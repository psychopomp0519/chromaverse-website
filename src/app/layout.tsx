import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { CinemaHeader } from "@/components/layout/CinemaHeader";
import { RadialMenu } from "@/components/core/RadialMenu";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

const pretendard = localFont({
  src: [
    { path: "../fonts/PretendardVariable.woff2", weight: "100 900" },
  ],
  variable: "--font-heading",
  fallback: ["system-ui", "sans-serif"],
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-novel",
});

const SITE_URL = "https://chromaverse-website.pages.dev";

export const metadata: Metadata = {
  title: {
    default: "크로마버스 — 빛과 어둠의 세계",
    template: "%s | 크로마버스",
  },
  description: "크로마주 세계관 백과사전과 크로마버스 소설 연재 플랫폼",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "크로마버스",
    title: "크로마버스 — 빛과 어둠의 세계",
    description: "700화의 대서사. RGB와 CMYK가 지배하는 세계에서 펼쳐지는 크로마버스 소설 연재.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "크로마버스 — 빛과 어둠의 세계",
    description: "700화의 대서사. RGB와 CMYK가 지배하는 세계에서 펼쳐지는 크로마버스 소설 연재.",
  },
  other: {
    "theme-color": "#0B0B14",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={`${pretendard.variable} ${notoSerifKR.variable}`}>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
        >
          <CinemaHeader />
          <main className="overflow-x-hidden pt-16">{children}</main>
          <Footer />
          <RadialMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
