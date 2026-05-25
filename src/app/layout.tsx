import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'RestaurantOS | Enterprise AI Hub for Premium Dining',
  description: 'Automate fine dining and high-end hospitality operations with real-time telemetry, AI Sommelier service, and modern SaaS consoles.',
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
