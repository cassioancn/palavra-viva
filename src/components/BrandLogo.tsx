import React from "react";

interface BrandLogoProps {
  className?: string;
  variant?: "solid" | "radiant";
}

/**
 * BrandLogo — Logotipo estilizado da Cruz Sagrada.
 * Substitui o ícone anterior de pomba por um símbolo cristão moderno,
 * luminoso, elegante e cheio de esperança e reverência.
 */
export function BrandLogo({ className = "w-5 h-5", variant = "radiant" }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Palavra Viva - Cruz da Esperança"
    >
      <defs>
        <radialGradient id="crossAura" cx="50%" cy="38%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo / Aura radiante suave central */}
      {variant === "radiant" && (
        <circle cx="12" cy="9" r="6" fill="url(#crossAura)" />
      )}

      {/* Raios sutis de alvorecer (4 diagonais discretas de esperança) */}
      {variant === "radiant" && (
        <>
          <path
            d="M8.5 5.5L7 4M15.5 5.5L17 4M8.5 12.5L7 14M15.5 12.5L17 14"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        </>
      )}

      {/* Haste Vertical da Cruz */}
      <rect
        x="10.5"
        y="2.5"
        width="3"
        height="18"
        rx="1.5"
        fill="currentColor"
      />

      {/* Haste Horizontal da Cruz */}
      <rect
        x="4.5"
        y="7.5"
        width="15"
        height="3"
        rx="1.5"
        fill="currentColor"
      />

      {/* Ponto de luz no centro da intersecção */}
      <circle cx="12" cy="9" r="1.1" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

