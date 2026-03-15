import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
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

export const metadata: Metadata = {
  title: {
    default: "크로마버스 — 빛과 어둠의 세계",
    template: "%s | 크로마버스",
  },
  description: "크로마주 세계관 백과사전과 크로마버스 소설 연재 플랫폼",
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
          <Header />
          <main className="overflow-x-hidden pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
