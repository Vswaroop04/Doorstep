import nodemailer from "nodemailer";

export async function sendMail(
  subject: string,
  toEmail: string,
  mailBody: string
): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL as string,
        pass: process.env.NODEMAILER_PW as string,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.NODEMAILER_EMAIL as string,
      to: toEmail,
      subject: subject,
      html: mailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
