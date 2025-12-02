import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReCap — Spoiler-Free TV Episode Recaps",
  description: "Get AI-powered, spoiler-free recaps for any TV show episode. Remember what happened before you continue watching.",
  keywords: ["TV recap", "episode summary", "spoiler free", "TV shows", "binge watching"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
