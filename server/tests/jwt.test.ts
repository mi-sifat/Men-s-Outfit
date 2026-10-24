import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../src/utils/jwt';
import { UserRole } from '../src/types';

describe('JWT Utility Service', () => {
  it('should generate a valid JWT token and decode its payload', () => {
    const payload = {
      userId: 'user-12345',
      role: UserRole.ADMIN,
      email: 'admin@echooutfits.com',
    };

    const token = generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.email).toBe(payload.email);
  });
});
