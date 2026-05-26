'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type Particle = {
  id: string;
  top: string;
  left: string;
  size: number;
  opacity: number;
  blur: number;
  duration: number;
  delay: number;
};

export default function CoffeeMenuBackground() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 22 }).map((_, idx) => {
      const size = 2 + Math.round(Math.random() * 6);
      return {
        id: `p-${idx}`,
        top: `${Math.round(Math.random() * 100)}%`,
        left: `${Math.round(Math.random() * 100)}%`,
        size,
        opacity: 0.08 + Math.random() * 0.14,
        blur: 0 + Math.round(Math.random() * 3),
        duration: 10 + Math.random() * 18,
        delay: Math.random() * 2,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[40%] opacity-80"
        animate={{ rotate: [0, 6, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(60% 60% at 20% 20%, rgba(197,138,70,0.18), transparent 55%), radial-gradient(50% 50% at 80% 30%, rgba(231,195,154,0.11), transparent 60%), radial-gradient(55% 55% at 55% 80%, rgba(135,94,52,0.14), transparent 62%)',
        }}
      />

      <motion.div
        className="absolute -top-48 -left-56 h-[520px] w-[520px] rounded-full blur-[110px]"
        animate={{ x: [0, 28, -8, 0], y: [0, 14, 24, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(197,138,70,0.09)' }}
      />
      <motion.div
        className="absolute -bottom-56 -right-64 h-[620px] w-[620px] rounded-full blur-[140px]"
        animate={{ x: [0, -18, 12, 0], y: [0, -22, -8, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(231,195,154,0.07)' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 h-[480px] w-[480px] rounded-full blur-[120px]"
        animate={{ x: [0, 22, 0], y: [0, -18, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(126,74,36,0.09)' }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: 'rgba(246,240,232,1)',
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
          }}
          animate={{ y: [0, -14, 0], opacity: [p.opacity, p.opacity * 1.4, p.opacity] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[240px] opacity-70"
        animate={{ opacity: [0.55, 0.75, 0.55], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(60% 60% at 50% 100%, rgba(246,240,232,0.08), transparent 65%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
