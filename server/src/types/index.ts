// Server-side type definitions

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// User roles
export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  OWNER = 'owner',
  ORDER_MANAGER = 'order_manager',
  INVENTORY_MANAGER = 'inventory_manager',
}

// Order statuses
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURN_REQUESTED = 'return_requested',
  RETURNED = 'returned',
  REFUND_PENDING = 'refund_pending',
  REFUNDED = 'refunded',
  FAILED_DELIVERY = 'failed_delivery',
}

// Payment statuses
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUND_PENDING = 'refund_pending',
  REFUNDED = 'refunded',
  COD_PENDING = 'cod_pending',
  COD_COLLECTED = 'cod_collected',
}

// Payment methods
export enum PaymentMethod {
  COD = 'cod',
  SSLCOMMERZ = 'sslcommerz',
  AAMARPAY = 'aamarpay',
}

// Courier providers
export enum CourierProvider {
  MANUAL = 'manual',
  PATHAO = 'pathao',
  STEADFAST = 'steadfast',
}

// Bangladesh divisions
export const BD_DIVISIONS = [
  'ঢাকা',
  'চট্টগ্রাম',
  'রাজশাহী',
  'খুলনা',
  'বরিশাল',
  'সিলেট',
  'রংপুর',
  'ময়মনসিংহ',
] as const;

export type BDDivision = typeof BD_DIVISIONS[number];
