'use client';

import React, { useState, useEffect } from 'react';
import { useStore, LiveOrder, MenuItem, Reservation } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function DashboardPage() {
  const session = useStore((state) => state.session);
  const orders = useStore((state) => state.orders);
  const notifications = useStore((state) => state.notifications);
  const menuItems = useStore((state) => state.menuItems);
  const reservations = useStore((state) => state.reservations);

  const addLiveOrder = useStore((state) => state.addLiveOrder);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const clearNotifications = useStore((state) => state.clearNotifications);

  // Menu Actions
  const updateMenuPrice = useStore((state) => state.updateMenuPrice);
  const addMenuItem = useStore((state) => state.addMenuItem);
  const deleteMenuItem = useStore((state) => state.deleteMenuItem);

  // Reservation Actions
  const addReservation = useStore((state) => state.addReservation);
  const confirmReservation = useStore((state) => state.confirmReservation);
  const cancelReservation = useStore((state) => state.cancelReservation);

  // Dashboard state tabs: overview | menu | reservations
  const [activeTab, setActiveTab] = useState('overview');

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Form states for menu add
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuPrice, setNewMenuPrice] = useState('');
  const [newMenuCategory, setNewMenuCategory] = useState<'Entree' | 'Dessert' | 'Beverage'>('Entree');
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

  // Overview metrics calculations
  const activeQueueCount = orders.filter((o) => o.status === 'Preparing' || o.status === 'Pending').length;
  const shiftRevenue = orders
    .filter((o) => o.status === 'Served' || o.status === 'Completed' || o.status === 'Preparing')
    .reduce((sum, o) => sum + o.total, 0);

  const simulateCustomerTicket = () => {
    const clientNames = ['Christian L.', 'Julia V.', 'Thomas A.', 'Sophie M.'];
    const dishChoices = [
      { items: 'Signature Wagyu, Obsidian Gin & Tonic', total: 146.00 },
      { items: 'Seared Scallops, Chablis Premier Cru 2020', total: 148.00 },
      { items: 'Signature Wagyu (2x), Napa Valley Cabernet 2018', total: 343.00 }
    ];

    const randomName = clientNames[Math.floor(Math.random() * clientNames.length)];
    const randomChoice = dishChoices[Math.floor(Math.random() * dishChoices.length)];

    addLiveOrder({
      name: randomName,
      items: randomChoice.items,
      total: randomChoice.total
    });
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName || !newMenuPrice) return;
    
    addMenuItem({
      name: newMenuName,
      price: parseFloat(newMenuPrice),
      category: newMenuCategory,
      description: newMenuDesc || 'Luxury curated gastronomic signature culinary addition.',
      image: newMenuCategory === 'Beverage' ? '/assets/order_gin.png' : '/assets/chatbot_steak.png'
    });

    setNewMenuName('');
    setNewMenuPrice('');
    setNewMenuDesc('');
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName) return;

    addReservation({
      guestName: newGuestName,
      date: newResDate,
      hour: newResHour,
      guestsCount: parseInt(newGuestsCount),
      booth: `Booth ${Math.floor(1 + Math.random() * 8)}`
    });

    setNewGuestName('');
    setNewGuestsCount('2');
  };

  const startEditingPrice = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditingPrice(item.price.toString());
  };

  const saveEditedPrice = (itemId: string) => {
    const parsed = parseFloat(editingPrice);
    if (!isNaN(parsed)) {
      updateMenuPrice(itemId, parsed);
    }
    setEditingItemId(null);
  };

  return (
    <div className="flex-1 flex pt-nav-height min-h-screen bg-canvas-charcoal">
      
      {/* Collapsible Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel Content */}
      <main className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1440px]">
        
        {/* Active Tab: Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Header banner */}
            <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-premium-white tracking-tight flex items-center gap-3">
                  Overview Console
                  <span className="text-xs font-mono px-2 py-1 rounded bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20 uppercase">
                    HQ Live Feed
                  </span>
                </h1>
                <p className="text-sm text-muted-steel mt-1">
                  Real-time table tracking, kitchen queue pacer, and multi-tenant telemetry.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={simulateCustomerTicket}
                  className="px-4 py-2.5 rounded-lg bg-glass-fill border border-ice-border hover:border-[#E5C158]/50 text-xs font-bold text-[#E5C158] transition-all spring-interaction flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  Simulate Client Ticket
                </button>
                <button
                  onClick={clearNotifications}
                  className="px-4 py-2.5 rounded-lg bg-white/5 border border-ice-border text-xs text-premium-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">clear_all</span>
                  Clear Alerts
                </button>
              </div>
            </section>

            {/* Metrics cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-5 rounded-xl border border-ice-border flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#8E939E] uppercase block">
                    Shift Revenue
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-[#E5C158]">
                    ${shiftRevenue.toFixed(2)}
                  </h3>
                  <p className="text-[9px] text-green-400 flex items-center gap-1 leading-none">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                    +14.8% vs last Sunday
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#E5C158]/10 border border-[#E5C158]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#E5C158] text-lg font-bold">payments</span>
                </div>
              </div>

              <div className="glass-card p-5 rounded-xl border border-ice-border flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#8E939E] uppercase block">
                    Active Queue
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-premium-white">{activeQueueCount}</h3>
                  <p className="text-[9px] text-[#8E939E] leading-none">Kitchen capacity: 85%</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-lg">restaurant</span>
                </div>
              </div>

              <div className="glass-card p-5 rounded-xl border border-ice-border flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#8E939E] uppercase block">
                    Active Alerts
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-premium-white">{notifications.length}</h3>
                  <p className="text-[9px] text-amber-400 flex items-center gap-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block"></span>
                    Awaiting staff action
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-400 text-lg">notifications_active</span>
                </div>
              </div>

              <div className="glass-card p-5 rounded-xl border border-ice-border flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#8E939E] uppercase block">
                    Average Pacing
                  </span>
                  <h3 className="text-2xl font-bold font-mono text-premium-white">
                    18.4 <span className="text-xs text-muted-steel font-sans">min</span>
                  </h3>
                  <p className="text-[9px] text-green-400 leading-none">Excellent pace metrics</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400 text-lg">speed</span>
                </div>
              </div>
            </section>

            {/* Live Tickets & Logs */}
            <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              
              {/* Order Queue */}
              <div className="space-y-6">
                <h2 className="text-sm font-bold tracking-widest text-[#E5C158] uppercase flex items-center gap-2 font-mono">
                  Active Kitchen & Table Order Queue
                  <span className="inline-block w-2 h-2 rounded-full bg-[#E5C158] animate-ping"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orders.length === 0 ? (
                    <div className="glass-card rounded-xl p-8 text-center space-y-4 md:col-span-2">
                      <span className="material-symbols-outlined text-4xl text-[#8E939E]/20">soup_kitchen</span>
                      <p className="text-xs text-muted-steel">
                        No active tickets logged. Send simulated client orders to view queue.
                      </p>
                    </div>
                  ) : (
                    orders.map((order) => {
                      let badgeClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                      let actionBtn = null;

                      if (order.status === 'Pending') {
                        badgeClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                        actionBtn = (
                          <button
                            onClick={() => handleOrderStatus(order.id, 'Preparing')}
                            className="w-full py-2 bg-[#E5C158] text-canvas-charcoal text-[11px] font-bold rounded-lg hover:brightness-110 transition-all spring-interaction"
                          >
                            START PREPARING
                          </button>
                        );
                      } else if (order.status === 'Preparing') {
                        badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                        actionBtn = (
                          <button
                            onClick={() => handleOrderStatus(order.id, 'Served')}
                            className="w-full py-2 bg-green-500 text-premium-white text-[11px] font-bold rounded-lg hover:bg-green-600 transition-all spring-interaction"
                          >
                            MARK AS SERVED
                          </button>
                        );
                      } else if (order.status === 'Served') {
                        badgeClass = 'bg-green-500/10 text-green-400 border border-green-500/20';
                        actionBtn = (
                          <button
                            onClick={() => handleOrderStatus(order.id, 'Completed')}
                            className="w-full py-2 bg-white/5 text-premium-white hover:bg-white/10 text-[11px] font-bold rounded-lg transition-all spring-interaction border border-ice-border"
                          >
                            ARCHIVE ORDER
                          </button>
                        );
                      } else {
                        badgeClass = 'bg-white/5 text-muted-steel border border-ice-border';
                        actionBtn = (
                          <div className="text-center text-[10px] text-muted-steel py-2 font-mono uppercase">
                            Ticket Closed
                          </div>
                        );
                      }

                      return (
                        <div
                          key={order.id}
                          className="glass-card rounded-xl p-5 border border-ice-border space-y-4 hover:border-[#E5C158]/30 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="font-mono text-xs text-[#E5C158] font-bold">{order.id}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${badgeClass}`}>
                                {order.status}
                              </span>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-bold text-premium-white">Client: {order.name}</h4>
                              <p className="text-[11px] text-muted-steel mt-1 leading-relaxed">{order.items}</p>
                            </div>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-ice-border/60">
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-muted-steel">Value:</span>
                              <span className="text-premium-white font-bold">${order.total.toFixed(2)}</span>
                            </div>
                            {actionBtn}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Sidebar Logs & AI insights */}
              <div className="space-y-6">
                
                {/* AI Insights panel */}
                <div className="glass-card p-5 rounded-xl border border-ice-border bg-gradient-to-br from-[#E5C158]/5 to-transparent space-y-3">
                  <h3 className="text-xs font-bold text-[#E5C158] flex items-center gap-2 font-mono">
                    <span className="material-symbols-outlined text-base">psychology</span>
                    AI OS INSIGHTS
                  </h3>
                  <p className="text-xs text-premium-white/90 leading-relaxed font-sans">
                    <strong>Sommelier Correlation</strong>: Napa Cabernet sales are matching Wagyu beef pacing metrics. Suggest upselling <em>Seared Scallops</em> tonight due to rich reserves in Hokkaido stock levels.
                  </p>
                </div>

                {/* shift activity log */}
                <div className="glass-card p-5 rounded-xl border border-ice-border space-y-4">
                  <h2 className="text-xs font-bold tracking-widest text-[#8E939E] uppercase flex items-center gap-2 font-mono">
                    Shift Telemetry Alerts
                  </h2>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.map((n) => {
                      let borderClass = 'border-l-blue-400';
                      if (n.type === 'success') borderClass = 'border-l-green-400';
                      else if (n.type === 'warning') borderClass = 'border-l-amber-400';

                      return (
                        <div
                          key={n.id}
                          className={`p-3 bg-white/5 rounded-lg border-l-2 ${borderClass} text-xs flex justify-between gap-3 items-start`}
                        >
                          <p className="text-premium-white flex-1 leading-snug">{n.text}</p>
                          <span className="font-mono text-[9px] text-[#8E939E] shrink-0">{n.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* staff roster */}
                <div className="glass-card p-5 rounded-xl border border-ice-border space-y-4 bg-[#12141C]/50">
                  <h3 className="text-xs font-bold text-premium-white font-mono">Shift Roster</h3>
                  <div className="space-y-2 text-xs text-muted-steel">
                    <div className="flex justify-between items-center border-b border-ice-border/50 pb-2">
                      <span>Commander</span>
                      <span className="text-premium-white font-semibold">Elena Rostova</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sommelier</span>
                      <span className="text-premium-white">Christian L.</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Active Tab: Menu Management */}
        {activeTab === 'menu' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            
            {/* Menu items list table */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-premium-white tracking-tight">Menu Management</h1>
                <p className="text-sm text-muted-steel mt-1">Audit active gastronomic dishes, modify pricing, and configure upsell tokens.</p>
              </div>

              <div className="glass-card rounded-xl border border-ice-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 font-mono text-[10px] text-[#8E939E] uppercase tracking-wider border-b border-ice-border">
                    <tr>
                      <th className="px-6 py-4">Item Name</th>
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
                            <span className="material-symbols-outlined text-[#E5C158] text-base">restaurant</span>
                            <div>
                              <p className="font-bold">{item.name}</p>
                              <p className="text-[10px] text-muted-steel max-w-xs truncate">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-white/5 border border-ice-border rounded text-[9px] font-mono text-[#8E939E]">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-[#E5C158] font-bold">
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#8E939E] text-xs">$</span>
                              <input
                                type="text"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                className="w-16 bg-white/5 border border-ice-border rounded p-1 focus:outline-none focus:border-[#E5C158] text-premium-white font-mono text-xs"
                              />
                            </div>
                          ) : (
                            `$${item.price.toFixed(2)}`
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {editingItemId === item.id ? (
                              <button
                                onClick={() => saveEditedPrice(item.id)}
                                className="px-2.5 py-1 bg-green-500 text-premium-white rounded hover:bg-green-600 transition-colors font-bold text-[10px] flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">save</span>
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => startEditingPrice(item)}
                                className="px-2.5 py-1 bg-glass-fill border border-ice-border rounded hover:border-[#E5C158]/50 text-premium-white transition-all text-[10px] flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">edit</span>
                                Edit Price
                              </button>
                            )}
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-[#8E939E] hover:text-red-400 flex items-center justify-center transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar form for adding new dishes */}
            <aside className="glass-card p-6 rounded-xl border border-ice-border space-y-6">
              <div>
                <h3 className="text-sm font-bold text-premium-white font-mono uppercase">Add Menu Item</h3>
                <p className="text-[10px] text-muted-steel mt-1">Inject a new culinary experience directly into the operational database.</p>
              </div>

              <form onSubmit={handleCreateMenuItem} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Dish Title</label>
                  <input
                    type="text"
                    required
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    placeholder="e.g. Imperial Beluga Caviar"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#E5C158] transition-all placeholder:text-muted-steel/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Item Price ($ USD)</label>
                  <input
                    type="text"
                    required
                    value={newMenuPrice}
                    onChange={(e) => setNewMenuPrice(e.target.value)}
                    placeholder="250.00"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#E5C158] transition-all placeholder:text-muted-steel/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Category</label>
                  <select
                    value={newMenuCategory}
                    onChange={(e) => setNewMenuCategory(e.target.value as any)}
                    className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#E5C158] transition-all"
                  >
                    <option value="Entree">Entree</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Description</label>
                  <textarea
                    value={newMenuDesc}
                    onChange={(e) => setNewMenuDesc(e.target.value)}
                    placeholder="Specify culinary details, garnishes, and standard wine pairing metadata..."
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#E5C158] transition-all min-h-[90px] placeholder:text-muted-steel/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E5C158] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  DEPLOY MENU SPECIAL
                </button>
              </form>
            </aside>
          </section>
        )}

        {/* Active Tab: Reservations Roster */}
        {activeTab === 'reservations' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            
            {/* Active guest bookings list */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-premium-white tracking-tight">Reservations Console</h1>
                <p className="text-sm text-muted-steel mt-1">Audit active table bookings, confirm VIP window layouts, and manage guest pacing.</p>
              </div>

              <div className="glass-card rounded-xl border border-ice-border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 font-mono text-[10px] text-[#8E939E] uppercase tracking-wider border-b border-ice-border">
                    <tr>
                      <th className="px-6 py-4">Guest Name</th>
                      <th className="px-6 py-4">Telemetry Date / Hour</th>
                      <th className="px-6 py-4">Booth Selection</th>
                      <th className="px-6 py-4">Guests</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ice-border text-xs text-premium-white">
                    {reservations.map((res) => {
                      let badgeClass = 'bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20';
                      if (res.status === 'Confirmed') badgeClass = 'bg-green-500/10 text-green-400 border border-green-500/20';
                      else if (res.status === 'Cancelled') badgeClass = 'bg-red-500/10 text-red-400 border border-red-500/20';

                      return (
                        <tr key={res.id} className="hover:bg-white/3 transition-colors">
                          <td className="px-6 py-4 font-bold">{res.guestName}</td>
                          <td className="px-6 py-4">
                            <span className="text-[#8E939E] font-mono text-[10px] uppercase">
                              {res.date} @ {res.hour}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-steel">{res.booth}</td>
                          <td className="px-6 py-4 font-mono">{res.guestsCount}x</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {res.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => confirmReservation(res.id)}
                                    className="px-2 py-1 bg-green-500 text-premium-white rounded font-bold text-[9px] hover:bg-green-600 transition-colors"
                                  >
                                    CONFIRM
                                  </button>
                                  <button
                                    onClick={() => cancelReservation(res.id)}
                                    className="px-2 py-1 bg-white/5 border border-ice-border text-premium-white rounded font-bold text-[9px] hover:bg-white/10 transition-colors"
                                  >
                                    CANCEL
                                  </button>
                                </>
                              )}
                              {res.status !== 'Pending' && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                  {res.status}
                                </span>
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

            {/* Sidebar form for booking reservations */}
            <aside className="glass-card p-6 rounded-xl border border-ice-border space-y-6">
              <div>
                <h3 className="text-sm font-bold text-premium-white font-mono uppercase">Create Reservation</h3>
                <p className="text-[10px] text-muted-steel mt-1">Book a new guest table session directly in B2B scheduling telemetry.</p>
              </div>

              <form onSubmit={handleCreateReservation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="e.g. Julian Vanderbilt"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#E5C158] transition-all placeholder:text-muted-steel/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Guests Count</label>
                  <input
                    type="number"
                    required
                    value={newGuestsCount}
                    onChange={(e) => setNewGuestsCount(e.target.value)}
                    min="1"
                    max="12"
                    className="w-full bg-white/5 border border-ice-border rounded-xl px-4 py-2 text-xs text-premium-white focus:outline-none focus:border-[#E5C158] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Dining Date</label>
                  <select
                    value={newResDate}
                    onChange={(e) => setNewResDate(e.target.value as any)}
                    className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#E5C158] transition-all"
                  >
                    <option value="TONIGHT">Tonight</option>
                    <option value="TOMORROW">Tomorrow</option>
                    <option value="TUESDAY">Tuesday</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">Hour Window</label>
                  <select
                    value={newResHour}
                    onChange={(e) => setNewResHour(e.target.value as any)}
                    className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#E5C158] transition-all"
                  >
                    <option value="18:00">18:00 (Dinner Start)</option>
                    <option value="20:30">20:30 (Prime Hour)</option>
                    <option value="22:00">22:00 (Late Seating)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E5C158] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm font-bold">calendar_today</span>
                  SCHEDULE BOOKING
                </button>
              </form>
            </aside>
          </section>
        )}
      </main>
    </div>
  );

  function handleOrderStatus(id: string, status: LiveOrder['status']) {
    updateOrderStatus(id, status);
  }
}
