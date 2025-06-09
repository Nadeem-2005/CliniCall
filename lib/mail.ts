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

//appointment status update mail to user from doctor
export async function sendAppointmentAcceptedByDoctorToUser(
  to: string,
  userName: string,
  doctorName: string,
  date: string,
  time: string
) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
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
  });
}

export async function sendAppointmentRejectedByDoctorToUser(
  to: string,
  userName: string,
  doctorName: string,
  date: string,
  time: string
) {
  return transporter.sendMail({
    from: `"Clinical App Team" <${process.env.EMAIL_USER}>`,
    to,
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
  });
}

//appointment status update mail to user from hospital
export function sendAppointmentAcceptedByHospitalToUser(
  to: string,
  patientName: string,
  hospitalName: string,
  date: string,
  time: string
) {
  return {
    to,
    subject: "Your Appointment Has Been Accepted by the Hospital",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${patientName},</h2>
        <p>We are pleased to inform you that your appointment request to ${hospitalName} has been <strong>accepted</strong> by the hospital.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
        </ul>
        <p>Please arrive at least 15 minutes before the scheduled time and bring any relevant documents or prior prescriptions.</p>
        <p>Thank you,<br/>Hospital Administration</p>
      </div>
    `,
  };
}

export function sendAppointmentRejectedByHospitalToUser(
  to: string,
  patientName: string,
  hospitalName: string,
  date: string,
  time: string
) {
  return {
    to,
    subject: "Your Appointment Has Been Rejected by the Hospital",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${patientName},</h2>
        <p>We regret to inform you that your appointment request to ${hospitalName} on <strong>${date}</strong> at <strong>${time}</strong> has been <strong>rejected</strong> by the hospital.</p>
        <p>This may be due to scheduling conflicts or unavailability.</p>
        <p>You may try booking another slot at your convenience.</p>
        <p>We apologize for the inconvenience and appreciate your understanding.</p>
        <p>Thank you,<br/>Hospital Administration</p>
      </div>
    `,
  };
}
