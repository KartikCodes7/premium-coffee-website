'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Loader2, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

export default function FloatingAssistance() {
  const tableNumber = useStore((state) => state.tableNumber);
  const callWaiter = useStore((state) => state.callWaiter);
  const { playSound } = useSoundFeedback();
  
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);

  // Only display if guest is actively seated at a table
  if (!tableNumber) return null;

  const handleCall = () => {
    if (loading || called) return;
    
    playSound('chime');
    setLoading(true);
    
    // Simulate realistic operations latency of 900ms
    setTimeout(() => {
      callWaiter();
      setLoading(false);
      setCalled(true);
      playSound('success');
      
      // Reset call status after 8 seconds
      setTimeout(() => {
        setCalled(false);
      }, 8000);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[999] pointer-events-auto">
      <motion.button
        onClick={handleCall}
        whileHover={{ scale: 1.06, rotate: [0, -6, 6, -6, 0] }}
        whileTap={{ scale: 0.94 }}
        className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-2xl relative transition-colors ${
          called
            ? 'bg-green-500/10 border-green-500 text-green-400 gold-glow'
            : 'glass-card border-ice-border hover:border-[#C58A46] text-[#C58A46] hover:text-[#E5C158] bg-[#12141C]/80 backdrop-blur-md'
        }`}
      >
        {/* Ring ripple animations */}
        {!called && !loading && (
          <span className="absolute inset-0 rounded-full bg-[#C58A46]/10 animate-ping opacity-75"></span>
        )}

        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-[#C58A46]" />
        ) : called ? (
          <Check className="h-6 w-6 text-green-400" />
        ) : (
          <Bell className="h-6 w-6" />
        )}
      </motion.button>

      {/* Slide in helper tip */}
      <AnimatePresence>
        {called && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            className="absolute left-18 bottom-3 bg-canvas-charcoal/95 border border-green-500/30 text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            Table {tableNumber} Called ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
