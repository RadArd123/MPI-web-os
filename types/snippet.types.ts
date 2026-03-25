export interface Snippet {
  id: string;
  title: string;
  code: string;
}

export interface SnippetState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
  
  fetchSnippets: (userId: string) => Promise<void>;
  addSnippet: (data: Omit<Snippet, 'id'>, userId: string) => Promise<void>;
  removeSnippet: (id: string, userId: string) => Promise<void>;
}