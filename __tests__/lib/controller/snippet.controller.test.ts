import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SnippetService before importing the controller
vi.mock('@/lib/service/snippet.service', () => ({
  SnippetService: {
    create: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

import { SnippetController } from '@/lib/controller/snippet.controller';
import { SnippetService } from '@/lib/service/snippet.service';

const mockedService = vi.mocked(SnippetService);

// Helper to create a Request with JSON body
function jsonRequest(body: unknown, url = 'http://localhost/api/snippets') {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SnippetController', () => {
  describe('createSnippet', () => {
    it('should return 400 if title is missing', async () => {
      const req = jsonRequest({ code: 'x', userId: '1' });
      const res = await SnippetController.createSnippet(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toMatch(/missing/i);
    });

    it('should return 400 if code is missing', async () => {
      const req = jsonRequest({ title: 'x', userId: '1' });
      const res = await SnippetController.createSnippet(req);

      expect(res.status).toBe(400);
    });

    it('should return 400 if userId is missing', async () => {
      const req = jsonRequest({ title: 'x', code: 'y' });
      const res = await SnippetController.createSnippet(req);

      expect(res.status).toBe(400);
    });

    it('should return 201 with the created snippet on success', async () => {
      const snippet = { id: 'abc', title: 'Test', code: 'code', userId: '1' };
      mockedService.create.mockResolvedValueOnce(snippet as any);

      const req = jsonRequest({ title: 'Test', code: 'code', userId: '1' });
      const res = await SnippetController.createSnippet(req);

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.id).toBe('abc');
    });

    it('should return 500 if service throws', async () => {
      mockedService.create.mockRejectedValueOnce(new Error('DB error'));

      const req = jsonRequest({ title: 'T', code: 'C', userId: '1' });
      const res = await SnippetController.createSnippet(req);

      expect(res.status).toBe(500);
    });
  });

  describe('getSnippets', () => {
    it('should return 400 if userId is missing', async () => {
      const req = new Request('http://localhost/api/snippets');
      const res = await SnippetController.getSnippets(req);

      expect(res.status).toBe(400);
    });

    it('should return 200 with snippets array', async () => {
      const snippets = [{ id: '1', title: 'A', code: 'a', userId: 'u1' }];
      mockedService.getAll.mockResolvedValueOnce(snippets as any);

      const req = new Request('http://localhost/api/snippets?userId=u1');
      const res = await SnippetController.getSnippets(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveLength(1);
      expect(body[0].title).toBe('A');
    });

    it('should return 500 if service throws', async () => {
      mockedService.getAll.mockRejectedValueOnce(new Error('DB error'));

      const req = new Request('http://localhost/api/snippets?userId=u1');
      const res = await SnippetController.getSnippets(req);

      expect(res.status).toBe(500);
    });
  });

  describe('deleteSnippet', () => {
    it('should return 400 if userId is missing', async () => {
      const req = new Request('http://localhost/api/snippets?id=1', {
        method: 'DELETE',
      });
      const res = await SnippetController.deleteSnippet(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toMatch(/userId/i);
    });

    it('should return 400 if snippet id is missing', async () => {
      const req = new Request('http://localhost/api/snippets?userId=u1', {
        method: 'DELETE',
      });
      const res = await SnippetController.deleteSnippet(req);

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toMatch(/id/i);
    });

    it('should return 200 on successful deletion', async () => {
      mockedService.delete.mockResolvedValueOnce({ count: 1 } as any);

      const req = new Request(
        'http://localhost/api/snippets?id=s1&userId=u1',
        { method: 'DELETE' }
      );
      const res = await SnippetController.deleteSnippet(req);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(mockedService.delete).toHaveBeenCalledWith('s1', 'u1');
    });

    it('should return 500 if service throws', async () => {
      mockedService.delete.mockRejectedValueOnce(new Error('DB error'));

      const req = new Request(
        'http://localhost/api/snippets?id=s1&userId=u1',
        { method: 'DELETE' }
      );
      const res = await SnippetController.deleteSnippet(req);

      expect(res.status).toBe(500);
    });
  });
});
