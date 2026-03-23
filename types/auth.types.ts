

export interface OperatorProfile {
  id: string;
  operatorName: string;
  themeColor: string;
  avatarUrl?: string | null;
}

export interface User {
  id: string;
  email: string;
  profile?: OperatorProfile;
}


export interface AuthSession {
  user: {
    email: string;
    name: string;
  } | null;
}

export interface AuthResponse {
  message?: string;
  error?: string;
  user?: {
    email: string;
    operatorName: string;
  };
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  operatorName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setSession: (user: User | null) => void;
  checkSession: () => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}