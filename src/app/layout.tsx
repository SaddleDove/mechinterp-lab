import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: {
    default: 'MechInterp Lab — Mechanistic Interpretability Research Platform',
    template: '%s | MechInterp Lab',
  },
  description:
    'A fictional, front-end-only mechanistic interpretability console. Attention visualization, activation patching, SAE feature browser, logit lens, and more — every number on every page is simulated demo data, not output from a real model.',
};

export default function RootLayout({
  children,
}: ReadonlyProps<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="bg-[#09090b] text-zinc-100 antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

type ReadonlyProps<T> = Readonly<T>;
