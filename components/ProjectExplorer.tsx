'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import type { ProjectDraft } from '@/types/project.types';

const inputClass =
  'h-8 min-w-0 rounded-md border border-white/15 bg-black/50 px-2.5 text-[10px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30';

export default function ProjectExplorer() {
  const { projects, isLoading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjectStore();
  const [draft, setDraft] = useState<ProjectDraft>({ name: '', description: '', link: '', status: 'IN_PROGRESS' });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalLabel = useMemo(() => `${projects.length} projects`, [projects.length]);

  const handleCreate = async () => {
    if (!draft.name?.trim()) return;
    const created = await createProject(draft);
    if (created) {
      setDraft({ name: '', description: '', link: '', status: 'IN_PROGRESS' });
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 font-mono text-zinc-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Portfolio / {totalLabel}</p>
        <button
          onClick={fetchProjects}
          className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:text-zinc-200"
          title="Refresh"
        >
          <RotateCcw size={12} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_130px_86px]">
        <input
          className={inputClass}
          placeholder="Project name"
          value={draft.name || ''}
          onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder="Description"
          value={draft.description || ''}
          onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder="https://"
          value={draft.link || ''}
          onChange={(e) => setDraft((prev) => ({ ...prev, link: e.target.value }))}
        />
        <select
          className={inputClass}
          value={draft.status || 'IN_PROGRESS'}
          onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as ProjectDraft['status'] }))}
        >
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="FINISHED">FINISHED</option>
        </select>
        <button
          onClick={handleCreate}
          className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-white/20 bg-white px-2 text-[9px] font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200"
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {error && <p className="text-[10px] uppercase tracking-widest text-red-400">{error}</p>}

      <div className="custom-scrollbar grid flex-1 auto-rows-min content-start grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="self-start rounded-lg border border-white/10 bg-black/60 p-2.5">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-zinc-200">{project.name}</p>
                <p className="truncate text-[9px] text-zinc-500">{project.description || 'No description'}</p>
              </div>
              <span className="rounded border border-white/15 px-2 py-0.5 text-[9px] text-zinc-400">{project.status}</span>
            </div>

            <p className="mb-2 truncate text-[9px] text-zinc-600">{project.link || 'No link'}</p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateProject(project.id, {
                    status: project.status === 'FINISHED' ? 'IN_PROGRESS' : 'FINISHED',
                  })
                }
                className="h-7 rounded-md border border-white/15 px-2.5 text-[9px] uppercase tracking-widest text-zinc-300 transition hover:bg-white/10"
              >
                Toggle
              </button>
              <a
                href={project.link || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 items-center gap-1 rounded-md border border-white/15 px-2.5 text-[9px] uppercase tracking-widest text-zinc-300 transition hover:bg-white/10"
              >
                <ExternalLink size={10} /> Open
              </a>
              <button
                onClick={() => deleteProject(project.id)}
                className="ml-auto inline-flex h-7 items-center gap-1 rounded-md border border-red-500/40 px-2.5 text-[9px] uppercase tracking-widest text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={10} /> Delete
              </button>
            </div>
          </div>
        ))}

        {!isLoading && projects.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-white/15 p-8 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            No projects yet
          </div>
        )}
      </div>
    </div>
  );
}