'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const session = useStore((state) => state.session);

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: 'monitoring' },
    { id: 'menu', label: 'Menu Management', icon: 'restaurant_menu' },
    { id: 'reservations', label: 'Reservations', icon: 'calendar_today' },
  ];

  return (
    <aside
      className={`bg-[#15100C]/90 border-r border-ice-border flex flex-col justify-between transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="p-4 space-y-8">
        
        {/* Toggle Collapse */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span className="font-mono text-[9px] text-[#8E939E] uppercase tracking-widest">
              Operations Node
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[#8E939E] hover:text-premium-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm font-bold">
              {collapsed ? 'first_page' : 'last_page'}
            </span>
          </button>
        </div>

        {/* Menu Buttons */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C58A46]/10 text-[#C58A46] border-[#C58A46]/20 font-bold'
                    : 'bg-transparent border-transparent text-[#8E939E] hover:text-premium-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-base shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile/Role Details at Bottom */}
      <div className="p-4 border-t border-ice-border bg-[#0C0705]/30 space-y-4">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full border border-ice-border overflow-hidden bg-glass-fill flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#8E939E] text-lg">account_circle</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-bold text-premium-white truncate leading-tight">
                {session.user}
              </p>
              <p className="text-[9px] font-mono tracking-widest text-[#C58A46] uppercase truncate leading-none mt-1">
                {session.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
