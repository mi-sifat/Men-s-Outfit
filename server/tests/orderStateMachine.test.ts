import { describe, it, expect } from 'vitest';
import { canTransition, VALID_STATUS_TRANSITIONS } from '../src/services/orderStateMachine';
import { OrderStatus } from '../src/types';

describe('Order State Machine Service', () => {
  it('should allow valid transition from PENDING to CONFIRMED', () => {
    expect(canTransition(OrderStatus.PENDING, OrderStatus.CONFIRMED)).toBe(true);
  });

  it('should allow cancellation from PENDING status', () => {
    expect(canTransition(OrderStatus.PENDING, OrderStatus.CANCELLED)).toBe(true);
  });

  it('should allow transition from CONFIRMED to PROCESSING', () => {
    expect(canTransition(OrderStatus.CONFIRMED, OrderStatus.PROCESSING)).toBe(true);
  });

  it('should allow transition from PROCESSING to SHIPPED', () => {
    expect(canTransition(OrderStatus.PROCESSING, OrderStatus.SHIPPED)).toBe(true);
  });

  it('should allow transition from SHIPPED to DELIVERED', () => {
    expect(canTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED)).toBe(true);
  });

  it('should NOT allow invalid transition from PENDING directly to DELIVERED', () => {
    expect(canTransition(OrderStatus.PENDING, OrderStatus.DELIVERED)).toBe(false);
  });

  it('should NOT allow transition from CANCELLED to any other state', () => {
    expect(canTransition(OrderStatus.CANCELLED, OrderStatus.PENDING)).toBe(false);
    expect(canTransition(OrderStatus.CANCELLED, OrderStatus.CONFIRMED)).toBe(false);
  });
});
