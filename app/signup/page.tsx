"use client";

import Link from "next/link";
import SpaceBackground from "@/components/SpaceBackground";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useRouter } from "next/dist/client/components/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    operatorName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { confirmPassword: _confirmPassword, ...payload } = formData;
    const result = await signup(payload);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "INITIALIZATION_FAILED");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#02040a]">
      <SpaceBackground />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl text-zinc-100 leading-tight tracking-tighter">
            Create{" "}
            <span className="text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              New Identity
            </span>{" "}
            <br />
            <span className="text-zinc-500 font-light text-2xl md:text-3xl">
              to Join the Stars
            </span>
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Choose Operator Name"
              className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              name="operatorName"
              value={formData.operatorName}
              onChange={handleChange}
            />

            <input
              type="email"
              placeholder="System Email"
              className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Create Access Password"
              className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="text-red-400 text-[10px] uppercase tracking-widest text-center animate-pulse">
              System Alert: {error}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <p className="text-[11px] text-zinc-500 font-medium tracking-wider uppercase">
              Already have an ID?{" "}
              <Link
                href="/login"
                className="text-zinc-200 hover:text-white underline underline-offset-4 transition-all ml-1 font-bold"
              >
                Go to your Satellite
              </Link>
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full group mt-6 bg-white hover:bg-zinc-200 disabled:bg-zinc-500 border border-white/20 rounded-2xl py-2 pl-8 pr-2 flex items-center justify-between transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <span className="text-black font-black tracking-tighter uppercase text-sm">
              {isLoading ? "Synchronizing..." : "Complete Registration"}
            </span>
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <span className="text-white text-xl">→</span>
            </div>
          </button>
        </form>

        <p className="mt-10 text-[10px] text-zinc-600 text-center leading-relaxed px-12 font-medium tracking-wide">
          By registering, you initialize your connection to the{" "}
          <span className="text-zinc-400 underline cursor-pointer hover:text-zinc-200 transition-colors">
            Radu OS Protocols
          </span>
        </p>
      </div>
    </main>
  );
}
