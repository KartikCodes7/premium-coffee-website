'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Download, TrendingUp, BrainCircuit, MoreHorizontal } from 'lucide-react';

export default function AnalyticsPage() {
  const orders = useStore((state) => state.orders);
  const addNotification = useStore((state) => state.addNotification);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate dynamic sales figures from Zustand orders queue
  let baseRevenue = 142850.00;
  let baseOrdersCount = 2450;

  orders.forEach((o) => {
    baseRevenue += o.total;
    baseOrdersCount += 1;
  });

  const handleExportCsv = () => {
    addNotification('Telemetry report exported successfully.', 'success');
  };

  // Mock transactions history combined with live orders
  const historicalTransactions = [
    { id: '#ROS-9241', time: 'Today, 09:15', name: 'Julianne Moore', items: 'Silk Flat White (2x), Almond Croissant (1x)', total: 17.20, status: 'Served' },
    { id: '#ROS-9238', time: 'Today, 08:40', name: 'Theodore Vane', items: 'Nitro Cold Brew (1x), Atelier Cinnamon Roll (1x)', total: 12.10, status: 'Served' }
  ];

  const liveTransactions = orders.map((o) => ({
    id: o.id,
    time: `Today, ${o.time}`,
    name: o.name,
    items: o.items,
    total: o.total,
    status: o.status
  }));

  const allTransactions = [...liveTransactions, ...historicalTransactions];

  return (
    <main className="pt-[nav-height] max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-10 flex-1 relative">
      
      {/* Header section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-premium-white">Analytics Hub</h1>
          <p className="text-xs font-mono text-muted-steel mt-1 uppercase tracking-widest leading-none">
            Real-time SaaS Telemetry & Cohort Matrix
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass-card flex items-center px-4 py-2.5 rounded-lg gap-3 border border-ice-border cursor-pointer hover:bg-glass-fill transition-all text-xs">
            <Calendar className="text-sm text-[#C58A46]" size={18} />
            <span className="font-mono text-premium-white">Last 30 Days</span>
            <ChevronDown className="text-sm text-premium-white" size={18} />
          </div>
          <button
            onClick={handleExportCsv}
            className="bg-[#C58A46] text-canvas-charcoal px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg spring-interaction"
          >
            <Download className="text-sm font-bold" size={18} />
            Export CSV
          </button>
        </div>
      </header>

      {/* Sparkline Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gross Revenue */}
        <motion.div
          className="glass-card p-6 rounded-xl flex flex-col gap-4 border border-ice-border hover:border-[#C58A46]/30 transition-all spring-interaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 * 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[#8E939E] font-mono text-[10px] uppercase tracking-widest block">Gross Revenue</span>
            <span className="text-green-400 font-mono text-xs flex items-center gap-1">
              +14.2% <TrendingUp className="text-sm" size={18} />
            </span>
          </div>
          <div className="font-mono text-3xl text-[#C58A46] font-bold">
            ${baseRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="h-10 w-full mt-1">
            <svg className="w-full h-full stroke-[#C58A46] fill-none stroke-[2] opacity-80" viewBox="0 0 100 30">
              <path d="M0,25 Q10,20 20,22 T40,15 T60,18 T80,10 T100,5"></path>
            </svg>
          </div>
        </motion.div>

        {/* Shift Orders */}
        <motion.div
          className="glass-card p-6 rounded-xl flex flex-col gap-4 border border-ice-border hover:border-[#C58A46]/30 transition-all spring-interaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 * 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[#8E939E] font-mono text-[10px] uppercase tracking-widest block">Shift Orders</span>
            <span className="text-green-400 font-mono text-xs flex items-center gap-1">
              +8.5% <TrendingUp className="text-sm" size={18} />
            </span>
          </div>
          <div className="font-mono text-3xl text-premium-white font-bold">{baseOrdersCount.toLocaleString()}</div>
          <div className="h-10 w-full mt-1">
            <svg className="w-full h-full stroke-[#C58A46] fill-none stroke-[2] opacity-80" viewBox="0 0 100 30">
              <path d="M0,28 L20,20 L40,25 L60,10 L80,15 L100,5"></path>
            </svg>
          </div>
        </motion.div>

        {/* Average Order Value */}
        <motion.div
          className="glass-card p-6 rounded-xl flex flex-col gap-4 border border-ice-border hover:border-[#C58A46]/30 transition-all spring-interaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 * 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[#8E939E] font-mono text-[10px] uppercase tracking-widest block">Avg Order Value</span>
            <span className="text-green-400 font-mono text-xs flex items-center gap-1">
              +3.2% <TrendingUp className="text-sm" size={18} />
            </span>
          </div>
          <div className="font-mono text-3xl text-premium-white font-bold">$12.50</div>
          <div className="h-10 w-full mt-1">
            <svg className="w-full h-full stroke-[#C58A46] fill-none stroke-[2] opacity-80" viewBox="0 0 100 30">
              <path d="M0,20 C10,18 20,22 30,15 C40,8 50,12 60,15 C70,18 80,10 100,8"></path>
            </svg>
          </div>
        </motion.div>

        {/* Returning Cohorts */}
        <motion.div
          className="glass-card p-6 rounded-xl flex flex-col gap-4 border border-ice-border hover:border-[#C58A46]/30 transition-all spring-interaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 * 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[#8E939E] font-mono text-[10px] uppercase tracking-widest block">Returning Cohorts</span>
            <span className="text-green-400 font-mono text-xs flex items-center gap-1">
              +12.0% <TrendingUp className="text-sm" size={18} />
            </span>
          </div>
          <div className="font-mono text-3xl text-premium-white font-bold">68%</div>
          <div className="h-10 w-full mt-1">
            <svg className="w-full h-full stroke-[#C58A46] fill-none stroke-[2] opacity-80" viewBox="0 0 100 30">
              <path d="M0,25 L30,22 L50,15 L70,18 L100,5"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Advanced Telemetry Section: SVG Area Forecast Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Busiest Dining Seating Hours Chart */}
        <div className="glass-card p-6 md:p-8 rounded-xl lg:col-span-2 space-y-6 border border-ice-border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-premium-white">Busiest Seating Cycles</h2>
              <p className="text-xs text-[#8E939E]">Real-time café traffic flow and barista queue demand.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#C58A46] rounded"></span>
                <span className="text-premium-white">Current (Live)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 border border-[#C58A46] border-dashed rounded"></span>
                <span className="text-muted-steel">AI Forecast</span>
              </div>
            </div>
          </div>

          {/* SVG Canvas Area Chart */}
          <div className="h-56 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C58A46" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C58A46" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <path d="M0,130 Q50,110 100,120 T200,80 T300,50 T400,90 T500,60 L500,150 L0,150 Z" fill="url(#glowGrad)"></path>
              {/* Current Line */}
              <path d="M0,130 Q50,110 100,120 T200,80 T300,50 T400,90 T500,60" fill="none" stroke="#C58A46" strokeWidth="2.5" strokeLinecap="round"></path>
              {/* Forecast Line */}
              <path d="M0,135 Q50,105 100,115 T200,75 T300,45 T400,80 T500,50" fill="none" stroke="#C58A46" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6"></path>
            </svg>
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 font-mono text-[9px] text-[#8E939E] uppercase tracking-wider pt-2 border-t border-ice-border/30">
              <span>06:00</span>
              <span>09:00</span>
              <span>12:00 (Peak)</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>
        </div>

        {/* AI Operations Forecast Report card */}
        <div className="glass-card p-6 md:p-8 rounded-xl space-y-6 border border-ice-border bg-gradient-to-br from-[#C58A46]/3 to-transparent">
          <h3 className="text-xs font-bold text-[#C58A46] font-mono flex items-center gap-2 leading-none uppercase">
            <BrainCircuit className="text-base" size={20} />
            AI Analytics Report
          </h3>
          <div className="space-y-4 text-xs text-muted-steel leading-relaxed">
            <p>
              <strong>Demand Forecasting</strong>: Café traffic is expected to peak at <strong>88%</strong> capacity tomorrow between 08:00 and 10:30 due to high pre-order volume from loyalty cohorts.
            </p>
            <p>
              <strong>Inventory Recommendation</strong>: Premium Oat Milk supply will approach safety threshold by 14:00 if morning rush pacing maintains +14% slope. Suggest activating AI Barista prompts for almond milk alternatives.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-ice-border font-mono text-[10px] uppercase text-[#C58A46]">
              Forecast Accuracy: 94.2%
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Heatmap & Popular dishes progress */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Menu list items visual sold bars */}
        <div className="glass-card p-6 md:p-8 rounded-xl lg:col-span-3 flex flex-col gap-6 border border-ice-border">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-premium-white">Popular Menu Items</h2>
            <MoreHorizontal className="text-[#8E939E] cursor-pointer" size={24} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#8E939E]">
                <span className="text-premium-white font-semibold">Silk Flat White</span>
                <span>842 units sold</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-ice-border">
                <div className="h-full bg-[#C58A46] rounded-full shadow-lg" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#8E939E]">
                <span className="text-premium-white font-semibold">Nitro Cold Brew</span>
                <span>621 units sold</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-ice-border">
                <div className="h-full bg-[#C58A46] rounded-full shadow-lg" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#8E939E]">
                <span className="text-premium-white font-semibold">Almond Croissant</span>
                <span>540 units sold</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-ice-border">
                <div className="h-full bg-[#C58A46] rounded-full shadow-lg" style={{ width: '55%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#8E939E]">
                <span className="text-premium-white font-semibold">Obsidian Iced Mocha</span>
                <span>312 units sold</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-ice-border">
                <div className="h-full bg-[#C58A46] rounded-full shadow-lg" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Cohort Retention Heatmap */}
        <div className="glass-card p-6 md:p-8 rounded-xl lg:col-span-2 flex flex-col gap-6 border border-ice-border">
          <h2 className="text-lg font-bold text-premium-white">Cohort Retention</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-1.5">
              <thead>
                <tr className="font-mono text-[9px] text-[#8E939E] uppercase">
                  <th className="p-1 text-left">Cohort</th>
                  <th className="p-1">W0</th>
                  <th className="p-1">W2</th>
                  <th className="p-1">W4</th>
                  <th className="p-1">W6</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr>
                  <td className="p-2 text-left font-mono text-[9px] uppercase text-[#8E939E]">May 01</td>
                  <td className="p-2 heatmap-90 rounded font-bold">100%</td>
                  <td className="p-2 heatmap-70 rounded font-bold">42%</td>
                  <td className="p-2 heatmap-50 rounded font-bold">28%</td>
                  <td className="p-2 heatmap-30 rounded font-bold">15%</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-mono text-[9px] uppercase text-[#8E939E]">May 08</td>
                  <td className="p-2 heatmap-90 rounded font-bold">100%</td>
                  <td className="p-2 heatmap-70 rounded font-bold">38%</td>
                  <td className="p-2 heatmap-30 rounded font-bold">12%</td>
                  <td className="p-2 heatmap-10 rounded font-bold">8%</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-mono text-[9px] uppercase text-[#8E939E]">May 15</td>
                  <td className="p-2 heatmap-90 rounded font-bold">100%</td>
                  <td className="p-2 heatmap-50 rounded font-bold">24%</td>
                  <td className="p-2 heatmap-10 rounded font-bold">5%</td>
                  <td className="p-2 heatmap-10 rounded font-bold">2%</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-mono text-[9px] uppercase text-[#8E939E]">May 22</td>
                  <td className="p-2 heatmap-90 rounded font-bold">100%</td>
                  <td className="p-2 heatmap-70 rounded font-bold">45%</td>
                  <td className="p-2 heatmap-30 rounded font-bold">18%</td>
                  <td className="p-2 text-white/10 font-bold border border-ice-border">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transaction list table */}
      <section className="glass-card rounded-xl overflow-hidden border border-ice-border">
        <div className="p-6 md:p-8 flex justify-between items-center border-b border-ice-border">
          <h2 className="text-lg font-bold text-premium-white">Recent Transactions Telemetry</h2>
          <button
            onClick={() => addNotification('All transaction histories loaded.', 'info')}
            className="text-xs font-mono text-[#C58A46] hover:underline font-bold uppercase"
          >
            VIEW ALL
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 font-mono text-[10px] text-[#8E939E] uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Ticket ID</th>
                <th className="px-6 py-4">Date / Time</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Culinary Items Placed</th>
                <th className="px-6 py-4">Paid Total</th>
                <th className="px-6 py-4">Ops Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ice-border">
              {allTransactions.map((tx) => {
                let badgeClass = 'bg-green-500/10 text-green-400 border border-green-500/20';
                if (tx.status === 'Preparing') badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                else if (tx.status === 'Pending') badgeClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';

                return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-all duration-150 text-xs">
                    <td className="px-8 py-4 font-mono text-[#C58A46] font-bold">{tx.id}</td>
                    <td className="px-6 py-4 text-[#8E939E]">{tx.time}</td>
                    <td className="px-6 py-4 text-premium-white font-bold">{tx.name}</td>
                    <td className="px-6 py-4 text-[#8E939E] max-w-xs truncate">{tx.items}</td>
                    <td className="px-6 py-4 font-mono text-premium-white font-bold">${tx.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${badgeClass}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
