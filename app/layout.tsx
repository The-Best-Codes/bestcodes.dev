import Footer from "@/components/global/footer";
import Header from "@/components/global/header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestcodes.dev";

export const metadata: Metadata = {
  title: "BestCodes - Official Website",
  description:
    "BestCodes is a Christian, Coder, and Creator. Explore projects, resources, and more.",
  keywords: [
    "bestcodes",
    "best-codes",
    "best_codes",
    "the-best-codes",
    "the-best-codes",
    "the_best_codes",
    "thebestcodes",
    "react",
    "next.js",
  ],
  openGraph: {
    title: "BestCodes - Official Website",
    description: "Christian, Coder, Creator",
    url: siteBaseUrl,
    siteName: "BestCodes",
    /* images: [
      {
        url: "https://bestcodes.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "BestCodes Official Website",
      },
      ], */
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BestCodes - Official Website",
    description: "Christian, Coder, Creator",
    site: "@the_best_codes",
    creator: "@the_best_codes",
    /* images: {
      url: "https://bestcodes.dev/twitter-image.png",
      alt: "BestCodes Official Website",
      }, */
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
