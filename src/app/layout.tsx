import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'RestaurantOS | Enterprise AI Hub for Premium Cafés',
  description: 'Automate premium coffee shops, high-end bakeries, and boutique café operations with real-time telemetry, AI Barista concierge, and modern SaaS consoles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full dark", "font-sans", geist.variable)}>
      <body className="h-full bg-canvas-charcoal text-premium-white antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
