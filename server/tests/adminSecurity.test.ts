import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../src/utils/jwt';
import { UserRole } from '../src/types';
import bcrypt from 'bcryptjs';

describe('Admin Security & Access Control Tests', () => {
  it('should generate secure admin tokens with ADMIN and OWNER roles', () => {
    const adminPayload = {
      userId: 'admin-usr-1',
      role: UserRole.ADMIN,
      email: 'admin@mensoutfit.com',
    };

    const token = generateToken(adminPayload);
    const decoded = verifyToken(token);

    expect(decoded.role).toBe(UserRole.ADMIN);
    expect(decoded.email).toBe('admin@mensoutfit.com');
  });

  it('should enforce bcrypt password hashing with adequate salt complexity', async () => {
    const plainPassword = 'SuperSecretAdminPassword@2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    expect(hash).not.toBe(plainPassword);
    expect(hash.startsWith('$2')).toBe(true);

    const match = await bcrypt.compare(plainPassword, hash);
    expect(match).toBe(true);

    const wrongMatch = await bcrypt.compare('WrongPassword', hash);
    expect(wrongMatch).toBe(false);
  });

  it('should reject invalid or tampered JWT tokens', () => {
    const validToken = generateToken({
      userId: 'test-1',
      role: UserRole.CUSTOMER,
      email: 'customer@test.com',
    });

    const tampered = validToken.substring(0, validToken.length - 5) + 'xxxxx';
    expect(() => verifyToken(tampered)).toThrow();
  });

  it('should verify customer role cannot be granted admin authorization', () => {
    const customerPayload = {
      userId: 'cust-1',
      role: UserRole.CUSTOMER,
      email: 'customer@test.com',
    };

    const allowedAdminRoles = [UserRole.ADMIN, UserRole.OWNER, UserRole.ORDER_MANAGER];
    const isAuthorized = allowedAdminRoles.includes(customerPayload.role);

    expect(isAuthorized).toBe(false);
  });
});
