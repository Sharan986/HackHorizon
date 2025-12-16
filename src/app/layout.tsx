import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { s } from "motion/react-client";
import LenisProvider from "@/utils/LenisProvider";
import Snowfall from "@/components/ui/HeroSectionElement/Snowfall";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clashClan = localFont({
  src: [
    {
      path: "../../public/Clash_Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-clashclan", // useful for Tailwind
});

// const superCell = localFont({
//   src: [
//     {
//       path: "../../public/supercell-magic.ttf",
//       weight: "400",
//       style: "normal",
//     },
//   ],
//   variable: "--font-supercell", // useful for Tailwind
// });

export const metadata: Metadata = {
  title: "Innerve X",
  description: "Created by OSS",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <head>
        {/* Preload critical hero background image */}
        <link
          rel="preload"
          href="/_next/static/media/background.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${clashClan.variable} antialiased`}
      >
        <Snowfall />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
