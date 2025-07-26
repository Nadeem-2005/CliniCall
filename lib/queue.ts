import { Queue } from 'bullmq';

// Redis connection configuration for BullMQ
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Email queue configuration - for job creation only
export const emailQueue = new Queue('email processing', {
  connection: redisConfig,
});

// Notification queue for real-time notifications - for job creation only
export const notificationQueue = new Queue('notification processing', {
  connection: redisConfig,
});

// Email job types
export interface EmailJob {
  type: 'appointment_confirmation' | 'appointment_notification' | 'appointment_status_update' | 'approval' | 'rejection';
  to: string;
  data: any;
}

// Queue processing is handled by the separate queue-server.js
// This file only handles job creation

// Queue helper functions
export const queueEmail = async (emailData: EmailJob, delay?: number) => {
  const options = delay ? { delay } : {};
  await emailQueue.add('email', emailData, options);
};

export const queueNotification = async (notificationData: any, delay?: number) => {
  const options = delay ? { delay } : {};
  await notificationQueue.add('notification', notificationData, options);
};

// Event handlers and processing are handled by queue-server.js
// This file is only for job enqueueing in the Next.js application

export { emailQueue as default };