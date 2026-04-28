import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectService } from '@/lib/service/project.service';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
       findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

describe('ProjectService', () => {
  const mockUserId = 'user-123';
  const mockProjectId = 'project-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project with valid data', async () => {
      const projectData = {
        name: 'My Project',
        description: 'A test project',
        link: 'https://example.com',
        status: 'IN_PROGRESS' as const,
      };

      const mockProject = {
        id: mockProjectId,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...projectData,
      };

      vi.mocked(prisma.project.create).mockResolvedValue(mockProject);

      const result = await ProjectService.createProject(mockUserId, projectData);

      expect(result).toEqual(mockProject);
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: {
          ...projectData,
          userId: mockUserId,
        },
      });
    });

    it('should handle creation errors gracefully', async () => {
      const projectData = {
        name: 'My Project',
        status: 'IN_PROGRESS' as const,
      };

      vi.mocked(prisma.project.create).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        ProjectService.createProject(mockUserId, projectData)
      ).rejects.toThrow('Database error');
    });
  });

  describe('getProjects', () => {
    it('should fetch all projects for a user', async () => {
      const mockProjects = [
        {
          id: 'proj-1',
          name: 'Project 1',
          description: 'Desc 1',
          link: 'https://p1.com',
          status: 'IN_PROGRESS' as const,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'proj-2',
          name: 'Project 2',
          description: 'Desc 2',
          link: 'https://p2.com',
          status: 'FINISHED' as const,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects);

      const result = await ProjectService.getProjects(mockUserId);

      expect(result).toEqual(mockProjects);
      expect(result).toHaveLength(2);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
          where: { userId: mockUserId },
          orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when user has no projects', async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue([]);

      const result = await ProjectService.getProjects(mockUserId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('updateProject', () => {
    it('should update project with valid data', async () => {
      const updateData = {
        name: 'Updated Project',
        status: 'FINISHED' as const,
      };

      const mockUpdatedProject = {
        id: mockProjectId,
        userId: mockUserId,
        name: 'Updated Project',
        description: 'Original description',
        link: 'https://example.com',
        status: 'FINISHED' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.project.updateMany).mockResolvedValue({ count: 1 });

      await ProjectService.updateProject(mockUserId, mockProjectId, updateData);

      expect(prisma.project.updateMany).toHaveBeenCalledWith({
        where: {
          id: mockProjectId,
          userId: mockUserId,
        },
        data: updateData,
      });
    });

    it('should not update project if user is not owner', async () => {
      const updateData = { name: 'Hacked Project' };
      const differentUserId = 'hacker-user';

      vi.mocked(prisma.project.updateMany).mockResolvedValue({ count: 0 });

      await ProjectService.updateProject(
        differentUserId,
        mockProjectId,
        updateData
      );

      expect(prisma.project.updateMany).toHaveBeenCalledWith({
        where: {
          id: mockProjectId,
          userId: differentUserId,
        },
        data: updateData,
      });
    });
  });

  describe('deleteProject', () => {
    it('should delete project owned by user', async () => {
      vi.mocked(prisma.project.deleteMany).mockResolvedValue({ count: 1 });

      await ProjectService.deleteProject(mockUserId, mockProjectId);

      expect(prisma.project.deleteMany).toHaveBeenCalledWith({
        where: {
          id: mockProjectId,
          userId: mockUserId,
        },
      });
    });

    it('should prevent deletion by unauthorized user', async () => {
      const unauthorizedUserId = 'wrong-user';

      vi.mocked(prisma.project.deleteMany).mockResolvedValue({ count: 0 });

      await ProjectService.deleteProject(unauthorizedUserId, mockProjectId);

      expect(prisma.project.deleteMany).toHaveBeenCalledWith({
        where: {
          id: mockProjectId,
          userId: unauthorizedUserId,
        },
      });
    });
  });

  describe('getProjectByName', () => {
    it('should find project by name', async () => {
      const mockProject = {
        id: mockProjectId,
        name: 'Search Test',
        description: 'Test description',
        link: 'https://search.com',
        status: 'IN_PROGRESS' as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

       vi.mocked(prisma.project.findFirst).mockResolvedValue(mockProject);

      const result = await ProjectService.getProjectByName(
        mockUserId,
        'Search Test'
      );

      expect(result).toEqual(mockProject);
    });

    it('should return null when project not found', async () => {
       vi.mocked(prisma.project.findFirst).mockResolvedValue(null);

      const result = await ProjectService.getProjectByName(
        mockUserId,
        'Nonexistent'
      );

      expect(result).toBeNull();
    });
  });
});
