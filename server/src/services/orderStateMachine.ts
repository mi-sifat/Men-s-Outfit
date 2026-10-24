import { OrderStatus } from '../types';
import { AppError } from '../utils/AppError';

// Valid status transitions map
export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.FAILED_DELIVERY],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURN_REQUESTED],
  [OrderStatus.RETURN_REQUESTED]: [OrderStatus.RETURNED, OrderStatus.DELIVERED],
  [OrderStatus.RETURNED]: [OrderStatus.REFUND_PENDING, OrderStatus.REFUNDED],
  [OrderStatus.REFUND_PENDING]: [OrderStatus.REFUNDED],
  [OrderStatus.FAILED_DELIVERY]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
};

export const canTransition = (current: OrderStatus, target: OrderStatus): boolean => {
  const allowed = VALID_STATUS_TRANSITIONS[current] || [];
  return allowed.includes(target);
};

export const validateStatusTransition = (current: OrderStatus, target: OrderStatus): void => {
  if (!canTransition(current, target)) {
    throw AppError.badRequest(
      `অর্ডার স্ট্যাটাস '${current}' থেকে সরাসরি '${target}'-এ পরিবর্তন করা সম্ভব নয়।`
    );
  }
};
