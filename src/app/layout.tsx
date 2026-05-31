import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'HospitalityOS | Smart Guest Experience & Operations Platform',
  description: 'Unify QR ordering, guest service dispatch, and hospitality operations management across restaurants, boutique cafés, and luxury hotels.',
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
