import axios from 'axios';
import config from '../../config';
import { ICourierProvider, CourierShipmentPayload, CourierShipmentResult } from './CourierProvider.interface';
import { logger } from '../../utils/logger';

export class SteadfastCourierProvider implements ICourierProvider {
  private readonly baseUrl = 'https://portal.steadfast.com.bd/api/v1';

  async createShipment(payload: CourierShipmentPayload): Promise<CourierShipmentResult> {
    if (!config.steadfast.apiKey || !config.steadfast.secretKey) {
      logger.info(`[MOCK STEADFAST] Creating parcel for order ${payload.orderNumber}`);
      const mockConsignmentId = `STF-${Date.now()}`;
      return {
        success: true,
        consignmentId: mockConsignmentId,
        trackingCode: mockConsignmentId,
        courierName: 'Steadfast Courier',
        status: 'in_review',
      };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/create_order`,
        {
          invoice: payload.orderNumber,
          recipient_name: payload.recipientName,
          recipient_phone: payload.recipientPhone,
          recipient_address: payload.recipientAddress,
          cod_amount: payload.amountToCollect,
          note: payload.itemDescription || 'Echo Outfits Apparel',
        },
        {
          headers: {
            'Api-Key': config.steadfast.apiKey,
            'Secret-Key': config.steadfast.secretKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;
      if (data.status === 200) {
        return {
          success: true,
          consignmentId: String(data.consignment.consignment_id),
          trackingCode: data.consignment.tracking_code,
          courierName: 'Steadfast Courier',
          status: data.consignment.status,
          rawResponse: data,
        };
      }
      throw new Error(data.message || 'স্টেডফাস্টে পার্সেল তৈরি করতে সমস্যা হয়েছে');
    } catch (err: any) {
      logger.error('Steadfast order error:', err);
      throw new Error(`Steadfast ত্রুটি: ${err.message}`);
    }
  }

  async trackShipment(consignmentId: string): Promise<{ status: string; history?: any[] }> {
    if (!config.steadfast.apiKey) {
      return { status: 'in_transit', history: [] };
    }

    const response = await axios.get(`${this.baseUrl}/status_by_cid/${consignmentId}`, {
      headers: {
        'Api-Key': config.steadfast.apiKey,
        'Secret-Key': config.steadfast.secretKey,
      },
    });

    return {
      status: response.data.delivery_status || 'unknown',
    };
  }
}
