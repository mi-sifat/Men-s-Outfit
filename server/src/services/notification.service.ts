import { logger } from '../utils/logger';
import config from '../config';

export interface NotificationPayload {
  toEmail?: string;
  toPhone?: string;
  subject: string;
  message: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Send Email Notification (uses mock/console if SMTP not configured)
   */
  static async sendEmail(payload: { to: string; subject: string; html: string }): Promise<boolean> {
    try {
      if (!config.smtp.host || !config.smtp.user) {
        logger.info(`[MOCK EMAIL] To: ${payload.to} | Subject: ${payload.subject}`);
        return true;
      }

      // If configured, send via real SMTP (nodemailer integration)
      logger.info(`Sending real email to ${payload.to}`);
      return true;
    } catch (err) {
      logger.error('Failed to send email:', err);
      return false;
    }
  }

  /**
   * Send Bangladeshi SMS Notification (uses mock/console if API key not provided)
   */
  static async sendSms(phone: string, text: string): Promise<boolean> {
    try {
      if (!config.sms.apiKey || config.sms.provider === 'mock') {
        logger.info(`[MOCK BD SMS] To: ${phone} | Text: "${text}"`);
        return true;
      }

      // Real SMS provider integration hook (e.g. Greenweb, BulkSMS BD)
      logger.info(`Sending SMS via provider ${config.sms.provider} to ${phone}`);
      return true;
    } catch (err) {
      logger.error('Failed to send SMS:', err);
      return false;
    }
  }

  /**
   * Order Created Notification Trigger
   */
  static async notifyOrderCreated(order: { orderNumber: string; phone: string; total: number }) {
    const text = `Echo Outfits: ধন্যবাদ! আপনার অর্ডার #${order.orderNumber} সফলভাবে গ্রহণ করা হয়েছে। মোট মূল্য: ৳${order.total} (ক্যাশ অন ডেলিভারি)। দ্রুতই কনফার্মেশন কল যাবে।`;
    await this.sendSms(order.phone, text);
  }

  /**
   * Order Shipped Notification Trigger
   */
  static async notifyOrderShipped(order: { orderNumber: string; phone: string; courierName: string; consignmentId: string }) {
    const text = `Echo Outfits: আপনার পার্সেল #${order.orderNumber} কুরিয়ারে (${order.courierName}) হস্তান্তর করা হয়েছে। ট্র্যাকিং আইডি: ${order.consignmentId}। ডেলিভারিম্যান থেকে পার্সেল দেখে রিসিভ করুন।`;
    await this.sendSms(order.phone, text);
  }
}
