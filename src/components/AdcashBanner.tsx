"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    aclib?: {
      runBanner: (options: { zoneId: string }) => void;
    };
  }
}

interface AdcashBannerProps {
  zoneId?: string;
  className?: string;
}

export function AdcashBanner({
  zoneId = "12437738",
  className = "",
}: AdcashBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 60; // ~9s aguardando carregamento do aclib.js

    const mountBanner = (): boolean => {
      if (cancelled || !container) return true;
      if (typeof window === "undefined") return false;

      if (window.aclib && typeof window.aclib.runBanner === "function") {
        // Limpa conteúdo anterior para evitar duplicação em React StrictMode
        container.innerHTML = "";

        const safeZoneId = String(zoneId).replace(/[^a-zA-Z0-9_-]/g, "");
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.text = `if (window.aclib && typeof window.aclib.runBanner === "function") { aclib.runBanner({ zoneId: '${safeZoneId}' }); }`;
        container.appendChild(script);
        return true;
      }

      return false;
    };

    if (mountBanner()) {
      return () => {
        cancelled = true;
        if (container) {
          container.innerHTML = "";
        }
      };
    }

    const intervalId = window.setInterval(() => {
      attempts += 1;
      if (mountBanner() || attempts >= maxAttempts) {
        window.clearInterval(intervalId);
      }
    }, 150);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [zoneId]);

  return (
    <aside
      aria-label="Publicidade"
      className={`mx-auto w-fit rounded-2xl border border-sanctuary-800/80 bg-sanctuary-900/50 p-3 sm:p-4 shadow-sm ${className}`}
    >
      <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 select-none">
        Publicidade
      </p>
      <div
        ref={containerRef}
        className="min-h-[250px] w-[300px] mx-auto flex items-center justify-center overflow-hidden rounded-lg bg-sanctuary-950/60"
      />
    </aside>
  );
}
