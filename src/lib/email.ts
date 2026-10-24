import nodemailer from "nodemailer";

export interface InquiryEmailPayload {
  id: string;
  full_name: string;
  email: string;
  company?: string | null;
  inquiry_type: string;
  subject: string;
  message: string;
  created_at: Date;
}

export async function sendInquiryNotificationEmail(
  inquiry: InquiryEmailPayload,
  recipientEmail?: string
): Promise<{ sent: boolean; mode: "smtp" | "logged" }> {
  const targetEmail =
    recipientEmail?.trim() ||
    process.env.INITIAL_ADMIN_EMAIL ||
    "admin@bookingnetwork.co";

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpFrom =
    process.env.SMTP_FROM?.trim() || "no-reply@bookingnetwork.co";

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Booking Network Portal" <${smtpFrom}>`,
        to: targetEmail,
        replyTo: inquiry.email,
        subject: `[Booking Network Inquiry: ${inquiry.inquiry_type}] ${inquiry.subject}`,
        text: [
          `New inquiry submitted on the Booking Network Co., Ltd. Corporate Website:`,
          ``,
          `Reference ID : ${inquiry.id}`,
          `Sender Name  : ${inquiry.full_name}`,
          `Sender Email : ${inquiry.email}`,
          `Organization : ${inquiry.company || "Not specified"}`,
          `Inquiry Type : ${inquiry.inquiry_type}`,
          `Subject      : ${inquiry.subject}`,
          `Submitted At : ${inquiry.created_at.toISOString()}`,
          ``,
          `Message:`,
          `------------------------------------------------------------`,
          inquiry.message,
          `------------------------------------------------------------`,
        ].join("\n"),
      });

      return { sent: true, mode: "smtp" };
    } catch (error) {
      console.error("SMTP notification error (inquiry stored safely in DB):", error);
      return { sent: false, mode: "logged" };
    }
  }

  return { sent: true, mode: "logged" };
}

