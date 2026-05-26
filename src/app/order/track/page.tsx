'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ArrowRight, ShieldCheck, Compass, Check, Loader2, Sparkles, Award } from 'lucide-react';
import { useStore } from '@/store/useStore';

type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served';

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <main className="pt-nav-height max-w-md mx-auto px-margin-mobile py-10 space-y-8 flex-1 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#C58A46] w-8 h-8 mb-2" />
        <span className="text-xs text-muted-steel uppercase tracking-widest font-mono">Synchronizing kitchen queue...</span>
      </main>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const tableNumber = useStore((state) => state.tableNumber);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer state
  const [minutesRemaining, setMinutesRemaining] = useState(8);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setMinutesRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 45000); // Decelerate countdown for realistic demo feel
    return () => clearInterval(interval);
  }, [mounted]);

  // Find target order or degrade to seed fallback
  const activeOrder = useMemo(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      const found = orders.find(o => o.id === queryId);
      if (found) return found;
    }
    return orders.length > 0 ? orders[0] : {
      id: '#OS-8902',
      name: 'Elena R.',
      items: 'Silk Flat White (1x), Almond Croissant (1x)',
      total: 11.30,
      status: 'Preparing' as OrderStatus,
      time: '15:28'
    };
  }, [orders, searchParams]);

  // Define steps with clean B2B status colors and descriptions
  const steps = [
    { label: 'Order Received', status: 'Pending', color: '#D97706', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Secure B2B ticket approved and sent to barista terminal.' },
    { label: 'Preparing', status: 'Preparing', color: '#2563EB', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20', desc: 'Crafting signature coffee shots and infusing milk.' },
    { label: 'Ready', status: 'Ready', color: '#16A34A', badgeClass: 'bg-green-500/10 text-green-400 border-green-500/20', desc: 'Orders finished and ready at dispatcher dispatch counter.' },
    { label: 'Served', status: 'Served', color: '#4B5563', badgeClass: 'bg-white/5 text-muted-steel border-white/10', desc: 'Delivered to Table with barista service.' }
  ];

  const activeIndex = steps.findIndex((s) => s.status === activeOrder.status);

  // Quick simulator control for local demos
  const advanceStep = () => {
    if (activeOrder.status === 'Pending') {
      updateOrderStatus(activeOrder.id, 'Preparing');
    } else if (activeOrder.status === 'Preparing') {
      updateOrderStatus(activeOrder.id, 'Ready');
    } else if (activeOrder.status === 'Ready') {
      updateOrderStatus(activeOrder.id, 'Served');
    } else {
      updateOrderStatus(activeOrder.id, 'Pending');
    }
  };

  if (!mounted) return null;

  // Compute progress bar percentage
  const progressPercent = activeOrder.status === 'Pending' ? 15 
                        : activeOrder.status === 'Preparing' ? 50 
                        : activeOrder.status === 'Ready' ? 85 
                        : 100;

  const isCompleted = activeOrder.status === 'Served';

  return (
    <main className="pt-nav-height max-w-md mx-auto px-margin-mobile py-10 space-y-8 flex-1 flex flex-col justify-center relative">
      
      {/* 1. PREMIUM ORDER COMPLETION CELEBRATION */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          >
            {/* Subtle floating gold stars/celebrations */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#C58A46]"
                style={{
                  width: 3 + Math.random() * 6,
                  height: 3 + Math.random() * 6,
                  left: `${Math.random() * 100}%`,
                  top: `${100 + Math.random() * 20}%`
                }}
                animate={{
                  y: -600,
                  x: [0, (Math.random() - 0.5) * 60, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 1.5
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <section className="text-center space-y-4 relative z-10">
        <div className="inline-flex items-center px-3.5 py-1.5 glass-card rounded-full gap-2 border border-ice-border">
          <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-[#C58A46] animate-pulse'}`}></span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-premium-white">
            {isCompleted ? 'Barista Order Dispatched' : 'Active Café Pacing'}
          </span>
        </div>
        
        {/* Wording "Your order is being prepared" */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-premium-white tracking-tight leading-tight">
          {activeOrder.status === 'Pending' && 'Your order is approved ☕'}
          {activeOrder.status === 'Preparing' && 'Your order is being prepared ☕'}
          {activeOrder.status === 'Ready' && 'Your order is ready! ⚡'}
          {activeOrder.status === 'Served' && 'Order successfully served! 🎉'}
        </h1>

        {/* ETA countdown bar */}
        {!isCompleted ? (
          <p className="text-xs text-muted-steel">
            Preparing — approx <span className="text-[#C58A46] font-mono font-bold">{minutesRemaining} min</span> remaining
          </p>
        ) : (
          <p className="text-xs text-green-400 font-bold flex items-center justify-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            Barista service logged at Table {tableNumber || '4'}
          </p>
        )}
      </section>

      {/* Live progress indicator cup animation */}
      <section className="flex flex-col items-center justify-center relative py-6 z-10">
        <div className="relative w-28 h-28 flex items-center justify-center rounded-full glass-card border border-ice-border">
          <AnimatePresence>
            {!isCompleted ? (
              <motion.div
                key="steam"
                className="absolute top-4 flex gap-1 justify-center z-10"
              >
                {/* Simulated coffee cup steam particles */}
                {[0.2, 0.6, 1.0].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    className="w-1 h-5 bg-[#C58A46] rounded-full blur-[1px]"
                    animate={{
                      y: [0, -14, 0],
                      opacity: [0.1, 0.7, 0.1],
                      scaleX: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                className="absolute top-4 z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-[#C58A46]" />
              </motion.div>
            )}
          </AnimatePresence>

          <Coffee className={`h-10 w-10 text-[#C58A46] ${!isCompleted ? 'animate-pulse' : ''}`} />
        </div>

        {/* Dynamic progress bar countdown indicator */}
        <div className="w-full max-w-xs mt-6 bg-white/5 rounded-full h-1.5 border border-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C58A46] to-[#E7C39A]"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 8px #C58A46' }}
          />
        </div>
      </section>

      {/* Ticket Details card */}
      <section className="glass-card rounded-2xl p-5 border border-ice-border space-y-4 bg-gradient-to-br from-[#12141C] to-transparent z-10">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <span className="font-mono text-[8px] text-[#8E939E] uppercase tracking-widest block">Table Order Ticket</span>
            <span className="font-mono text-sm text-[#C58A46] font-bold">{activeOrder.id}</span>
          </div>
          <div>
            <span className="font-mono text-[8px] text-[#8E939E] uppercase tracking-widest block text-right">Tenancy</span>
            <span className="font-mono text-[10px] text-premium-white font-bold">Aura Café</span>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="flex justify-between gap-4">
            <span className="text-muted-steel">Gourmet Selections</span>
            <p className="text-premium-white font-medium text-right truncate max-w-[200px]">{activeOrder.items}</p>
          </div>
          <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
            <span className="text-muted-steel">Total Paid</span>
            <span className="font-mono text-sm text-premium-white font-bold">${activeOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* B2B Mini Order Timeline */}
      <section className="relative space-y-6 py-4 z-10">
        <h3 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">Barista Preparation Steps</h3>

        <div className="space-y-4 relative">
          {/* Connector timeline line */}
          <div className="absolute left-4.5 top-2 bottom-2 w-0.5 bg-white/5"></div>
          {activeIndex !== -1 && (
            <div
              className="absolute left-4.5 top-2 w-0.5 bg-[#C58A46] transition-all duration-500"
              style={{ height: `${(activeIndex / (steps.length - 1)) * 92}%` }}
            />
          )}

          {steps.map((step, idx) => {
            const isFinished = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const stepConfig = steps[idx];

            let circleClass = 'bg-white/5 border-white/10 text-muted-steel';
            if (isFinished) {
              circleClass = 'bg-[#C58A46]/10 border-[#C58A46] text-[#C58A46]';
            } else if (isCurrent) {
              circleClass = 'bg-[#C58A46] border-[#C58A46] text-canvas-charcoal font-bold';
            }

            return (
              <div key={step.status} className="flex items-start gap-4 transition-all">
                {/* Circle number */}
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-500 ${circleClass}`}>
                  {isFinished ? (
                    <Check className="h-4.5 w-4.5 font-bold" />
                  ) : isCurrent && !isCompleted ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#C58A46]' : 'text-premium-white'}`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${stepConfig.badgeClass}`}>
                        {step.status}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-steel leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* B2B Operations Simulator Panel */}
      <section className="glass-card p-4 rounded-xl border border-ice-border space-y-4 bg-gradient-to-tr from-[#12141C]/30 to-transparent z-10">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h4 className="text-[10px] font-mono tracking-widest text-[#C58A46] uppercase">B2B Telemetry Control</h4>
            <p className="text-[9px] text-muted-steel mt-0.5">Advance stages to trigger countdowns & celebration tones.</p>
          </div>
          <button
            onClick={advanceStep}
            className="px-3.5 py-2 rounded-lg bg-glass-fill border border-ice-border hover:border-[#C58A46]/50 text-[10px] font-bold text-[#C58A46] transition-all spring-interaction flex items-center gap-1"
          >
            Advance Status
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <Link
            href="/history"
            className="py-2.5 rounded-lg bg-white/5 border border-ice-border text-[10px] font-bold text-premium-white text-center hover:bg-white/10 transition-all"
          >
            Loyalty Profile
          </Link>
          <Link
            href="/menu"
            className="py-2.5 rounded-lg bg-white/5 border border-ice-border text-[10px] font-bold text-premium-white text-center hover:bg-white/10 transition-all"
          >
            Order More
          </Link>
        </div>
      </section>

    </main>
  );
}
