import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//approval mail for doctor and hospital
export async function sendApprovalMailToDoctor(to: string, name: string) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Doctor Application Has Been Approved",
    html: `
      <p>Hi Dr. ${name},</p>
      <p>Congratulations! Your application to join our clinical platform has been <strong>approved</strong>.</p>
      <p>You can now log in and access your doctor dashboard.</p>
      <p>Thank you for joining us!</p>
      <br/>
      <p>– Clinical App Team</p>
    `,
  });
}

export async function sendApprovalMailToHospital(to: string, name: string) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Hospital Application Has Been Approved",
    html: `
      <p>Dear ${name},</p>
      <p>We are pleased to inform you that your hospital application has been <strong>approved</strong>.</p>
      <p>You can now log in and manage your hospital profile.</p>
      <p>Thank you for partnering with us!</p>
      <br/>
      <p>– Clinical App Team</p>
    `,
  });
}

//rejection mail for doctor and hospital
export async function sendRejectionMailToDoctor(to: string, name: string) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Doctor Application Has Been Rejected",
    html: `
      <p>Dear Dr. ${name},</p>
      <p>We regret to inform you that your application to join our clinical platform has been <strong>rejected</strong>.</p>
      <p>If you have any questions, please send your queries to this email.</p>
      <br/>
      <p>– Clinical App Team</p>
    `,
  });
}

export async function sendRejectionMailToHospital(to: string, name: string) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Hospital Application Has Been Rejected",
    html: `
      <p>Dear ${name},</p>
      <p>We regret to inform you that your hospital application has been <strong>rejected</strong>.</p>
      <p>If you have any questions, please send your queries to this email.</p>
      <br/>
      <p>– Clinical App Team</p>
    `,
  });
}

//appointment booked mail to user
export async function sendAppointmentConfirmationToUserWithHospital(
  to: string,
  name: string,
  hospitalName: string,
  date: string,
  time: string
) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Booked Successfully",
    html: `
      <p>Dear ${name},</p>
      <p>Your appointment request at ${hospitalName} has been successfully sent.</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>

            <br/>

      <p>You will be notified when your request is accepeted by <strong>${hospitalName}</strong>.</p>
      <p>Please check your appointment status at you <strong>Dashboard</strong>.</p>
      <p>Thank you for using our service!</p>
      <br/>
      <p>– Clinical App Team</p>
    `,
  });
}

export async function sendAppointmentNotificationToHospital(
  to: string,
  userName: string,
  hospitalName: string,
  date: string,
  time: string,
  reason: string
) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
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
  });
}

export async function sendAppointmentConfirmationToUserWithDoctor(
  to: string,
  userName: string,
  doctorName: string,
  date: string,
  time: string
) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Confirmed with Doctor",
    html: `
      <p>Dear ${userName},</p>
      <p>Your appointment has been confirmed with <strong>Dr. ${doctorName}</strong>.</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>Please arrive at least 10 minutes early.</p>
      <br/>
       <p>You will be notified when your request is accepeted by <strong>Dr.${doctorName}</strong>.</p>
      <p>Please check your appointment status at you <strong>Dashboard</strong>.</p>
      <br/>
      <p>– Clinical App Team</p>
    `,
  });
}

export async function sendAppointmentNotificationToDoctor(
  to: string,
  doctorName: string,
  userName: string,
  date: string,
  time: string,
  reason: string
) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
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
  });
}
