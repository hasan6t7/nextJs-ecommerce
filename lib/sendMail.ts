import nodemailer from "nodemailer";

export const sendMail = async (subject: string, receiver: string, body: string) => {
  console.log("MAIL DATA:", { subject, receiver });

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

  const options = {
    from: `Md. Hasanujjaman <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(options);
    console.log("Mail sent:", info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error("Mail error:", error);
    return { success: false, message: error.message };
  }
};
