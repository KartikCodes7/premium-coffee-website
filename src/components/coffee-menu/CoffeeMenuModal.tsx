'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, Sparkles } from 'lucide-react';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CoffeeMenuItem } from './coffeeMenuData';

type Props = {
  item: CoffeeMenuItem | null;
  open: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (qty: number) => void;
};

export default function CoffeeMenuModal({
  item,
  open,
  isFavorite,
  onToggleFavorite,
  onOpenChange,
  onAddToCart,
}: Props) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!open) return;
    setQty(1);
  }, [open, item?.id]);

  const headerPills = useMemo(() => {
    if (!item) return [];
    return [
      ...item.tags.slice(0, 2),
      `${item.calories} cal`,
      `${item.rating.toFixed(1)} rating`,
    ];
  }, [item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="!top-0 !left-0 !translate-x-0 !translate-y-0 !w-[100vw] !h-[100dvh] !max-w-none !rounded-none !p-0 bg-canvas-charcoal/70 ring-0 border-0 overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute -inset-[30%] opacity-90"
            animate={{ rotate: [0, 7, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(60% 60% at 20% 20%, rgba(197,138,70,0.24), transparent 55%), radial-gradient(55% 55% at 80% 40%, rgba(231,195,154,0.18), transparent 62%), radial-gradient(55% 55% at 55% 80%, rgba(126,74,36,0.18), transparent 62%)',
            }}
          />
          <div className="absolute inset-0 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <AnimatePresence mode="wait">
          {open && item && (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative z-10 h-full w-full"
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/65 to-transparent" />

              <div className="absolute top-5 left-5 flex items-center gap-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="bg-black/25 border-white/10 hover:border-[#C58A46]/40 hover:bg-black/35 text-premium-white"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </Button>
                </DialogClose>
                <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8E939E]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C58A46]" />
                  Premium immersion mode
                </div>
              </div>

              <div className="absolute top-5 right-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className="w-11 h-11 rounded-2xl glass-card border border-white/10 hover:border-[#C58A46]/40 transition-colors flex items-center justify-center"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? 'text-[#C58A46]' : 'text-[#8E939E]'}`}
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1.02 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas-charcoal via-canvas-charcoal/40 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(197,138,70,0.22),transparent_55%)]" />

                  <div className="absolute bottom-6 left-6 right-6 max-w-xl space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {headerPills.map((p) => (
                        <span
                          key={p}
                          className="px-3 py-1.5 rounded-full bg-black/35 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-premium-white"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-premium-white leading-tight">
                      {item.name}
                    </h2>
                    <p className="text-sm md:text-base text-muted-steel leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="relative h-full">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <div className="px-margin-mobile md:px-10 py-10 lg:py-14 space-y-10">
                      <div className="glass-card rounded-2xl p-6 border border-white/10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-mono tracking-widest uppercase text-muted-steel">
                              Price
                            </p>
                            <div className="mt-2 flex items-baseline gap-2">
                              <span className="font-mono text-3xl font-extrabold text-[#C58A46]">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-steel">/ item</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-mono tracking-widest uppercase text-muted-steel">
                              Quantity
                            </p>
                            <div className="mt-2 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                className="w-10 h-10 rounded-xl glass-card border border-white/10 hover:border-[#C58A46]/35 transition-colors flex items-center justify-center"
                              >
                                <Minus className="h-4 w-4 text-premium-white" />
                              </button>
                              <span className="w-10 text-center font-mono text-lg font-bold text-premium-white">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty((q) => q + 1)}
                                className="w-10 h-10 rounded-xl glass-card border border-white/10 hover:border-[#C58A46]/35 transition-colors flex items-center justify-center"
                              >
                                <Plus className="h-4 w-4 text-premium-white" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="mt-5 w-full h-12 text-sm font-extrabold tracking-wide"
                          onClick={() => onAddToCart(qty)}
                        >
                          Add to cart • ${(item.price * qty).toFixed(2)}
                        </Button>

                        <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-steel text-center">
                          Cinematic checkout sync via RestaurantOS
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold text-premium-white tracking-tight">
                            Ingredients
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                            curated
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-3 py-1.5 rounded-full bg-white/5 border border-ice-border text-xs text-premium-white/90"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold text-premium-white tracking-tight">
                            Nutrition
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                            per serving
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="glass-card rounded-xl p-4 border border-ice-border">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                              Calories
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-premium-white font-mono">
                              {item.calories}
                            </p>
                          </div>
                          <div className="glass-card rounded-xl p-4 border border-ice-border">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                              Protein
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-premium-white font-mono">
                              {Math.max(2, Math.round(item.calories / 80))}g
                            </p>
                          </div>
                          <div className="glass-card rounded-xl p-4 border border-ice-border">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                              Sugar
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-premium-white font-mono">
                              {Math.max(0, Math.round(item.calories / 60))}g
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-extrabold text-premium-white tracking-tight">
                            Recommended Pairings
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                            ai assisted
                          </span>
                        </div>

                        <div className="space-y-3">
                          {item.pairings.map((p) => (
                            <div
                              key={p}
                              className="glass-card rounded-xl p-4 border border-ice-border flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-premium-white truncate">
                                  {p}
                                </p>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-steel mt-1">
                                  Pairing recommendation
                                </p>
                              </div>
                              <span className="material-symbols-outlined text-[#C58A46]">
                                auto_awesome
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
