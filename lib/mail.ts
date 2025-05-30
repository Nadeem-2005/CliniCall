
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