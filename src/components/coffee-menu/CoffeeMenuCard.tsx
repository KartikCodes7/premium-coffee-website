'use client';

import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Plus, Star } from 'lucide-react';
import type { CoffeeMenuItem } from './coffeeMenuData';

type Props = {
  item: CoffeeMenuItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onQuickAdd: () => void;
};

export default function CoffeeMenuCard({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onQuickAdd,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const float = useMemo(() => 5 + (index % 5), [index]);

  return (
    <motion.div
      ref={rootRef}
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.02, 0.18) }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative overflow-hidden rounded-2xl glass-card border border-ice-border hover:border-[#C58A46]/35 transition-colors shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
      style={
        {
          ['--mx' as any]: '50%',
          ['--my' as any]: '50%',
        } as React.CSSProperties
      }
      onMouseMove={(e) => {
        const el = rootRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty('--mx', `${x}%`);
        el.style.setProperty('--my', `${y}%`);
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mx)_var(--my),rgba(197,138,70,0.24),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,240,232,0.035),transparent_55%,rgba(197,138,70,0.05))]" />
      </div>

      <motion.div
        className="absolute -top-8 -right-10 h-44 w-44 rounded-full blur-[70px] opacity-0 group-hover:opacity-100"
        animate={{ y: [0, -float, 0], x: [0, float, 0] }}
        transition={{ duration: 7 + (index % 4), repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(197,138,70,0.13)' }}
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl glass-card border border-ice-border hover:border-[#C58A46]/50 transition-colors flex items-center justify-center"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${isFavorite ? 'text-[#C58A46]' : 'text-[#8E939E]'}`}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className="block w-full text-left cursor-pointer focus:outline-none"
      >
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              unoptimized
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-charcoal/85 via-canvas-charcoal/10 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-premium-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold tracking-tight text-premium-white truncate">
                {item.name}
              </h3>
              <p className="text-sm text-muted-steel mt-1.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-[#C58A46] font-mono text-sm">
                <Star className="fill-current" size={14} />
                <span className="font-bold">{item.rating.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-muted-steel font-mono uppercase tracking-widest mt-1">
                {item.calories} cal
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-ice-border/30">
            <span className="font-mono text-xl font-extrabold text-[#C58A46] tracking-tight">
              ${item.price.toFixed(2)}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              className="relative h-11 px-5 rounded-xl border border-ice-border bg-white/5 hover:bg-white/10 hover:border-[#C58A46]/45 transition-all flex items-center gap-2 text-sm font-bold text-premium-white overflow-hidden group"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_30%_30%,rgba(197,138,70,0.20),transparent_55%)]" />
              <Plus className="h-4 w-4 text-[#C58A46] relative z-10" />
              <span className="relative z-10">Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
