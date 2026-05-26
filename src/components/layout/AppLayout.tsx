'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import CartSidebar from './CartSidebar';
import RoleSwitcher from '../ui/RoleSwitcher';
import FloatingChatbot from '../chatbot/FloatingChatbot';
import { useStore, NotificationItem } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Routes where admin chrome (header, sidebar, role switcher) should be hidden
 * — these are customer-facing scan/transition pages.
 */
const CHROMELESS_ROUTES = ['/qr', '/qr/scan'];

/**
 * Admin-only routes that customers should never see.
 * If a customer (table session) tries to access these, redirect to menu.
 */
const ADMIN_ROUTES = ['/dashboard', '/analytics', '/qr-generator'];

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const [cartOpen, setCartOpen] = useState(false);
  const notifications = useStore((state) => state.notifications);
  const tableNumber = useStore((state) => state.tableNumber);
  const session = useStore((state) => state.session);
  const [activeToasts, setActiveToasts] = useState<NotificationItem[]>([]);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor notifications array to show toasts
  useEffect(() => {
    if (!mounted || notifications.length === 0) return;
    
    // Get the latest notification
    const newest = notifications[0];
    
    // Avoid double-toast for the same notification id
    setActiveToasts((prev) => {
      if (prev.some((t) => t.id === newest.id)) return prev;
      
      // Auto-remove toast after 3.5 seconds
      setTimeout(() => {
        setActiveToasts((current) => current.filter((t) => t.id !== newest.id));
      }, 3500);

      return [...prev, newest];
    });
  }, [notifications, mounted]);

  // Determine layout mode
  const isChromeless = CHROMELESS_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  // Only enforce strict customer routing lock if they are actually a Guest
  const isCustomerMode = mounted && !!tableNumber && session?.role === 'Guest';

  // Customer trying to access admin routes — redirect directly to menu
  useEffect(() => {
    if (isCustomerMode && isAdminRoute) {
      router.replace(`/menu?table=${tableNumber}`);
    }
  }, [isCustomerMode, isAdminRoute, router, tableNumber]);

  if (!mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-canvas-charcoal">{children}</div>
      </QueryClientProvider>
    );
  }

  // Chromeless mode: QR scan pages — no header, no sidebar, no floaters
  if (isChromeless) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-canvas-charcoal text-premium-white font-sans">
          {children}
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-canvas-charcoal text-premium-white flex flex-col font-sans">
        {/* Global Header */}
        <Header onOpenCart={() => setCartOpen(true)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Cart Sidebar */}
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

        {/* Float B2B Console Switcher — hide for customers */}
        {!isCustomerMode && <RoleSwitcher />}

        {/* Persistent Floating AI Barista Chatbot */}
        <FloatingChatbot />

        {/* Toast Notification Container */}
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
          <AnimatePresence>
            {activeToasts.map((toast) => {
              let borderClass = 'border-l-[#C58A46]';
              let Icon = Info;
              let iconColor = 'text-[#C58A46]';

              if (toast.type === 'success') {
                borderClass = 'border-l-green-500';
                Icon = CheckCircle;
                iconColor = 'text-green-400';
              } else if (toast.type === 'warning') {
                borderClass = 'border-l-amber-500';
                Icon = AlertTriangle;
                iconColor = 'text-amber-400';
              } else if (toast.type === 'error') {
                borderClass = 'border-l-red-500';
                Icon = XCircle;
                iconColor = 'text-red-400';
              }

              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`glass-card p-4 rounded-xl border-l-4 ${borderClass} flex items-center gap-3 shadow-2xl pointer-events-auto`}
                >
                  <Icon className={iconColor} size={24} />
                  <span className="text-xs font-medium text-premium-white flex-1">
                    {toast.text}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </QueryClientProvider>
  );
}
