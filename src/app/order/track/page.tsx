'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OrderTrackingPage() {
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Retrieve the latest order or fallback to a dummy active one
  const activeOrder = orders.length > 0 ? orders[0] : {
    id: '#OS-8902',
    name: 'Elena R.',
    items: 'Signature Wagyu, Napa Valley Cabernet 2018',
    total: 219.00,
    status: 'Preparing' as const,
    time: '19:42'
  };

  const steps = [
    { label: 'TICKET LOGGED', status: 'Pending', icon: 'receipt_long', desc: 'Secure settlement approved. Sent directly to duty commander display.' },
    { label: 'KITCHEN PREPARING', status: 'Preparing', icon: 'soup_kitchen', desc: 'Chef de Cuisine Marcus Kensington is poaching Kobe steaks.' },
    { label: 'DISHES SERVED', status: 'Served', icon: 'restaurant', desc: 'Sommelier Christian L. has uncorked Napa Valley cabernets.' },
    { label: 'SESSION ARCHIVED', status: 'Completed', icon: 'archive', desc: 'PCI-DSS gateway transaction settled and closed.' }
  ];

  // Determine current active step index
  const activeIndex = steps.findIndex((s) => s.status === activeOrder.status);

  // Quick simulation controls to let user change status directly and watch it animate!
  const advanceStep = () => {
    if (activeOrder.status === 'Pending') {
      updateOrderStatus(activeOrder.id, 'Preparing');
    } else if (activeOrder.status === 'Preparing') {
      updateOrderStatus(activeOrder.id, 'Served');
    } else if (activeOrder.status === 'Served') {
      updateOrderStatus(activeOrder.id, 'Completed');
    } else {
      updateOrderStatus(activeOrder.id, 'Pending');
    }
  };

  return (
    <main className="pt-nav-height max-w-[960px] mx-auto px-margin-mobile md:px-margin-desktop py-16 space-y-12 flex-1 flex flex-col justify-center">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center px-3.5 py-1.5 glass-card rounded-full gap-2 border border-ice-border">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest font-bold">
            Live Telemetry Pacing active
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-premium-white tracking-tight">
          Gastronomic Ticket Telemetry
        </h1>
        <p className="text-sm text-muted-steel max-w-md mx-auto">
          Synchronizing cart allocations, sommelier pairing configurations, and kitchen queue pacing.
        </p>
      </div>

      {/* Ticket Details summary card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-ice-border space-y-4 bg-gradient-to-br from-[#12141C] to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-ice-border/50 pb-4">
          <div>
            <span className="font-mono text-[9px] text-[#8E939E] uppercase tracking-widest block">
              Active Table Ticket
            </span>
            <span className="font-mono text-lg text-[#E5C158] font-bold">{activeOrder.id}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-[#8E939E] uppercase tracking-widest block text-left md:text-right">
              Pacing Stage
            </span>
            <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20 uppercase">
              {activeOrder.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="space-y-1">
            <span className="text-[#8E939E] uppercase tracking-wider font-mono text-[9px] block">Dishes Paced</span>
            <p className="text-premium-white font-medium">{activeOrder.items}</p>
          </div>
          <div className="space-y-1 md:text-right">
            <span className="text-[#8E939E] uppercase tracking-wider font-mono text-[9px] block">Tab Settled</span>
            <p className="font-mono text-base text-premium-white font-bold">${activeOrder.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Visual Stepper Tracker */}
      <div className="relative space-y-12 py-6">
        
        {/* Connector vertical line for mobile / horizontal line for desktop */}
        <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-white/5 md:hidden"></div>
        <div className="absolute left-10 right-10 top-14 h-0.5 bg-white/5 hidden md:block"></div>

        {/* Dynamic Connector highlighted progress line */}
        {activeIndex !== -1 && (
          <>
            {/* Mobile Vertical highlighted line */}
            <div
              className="absolute left-6 top-10 w-0.5 bg-[#E5C158] md:hidden transition-all duration-500"
              style={{ height: `${(activeIndex / (steps.length - 1)) * 80}%` }}
            ></div>
            {/* Desktop Horizontal highlighted line */}
            <div
              className="absolute left-10 top-14 h-0.5 bg-[#E5C158] hidden md:block transition-all duration-500"
              style={{ width: `${(activeIndex / (steps.length - 1)) * 92}%` }}
            ></div>
          </>
        )}

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:text-center relative">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;
            
            let circleClass = 'bg-white/5 border-ice-border text-muted-steel';
            if (isCompleted) {
              circleClass = 'bg-[#E5C158]/10 border-[#E5C158] text-[#E5C158]';
            } else if (isActive) {
              circleClass = 'bg-[#E5C158] border-[#E5C158] text-canvas-charcoal font-bold shadow-lg shadow-[#E5C158]/20';
            }

            return (
              <div key={step.status} className="flex md:flex-col items-center md:items-center gap-6 md:gap-4 group">
                {/* Circle step badge */}
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${circleClass}`}>
                  <span className="material-symbols-outlined text-xl">{step.icon}</span>
                </div>

                {/* text */}
                <div className="space-y-1 md:text-center text-left">
                  <h4 className={`text-xs font-mono font-bold uppercase tracking-widest ${isActive ? 'text-[#E5C158]' : 'text-premium-white'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-muted-steel leading-relaxed max-w-[200px] md:mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator quick-control Panel */}
      <div className="glass-card p-5 rounded-xl border border-ice-border flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-tr from-[#12141C]/50 to-transparent">
        <div className="text-left space-y-1">
          <h4 className="text-xs font-bold text-premium-white font-mono">Operations Simulator Panel</h4>
          <p className="text-[10px] text-muted-steel">Simulate shift actions to verify visual stepper layout pacing dynamically.</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={advanceStep}
            className="px-4 py-2.5 rounded-lg bg-glass-fill border border-ice-border hover:border-[#E5C158]/50 text-xs font-bold text-[#E5C158] transition-all spring-interaction flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">speed</span>
            Simulate Next Shift Stage
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-ice-border text-xs text-premium-white hover:bg-white/10 transition-all font-semibold"
          >
            Return to HQ terminal
          </Link>
        </div>
      </div>

    </main>
  );
}
