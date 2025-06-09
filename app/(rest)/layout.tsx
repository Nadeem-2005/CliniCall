import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CliniCall-Dashboard",
  description: "Your,  Health, Our Priority",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <html>
        <body>{children}</body>
      </html>
    </>
  );
};

export default layout;
