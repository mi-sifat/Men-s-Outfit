import mongoose, { Document, Schema } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../types';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  orderNumber: string;
  provider: PaymentMethod;
  amount: number;
  currency: string;
  transactionId: string;
  bankTransactionId?: string;
  valId?: string;
  cardType?: string;
  status: PaymentStatus;
  rawResponse?: Record<string, any>;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    provider: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'BDT' },
    transactionId: { type: String, required: true, unique: true, index: true },
    bankTransactionId: { type: String },
    valId: { type: String },
    cardType: { type: String },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    rawResponse: { type: Schema.Types.Mixed },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
