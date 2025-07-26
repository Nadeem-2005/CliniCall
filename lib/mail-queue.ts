import { queueEmail, EmailJob } from './queue';

// Queued email functions - these replace the direct email sending functions

export async function queueAppointmentConfirmationToUserWithHospital(
  to: string,
  name: string,
  hospitalName: string,
  date: string,
  time: string
) {
  const emailData: EmailJob = {
    type: 'appointment_confirmation',
    to,
    data: {
      subject: "Appointment Booked Successfully",
      html: `
        <p>Dear ${name},</p>
        <p>Your appointment request at ${hospitalName} has been successfully sent.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <br/>
        <p>You will be notified when your request is accepted by <strong>${hospitalName}</strong>.</p>
        <p>Please check your appointment status at your <strong>Dashboard</strong>.</p>
        <p>Thank you for using our service!</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueAppointmentNotificationToHospital(
  to: string,
  userName: string,
  hospitalName: string,
  date: string,
  time: string,
  reason: string
) {
  const emailData: EmailJob = {
    type: 'appointment_notification',
    to,
    data: {
      subject: "New Appointment Booking Notification",
      html: `
        <p>Dear ${hospitalName} Team,</p>
        <p>A new appointment has been booked by <strong>${userName}</strong>.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please check your dashboard for more details.</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueAppointmentConfirmationToUserWithDoctor(
  to: string,
  userName: string,
  doctorName: string,
  date: string,
  time: string
) {
  const emailData: EmailJob = {
    type: 'appointment_confirmation',
    to,
    data: {
      subject: "Appointment Confirmed with Doctor",
      html: `
        <p>Dear ${userName},</p>
        <p>Your appointment has been confirmed with <strong>Dr. ${doctorName}</strong>.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Please arrive at least 10 minutes early.</p>
        <br/>
        <p>You will be notified when your request is accepted by <strong>Dr.${doctorName}</strong>.</p>
        <p>Please check your appointment status at your <strong>Dashboard</strong>.</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueAppointmentNotificationToDoctor(
  to: string,
  doctorName: string,
  userName: string,
  date: string,
  time: string,
  reason: string
) {
  const emailData: EmailJob = {
    type: 'appointment_notification',
    to,
    data: {
      subject: "New Appointment Booked",
      html: `
        <p>Dear Dr. ${doctorName},</p>
        <p>You have a new appointment booked by <strong>${userName}</strong>.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please check your dashboard for more details.</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueAppointmentAcceptedByDoctorToUser(
  to: string,
  userName: string,
  doctorName: string,
  date: string,
  time: string
) {
  const emailData: EmailJob = {
    type: 'appointment_status_update',
    to,
    data: {
      subject: "Your Appointment Request Has Been Accepted",
      html: `
        <p>Dear ${userName},</p>
        <p>Great news! <strong>Dr. ${doctorName}</strong> has <span style="color:green;"><strong>accepted</strong></span> your appointment request.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>Please make sure to be available at the scheduled time and arrive 10 minutes early if it's an in-person consultation.</p>
        <br/>
        <p>Thank you for using our service!</p>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueAppointmentRejectedByDoctorToUser(
  to: string,
  userName: string,
  doctorName: string,
  date: string,
  time: string
) {
  const emailData: EmailJob = {
    type: 'appointment_status_update',
    to,
    data: {
      subject: "Your Appointment Request Has Been Rejected",
      html: `
        <p>Dear ${userName},</p>
        <p>We regret to inform you that <strong>Dr. ${doctorName}</strong> has <span style="color:red;"><strong>rejected</strong></span> your appointment request.</p>
        <p><strong>Requested Date:</strong> ${date}</p>
        <p><strong>Requested Time:</strong> ${time}</p>
        <p>This may be due to scheduling conflicts or availability issues.</p>
        <p>You can try booking a different time slot or choose another doctor from your dashboard.</p>
        <br/>
        <p>We apologize for the inconvenience and thank you for understanding.</p>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueApprovalMailToDoctor(to: string, name: string) {
  const emailData: EmailJob = {
    type: 'approval',
    to,
    data: {
      subject: "Your Doctor Application Has Been Approved",
      html: `
        <p>Hi Dr. ${name},</p>
        <p>Congratulations! Your application to join our clinical platform has been <strong>approved</strong>.</p>
        <p>You can now log in and access your doctor dashboard.</p>
        <p>Thank you for joining us!</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueApprovalMailToHospital(to: string, name: string) {
  const emailData: EmailJob = {
    type: 'approval',
    to,
    data: {
      subject: "Your Hospital Application Has Been Approved",
      html: `
        <p>Dear ${name},</p>
        <p>We are pleased to inform you that your hospital application has been <strong>approved</strong>.</p>
        <p>You can now log in and manage your hospital profile.</p>
        <p>Thank you for partnering with us!</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueRejectionMailToDoctor(to: string, name: string) {
  const emailData: EmailJob = {
    type: 'rejection',
    to,
    data: {
      subject: "Your Doctor Application Has Been Rejected",
      html: `
        <p>Dear Dr. ${name},</p>
        <p>We regret to inform you that your application to join our clinical platform has been <strong>rejected</strong>.</p>
        <p>If you have any questions, please send your queries to this email.</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}

export async function queueRejectionMailToHospital(to: string, name: string) {
  const emailData: EmailJob = {
    type: 'rejection',
    to,
    data: {
      subject: "Your Hospital Application Has Been Rejected",
      html: `
        <p>Dear ${name},</p>
        <p>We regret to inform you that your hospital application has been <strong>rejected</strong>.</p>
        <p>If you have any questions, please send your queries to this email.</p>
        <br/>
        <p>– Clinical App Team</p>
      `,
    },
  };
  
  await queueEmail(emailData);
}