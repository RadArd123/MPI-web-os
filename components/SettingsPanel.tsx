"use client";

import { useProfileStore } from "@/store/profileStore";
import { useEffect, useState } from "react";
import { User, Palette, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Settings() {
  const { profile, getProfile, updateProfile, isLoading, error } = useProfileStore();
  const { user, deleteAccount } = useAuthStore();

  const [name, setName] = useState("");
  const [themeColor, setThemeColor] = useState("");

 
  useEffect(() => {
    if (user?.id) {
      getProfile(user.id);
    }
  }, [user?.id, getProfile]);

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(profile.operatorName || "");
      setThemeColor(profile.themeColor || "");
    }
  }, [profile]);

  const handleUpdate = async () => {
    if (user?.id) {
      await updateProfile(user.id, name, themeColor);
      alert("Profile updated successfully!");
    }
  };

  const handleDeleteAccount = async () => {
    if (user?.id) {
      const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (confirmDelete) {
        await deleteAccount(user?.id);
      }
    }
  };

  return (
    <div className="h-full w-full max-w-2xl mx-auto p-4 gap-6 flex flex-col text-cyan-50">
      {/* Header */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col items-center gap-2 shadow-lg">
        <h1 className="text-3xl font-black tracking-tighter text-cyan-400 uppercase">System Settings</h1>
        <p className="text-zinc-400 text-sm">Gestionare identitate operator și parametri terminal.</p>
      </div>

      {isLoading && <p className="text-cyan-400 animate-pulse text-center text-xs">Processing request...</p>}
      {error && <p className="text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20 text-center text-xs">{error}</p>}

      {/* Profile Settings Group */}
      <div className="flex flex-col gap-4">
        {/* Operator Name Field */}
        <div className="p-4 rounded-lg border border-white/10 bg-white/5 flex items-center gap-4 transition-all focus-within:border-cyan-500/50">
          <User size={20} className="text-cyan-400" />
          <div className="flex flex-col flex-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Operator Name</label>
            <input
              type="text"
              className="text-sm text-cyan-300 bg-transparent border-none focus:outline-none font-mono"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/40 text-[10px] font-bold transition-all disabled:opacity-50"
          >
            UPDATE
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-auto p-4 rounded-lg border border-red-500/20 bg-red-500/5 flex justify-between items-center group hover:border-red-500/50 transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Danger Zone</p>
            <p className="text-[10px] text-zinc-500">Ștergerea contului este ireversibilă.</p>
          </div>
        </div>
        <button 
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/30 text-red-500 rounded border border-red-500/50 text-[10px] font-black transition-all"
        >
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
}