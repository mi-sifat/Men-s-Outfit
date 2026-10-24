import axios from 'axios';
import config from '../../config';
import { ICourierProvider, CourierShipmentPayload, CourierShipmentResult } from './CourierProvider.interface';
import { logger } from '../../utils/logger';

export class PathaoCourierProvider implements ICourierProvider {
  private get baseUrl(): string {
    return config.pathao.isSandbox
      ? 'https://courier-api-sandbox.pathao.com'
      : 'https://api-hermes.pathao.com';
  }

  private async getAccessToken(): Promise<string> {
    if (!config.pathao.clientId || !config.pathao.clientSecret) {
      return 'mock-pathao-token';
    }

    try {
      const response = await axios.post(`${this.baseUrl}/aladdin/api/v1/issue-token`, {
        client_id: config.pathao.clientId,
        client_secret: config.pathao.clientSecret,
        username: config.pathao.username,
        password: config.pathao.password,
        grant_type: 'password',
      });
      return response.data.access_token;
    } catch (err: any) {
      logger.error('Pathao token issue error:', err);
      throw new Error('পাঠাও এক্সেস টোকেন পেতে সমস্যা হয়েছে');
    }
  }

  async createShipment(payload: CourierShipmentPayload): Promise<CourierShipmentResult> {
    if (!config.pathao.clientId || !config.pathao.clientSecret) {
      logger.info(`[MOCK PATHAO] Creating shipment for order ${payload.orderNumber}`);
      const mockConsignmentId = `PTH-${Date.now()}`;
      return {
        success: true,
        consignmentId: mockConsignmentId,
        trackingCode: mockConsignmentId,
        courierName: 'Pathao Courier',
        status: 'Shipment Created',
      };
    }

    try {
      const token = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseUrl}/aladdin/api/v1/orders`,
        {
          store_id: 1, // Store ID from Pathao Dashboard
          merchant_order_id: payload.orderNumber,
          recipient_name: payload.recipientName,
          recipient_phone: payload.recipientPhone,
          recipient_address: payload.recipientAddress,
          amount_to_collect: payload.amountToCollect,
          item_type: 2, // 2 = Parcel/Clothing
          item_quantity: 1,
          item_weight: payload.weight || 0.5,
          item_description: payload.itemDescription || 'Echo Outfits Clothing',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.data;
      return {
        success: true,
        consignmentId: data.consignment_id,
        deliveryFee: data.delivery_fee,
        courierName: 'Pathao Courier',
        status: data.order_status,
        rawResponse: data,
      };
    } catch (err: any) {
      logger.error('Pathao create order error:', err);
      throw new Error(`পাঠাও পার্সেল তৈরি ব্যর্থ: ${err.message}`);
    }
  }

  async trackShipment(consignmentId: string): Promise<{ status: string; history?: any[] }> {
    if (!config.pathao.clientId) {
      return { status: 'In Transit (Mock)', history: [] };
    }

    const token = await this.getAccessToken();
    const response = await axios.get(`${this.baseUrl}/aladdin/api/v1/orders/${consignmentId}/info`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.data.order_status,
      history: response.data.data.order_status_history,
    };
  }
}
