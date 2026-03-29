import { create } from 'zustand';
import type { ProfileState } from '@/types/profile.types';


export const useProfileStore = create<ProfileState>((set) => ({

    profiles: [],
    profile: null,
    isLoading: false,
    error: null,

    fetchProfiles: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/profile', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error("Failed to load profiles.");
            const data = await res.json();
            set({ profiles: data, isLoading: false });

        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error fetching profiles" });
        } finally {
            set({ isLoading: false });
        }
    },
    updateProfile: async (userId, operatorName, themeColor) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`/api/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operatorName, themeColor }),
            });
            if (!res.ok) throw new Error("Failed to update profile.");
            const updatedProfile = await res.json();
            set((state) => ({
                profile: updatedProfile,
                profiles: state.profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p),
            }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error updating profile" });
        } finally {
            set({ isLoading: false });
        }

    },
    getProfile: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`/api/profile/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error("Failed to load profile.");
            const data = await res.json();
            set({ profile: data });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error fetching profile" });
        } finally {
            set({ isLoading: false });
        }
    },
    getProfileByOperatorName: async (operatorName) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`/api/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operatorName }),
            });
            if (!res.ok) throw new Error("Failed to load profile.");
            const data = await res.json();
            set({ profile: data });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error fetching profile" });
        } finally {
            set({ isLoading: false });
        }
    },

}));