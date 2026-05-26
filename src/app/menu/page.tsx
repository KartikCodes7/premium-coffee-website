'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import CoffeeMenuBackground from '@/components/coffee-menu/CoffeeMenuBackground';
import CoffeeMenuCard from '@/components/coffee-menu/CoffeeMenuCard';
import CoffeeMenuModal from '@/components/coffee-menu/CoffeeMenuModal';
import {
  coffeeMenuCategories,
  coffeeMenuItems,
  type CoffeeMenuCategory,
  type CoffeeMenuItem,
} from '@/components/coffee-menu/coffeeMenuData';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/store/useStore';

type CategoryFilter = CoffeeMenuCategory | 'All';

export default function CoffeeMenuPage() {
  const addToCart = useStore((s) => s.addToCart);
  const favoriteItemIds = useStore((s) => s.favoriteItemIds);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selected, setSelected] = useState<CoffeeMenuItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    const q = normalizedQuery;
    return coffeeMenuItems.filter((it) => {
      if (filter !== 'All' && it.category !== filter) return false;
      if (showFavorites && !favoriteItemIds.includes(it.id)) return false;
      if (!q) return true;
      const haystack = `${it.name} ${it.description} ${it.ingredients.join(' ')} ${it.tags.join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [filter, favoriteItemIds, normalizedQuery, showFavorites]);

  const trending = useMemo(() => {
    return coffeeMenuItems
      .filter((it) => it.tags.includes('Trending'))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, []);

  const aiPicks = useMemo(() => {
    const hour = new Date().getHours();
    const bias: CoffeeMenuCategory[] =
      hour < 12 ? ['Hot Coffee', 'Bakery'] : hour < 17 ? ['Cold Coffee', 'Desserts'] : ['Signature Drinks', 'Desserts'];

    const pool = coffeeMenuItems
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .filter((x) => !x.tags.includes('Limited'));

    const prioritized = pool.filter((x) => bias.includes(x.category));
    const fallback = pool.filter((x) => !bias.includes(x.category));
    const merged = [...prioritized, ...fallback];
    return merged.slice(0, 6);
  }, []);

  const categoriesToRender = useMemo(() => {
    return filter === 'All' ? coffeeMenuCategories : [filter];
  }, [filter]);

  const isFavorite = (id: string) => favoriteItemIds.includes(id);

  const handleOpen = (item: CoffeeMenuItem) => {
    setSelected(item);
    setOpen(true);
  };

  const handleQuickAdd = (item: CoffeeMenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      options: {
        category: item.category,
        calories: `${item.calories}`,
        note: 'Coffee menu quick add',
      },
    });
  };

  const handleAddToCartFromModal = (qty: number) => {
    if (!selected) return;
    addToCart({
      id: selected.id,
      name: selected.name,
      price: selected.price,
      image: selected.image,
      qty,
      options: {
        category: selected.category,
        calories: `${selected.calories}`,
        note: 'Coffee menu',
      },
    });
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <main className="pt-nav-height flex-1 bg-canvas-charcoal relative overflow-hidden">
      <CoffeeMenuBackground />

      <div className="relative z-10 max-w-grid-max-width mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14 space-y-8">
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-ice-border">
                <Sparkles className="h-4 w-4 text-[#C58A46]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C58A46]">
                  Premium Coffee Menu Experience
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-premium-white leading-tight">
                Browse. Tap. Immerse.
              </h1>
              <p className="text-sm md:text-base text-muted-steel max-w-2xl leading-relaxed">
                Category-driven menu with cinematic micro-interactions, live wallpaper ambience, and a full-screen product
                experience tuned for a luxury cafe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-steel" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search drinks, ingredients, tags..."
                  className="h-11 pl-10 bg-black/15 border-white/10 text-premium-white placeholder:text-muted-steel/60 focus-visible:border-[#C58A46]/45"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFavorites((v) => !v)}
                className={`h-11 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  showFavorites
                    ? 'border-[#C58A46]/40 bg-[#C58A46]/10 text-[#C58A46]'
                    : 'border-white/10 bg-black/10 text-premium-white hover:border-[#C58A46]/30'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Favorites
                {favoriteItemIds.length > 0 && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                    {favoriteItemIds.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="sticky top-nav-height z-30 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop py-4 bg-canvas-charcoal/70 backdrop-blur-xl border-y border-ice-border">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['All', ...coffeeMenuCategories] as CategoryFilter[]).map((c) => {
                const active = c === filter;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#C58A46]/12 text-[#C58A46] border-[#C58A46]/35 gold-glow'
                        : 'bg-black/10 text-premium-white border-white/10 hover:border-[#C58A46]/25'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">Trending</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-premium-white tracking-tight mt-1">
                Today’s most ordered
              </h2>
            </div>
            <p className="hidden md:block text-xs text-muted-steel max-w-sm text-right">
              Swipe horizontally — each card is interactive and opens a full-screen cinematic modal.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-canvas-charcoal to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas-charcoal to-transparent pointer-events-none" />

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {trending.map((item, idx) => (
                <div key={item.id} className="min-w-[280px] max-w-[280px]">
                  <CoffeeMenuCard
                    item={item}
                    index={idx}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    onOpen={() => handleOpen(item)}
                    onQuickAdd={() => handleQuickAdd(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">AI Barista</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-premium-white tracking-tight mt-1">
                Recommended for this moment
              </h2>
            </div>
            <p className="text-xs text-muted-steel max-w-sm text-right">
              Picks adapt to the day-part and top-rated signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {aiPicks.map((item, idx) => (
              <CoffeeMenuCard
                key={item.id}
                item={item}
                index={idx}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onOpen={() => handleOpen(item)}
                onQuickAdd={() => handleQuickAdd(item)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">Menu</p>
              <h2 className="text-xl md:text-3xl font-extrabold text-premium-white tracking-tight mt-1">
                Category gallery
              </h2>
            </div>
            <p className="text-xs text-muted-steel max-w-sm text-right">
              Hover for glow. Click for immersive modal. Add to cart with one tap.
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {categoriesToRender.map((cat) => {
              const items = filteredItems.filter((x) => x.category === cat);
              if (!loading && items.length === 0) return null;

              return (
                <motion.section
                  key={cat}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-extrabold text-premium-white tracking-tight">
                      {cat}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-steel">
                      {loading ? 'Loading' : `${items.length} items`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={`${cat}-sk-${i}`}
                            className="glass-card rounded-2xl border border-ice-border overflow-hidden"
                          >
                            <Skeleton className="h-48 w-full bg-white/5 rounded-none" />
                            <div className="p-5 space-y-3">
                              <Skeleton className="h-5 w-2/3 bg-white/5" />
                              <Skeleton className="h-4 w-full bg-white/5" />
                              <Skeleton className="h-4 w-5/6 bg-white/5" />
                              <div className="flex items-center justify-between pt-2">
                                <Skeleton className="h-6 w-20 bg-white/5" />
                                <Skeleton className="h-10 w-24 bg-white/5 rounded-xl" />
                              </div>
                            </div>
                          </div>
                        ))
                      : items.map((item, idx) => (
                          <CoffeeMenuCard
                            key={item.id}
                            item={item}
                            index={idx}
                            isFavorite={isFavorite(item.id)}
                            onToggleFavorite={() => toggleFavorite(item.id)}
                            onOpen={() => handleOpen(item)}
                            onQuickAdd={() => handleQuickAdd(item)}
                          />
                        ))}
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        </section>
      </div>

      <CoffeeMenuModal
        item={selected}
        open={open}
        isFavorite={selected ? isFavorite(selected.id) : false}
        onToggleFavorite={() => selected && toggleFavorite(selected.id)}
        onOpenChange={(v) => setOpen(v)}
        onAddToCart={handleAddToCartFromModal}
      />
    </main>
  );
}
