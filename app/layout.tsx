import type { Metadata } from "next";
import "./globals.css";

import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

// add the variable to your <html> or <body> tag
<body className={`${playfair.variable}`}></body>

import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Resilink — Enrollment Tracker",
  description: "NEET PG Resident Enrollment Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dancing.variable} bg-gray-500 min-h-screen`}>{children}</body>  
    </html>
  );
}
