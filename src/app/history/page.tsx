'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Award, Clock, ArrowLeft, RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

export default function HistoryPage() {
  const router = useRouter();
  const pastOrders = useStore((state) => state.pastOrders);
  const reorderPastOrder = useStore((state) => state.reorderPastOrder);
  const favoriteItemIds = useStore((state) => state.favoriteItemIds);
  const menuItems = useStore((state) => state.menuItems);
  const tableNumber = useStore((state) => state.tableNumber);

  const { playSound } = useSoundFeedback();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Simple mock loyalty variables (subtle, dynamic)
  const loyaltyPoints = 380;
  const targetPoints = 500;
  const loyaltyPercentage = (loyaltyPoints / targetPoints) * 100;

  const handleReorder = (orderId: string) => {
    playSound('pip');
    reorderPastOrder(orderId);
    router.push('/order'); // redirect to checkout review instantly
  };

  return (
    <main className="pt-nav-height min-h-screen bg-canvas-charcoal relative overflow-hidden flex flex-col items-center">
      {/* Background glowing spheres */}
      <div className="absolute top-1/4 -left-32 w-[350px] h-[350px] bg-[#C58A46]/5 blur-[90px] rounded-full pointer-events-none"></div>
      <div className="absolute top-2/3 -right-32 w-[400px] h-[400px] bg-[#E7C39A]/4 blur-[110px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md px-margin-mobile py-8 space-y-8 z-10 flex-1 flex flex-col">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/menu"
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-ice-border hover:border-[#C58A46]/35 text-xs text-premium-white transition-all flex items-center gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#C58A46]" />
            Back to Menu
          </Link>
          <div className="text-right">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-steel block">Current Session</span>
            <span className="text-xs text-premium-white font-bold font-mono">
              {tableNumber ? `Table ${tableNumber}` : 'QR Entrance Required'}
            </span>
          </div>
        </div>

        {/* Profile Card & Dynamic Loyalty showcase */}
        <section className="glass-card p-6 rounded-2xl border border-ice-border space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C58A46]/10 border border-[#C58A46]/20 flex items-center justify-center text-[#C58A46] font-bold text-sm shrink-0">
              ER
            </div>
            <div>
              <h2 className="text-lg font-bold text-premium-white tracking-tight">Elena Rostova</h2>
              <p className="text-xs text-muted-steel">Premium Guest Account</p>
            </div>
          </div>

          {/* Dynamic Loyalty Circle ring */}
          <div className="p-4 bg-white/3 border border-ice-border rounded-xl flex items-center justify-between gap-6">
            <div className="space-y-1.5 flex-1">
              <span className="text-[9px] font-mono tracking-widest text-[#C58A46] uppercase block">Loyalty Balance</span>
              <h3 className="text-xl font-extrabold text-premium-white tracking-tight">
                {loyaltyPoints} <span className="text-xs font-normal text-muted-steel font-sans">/ {targetPoints} points</span>
              </h3>
              <p className="text-[10px] text-muted-steel leading-relaxed">
                Enjoy {targetPoints - loyaltyPoints} more points to redeem your next organic Silk Flat White on us.
              </p>
            </div>
            
            {/* SVG Ring Progress */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-white/5"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-[#C58A46]"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 26}
                  initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - loyaltyPercentage / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <Award className="h-4.5 w-4.5 text-[#C58A46]" />
              </div>
            </div>
          </div>
        </section>

        {/* Favorite items summary */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">Favorite Drinks</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.filter(m => favoriteItemIds.includes(m.id)).map(item => (
              <Link
                key={item.id}
                href="/menu"
                className="p-3 bg-white/3 border border-ice-border rounded-xl hover:border-[#C58A46]/25 transition-all text-left block"
              >
                <h4 className="text-xs font-bold text-premium-white truncate">{item.name}</h4>
                <p className="text-[10px] text-[#C58A46] font-mono mt-1 font-bold">${item.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Order History */}
        <section className="space-y-4 flex-1 flex flex-col">
          <h3 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#C58A46]" />
            Previous Orders
          </h3>

          <div className="space-y-3 flex-grow overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
            {pastOrders.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center space-y-3">
                <Clock size={36} className="lucide-icon text-muted-steel/20 mx-auto" />
                <p className="text-xs text-muted-steel">No previous order receipts logged yet.</p>
              </div>
            ) : (
              pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card p-4.5 rounded-xl border border-ice-border hover:border-[#C58A46]/20 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-mono text-xs text-[#C58A46] font-bold">{order.id}</h4>
                      <p className="text-[9px] text-muted-steel mt-0.5 uppercase tracking-wider">{order.time}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-white/5 border border-ice-border text-[9px] font-bold text-muted-steel rounded">
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-premium-white/80 leading-relaxed font-sans">
                    {order.items}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="text-xs">
                      <span className="text-muted-steel">Total Paid: </span>
                      <span className="font-mono font-bold text-premium-white">${order.total.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handleReorder(order.id)}
                      className="px-3 py-1.5 rounded-lg bg-glass-fill border border-ice-border hover:border-[#C58A46]/45 text-[10px] text-[#C58A46] font-bold transition-all flex items-center gap-1.5 spring-interaction"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reorder
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
