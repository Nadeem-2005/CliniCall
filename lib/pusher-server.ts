import Pusher from 'pusher';
import { queueNotification } from './queue';

// Singleton Pusher instance
let pusherInstance: Pusher | null = null;

const getPusherInstance = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
      // Connection optimization
      timeout: 30000,
      keepAlive: true,
    });
  }
  return pusherInstance;
};

// Batch notification interface
interface BatchNotification {
  userId: string;
  channel: string;
  event: string;
  data: any;
  delay?: number;
}

// Notification batching system
class NotificationBatcher {
  private batch: Map<string, BatchNotification[]> = new Map();
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_DELAY = 1000; // 1 second

  addNotification(notification: BatchNotification) {
    const key = `${notification.userId}-${notification.channel}`;
    
    if (!this.batch.has(key)) {
      this.batch.set(key, []);
    }
    
    this.batch.get(key)!.push(notification);
    
    // If batch is full, process immediately
    if (this.batch.get(key)!.length >= this.BATCH_SIZE) {
      this.processBatch(key);
    } else {
      // Otherwise, set timeout to process batch
      this.scheduleBatchProcessing();
    }
  }

  private scheduleBatchProcessing() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    
    this.batchTimeout = setTimeout(() => {
      this.processAllBatches();
    }, this.BATCH_DELAY);
  }

  private async processBatch(key: string) {
    const notifications = this.batch.get(key);
    if (!notifications || notifications.length === 0) return;

    const pusher = getPusherInstance();
    
    try {
      // Group notifications by channel for efficient sending
      const channelGroups = notifications.reduce((groups, notif) => {
        if (!groups[notif.channel]) {
          groups[notif.channel] = [];
        }
        groups[notif.channel].push(notif);
        return groups;
      }, {} as Record<string, BatchNotification[]>);

      // Send batched notifications
      const promises = Object.entries(channelGroups).map(([channel, notifs]) => {
        if (notifs.length === 1) {
          // Single notification
          return pusher.trigger(channel, notifs[0].event, notifs[0].data);
        } else {
          // Batch notification
          return pusher.trigger(channel, 'batch-notification', {
            notifications: notifs.map(n => ({ event: n.event, data: n.data }))
          });
        }
      });

      await Promise.all(promises);
      console.log(`Processed batch of ${notifications.length} notifications for ${key}`);
      
    } catch (error) {
      console.error(`Failed to process notification batch for ${key}:`, error);
      
      // Re-queue failed notifications
      notifications.forEach(notif => {
        queueNotification({
          userId: notif.userId,
          message: JSON.stringify(notif.data),
          type: notif.event,
        });
      });
    } finally {
      this.batch.delete(key);
    }
  }

  private async processAllBatches() {
    const keys = Array.from(this.batch.keys());
    await Promise.all(keys.map(key => this.processBatch(key)));
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }
}

// Global batcher instance
const notificationBatcher = new NotificationBatcher();

// Optimized notification functions
export const sendRealtimeNotification = async (
  userId: string,
  channel: string,
  event: string,
  data: any,
  immediate = false
) => {
  if (immediate) {
    // Send immediately for urgent notifications
    const pusher = getPusherInstance();
    try {
      await pusher.trigger(channel, event, data);
    } catch (error) {
      console.error('Failed to send immediate notification:', error);
      // Fallback to queue
      await queueNotification({
        userId,
        message: JSON.stringify(data),
        type: event,
      });
    }
  } else {
    // Add to batch for non-urgent notifications
    notificationBatcher.addNotification({
      userId,
      channel,
      event,
      data,
    });
  }
};

// Specific notification functions
export const notifyAppointmentUpdate = async (
  userId: string,
  appointmentData: any,
  immediate = false
) => {
  await sendRealtimeNotification(
    userId,
    `user-${userId}`,
    'appointment-update',
    appointmentData,
    immediate
  );
};

export const notifyDoctorNewAppointment = async (
  doctorId: string,
  appointmentData: any,
  immediate = true // Doctor notifications are usually urgent
) => {
  await sendRealtimeNotification(
    doctorId,
    `doctor-${doctorId}`,
    'new-appointment',
    appointmentData,
    immediate
  );
};

export const notifyHospitalNewAppointment = async (
  hospitalId: string,
  appointmentData: any,
  immediate = true // Hospital notifications are usually urgent
) => {
  await sendRealtimeNotification(
    hospitalId,
    `hospital-${hospitalId}`,
    'new-appointment',
    appointmentData,
    immediate
  );
};

// Connection management
export const optimizePusherConnection = () => {
  const pusher = getPusherInstance();
  
  // Set up connection event handlers
  pusher.connection?.bind('connected', () => {
    console.log('Pusher connected successfully');
  });
  
  pusher.connection?.bind('error', (error: any) => {
    console.error('Pusher connection error:', error);
  });
  
  pusher.connection?.bind('disconnected', () => {
    console.log('Pusher disconnected');
  });
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (pusherInstance) {
    // Process any remaining batches
    await notificationBatcher['processAllBatches']();
    pusherInstance = null;
  }
});

export default getPusherInstance;