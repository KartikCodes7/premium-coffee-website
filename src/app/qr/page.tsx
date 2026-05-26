'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Scan, ShieldCheck, Wifi } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

export default function QRScannerPage() {
  const router = useRouter();
  const setTableNumber = useStore((state) => state.setTableNumber);
  const { playSound } = useSoundFeedback();

  const [step, setStep] = useState<'align' | 'scanning' | 'success'>('align');
  const [dots, setDots] = useState('');

  // Scanning simulation lifecycle
  useEffect(() => {
    // 1. Initial mounting chimes
    const timer1 = setTimeout(() => {
      setStep('scanning');
    }, 1000);

    // 2. Dots loading animation
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    // 3. Scan success chime & global state updates
    const timer2 = setTimeout(() => {
      clearInterval(dotsInterval);
      playSound('success');
      setTableNumber('4');
      setStep('success');
    }, 2800);

    // 4. Auto-redirect to menu
    const timer3 = setTimeout(() => {
      router.push('/menu?table=4');
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(dotsInterval);
    };
  }, [router, setTableNumber]);

  return (
    <main className="pt-nav-height min-h-[calc(100vh-nav-height)] bg-[#0B0C0E] text-premium-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dark cafe aesthetic glowing lights */}
      <div className="absolute top-1/4 -left-32 w-[350px] h-[350px] bg-[#C58A46]/6 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 -right-32 w-[400px] h-[400px] bg-[#E7C39A]/4 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Futuristic Scanner Frame wrapper */}
      <div className="w-full max-w-sm flex flex-col items-center space-y-8 z-10 text-center">
        
        {/* Entrance telemetry metadata */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Wifi className="h-3 w-3 text-green-400 animate-pulse" />
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#8E939E]">
              CafeOS Telemetry Active
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-premium-white font-sans">
            Aura Premium Café Entrance
          </h1>
          <p className="text-xs text-muted-steel max-w-xs mx-auto">
            Scan the QR code at your table to synchronize your dynamic ordering cart.
          </p>
        </div>

        {/* Cinematic phone scanning box */}
        <div className="relative w-64 h-64 rounded-3xl border border-white/10 bg-black/45 shadow-2xl flex items-center justify-center overflow-hidden group">
          
          {/* Neon Scanner corners */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C58A46] rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C58A46] rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C58A46] rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C58A46] rounded-br-lg"></div>

          {/* QR Icon in center */}
          <AnimatePresence mode="wait">
            {step === 'align' && (
              <motion.div
                key="align"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center space-y-2"
              >
                <QrCode className="h-16 w-16 text-muted-steel animate-pulse" />
                <span className="font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                  Align QR Code
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
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ boxShadow: '0 0 10px #C58A46, 0 0 20px #C58A46' }}
                />
                
                <Scan className="h-16 w-16 text-[#C58A46] opacity-35" />
                <span className="font-mono text-[9px] text-[#C58A46] uppercase tracking-widest font-bold animate-pulse">
                  Analyzing Code{dots}
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
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <span className="font-mono text-[10px] bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                    Table 4 Unlocked
                  </span>
                  <p className="text-[10px] text-muted-steel mt-2">
                    Syncing kitchen queue session...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footnote telemetry logs */}
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
                Hold phone camera steady over table code
              </motion.p>
            ) : (
              <motion.p
                key="logs-redirect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold animate-pulse"
              >
                Entering gourmet cafe menu...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
