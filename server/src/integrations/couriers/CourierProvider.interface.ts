export interface CourierShipmentPayload {
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity?: string;
  recipientZone?: string;
  amountToCollect: number; // COD amount
  itemDescription?: string;
  weight?: number; // kg
}

export interface CourierShipmentResult {
  success: boolean;
  consignmentId: string;
  trackingCode?: string;
  deliveryFee?: number;
  courierName: string;
  status: string;
  rawResponse?: Record<string, any>;
}

export interface ICourierProvider {
  createShipment(payload: CourierShipmentPayload): Promise<CourierShipmentResult>;
  trackShipment(consignmentId: string): Promise<{ status: string; history?: any[] }>;
}
