'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MenuSquare, Calendar, BarChart3, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const session = useStore((state) => state.session);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'menu', label: 'Menu', icon: MenuSquare },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
  ];

  const externalLinks = [
    { href: '/analytics', label: 'Analytics Hub', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex bg-[#15100C]/90 border-r border-ice-border flex-col justify-between z-40"
      >
        {/* Top Section */}
        <div className="p-4 space-y-8">
          {/* Toggle Collapse */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[9px] text-[#8E939E] uppercase tracking-widest"
                >
                  Operations Node
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-[#8E939E] hover:text-premium-white transition-colors"
            >
              {collapsed ? (
                <ChevronLeft size={18} className="font-bold" />
              ) : (
                <ChevronRight size={18} className="font-bold" />
              )}
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
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-[#C58A46]/10 text-[#C58A46] border-[#C58A46]/20 font-bold'
                      : 'bg-transparent border-transparent text-[#8E939E] hover:text-premium-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-glow"
                      className="absolute inset-0 rounded-xl bg-[#C58A46]/10 border border-[#C58A46]/20"
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    />
                  )}
                  <item.icon size={20} className="lucide-icon shrink-0 relative z-10" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                              className="truncate relative z-10 sidebar-label"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Divider */}
            <div className="border-t border-ice-border/50 my-2"></div>

            {/* External Links */}
            {externalLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-transparent text-sm font-semibold text-[#8E939E] hover:text-premium-white hover:bg-white/5 transition-all"
              >
                <link.icon size={20} className="lucide-icon shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile/Role Details at Bottom */}
        <div className="p-4 border-t border-ice-border bg-[#0C0705]/30 space-y-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full border border-ice-border overflow-hidden bg-glass-fill flex items-center justify-center shrink-0">
              <UserCircle size={24} className="text-[#8E939E]" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="min-w-0"
                >
                  <p className="text-xs font-bold text-premium-white truncate leading-tight">
                    {session.user}
                  </p>
                  <p className="text-[9px] font-mono tracking-widest text-[#C58A46] uppercase truncate leading-none mt-1">
                    {session.role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#15100C]/95 backdrop-blur-xl border-t border-ice-border">
        <nav className="flex items-center justify-around py-2">
            {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  isActive ? 'text-[#C58A46]' : 'text-[#8E939E]'
                }`}
              >
                <item.icon size={24} className="lucide-icon" />
                <span className="text-[8px] font-mono uppercase tracking-wider">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
          <Link
            href="/analytics"
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[#8E939E] transition-all"
          >
            <BarChart3 size={24} className="lucide-icon" />
            <span className="text-[8px] font-mono uppercase tracking-wider">Analytics</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

