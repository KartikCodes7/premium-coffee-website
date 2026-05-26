'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Scan, ShieldCheck, Wifi, Coffee } from 'lucide-react';
import { useStore } from '@/store/useStore';

function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTableNumber = useStore((state) => state.setTableNumber);

  const tableParam = searchParams.get('table') || '1';

  const [step, setStep] = useState<'connecting' | 'scanning' | 'success'>('connecting');
  const [dots, setDots] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Phase 1: Connecting animation
    const timer1 = setTimeout(() => {
      setStep('scanning');
    }, 1200);

    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 350);

    // Phase 2: Scan success
    const timer2 = setTimeout(() => {
      clearInterval(dotsInterval);
      setTableNumber(tableParam);
      setStep('success');
    }, 3000);

    // Phase 3: Auto-redirect to menu
    const timer3 = setTimeout(() => {
      router.push(`/menu?table=${tableParam}`);
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(dotsInterval);
    };
  }, [mounted, router, setTableNumber, tableParam]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0B0C0E] text-premium-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-32 w-[350px] h-[350px] bg-[#C58A46]/6 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[400px] h-[400px] bg-[#E7C39A]/4 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Floating coffee particles */}
      <motion.div
        className="absolute top-20 right-20 opacity-10"
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Coffee size={40} className="text-[#C58A46]" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-16 opacity-8"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Coffee size={28} className="text-[#E7C39A]" />
      </motion.div>

      <div className="w-full max-w-sm flex flex-col items-center space-y-8 z-10 text-center">
        
        {/* Telemetry badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Wifi className="h-3 w-3 text-green-400 animate-pulse" />
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#8E939E]">
              CaféOS Telemetry Active
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-premium-white font-sans">
            Aura Premium Café
          </h1>
          <p className="text-xs text-muted-steel max-w-xs mx-auto">
            Synchronizing your table session with the kitchen queue.
          </p>
        </motion.div>

        {/* Scanner frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-64 h-64 rounded-3xl border border-white/10 bg-black/45 shadow-2xl flex items-center justify-center overflow-hidden"
        >
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C58A46] rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C58A46] rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C58A46] rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C58A46] rounded-br-lg" />

          <AnimatePresence mode="wait">
            {step === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center space-y-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <QrCode className="h-16 w-16 text-muted-steel" />
                </motion.div>
                <span className="font-mono text-[10px] text-[#C58A46] uppercase tracking-wider font-bold">
                  Connecting to Table {tableParam}{dots}
                </span>
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-2"
              >
                {/* Laser scan line */}
                <motion.div
                  className="absolute inset-x-6 h-0.5 bg-gradient-to-r from-transparent via-[#C58A46] to-transparent z-10"
                  animate={{ y: [-50, 50, -50] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ boxShadow: '0 0 12px #C58A46, 0 0 24px #C58A46' }}
                />
                
                <Scan className="h-16 w-16 text-[#C58A46] opacity-35" />
                <span className="font-mono text-[9px] text-[#C58A46] uppercase tracking-widest font-bold animate-pulse">
                  Verifying Table {tableParam}{dots}
                </span>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-3 p-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center"
                >
                  <ShieldCheck className="h-7 w-7 text-green-400" />
                </motion.div>
                <div>
                  <span className="font-mono text-[10px] bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                    Table {tableParam} Unlocked ☕
                  </span>
                  <p className="text-[10px] text-muted-steel mt-2">
                    Syncing kitchen queue session...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom status */}
        <div className="h-10">
          <AnimatePresence mode="wait">
            {step !== 'success' ? (
              <motion.p
                key="logs-scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-mono text-muted-steel uppercase tracking-widest opacity-60 leading-none"
              >
                Establishing secure table link...
              </motion.p>
            ) : (
              <motion.p
                key="logs-redirect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold animate-pulse"
              >
                Entering gourmet café menu...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Table info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card rounded-2xl p-4 w-full border border-white/8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C58A46]/10 border border-[#C58A46]/20 flex items-center justify-center">
                <Coffee className="h-5 w-5 text-[#C58A46]" />
              </div>
              <div>
                <p className="text-xs font-bold text-premium-white">Serving Table {tableParam}</p>
                <p className="text-[9px] font-mono text-muted-steel uppercase tracking-widest">Aura Premium Café</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function QRScanPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0B0C0E] flex items-center justify-center">
        <div className="animate-pulse text-muted-steel font-mono text-xs uppercase tracking-widest">
          Initializing...
        </div>
      </main>
    }>
      <ScanContent />
    </Suspense>
  );
}
