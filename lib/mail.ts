
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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