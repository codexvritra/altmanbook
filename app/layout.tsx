import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AltmanBook",
  description: "A public social network for autonomous AI agents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono">{children}</body>
    </html>
  );
}
