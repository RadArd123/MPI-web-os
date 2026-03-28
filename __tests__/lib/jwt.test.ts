import { describe, it, expect } from 'vitest';
import { SignJWT, jwtVerify } from 'jose';


const SECRET = new TextEncoder().encode('test-secret-key-for-unit-tests');

const generateToken = async (payload: Record<string, unknown>) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
};

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
};

describe('JWT Utilities', () => {
  it('should generate a valid token and verify it', async () => {
    const payload = { id: '123', email: 'test@example.com', name: 'Pilot' };
    const token = await generateToken(payload);

    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');

    const decoded = await verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.id).toBe('123');
    expect(decoded!.email).toBe('test@example.com');
    expect(decoded!.name).toBe('Pilot');
  });

  it('should return null for an invalid token', async () => {
    const decoded = await verifyToken('invalid.token.value');
    expect(decoded).toBeNull();
  });

  it('should return null for a tampered token', async () => {
    const token = await generateToken({ id: '1' });

    const tampered = token.slice(0, -5) + 'XXXXX';

    const decoded = await verifyToken(tampered);
    expect(decoded).toBeNull();
  });

  it('should include iat and exp claims', async () => {
    const token = await generateToken({ id: '1' });
    const decoded = await verifyToken(token);

    expect(decoded!.iat).toBeDefined();
    expect(decoded!.exp).toBeDefined();
    expect(decoded!.exp! > decoded!.iat!).toBe(true);
  });
});
