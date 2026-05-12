import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resilink — Enrollment Tracker",
  description: "NEET PG Resident Enrollment Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-500 min-h-screen">{children}</body>  
    </html>
  );
}
