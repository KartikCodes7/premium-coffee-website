'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';

export default function RoleSwitcher() {
  const session = useStore((state) => state.session);
  const switchRole = useStore((state) => state.switchRole);
  const switchLocation = useStore((state) => state.switchLocation);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRoleChange = (role: 'Owner' | 'Chef' | 'Guest') => {
    switchRole(role);
    setIsOpen(false);
    
    // Dynamic redirect depending on role when switching
    if (role === 'Owner' || role === 'Chef') {
      if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/analytics')) {
        router.push('/dashboard');
      }
    } else {
      if (pathname.startsWith('/dashboard') || pathname.startsWith('/analytics')) {
        router.push('/chatbot');
      }
    }
  };

  const handleLocationChange = (loc: string) => {
    switchLocation(loc);
    setIsOpen(false);
    // Reload path to simulate data reset
    router.refresh();
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9998]">
      <div className="relative">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-card p-3 rounded-full flex items-center gap-2 shadow-2xl hover:border-[#C58A46]/50 transition-colors spring-interaction"
        >
          <span className="material-symbols-outlined text-[#C58A46] animate-pulse">tune</span>
          <span className="text-xs font-semibold text-premium-white pr-2">
            {session.role} Console
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Click-out overlay */}
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
            
            <div className="absolute bottom-full left-0 mb-3 bg-[#15100C] border border-ice-border rounded-xl p-3 shadow-2xl w-56 flex flex-col gap-1 z-[9999]">
              <h3 className="text-[9px] font-mono tracking-widest text-[#8E939E] uppercase px-2 mb-2">
                Simulate Operations Role
              </h3>
              
              <button
                onClick={() => handleRoleChange('Owner')}
                className={`text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                  session.role === 'Owner'
                    ? 'bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20'
                    : 'text-[#8E939E]'
                }`}
              >
                <span>Owner/HQ Overview</span>
                <span className="material-symbols-outlined text-xs">monitoring</span>
              </button>
              
              <button
                onClick={() => handleRoleChange('Chef')}
                className={`text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                  session.role === 'Chef'
                    ? 'bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20'
                    : 'text-[#8E939E]'
                }`}
              >
                <span>Kitchen Chef View</span>
                <span className="material-symbols-outlined text-xs">restaurant_menu</span>
              </button>

              <button
                onClick={() => handleRoleChange('Guest')}
                className={`text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                  session.role === 'Guest'
                    ? 'bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20'
                    : 'text-[#8E939E]'
                }`}
              >
                <span>Customer Guest Flow</span>
                <span className="material-symbols-outlined text-xs">local_dining</span>
              </button>

              <h3 className="text-[9px] font-mono tracking-widest text-[#8E939E] uppercase px-2 mt-3 mb-2">
                Multi-Tenant Store Location
              </h3>

              <button
                onClick={() => handleLocationChange('Aura London')}
                className={`text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between hover:bg-white/5 text-[#8E939E] ${
                  session.restaurant.includes('London') ? 'text-[#C58A46]' : ''
                }`}
              >
                <span>Aura Gastronomy (London)</span>
              </button>

              <button
                onClick={() => handleLocationChange('Aura Tokyo')}
                className={`text-left px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between hover:bg-white/5 text-[#8E939E] ${
                  session.restaurant.includes('Tokyo') ? 'text-[#C58A46]' : ''
                }`}
              >
                <span>Aura Sushi (Tokyo)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
