'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useStore, LiveOrder, MenuItem, Reservation } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useOrdersQuery,
  useUpdateOrderStatusMutation,
  useMenuQuery,
  useUpdateMenuPriceMutation,
  useAddMenuItemMutation,
  useDeleteMenuItemMutation,
  useReservationsQuery,
  useCreateReservationMutation,
  useConfirmReservationMutation,
  useCancelReservationMutation,
  useAnalyticsQuery
} from '@/services/api';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';
import { 
  Clock, Flame, CheckCircle2, CheckCircle, 
  TrendingUp, Utensils, Lightbulb, 
  Banknote, Coffee, BellRing, Gauge, 
  Search, Plus, Trash2, BrainCircuit, Save, Edit2, Trash, Calendar 
} from 'lucide-react';

// --- Priority Tag Utilities ---
const PRIORITY_TAGS = ['VIP', 'Rush', 'Large Order', null, null, null] as const;
type PriorityTag = 'VIP' | 'Rush' | 'Large Order' | null;

function getOrderPriority(orderId: string): PriorityTag {
  // Deterministic pseudo-random based on order ID so tags persist across renders
  let hash = 0;
  for (let i = 0; i < orderId.length; i++) {
    hash = ((hash << 5) - hash) + orderId.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % PRIORITY_TAGS.length;
  return PRIORITY_TAGS[idx] ?? null;
}

function PriorityBadge({ tag }: { tag: PriorityTag }) {
  if (!tag) return null;
  const styles: Record<string, string> = {
    'VIP': 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    'Rush': 'bg-red-500/15 text-red-400 border-red-500/25',
    'Large Order': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  };
  return (
    <span className={`text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${styles[tag]}`}>
      {tag}
    </span>
  );
}

// --- Kanban Column Config ---
const KANBAN_COLUMNS: { status: LiveOrder['status']; label: string; color: string; bgGlow: string; icon: React.ElementType }[] = [
  { status: 'Pending', label: 'Pending', color: '#D97706', bgGlow: 'bg-amber-500/8 border-amber-500/20', icon: Clock },
  { status: 'Preparing', label: 'Preparing', color: '#2563EB', bgGlow: 'bg-blue-500/8 border-blue-500/20', icon: Flame },
  { status: 'Ready', label: 'Ready', color: '#16A34A', bgGlow: 'bg-green-500/8 border-green-500/20', icon: CheckCircle2 },
  { status: 'Served', label: 'Served', color: '#4B5563', bgGlow: 'bg-white/3 border-white/8', icon: CheckCircle },
];

// --- AI Insights Data ---
const AI_INSIGHTS = [
  { icon: TrendingUp, text: 'Cold brews perform **38% better** after 5 PM. Consider promoting Nitro Cold Brew during evening shifts.' },
  { icon: Utensils, text: 'Cappuccino + Croissant combos are **trending today**. Cross-sell upsell rate is at 84%.' },
  { icon: Clock, text: 'Peak café traffic detected between **6–8 PM**. Recommend deploying additional barista coverage.' },
  { icon: Lightbulb, text: 'Oat milk orders increased **22%** this week. Verify supply levels before weekend rush.' },
];

export default function DashboardPage() {
  const session = useStore((state) => state.session);
  const localOrders = useStore((state) => state.orders);
  const localNotifications = useStore((state) => state.notifications);
  const localMenuItems = useStore((state) => state.menuItems);
  const localReservations = useStore((state) => state.reservations);

  const addLiveOrder = useStore((state) => state.addLiveOrder);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const clearNotifications = useStore((state) => state.clearNotifications);

  // Menu Actions
  const updateMenuPrice = useStore((state) => state.updateMenuPrice);
  const addMenuItem = useStore((state) => state.addMenuItem);
  const deleteMenuItem = useStore((state) => state.deleteMenuItem);

  // Reservation Actions
  const addReservation = useStore((state) => state.addReservation);
  const confirmReservationLocal = useStore((state) => state.confirmReservation);
  const cancelReservationLocal = useStore((state) => state.cancelReservation);

  // React Query Operations
  const { data: serverOrders = [] } = useOrdersQuery();
  const { data: serverMenuItems = [] } = useMenuQuery();
  const { data: serverReservations = [] } = useReservationsQuery();
  const { data: serverAnalytics } = useAnalyticsQuery();

  const updateOrderStatusMutation = useUpdateOrderStatusMutation();
  const updateMenuPriceMutation = useUpdateMenuPriceMutation();
  const addMenuItemMutation = useAddMenuItemMutation();
  const deleteMenuItemMutation = useDeleteMenuItemMutation();
  const createReservationMutation = useCreateReservationMutation();
  const confirmReservationMutation = useConfirmReservationMutation();
  const cancelReservationMutation = useCancelReservationMutation();

  const { playSound } = useSoundFeedback();

  // Unified data selectors with local offline backup
  const orders = serverOrders.length > 0 ? serverOrders : localOrders;
  const menuItems = serverMenuItems.length > 0 ? serverMenuItems : localMenuItems;
  const reservations = serverReservations.length > 0 ? serverReservations : localReservations;
  const notifications = localNotifications;

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activeInsightIdx, setActiveInsightIdx] = useState(0);

  // Prevent hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  // Live shift clock
  useEffect(() => {
    if (!mounted) return;
    const update = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Rotating AI insights
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setActiveInsightIdx((prev) => (prev + 1) % AI_INSIGHTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [mounted]);

  // AUTO-SIMULATED OPERATIONS TICKER
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const clientNames = ['Vanderbilt', 'Chloe D.', 'Sarah J.', 'Thomas A.', 'Sophie M.'];
      const dishChoices = [
        { items: 'Noir Cortado (1x), Espresso Tiramisu (1x)', total: 13.00 },
        { items: 'Iced Vanilla Latte (1x), Atelier Cinnamon Roll (1x)', total: 12.00 },
        { items: 'Nitro Cold Brew (1x), Almond Croissant (1x)', total: 11.60 },
        { items: 'Silk Flat White (2x), Pastry (1x)', total: 17.20 },
      ];
      const randomName = clientNames[Math.floor(Math.random() * clientNames.length)];
      const randomChoice = dishChoices[Math.floor(Math.random() * dishChoices.length)];
      playSound('pip');
      addLiveOrder({ name: randomName, items: randomChoice.items, total: randomChoice.total });
    }, 24000);
    return () => clearInterval(interval);
  }, [mounted, addLiveOrder, playSound]);

  // Form states for menu add
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuPrice, setNewMenuPrice] = useState('');
  const [newMenuCategory, setNewMenuCategory] = useState<'Hot Coffee' | 'Cold Coffee' | 'Signature Drinks' | 'Bakery' | 'Desserts' | 'Refreshers' | 'Sandwiches'>('Hot Coffee');
  const [newMenuDesc, setNewMenuDesc] = useState('');

  // Form states for reservation add
  const [newGuestName, setNewGuestName] = useState('');
  const [newResDate, setNewResDate] = useState<'TONIGHT' | 'TOMORROW' | 'TUESDAY'>('TONIGHT');
  const [newResHour, setNewResHour] = useState<'18:00' | '20:30' | '22:00'>('20:30');
  const [newGuestsCount, setNewGuestsCount] = useState('2');

  // Editing states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState('');

  if (!mounted) return null;

  // Overview metrics
  const activeQueueCount = orders.filter((o) => o.status === 'Preparing' || o.status === 'Pending' || o.status === 'Ready').length;
  const shiftRevenue = orders
    .filter((o) => o.status === 'Served' || o.status === 'Preparing' || o.status === 'Ready')
    .reduce((sum, o) => sum + o.total, 0);

  // Kanban grouping with search filter
  const filteredOrders = searchQuery.trim()
    ? orders.filter((o) =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  const kanbanGroups = {
    Pending: filteredOrders.filter((o) => o.status === 'Pending'),
    Preparing: filteredOrders.filter((o) => o.status === 'Preparing'),
    Ready: filteredOrders.filter((o) => o.status === 'Ready'),
    Served: filteredOrders.filter((o) => o.status === 'Served'),
  };

  // Status summary counts (unfiltered)
  const statusCounts = {
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Preparing: orders.filter((o) => o.status === 'Preparing').length,
    Ready: orders.filter((o) => o.status === 'Ready').length,
    Served: orders.filter((o) => o.status === 'Served').length,
  };

  const simulateCustomerTicket = () => {
    playSound('pip');
    const clientNames = ['Julian V.', 'Thomas A.', 'Sophie M.', 'Elena R.'];
    const dishChoices = [
      { items: 'Silk Flat White (1x), Almond Croissant (1x)', total: 11.30 },
      { items: 'Nitro Cold Brew (1x), Truffle Egg Sandwich (1x)', total: 16.00 },
      { items: 'Saffron Honey Latte (1x), Atelier Cinnamon Roll (1x)', total: 13.10 }
    ];
    const randomName = clientNames[Math.floor(Math.random() * clientNames.length)];
    const randomChoice = dishChoices[Math.floor(Math.random() * dishChoices.length)];
    addLiveOrder({ name: randomName, items: randomChoice.items, total: randomChoice.total });
  };

  function handleOrderStatus(id: string, status: LiveOrder['status']) {
    playSound('pip');
    updateOrderStatus(id, status);
    updateOrderStatusMutation.mutate({ id, status });
  }

  function getNextStatus(current: LiveOrder['status']): LiveOrder['status'] | null {
    if (current === 'Pending') return 'Preparing';
    if (current === 'Preparing') return 'Ready';
    if (current === 'Ready') return 'Served';
    return null;
  }

  function getStatusActionLabel(status: LiveOrder['status']): string {
    if (status === 'Pending') return 'START PREPARING';
    if (status === 'Preparing') return 'MARK READY';
    if (status === 'Ready') return 'MARK SERVED';
    return 'DISPATCHED';
  }

  function getStatusActionColor(status: LiveOrder['status']): string {
    if (status === 'Pending') return 'bg-blue-500 hover:bg-blue-600 text-white';
    if (status === 'Preparing') return 'bg-green-500 hover:bg-green-600 text-white';
    if (status === 'Ready') return 'bg-white/10 hover:bg-white/15 text-premium-white border border-ice-border';
    return '';
  }

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName || !newMenuPrice) return;
    const parsedPrice = parseFloat(newMenuPrice);
    addMenuItem({
      name: newMenuName, price: parsedPrice, category: newMenuCategory,
      description: newMenuDesc || 'Luxury curated organic barista café signature.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gourmet%20artisan%20coffee%20beverage%20organic%20macro%20close%20up%20shot%20minimalist&image_size=portrait_4_3'
    });
    addMenuItemMutation.mutate({
      name: newMenuName, price: parsedPrice, category: newMenuCategory,
      description: newMenuDesc || 'Luxury curated organic barista café signature.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gourmet%20artisan%20coffee%20beverage%20organic%20macro%20close%20up%20shot%20minimalist&image_size=portrait_4_3'
    });
    setNewMenuName(''); setNewMenuPrice(''); setNewMenuDesc('');
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName) return;
    const parsedCount = parseInt(newGuestsCount);
    const resolvedBooth = `Booth ${Math.floor(1 + Math.random() * 8)}`;
    addReservation({ guestName: newGuestName, date: newResDate, hour: newResHour, guestsCount: parsedCount, booth: resolvedBooth });
    createReservationMutation.mutate({ guestName: newGuestName, date: newResDate, hour: newResHour, guestsCount: parsedCount, booth: resolvedBooth });
    setNewGuestName(''); setNewGuestsCount('2');
  };

  const startEditingPrice = (item: MenuItem) => { setEditingItemId(item.id); setEditingPrice(item.price.toString()); };
  const saveEditedPrice = (itemId: string) => {
    const parsed = parseFloat(editingPrice);
    if (!isNaN(parsed)) { updateMenuPrice(itemId, parsed); updateMenuPriceMutation.mutate({ id: itemId, price: parsed }); }
    setEditingItemId(null);
  };

  // Card animation presets
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const } }),
  };

  const activeInsight = AI_INSIGHTS[activeInsightIdx];

  return (
    <div className="flex-1 flex pt-nav-height min-h-screen bg-canvas-charcoal">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow p-4 md:p-8 lg:p-10 space-y-6 overflow-y-auto max-w-[1600px]">

        {/* =============== OVERVIEW TAB =============== */}
        {activeTab === 'overview' && (
          <>
            {/* Header with Live Clock */}
            <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-premium-white tracking-tight flex items-center gap-3 flex-wrap">
                  Operations Console
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20 uppercase">
                    HQ Café Stream
                  </span>
                </h1>
                <p className="text-xs text-muted-steel mt-1">
                  Real-time table tracking, active kitchen queue, and live operational chimes.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Live Shift Clock */}
                <div className="glass-card px-4 py-2.5 rounded-lg border border-ice-border flex items-center gap-2">
                  <Clock className="text-[#C58A46]" size={18} />
                  <span className="font-mono text-xs text-muted-steel">Current Shift —</span>
                  <span className="font-mono text-xs text-premium-white font-bold">{currentTime}</span>
                </div>

                <button
                  onClick={simulateCustomerTicket}
                  className="px-4 py-2.5 rounded-lg bg-glass-fill border border-ice-border hover:border-[#C58A46]/50 text-xs font-bold text-[#C58A46] transition-all spring-interaction flex items-center gap-2"
                >
                  <Plus className="font-bold" size={18} />
                  Simulate Ticket
                </button>
                <button
                  onClick={clearNotifications}
                  className="px-4 py-2.5 rounded-lg bg-white/5 border border-ice-border text-xs text-premium-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={18} />
                  Clear Alerts
                </button>
              </div>
            </section>

            {/* Metric Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Shift Revenue', value: `$${shiftRevenue.toFixed(2)}`, trend: '+18.4% vs last morning', trendColor: 'text-green-400', icon: Banknote, iconBg: 'bg-[#C58A46]/10 border-[#C58A46]/20', iconColor: 'text-[#C58A46]', valueColor: 'text-[#C58A46]' },
                { label: 'Barista Queue', value: activeQueueCount.toString(), trend: 'Espresso extraction: 92%', trendColor: 'text-muted-steel', icon: Coffee, iconBg: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-400', valueColor: 'text-premium-white' },
                { label: 'Table Alerts', value: notifications.length.toString(), trend: 'Waiter dispatch requests', trendColor: 'text-amber-400', icon: BellRing, iconBg: 'bg-amber-500/10 border-amber-500/20', iconColor: 'text-amber-400', valueColor: 'text-premium-white' },
                { label: 'Avg Prep Time', value: '6.2', trend: 'Excellent extraction metrics', trendColor: 'text-green-400', icon: Gauge, iconBg: 'bg-green-500/10 border-green-500/20', iconColor: 'text-green-400', valueColor: 'text-premium-white', suffix: 'min' },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="glass-card p-5 rounded-xl border border-ice-border flex items-center justify-between hover:border-[#C58A46]/20 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono tracking-widest text-[#8E939E] uppercase block">{card.label}</span>
                    <h3 className={`text-2xl font-bold font-mono ${card.valueColor}`}>
                      {card.value}
                      {card.suffix && <span className="text-xs text-muted-steel font-sans ml-1">{card.suffix}</span>}
                    </h3>
                    <p className={`text-[9px] ${card.trendColor} flex items-center gap-1 leading-none`}>
                      {card.trendColor === 'text-green-400' && <TrendingUp size={16} />}
                      {card.trendColor === 'text-amber-400' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block"></span>}
                      {card.trend}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${card.iconBg} border flex items-center justify-center shrink-0`}>
                    <card.icon className={`${card.iconColor} font-bold`} size={24} />
                  </div>
                </motion.div>
              ))}
            </section>

            {/* Quick Status Summary Bar */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {KANBAN_COLUMNS.map((col) => (
                <div
                  key={col.status}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${col.bgGlow} transition-all`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }}></span>
                  <span className="font-mono text-xs font-bold" style={{ color: col.color }}>
                    {statusCounts[col.status]}
                  </span>
                  <span className="text-[10px] text-muted-steel uppercase tracking-wider">
                    {col.label}{col.status === 'Served' ? ' Today' : ''}
                  </span>
                </div>
              ))}
            </motion.section>

            {/* Main Content: Kanban + Sidebar */}
            <section className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

              {/* Left: Kanban Board */}
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E939E]" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Table # or Order ID..."
                    className="w-full bg-white/5 border border-ice-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all placeholder:text-muted-steel/30"
                  />
                </div>

                {/* Kanban Header */}
                <h2 className="text-xs font-bold tracking-widest text-[#C58A46] uppercase flex items-center gap-2 font-mono">
                  Active Barista Kitchen Queue
                  <span className="inline-block w-2 h-2 rounded-full bg-[#C58A46] animate-ping"></span>
                </h2>

                {/* 4-Column Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {KANBAN_COLUMNS.map((col) => {
                    const colOrders = kanbanGroups[col.status];
                    return (
                      <div key={col.status} className="space-y-3">
                        {/* Column Header */}
                        <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${col.bgGlow}`}>
                          <div className="flex items-center gap-2">
                            <col.icon style={{ color: col.color }} size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: col.color }}>{col.label}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${col.color}15`, color: col.color }}>
                            {colOrders.length}
                          </span>
                        </div>

                        {/* Order Cards */}
                        <div className="space-y-3 min-h-[120px]">
                          <AnimatePresence mode="popLayout">
                            {colOrders.length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card rounded-lg p-6 text-center border border-dashed border-white/8"
                              >
                                <div className="flex justify-center mb-1">
                                  <col.icon className="text-white/10" size={32} />
                                </div>
                                <p className="text-[10px] text-muted-steel/50">No orders</p>
                              </motion.div>
                            ) : (
                              colOrders.map((order) => {
                                const priority = getOrderPriority(order.id);
                                const nextStatus = getNextStatus(order.status);
                                return (
                                  <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    className="glass-card rounded-xl p-5 border border-ice-border hover:border-[#C58A46]/25 transition-all flex flex-col gap-4"
                                    style={{ borderLeftWidth: '3px', borderLeftColor: col.color }}
                                  >
                                    {/* Ticket ID + Priority */}
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-mono text-xs text-[#C58A46] font-bold">{order.id}</span>
                                      <div className="flex items-center gap-1.5">
                                        <PriorityBadge tag={priority} />
                                        <span className="font-mono text-xs text-muted-steel">{order.time}</span>
                                      </div>
                                    </div>

                                    {/* Client & Items */}
                                    <div>
                                      <p className="text-sm font-bold text-premium-white">{order.name}</p>
                                      <p className="text-sm text-muted-steel mt-1 leading-relaxed line-clamp-3">{order.items}</p>
                                    </div>

                                    {/* Total + Action */}
                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm text-premium-white font-bold">${order.total.toFixed(2)}</span>
                                        {nextStatus ? (
                                          <button
                                            onClick={() => handleOrderStatus(order.id, nextStatus)}
                                            className={`px-3 py-2 rounded-md text-xs font-bold uppercase transition-all spring-interaction ${getStatusActionColor(order.status)}`}
                                          >
                                            {getStatusActionLabel(order.status)}
                                          </button>
                                        ) : (
                                          <span className="text-xs text-muted-steel font-mono uppercase">Dispatched ✓</span>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Sidebar: AI + Notifications + Roster */}
              <div className="space-y-5">

                {/* AI Insights Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="glass-card p-5 rounded-xl border border-ice-border bg-gradient-to-br from-[#C58A46]/5 to-transparent space-y-3"
                >
                  <h3 className="text-[10px] font-bold text-[#C58A46] flex items-center gap-2 font-mono uppercase tracking-widest">
                    <BrainCircuit className="animate-pulse" size={18} />
                    AI Barista Insights
                  </h3>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeInsightIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="flex gap-2.5 items-start"
                    >
                      <activeInsight.icon className="text-[#C58A46] shrink-0 mt-0.5" size={20} />
                      <p
                        className="text-xs text-premium-white/85 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: activeInsight.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C58A46] font-bold">$1</strong>')
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                  {/* Progress dots */}
                  <div className="flex gap-1.5 pt-1">
                    {AI_INSIGHTS.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === activeInsightIdx ? 'w-4 bg-[#C58A46]' : 'w-1.5 bg-white/10'}`} />
                    ))}
                  </div>
                </motion.div>

                {/* Notification Feed */}
                <div className="glass-card p-5 rounded-xl border border-ice-border space-y-3">
                  <h2 className="text-[10px] font-bold tracking-widest text-[#8E939E] uppercase flex items-center gap-2 font-mono">
                    Shift Alerts Feed
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C58A46] animate-pulse"></span>
                  </h2>
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence initial={false}>
                      {notifications.map((n) => {
                        let borderClass = 'border-l-blue-400';
                        if (n.type === 'success') borderClass = 'border-l-green-400';
                        else if (n.type === 'warning') borderClass = 'border-l-amber-400';
                        else if (n.type === 'error') borderClass = 'border-l-red-400';
                        return (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`p-3 bg-white/5 rounded-lg border-l-2 ${borderClass} text-xs flex justify-between gap-3 items-start`}
                          >
                            <p className="text-premium-white flex-1 leading-snug">{n.text}</p>
                            <span className="font-mono text-[9px] text-[#8E939E] shrink-0">{n.time}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Staff Roster */}
                <div className="glass-card p-5 rounded-xl border border-ice-border space-y-3 bg-[#12141C]/50">
                  <h3 className="text-[10px] font-bold text-premium-white font-mono uppercase tracking-widest">Shift Roster</h3>
                  <div className="space-y-2 text-xs text-muted-steel">
                    <div className="flex justify-between items-center border-b border-ice-border/50 pb-2">
                      <span>Head Barista</span>
                      <span className="text-premium-white font-semibold">Master Pierre</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Duty Commander</span>
                      <span className="text-premium-white">Elena Rostova</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =============== MENU TAB =============== */}
        {activeTab === 'menu' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-premium-white tracking-tight">Menu Management</h1>
                <p className="text-sm text-muted-steel mt-1">Audit active café recipes, modify pricing, and configure upsell tokens.</p>
              </div>

              <div className="glass-card rounded-xl border border-ice-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 font-mono text-[10px] text-[#8E939E] uppercase tracking-wider border-b border-ice-border">
                    <tr>
                      <th className="px-6 py-4">Recipe Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ice-border text-xs text-premium-white">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Utensils className="text-[#C58A46]" size={20} />
                            <div>
                              <p className="font-bold">{item.name}</p>
                              <p className="text-[10px] text-muted-steel max-w-xs truncate">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-white/5 border border-ice-border rounded text-[9px] font-mono text-[#8E939E]">{item.category}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[#C58A46] font-bold">
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#8E939E] text-xs">$</span>
                              <input type="text" value={editingPrice} onChange={(e) => setEditingPrice(e.target.value)}
                                className="w-16 bg-white/5 border border-ice-border rounded p-1 focus:outline-none focus:border-[#C58A46] text-premium-white font-mono text-xs" />
                            </div>
                          ) : (`$${item.price.toFixed(2)}`)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {editingItemId === item.id ? (
                              <button onClick={() => saveEditedPrice(item.id)}
                                className="px-2.5 py-1 bg-green-500 text-premium-white rounded hover:bg-green-600 transition-colors font-bold text-[10px] flex items-center gap-1">
                                <Save size={16} />Save
                              </button>
                            ) : (
                              <button onClick={() => startEditingPrice(item)}
                                className="px-2.5 py-1 bg-glass-fill border border-ice-border rounded hover:border-[#C58A46]/50 text-premium-white transition-all text-[10px] flex items-center gap-1">
                                <Edit2 size={16} />Edit Price
                              </button>
                            )}
                            <button onClick={() => { deleteMenuItem(item.id); deleteMenuItemMutation.mutate(item.id); }}
                              className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-[#8E939E] hover:text-red-400 flex items-center justify-center transition-colors">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="glass-card p-6 rounded-xl border border-ice-border space-y-6">
              <div>
                <h3 className="text-sm font-bold text-premium-white font-mono uppercase">Add Recipe Item</h3>
                <p className="text-[10px] text-muted-steel mt-1">Inject a new café experience directly into the operational database.</p>
              </div>
              <form onSubmit={handleCreateMenuItem} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Recipe Title</label>
                  <input type="text" required value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} placeholder="e.g. Saffron Honey Latte"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all placeholder:text-muted-steel/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Item Price ($ USD)</label>
                  <input type="text" required value={newMenuPrice} onChange={(e) => setNewMenuPrice(e.target.value)} placeholder="7.20"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all placeholder:text-muted-steel/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Category</label>
                  <select value={newMenuCategory} onChange={(e) => setNewMenuCategory(e.target.value as any)}
                    className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#C58A46] transition-all">
                    <option value="Hot Coffee">Hot Coffee</option>
                    <option value="Cold Coffee">Cold Coffee</option>
                    <option value="Signature Drinks">Signature Drinks</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Refreshers">Refreshers</option>
                    <option value="Sandwiches">Sandwiches</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Description</label>
                  <textarea value={newMenuDesc} onChange={(e) => setNewMenuDesc(e.target.value)}
                    placeholder="Specify ingredients, milk choices, and standard pairing metadata..."
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all min-h-[90px] placeholder:text-muted-steel/20" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#C58A46] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-1">
                  <Plus className="font-bold" size={18} />
                  DEPLOY CAFE SPECIAL
                </button>
              </form>
            </aside>
          </section>
        )}

        {/* =============== RESERVATIONS TAB =============== */}
        {activeTab === 'reservations' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-premium-white tracking-tight">Reservations Console</h1>
                <p className="text-sm text-muted-steel mt-1">Audit active café table bookings and guest session allocation.</p>
              </div>

              <div className="glass-card rounded-xl border border-ice-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 font-mono text-[10px] text-[#8E939E] uppercase tracking-wider border-b border-ice-border">
                    <tr>
                      <th className="px-6 py-4">Guest Name</th>
                      <th className="px-6 py-4">Date / Hour</th>
                      <th className="px-6 py-4">Booth Selection</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ice-border text-xs text-premium-white">
                    {reservations.map((res) => {
                      let badgeClass = 'bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20';
                      if (res.status === 'Confirmed') badgeClass = 'bg-green-500/10 text-green-400 border border-green-500/20';
                      else if (res.status === 'Cancelled') badgeClass = 'bg-red-500/10 text-red-400 border border-red-500/20';

                      return (
                        <tr key={res.id} className="hover:bg-white/3 transition-colors">
                          <td className="px-6 py-4 font-bold">{res.guestName}</td>
                          <td className="px-6 py-4"><span className="text-[#8E939E] font-mono text-[10px] uppercase">{res.date} @ {res.hour}</span></td>
                          <td className="px-6 py-4 text-muted-steel">{res.booth}</td>
                          <td className="px-6 py-4 font-mono">{res.guestsCount}x</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {res.status === 'Pending' && (
                                <>
                                  <button onClick={() => { confirmReservationLocal(res.id); confirmReservationMutation.mutate(res.id); }}
                                    className="px-2 py-1 bg-green-500 text-premium-white rounded font-bold text-[9px] hover:bg-green-600 transition-colors">CONFIRM</button>
                                  <button onClick={() => { cancelReservationLocal(res.id); cancelReservationMutation.mutate(res.id); }}
                                    className="px-2 py-1 bg-white/5 border border-ice-border text-premium-white rounded font-bold text-[9px] hover:bg-white/10 transition-colors">CANCEL</button>
                                </>
                              )}
                              {res.status !== 'Pending' && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>{res.status}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="glass-card p-6 rounded-xl border border-ice-border space-y-6">
              <div>
                <h3 className="text-sm font-bold text-premium-white font-mono uppercase">Create Reservation</h3>
                <p className="text-[10px] text-muted-steel mt-1">Book a new guest table session directly in B2B scheduling telemetry.</p>
              </div>
              <form onSubmit={handleCreateReservation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Guest Full Name</label>
                  <input type="text" required value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)} placeholder="e.g. Julian Vanderbilt"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all placeholder:text-muted-steel/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Guests Count</label>
                  <input type="number" required value={newGuestsCount} onChange={(e) => setNewGuestsCount(e.target.value)} min="1" max="12"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Dining Date</label>
                  <select value={newResDate} onChange={(e) => setNewResDate(e.target.value as any)}
                    className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#C58A46] transition-all">
                    <option value="TONIGHT">Tonight</option><option value="TOMORROW">Tomorrow</option><option value="TUESDAY">Tuesday</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Hour Window</label>
                  <select value={newResHour} onChange={(e) => setNewResHour(e.target.value as any)}
                    className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#C58A46] transition-all">
                    <option value="18:00">18:00 (Breakfast Riser)</option><option value="20:30">20:30 (Prime Brunch)</option><option value="22:00">22:00 (Late Afternoon)</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-[#C58A46] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 icon-btn">
                  <Calendar className="lucide-icon text-[#0C0705]" size={16} />
                  SCHEDULE BOOKING
                </button>
              </form>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
