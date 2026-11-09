import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
    "consolo cristão",
    "devocional",
    "passagens bíblicas",
  ],
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const cfToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-sanctuary-950 text-slate-100 antialiased selection:bg-sacred-500/30 selection:text-sacred-200">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          {/* Sutis auras de iluminação de santuário */}
          <div className="pointer-events-none fixed -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sacred-500/10 blur-[130px]" />
          <div className="pointer-events-none fixed top-1/3 -left-40 -z-10 h-[450px] w-[500px] rounded-full bg-sky-500/5 blur-[120px]" />
          <div className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[400px] w-[450px] rounded-full bg-sacred-500/5 blur-[100px]" />

          {children}
        </div>

        {/* Google Analytics (opcional se configurado) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Cloudflare Web Analytics (opcional se configurado) */}
        {cfToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfToken}"}`}
            strategy="afterInteractive"
          />
        )}

        {/* Infolinks Ads */}
        <Script id="infolinks-config" strategy="lazyOnload">
          {`
            var infolinks_pid = 3449438;
            var infolinks_wsid = 0;
          `}
        </Script>
        <Script
          id="infolinks-main"
          src="//resources.infolinks.com/js/infolinks_main.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
