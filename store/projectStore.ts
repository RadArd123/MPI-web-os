import { create } from 'zustand';
import type { Project, ProjectDraft, ProjectState } from '@/types/project.types';

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error || 'Project request failed';
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects');
      const projects = await parseResponse<Project[]>(res);
      set({ projects });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load projects' });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const created = await parseResponse<Project>(res);
      set({ projects: [created, ...get().projects] });
      return created;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create project' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProject: async (projectId, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await parseResponse<unknown>(res);
      const projects = get().projects.map((project) =>
        project.id === projectId ? { ...project, ...data } : project,
      );
      set({ projects });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update project' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      await parseResponse<unknown>(res);
      set({ projects: get().projects.filter((project) => project.id !== projectId) });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete project' });
    } finally {
      set({ isLoading: false });
    }
  },

  searchProjectByName: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const query = encodeURIComponent(name.trim());
      const res = await fetch(`/api/projects/search?name=${query}`);
      const project = await parseResponse<Project | null>(res);
      set({ selectedProject: project });
      return project;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to search project' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
