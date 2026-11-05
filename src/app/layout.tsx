import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://palavra-viva.novo-dia.workers.dev"),
  alternates: {
    canonical: "/",
  },
  title: "Palavra Viva — Consolo & Direção na Bíblia Sagrada",
  description:
    "Compartilhe o que você está sentindo e receba uma passagem real da Bíblia Sagrada com reflexão pastoral e oração, 100% livre de alucinações.",
  keywords: [
    "bíblia",
    "versículo do dia",
    "consolo bíblico",
    "oração",
    "ansiedade",
    "esperança",
    "palavra de deus",
    "nvi",
    "almeida",
  ],
  authors: [{ name: "Palavra Viva" }],
  openGraph: {
    title: "Palavra Viva — Consolo & Direção na Bíblia Sagrada",
    description:
      "Diga como você se sente e encontre paz na Palavra de Deus com versículos 100% verificados e reflexões pastorais acolhedoras.",
    url: "https://palavra-viva.novo-dia.workers.dev",
    siteName: "Palavra Viva",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-sanctuary-950 text-slate-100 antialiased selection:bg-sacred-500/30 selection:text-sacred-200">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          {/* Subtle Ambient Light Gradients */}
          <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sacred-500/10 blur-[130px]" />
          <div className="pointer-events-none fixed top-1/3 -left-40 -z-10 h-[450px] w-[500px] rounded-full bg-sky-500/5 blur-[120px]" />
          <div className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[400px] w-[450px] rounded-full bg-sacred-500/5 blur-[100px]" />

          {children}
        </div>
      </body>
    </html>
  );
}

