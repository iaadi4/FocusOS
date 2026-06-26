import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusOS - Master Your Digital Life",
  description:
    "The ultimate productivity suite for your browser. Master your time, stay focused, and eliminate distractions with FocusOS.",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#0A0A0A] text-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}

