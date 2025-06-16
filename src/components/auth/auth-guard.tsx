"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/v1/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
