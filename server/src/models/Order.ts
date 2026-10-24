import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus, PaymentStatus, PaymentMethod, CourierProvider } from '../types';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  sku: string;
  size: string;
  color: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  thanaOrUpazila?: string;
  addressLine: string;
  deliveryNotes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  trackingToken: string;
  customer?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  itemsSubtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  couponCode?: string;
  payableTotal: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  courierProvider: CourierProvider;
  courierConsignmentId?: string;
  courierTrackingCode?: string;
  adminNotes?: string;
  customerNotes?: string;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  sku: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  division: { type: String, required: true },
  district: { type: String, required: true },
  thanaOrUpazila: { type: String },
  addressLine: { type: String, required: true },
  deliveryNotes: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    trackingToken: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    itemsSubtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String },
    payableTotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    courierProvider: {
      type: String,
      enum: Object.values(CourierProvider),
      default: CourierProvider.MANUAL,
    },
    courierConsignmentId: { type: String },
    courierTrackingCode: { type: String },
    adminNotes: { type: String },
    customerNotes: { type: String },
    confirmedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
