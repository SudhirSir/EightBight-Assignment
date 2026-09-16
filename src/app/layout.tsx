import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OctaByte Dynamic Portfolio Dashboard',
  description: 'Real-time financial portfolio tracking app built with Next.js, React, TypeScript, Tailwind CSS, Yahoo & Google Finance APIs.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0c0e12] text-zinc-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
