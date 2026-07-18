"use client";

import { useEffect, useState } from "react";
import { Database, Wifi, WifiOff } from "lucide-react";
import { StatusBadge } from "@/components/layout/Navbar";

interface SupabaseStatusProps {
  compact?: boolean;
}

export function SupabaseStatus({ compact = false }: SupabaseStatusProps) {
  const [status, setStatus] = useState<{
    connected: boolean;
    authenticated?: boolean;
    loading: boolean;
  }>({ connected: false, loading: true });

  useEffect(() => {
    fetch("/api/supabase-status")
      .then((r) => r.json())
      .then((data) =>
        setStatus({
          connected: data.connected === true,
          authenticated: data.authenticated,
          loading: false,
        })
      )
      .catch(() => setStatus({ connected: false, loading: false }));
  }, []);

  if (status.loading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
        <Database className="w-3 h-3 animate-pulse" />
        {!compact && "Checking Supabase…"}
      </span>
    );
  }

  if (!status.connected) {
    return (
      <StatusBadge variant="warning">
        <WifiOff className="w-3 h-3 mr-1" />
        {compact ? "Offline" : "Supabase offline · local mode"}
      </StatusBadge>
    );
  }

  return (
    <StatusBadge variant="success">
      <Wifi className="w-3 h-3 mr-1" />
      {compact
        ? "Live"
        : status.authenticated
          ? "Supabase connected · signed in"
          : "Supabase connected"}
    </StatusBadge>
  );
}
