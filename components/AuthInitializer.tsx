'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { checkSession } = useAuthStore();

  useEffect(() => {
    
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}