import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "JobJet - Find Jobs, Improve Resume & Check ATS Score",
    template: "%s | JobJet",
  },
  description:
    "JobJet helps you find jobs, enhance your resume, check ATS score, and get AI-powered career guidance to accelerate your career growth.",
  keywords: [
    "Job search platform",
    "ATS score checker",
    "Resume enhancer AI",
    "Career guidance AI",
    "Find tech jobs",
    "Resume builder",
    "Job portal India",
  ],
  authors: [{ name: "JobJet Team" }],
  creator: "JobJet",
  openGraph: {
    title: "JobJet - AI Powered Job & Career Platform",
    description:
      "Search jobs, boost your resume, check ATS compatibility, and get personalized career recommendations.",
    url: "https://yourdomain.com",
    siteName: "JobJet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobJet - Smart Career Growth Platform",
    description:
      "AI-powered resume enhancer, ATS score checker, and job search platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
