import type { Metadata } from "next";
import React from 'react';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SDXL Lightning - by fal.ai",
  description: "Lightning fast SDXL API demo by fal.ai",
  authors: [{ name: "fal.ai", url: "https://fal.ai" }],
  metadataBase: new URL("https://fastsdxl.ai"),
  openGraph: {
    images: "/og_thumbnail.jpeg",
  },
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

