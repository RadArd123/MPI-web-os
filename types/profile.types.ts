export interface UserProfile {
  id: string;
  userId: string;
  operatorName: string;
  themeColor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileState {
  profiles: UserProfile[];
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
    fetchProfiles: () => Promise<void>;
    updateProfile: (userId: string, operatorName: string, themeColor: string) => Promise<void>;
    getProfile: (userId: string) => Promise<void>;
    getProfileByOperatorName: (operatorName: string) => Promise<void>;
}