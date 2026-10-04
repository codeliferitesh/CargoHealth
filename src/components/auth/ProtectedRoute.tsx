'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-brand-teal/30 flex items-center justify-center text-brand-teal mb-4 shadow-xl shadow-brand-teal/10 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-3 text-slate-200 font-mono text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents flashing protected content while redirecting
  }

  return <>{children}</>;
}
