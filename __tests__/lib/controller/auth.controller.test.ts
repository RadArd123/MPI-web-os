import { describe, it, expect, vi, beforeEach } from 'vitest';


vi.mock('@/lib/service/auth.service', () => ({
  AuthService: {
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
    verifyOperator: vi.fn(),
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  JWTUtils: {
    generateToken: vi.fn().mockResolvedValue('mock-jwt-token'),
    setAuthCookie: vi.fn().mockResolvedValue(undefined),
    removeAuthCookie: vi.fn().mockResolvedValue(undefined),
    verifyToken: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

import { AuthController } from '@/lib/controller/auth.controller';
import { AuthService } from '@/lib/service/auth.service';
import { JWTUtils } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

const mockedAuthService = vi.mocked(AuthService);
const mockedJWT = vi.mocked(JWTUtils);
const mockedCookies = vi.mocked(cookies);

function jsonRequest(body: unknown, url = 'http://localhost/api/auth') {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthController', () => {
  describe('signup', () => {
    it('should return 400 if user already exists', async () => {
      mockedAuthService.findUserByEmail.mockResolvedValueOnce({ id: '1', email: 'a@b.com' } as any);

      const req = jsonRequest({
        email: 'a@b.com',
        password: 'pass',
        operatorName: 'Test',
      });
      const res = await AuthController.signup(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toMatch(/already exists/i);
    });

    it('should return 201 on successful signup', async () => {
      mockedAuthService.findUserByEmail.mockResolvedValueOnce(null);
      mockedAuthService.createUser.mockResolvedValueOnce({
        id: 'new-id',
        email: 'new@test.com',
      } as any);

      const req = jsonRequest({
        email: 'new@test.com',
        password: 'pass',
        operatorName: 'Newbie',
      });
      const res = await AuthController.signup(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.message).toBe('OPERATOR_INITIALIZED');
      expect(body.userId).toBe('new-id');
      expect(mockedJWT.generateToken).toHaveBeenCalled();
      expect(mockedJWT.setAuthCookie).toHaveBeenCalledWith('mock-jwt-token');
    });

    it('should return 500 on internal error', async () => {
      mockedAuthService.findUserByEmail.mockRejectedValueOnce(new Error('DB error'));

      const req = jsonRequest({
        email: 'x@y.com',
        password: 'p',
        operatorName: 'O',
      });
      const res = await AuthController.signup(req);

      expect(res.status).toBe(500);
    });
  });

  describe('login', () => {
    it('should return 401 for invalid credentials', async () => {
      mockedAuthService.verifyOperator.mockResolvedValueOnce(null);

      const req = jsonRequest({ email: 'bad@test.com', password: 'wrong' });
      const res = await AuthController.login(req);

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe('INVALID_CREDENTIALS');
    });

    it('should return 200 with user data on success', async () => {
      const userData = { id: '1', email: 'a@b.com', operatorName: 'Pilot' };
      mockedAuthService.verifyOperator.mockResolvedValueOnce(userData as any);

      const req = jsonRequest({ email: 'a@b.com', password: 'correct' });
      const res = await AuthController.login(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe('LOGIN_SUCCESS');
      expect(body.user).toEqual(userData);
      expect(mockedJWT.setAuthCookie).toHaveBeenCalled();
    });

    it('should return 500 on internal error', async () => {
      mockedAuthService.verifyOperator.mockRejectedValueOnce(new Error('DB'));

      const req = jsonRequest({ email: 'x@y.com', password: 'p' });
      const res = await AuthController.login(req);

      expect(res.status).toBe(500);
    });
  });

  describe('logout', () => {
    it('should return 200 and remove the cookie', async () => {
      const res = await AuthController.logout();

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe('LOGOUT_SUCCESS');
      expect(mockedJWT.removeAuthCookie).toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('should return 401 if no cookie is present', async () => {
      mockedCookies.mockResolvedValueOnce({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const req = new Request('http://localhost/api/auth/getSession');
      const res = await AuthController.getSession(req);

      expect(res.status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      mockedCookies.mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: 'bad-token' }),
      } as any);
      mockedJWT.verifyToken.mockResolvedValueOnce(null);

      const req = new Request('http://localhost/api/auth/getSession');
      const res = await AuthController.getSession(req);

      expect(res.status).toBe(401);
    });

    it('should return 200 with user payload for valid session', async () => {
      const payload = { id: '1', email: 'a@b.com', name: 'Pilot' };
      mockedCookies.mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      } as any);
      mockedJWT.verifyToken.mockResolvedValueOnce(payload as any);

      const req = new Request('http://localhost/api/auth/getSession');
      const res = await AuthController.getSession(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.user).toEqual(payload);
    });
  });
});
