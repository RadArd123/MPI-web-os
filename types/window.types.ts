export interface WindowInstance {
  id: string;      
  title: string;  
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;  
}

export interface WindowState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
}

export interface WindowProps {
  id: string;
  title: string;
  zIndex: number;
  children: React.ReactNode;
  isMaximized: boolean; 
  isMinimized: boolean; 
  onMaximized: () => void;
  onMinimized: () => void;
  onClose: () => void;
  onFocus: () => void;
}