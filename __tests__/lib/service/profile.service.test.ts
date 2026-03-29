import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { ProfileService } from '@/lib/service/profile.service';
import { prisma } from '@/lib/prisma';

const mockedPrisma = vi.mocked(prisma);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProfileService', () => {
  describe('updateProfile', () => {
    it('should call prisma.profile.update with correct data', async () => {
      const mockResult = { userId: 'user1', operatorName: 'Alice', themeColor: 'red' };
      (mockedPrisma.profile.update as any).mockResolvedValueOnce(mockResult);

      const result = await ProfileService.updateProfile('user1', { operatorName: 'Alice', themeColor: 'red' });

      expect(mockedPrisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        data: {
          operatorName: 'Alice',
          themeColor: 'red',
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getProfile', () => {
    it('should call prisma.profile.findUnique with correct userId', async () => {
      const mockResult = { userId: 'user1', operatorName: 'Alice' };
      (mockedPrisma.profile.findUnique as any).mockResolvedValueOnce(mockResult);

      const result = await ProfileService.getProfile('user1');

      expect(mockedPrisma.profile.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user1' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllProfiles', () => {
    it('should call prisma.profile.findMany with order by operatorName', async () => {
      const mockResult = [{ userId: 'user1', operatorName: 'Alice' }];
      (mockedPrisma.profile.findMany as any).mockResolvedValueOnce(mockResult);

      const result = await ProfileService.getAllProfiles();

      expect(mockedPrisma.profile.findMany).toHaveBeenCalledWith({
        orderBy: { operatorName: 'asc' },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getProfileByOperatorName', () => {
    it('should call prisma.profile.findUnique with correct operatorName', async () => {
      const mockResult = { userId: 'user1', operatorName: 'Alice' };
      (mockedPrisma.profile.findUnique as any).mockResolvedValueOnce(mockResult);

      const result = await ProfileService.getProfileByOperatorName('Alice');

      expect(mockedPrisma.profile.findUnique).toHaveBeenCalledWith({
        where: { operatorName: 'Alice' },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
