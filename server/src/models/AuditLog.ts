import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: String, required: true, index: true },
    adminEmail: { type: String, required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
