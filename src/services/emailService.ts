import nodemailer from "nodemailer";
import { env } from "../lib/env.js";
import { logger } from "../lib/logger.js";
import { AppError } from "../lib/errors.js";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_PASS,
    },
  });

  static async sendContactEmail(name: string, email: string, message: string) {
    if (!env.GMAIL_USER || !env.GMAIL_PASS) {
      logger.warn("Email credentials not configured. Skipping email send.");
      return;
    }

    try {
      const adminMailOptions = {
        from: env.GMAIL_USER,
        to: "meetkhakhkhar05@gmail.com",
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      const userMailOptions = {
        from: env.GMAIL_USER,
        to: email,
        subject: "Registration Successful ✅",
        text: `Hi ${name},\n\nThank you for contacting GFG Student Chapter MU. We have received your message and will get back to you soon.\n\nBest Regards,\nGFG SC MU Team`,
      };

      await this.transporter.sendMail(adminMailOptions);
      await this.transporter.sendMail(userMailOptions);
      
      logger.info(`Emails sent successfully for ${email}`);
    } catch (error: any) {
      logger.error("Failed to send email:", error);
      throw new AppError("Failed to send email", 500);
    }
  }
}
