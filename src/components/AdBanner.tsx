"use client";

import React, { useEffect } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adsenseClient || !slot) return;
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn("AdSense push error:", err);
    }
  }, [adsenseClient, slot]);

  // If no AdSense account is configured, hide completely to avoid empty white boxes
  if (!adsenseClient || !slot) {
    return null;
  }

  return (
    <div className={`w-full overflow-hidden my-6 text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

