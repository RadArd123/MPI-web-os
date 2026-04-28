export type ProjectStatus = 'IN_PROGRESS' | 'FINISHED';

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  status: ProjectStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDraft {
  name: string;
  description?: string;
  link?: string;
  status?: ProjectStatus;
}

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: ProjectDraft) => Promise<Project | null>;
  updateProject: (projectId: string, data: Partial<ProjectDraft>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  searchProjectByName: (name: string) => Promise<Project | null>;
  clearError: () => void;
}
