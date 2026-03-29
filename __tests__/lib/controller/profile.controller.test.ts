import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/service/profile.service', () => ({
  ProfileService: {
    updateProfile: vi.fn(),
    getProfile: vi.fn(),
    getAllProfiles: vi.fn(),
    getProfileByOperatorName: vi.fn(),
  },
}));

import { ProfileController } from '@/lib/controller/profile.controller';
import { ProfileService } from '@/lib/service/profile.service';

const mockedService = vi.mocked(ProfileService);

function jsonRequest(body: unknown, url = 'http://localhost/api/profile') {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProfileController', () => {
  describe('updateProfile', () => {
    it('should return 400 if userId is missing', async () => {
      const req = jsonRequest({ operatorName: 'Test', themeColor: 'red' });
      const res = await ProfileController.updateProfile(req, '');

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toMatch(/userId/i);
    });

    it('should return 400 if operatorName is missing', async () => {
      const req = jsonRequest({ themeColor: 'red' });
      const res = await ProfileController.updateProfile(req, 'user1');

      expect(res.status).toBe(400);
    });

    it('should return 400 if themeColor is missing', async () => {
      const req = jsonRequest({ operatorName: 'Test' });
      const res = await ProfileController.updateProfile(req, 'user1');

      expect(res.status).toBe(400);
    });

    it('should return 200 with updated profile on success', async () => {
      const updatedMock = { userId: 'user1', operatorName: 'Test', themeColor: 'red' };
      mockedService.updateProfile.mockResolvedValueOnce(updatedMock as any);

      const req = jsonRequest({ operatorName: 'Test', themeColor: 'red' });
      const res = await ProfileController.updateProfile(req, 'user1');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.operatorName).toBe('Test');
    });

    it('should return 500 if service throws', async () => {
      mockedService.updateProfile.mockRejectedValueOnce(new Error('DB error'));

      const req = jsonRequest({ operatorName: 'Test', themeColor: 'red' });
      const res = await ProfileController.updateProfile(req, 'user1');

      expect(res.status).toBe(500);
    });
  });

  describe('getProfile', () => {
    it('should return 400 if userId is missing', async () => {
      const req = new Request('http://localhost/api/profile/user1');
      const res = await ProfileController.getProfile(req, '');

      expect(res.status).toBe(400);
    });

    it('should return 404 if profile not found', async () => {
      mockedService.getProfile.mockResolvedValueOnce(null);

      const req = new Request('http://localhost/api/profile/user1');
      const res = await ProfileController.getProfile(req, 'user1');

      expect(res.status).toBe(404);
    });

    it('should return 200 with profile', async () => {
      const mockProfile = { userId: 'user1', operatorName: 'Test' };
      mockedService.getProfile.mockResolvedValueOnce(mockProfile as any);

      const req = new Request('http://localhost/api/profile/user1');
      const res = await ProfileController.getProfile(req, 'user1');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.userId).toBe('user1');
    });

    it('should return 500 if service throws', async () => {
      mockedService.getProfile.mockRejectedValueOnce(new Error('DB error'));

      const req = new Request('http://localhost/api/profile/user1');
      const res = await ProfileController.getProfile(req, 'user1');

      expect(res.status).toBe(500);
    });
  });

  describe('getAllProfiles', () => {
    it('should return 200 with profiles', async () => {
      mockedService.getAllProfiles.mockResolvedValueOnce([{ userId: '1' }] as any);

      const res = await ProfileController.getAllProfiles();

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveLength(1);
    });

    it('should return 500 if service throws', async () => {
      mockedService.getAllProfiles.mockRejectedValueOnce(new Error('error'));

      const res = await ProfileController.getAllProfiles();

      expect(res.status).toBe(500);
    });
  });

  describe('getProfileByOperatorName', () => {
    it('should return 400 if operatorName missing', async () => {
      const req = jsonRequest({});
      const res = await ProfileController.getProfileByOperatorName(req);

      expect(res.status).toBe(400);
    });

    it('should return 404 if not found', async () => {
      mockedService.getProfileByOperatorName.mockResolvedValueOnce(null);

      const req = jsonRequest({ operatorName: 'Test' });
      const res = await ProfileController.getProfileByOperatorName(req);

      expect(res.status).toBe(404);
    });

    it('should return 200 if found', async () => {
      mockedService.getProfileByOperatorName.mockResolvedValueOnce({ operatorName: 'Test' } as any);

      const req = jsonRequest({ operatorName: 'Test' });
      const res = await ProfileController.getProfileByOperatorName(req);

      expect(res.status).toBe(200);
    });

    it('should return 500 if service throws', async () => {
      mockedService.getProfileByOperatorName.mockRejectedValueOnce(new Error('error'));

      const req = jsonRequest({ operatorName: 'Test' });
      const res = await ProfileController.getProfileByOperatorName(req);

      expect(res.status).toBe(500);
    });
  });
});
