import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Master Minds — Hackathon COL 5.0",
  description: "Dashboard de análisis SECOP II — Datasets jbjy-vk9h, dmgg-8hin y CSV 2025",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className="dark">
      <body className="min-h-screen bg-bg text-fg font-sans antialiased">{children}</body>
    </html>
  );
}
