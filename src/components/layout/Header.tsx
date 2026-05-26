'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Utensils, ShoppingCart, UserCircle } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export default function Header({ onOpenCart }: HeaderProps) {
  const pathname = usePathname();
  const session = useStore((state) => state.session);
  const cartCount = useStore((state) => state.getCartCount());
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: 'QR Menu', href: '/qr' },
    { label: 'Live Menu', href: '/menu' },
    { label: 'AI Concierge', href: '/chatbot' },
    { label: 'Checkout', href: '/order' },
    { label: 'Ops Terminal', href: '/dashboard' },
    { label: 'Analytics Hub', href: '/analytics' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-nav-height bg-[#0C0705]/85 backdrop-blur-xl border-b border-ice-border z-50 transition-all">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-full max-w-grid-max-width mx-auto">
        
        {/* Logo and Tenant Info */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 spring-interaction">
            <Utensils className="text-[#C58A46] font-bold" size={32} />
            <div className="flex flex-col">
              <h1 className="font-display-lg text-headline-md font-extrabold text-[#C58A46] tracking-tight leading-none">
                RestaurantOS
              </h1>
              {mounted && (
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8E939E] mt-0.5">
                  {session.restaurant}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActive
                      ? 'text-[#C58A46] font-bold border-b-2 border-[#C58A46] pb-1'
                      : 'text-[#8E939E] hover:text-[#F4F5F6]'
                  } transition-all font-body-md text-sm`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cart & Account Status */}
        <div className="flex items-center gap-6">
          {/* Dynamic Cart Trigger */}
          <div
            onClick={onOpenCart}
            className="relative cursor-pointer group spring-interaction p-2"
          >
            <ShoppingCart className="lucide-icon text-premium-white" size={32} />
            {mounted && cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C58A46] text-canvas-charcoal text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-canvas-charcoal">
                {cartCount}
              </span>
            )}
          </div>

          {/* Mobile sticky cart bubble (touch-friendly) */}
          <div className="md:hidden fixed bottom-16 right-4 z-50">
            <button onClick={onOpenCart} aria-label="Open cart" className="w-14 h-14 rounded-full bg-[#C58A46] text-canvas-charcoal flex items-center justify-center shadow-2xl spring-interaction">
              <ShoppingCart className="lucide-icon" size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-canvas-charcoal text-[#C58A46] text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-[#0C0705]">{cartCount}</span>
              )}
            </button>
          </div>

          {/* User / SaaS Role Indicator */}
          {mounted && (
            <div className="flex items-center gap-3 pl-4 border-l border-ice-border">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-premium-white">{session.user}</span>
                <span className="text-[9px] font-mono tracking-widest text-[#C58A46] uppercase">
                  {session.role} Mode
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-ice-border overflow-hidden bg-glass-fill flex items-center justify-center cursor-pointer hover:border-[#E5C158]/50 transition-colors">
                <UserCircle className="text-[#8E939E]" size={24} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
