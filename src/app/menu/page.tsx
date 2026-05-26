'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Bell, ShoppingBag, User, ArrowRight } from 'lucide-react';
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
import { useQrMenuQuery } from '@/services/api';
import { useStore } from '@/store/useStore';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

type CategoryFilter = CoffeeMenuCategory | 'All';
type QuickChipFilter = 'All' | 'Best Seller' | 'Low Sugar' | 'Cold Drinks' | 'Vegetarian' | 'Trending Today';

export default function CoffeeMenuPage() {
  const addToCartStore = useStore((s) => s.addToCart);
  const favoriteItemIds = useStore((s) => s.favoriteItemIds);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const tableNumber = useStore((s) => s.tableNumber);
  const setTableNumber = useStore((s) => s.setTableNumber);
  const callWaiterStore = useStore((s) => s.callWaiter);
  const getCartCount = useStore((s) => s.getCartCount);
  
  const qrMenuQuery = useQrMenuQuery();
  const { playSound } = useSoundFeedback();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [activeChip, setActiveChip] = useState<QuickChipFilter>('All');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selected, setSelected] = useState<CoffeeMenuItem | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse and persist table number from search query parameter
  useEffect(() => {
    if (!mounted) return;
    const urlTable = new URLSearchParams(window.location.search).get('table');
    if (urlTable) {
      setTableNumber(urlTable);
    }
  }, [mounted, setTableNumber]);

  // Simulate minimal loader for premium experience
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const menuItemsSource = useMemo(() => {
    if (qrMenuQuery.data && qrMenuQuery.data.length > 0) return qrMenuQuery.data;
    return coffeeMenuItems;
  }, [qrMenuQuery.data]);

  const pageLoading = loading || qrMenuQuery.isLoading;
  const dataModeLabel = qrMenuQuery.isError || !qrMenuQuery.data?.length ? 'Gourmet Demo Menu' : 'Live Menu Sync';
  const normalizedQuery = query.trim().toLowerCase();

  // Apply search query, category, and quick chip filters
  const filteredItems = useMemo(() => {
    const q = normalizedQuery;
    return menuItemsSource.filter((it) => {
      // 1. Category Filter
      if (filter !== 'All' && it.category !== filter) return false;
      
      // 2. Favorites Filter
      if (showFavorites && !favoriteItemIds.includes(it.id)) return false;
      
      // 3. Quick Action Chips
      if (activeChip === 'Best Seller' && it.rating < 4.8) return false;
      if (activeChip === 'Low Sugar' && it.calories > 150) return false;
      if (activeChip === 'Cold Drinks' && it.category !== 'Cold Coffee' && it.category !== 'Refreshers') return false;
      if (activeChip === 'Vegetarian' && it.category === 'Sandwiches' && it.name !== 'Caprese Melt') return false;
      if (activeChip === 'Trending Today' && !it.tags.includes('Trending')) return false;

      // 4. Text Query search
      if (!q) return true;
      const haystack = `${it.name} ${it.description} ${it.ingredients.join(' ')} ${it.tags.join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [filter, favoriteItemIds, menuItemsSource, normalizedQuery, showFavorites, activeChip]);

  const trending = useMemo(() => {
    return menuItemsSource
      .filter((it) => it.tags.includes('Trending'))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [menuItemsSource]);

  const aiPicks = useMemo(() => {
    const hour = new Date().getHours();
    const bias: CoffeeMenuCategory[] =
      hour < 12 ? ['Hot Coffee', 'Bakery'] : hour < 17 ? ['Cold Coffee', 'Desserts'] : ['Signature Drinks', 'Desserts'];

    const pool = menuItemsSource
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .filter((x) => !x.tags.includes('Limited'));

    const prioritized = pool.filter((x) => bias.includes(x.category));
    const fallback = pool.filter((x) => !bias.includes(x.category));
    const merged = [...prioritized, ...fallback];
    return merged.slice(0, 6);
  }, [menuItemsSource]);

  const categoriesToRender = useMemo(() => {
    return filter === 'All' ? coffeeMenuCategories : [filter];
  }, [filter]);

  const isFavorite = (id: string) => favoriteItemIds.includes(id);

  const handleOpen = (item: CoffeeMenuItem) => {
    setSelected(item);
    setOpen(true);
  };

  const handleQuickAdd = (item: CoffeeMenuItem) => {
    playSound('pip');
    addToCartStore({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      options: {
        category: item.category,
        calories: `${item.calories}`,
        note: 'Quick café selection',
      },
    });
  };

  const handleAddToCartFromModal = (qty: number) => {
    if (!selected) return;
    playSound('pip');
    addToCartStore({
      id: selected.id,
      name: selected.name,
      price: selected.price,
      image: selected.image,
      qty,
      options: {
        category: selected.category,
        calories: `${selected.calories}`,
        note: 'Custom coffee order',
      },
    });
    setOpen(false);
  };

  const handleCallWaiter = () => {
    playSound('chime');
    callWaiterStore();
  };

  if (!mounted) return null;

  return (
    <main className="pt-nav-height flex-1 bg-canvas-charcoal relative overflow-hidden pb-24">
      <CoffeeMenuBackground />

      <div className="relative z-10 max-w-grid-max-width mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14 space-y-8">
        
        {/* Header Telemetry Branding */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-ice-border">
                  <Sparkles className="h-4 w-4 text-[#C58A46]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#C58A46]">
                    Aura Premium CafeOS • {dataModeLabel}
                  </span>
                </div>
                {tableNumber && (
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-[#C58A46]/10 text-[#C58A46] px-3 py-1.5 rounded-full border border-[#C58A46]/20 font-bold">
                    Table {tableNumber}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-premium-white leading-tight">
                Order in seconds.
              </h1>
              <p className="text-sm md:text-base text-muted-steel max-w-2xl leading-relaxed">
                Experience gourmet coffee with cinematic item modals, Apple-grade audio feedback chimes, and instant operations sync.
              </p>
            </div>

            {/* Search, Favorites & Profile actions */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-steel" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search coffee, pastries..."
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

              {/* Guest Profile Entrance */}
              <Link
                href="/history"
                className="h-11 w-11 rounded-xl border border-white/10 bg-black/10 text-premium-white hover:border-[#C58A46]/30 transition-all flex items-center justify-center shrink-0"
                title="Customer Profile & History"
              >
                <User className="h-4 w-4 text-premium-white hover:text-[#C58A46] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Persistent sticky Category & Quick Chip scrollbar */}
          <div className="sticky top-nav-height z-30 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop py-4 bg-canvas-charcoal/70 backdrop-blur-xl border-y border-ice-border space-y-3">
            
            {/* 1. Category Navbar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['All', ...coffeeMenuCategories] as CategoryFilter[]).map((c) => {
                const active = c === filter;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setFilter(c); playSound('pip'); }}
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

            {/* 2. Quick Action Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {([
                { id: 'All', label: 'All Recipes' },
                { id: 'Best Seller', label: 'Best Seller 🌟' },
                { id: 'Low Sugar', label: 'Low Sugar 🌿' },
                { id: 'Cold Drinks', label: 'Cold Coffee & Teas ❄️' },
                { id: 'Vegetarian', label: 'Vegetarian Brunch 🟢' },
                { id: 'Trending Today', label: 'Trending Today 🔥' }
              ] as { id: QuickChipFilter, label: string }[]).map((chip) => {
                const active = chip.id === activeChip;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => { setActiveChip(chip.id); playSound('pip'); }}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all ${
                      active
                        ? 'bg-[#C58A46]/20 text-[#C58A46] border-[#C58A46]'
                        : 'bg-white/3 text-[#8E939E] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Swipeable Trending Slider */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">Trending</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-premium-white tracking-tight mt-1">
                Today’s popular selections
              </h2>
            </div>
            <p className="hidden md:block text-xs text-muted-steel max-w-sm text-right">
              Swipe recipes horizontally — each card has fluid motion effects.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-canvas-charcoal to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas-charcoal to-transparent pointer-events-none z-10" />

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {trending.map((item, idx) => (
                <div key={item.id} className="min-w-[270px] max-w-[270px]">
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

        {/* AI Picks grid */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">AI Recommendations</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-premium-white tracking-tight mt-1">
                Gourmet pairings for this moment
              </h2>
            </div>
            <p className="text-xs text-muted-steel max-w-sm text-right">
              Dynamically calibrated based on current café dining time.
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

        {/* Gallery grid & search layout */}
        <section className="space-y-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">All Recipes</p>
              <h2 className="text-xl md:text-3xl font-extrabold text-premium-white tracking-tight mt-1">
                Category gallery
              </h2>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {categoriesToRender.map((cat) => {
              const items = filteredItems.filter((x) => x.category === cat);
              if (!pageLoading && items.length === 0) return null;

              return (
                <motion.section
                  key={cat}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-extrabold text-premium-white tracking-tight">
                      {cat}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C58A46]">
                      {pageLoading ? 'Loading' : `${items.length} items`}
                    </span>
                  </div>

                  {/* Fluid filtering animation */}
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {pageLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={`${cat}-sk-${i}`}
                            className="glass-card rounded-2xl border border-ice-border overflow-hidden"
                          >
                            <Skeleton className="h-48 w-full bg-white/5 rounded-none" />
                            <div className="p-5 space-y-3">
                              <Skeleton className="h-5 w-2/3 bg-white/5" />
                              <Skeleton className="h-4 w-full bg-white/5" />
                              <div className="flex items-center justify-between pt-2">
                                <Skeleton className="h-6 w-16 bg-white/5" />
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
                  </motion.div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        </section>
      </div>

      {/* Floating Call Waiter Action Button */}
      <div className="fixed bottom-6 left-6 z-[9990] flex items-center gap-3 pointer-events-auto">
        <button
          onClick={handleCallWaiter}
          className="h-12 w-12 bg-[#C58A46] text-canvas-charcoal rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-95 transition-all spring-interaction"
          title="Call Waiter"
        >
          <Bell className="h-5 w-5 text-canvas-charcoal font-bold" />
        </button>
      </div>

      {/* Sticky Floating Mobile Cart Ticker */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 inset-x-0 mx-auto max-w-xs z-[9980] px-4 pointer-events-auto">
          <Link
            href="/order"
            className="flex items-center justify-between gap-4 p-4 rounded-full bg-[#C58A46] text-canvas-charcoal hover:brightness-110 active:scale-98 transition-all shadow-2xl shadow-[#C58A46]/25 spring-interaction"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-mono font-bold bg-canvas-charcoal text-[#C58A46] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                {getCartCount()}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider">Review Ticket</span>
            </div>
            <ArrowRight className="font-bold" size={18} />
          </Link>
        </div>
      )}

      {/* Cinematic Modal details popup */}
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
