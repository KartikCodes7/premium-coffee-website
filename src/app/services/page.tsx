'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Coffee, ConciergeBell, Compass, HelpCircle, MessageSquare } from 'lucide-react';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

export default function ServicesPage() {
  const router = useRouter();
  const { playSound } = useSoundFeedback();
  const locationId = useStore((state) => state.locationId);
  const locationType = useStore((state) => state.locationType);
  const setLocation = useStore((state) => state.setLocation);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const services = [
    {
      id: 'Restaurant',
      title: 'Food Ordering',
      description: 'Food & Beverages',
      details: 'Gourmet plates, signature cuisines, and custom-paced culinary creations.',
      icon: UtensilsCrossed,
      color: '#C58A46',
      badge: 'Bistro & Lounge',
      route: '/menu',
    },
    {
      id: 'Café',
      title: 'Coffee & Bakery',
      description: 'Artisanal craft coffee & fresh pastries',
      details: 'Double-ristretto extractions, single-origin brews, and fresh multi-layered croissants.',
      icon: Coffee,
      color: '#E7C39A',
      badge: 'Craft Coffee Bar',
      route: '/menu',
    },
    {
      id: 'Hotel',
      title: 'Guest Services',
      description: 'Suite services and room assistances',
      details: 'Connect with our smart AI concierge to manage hotel amenities, requests, and room support.',
      icon: ConciergeBell,
      color: '#A3B899',
      badge: 'Smart Concierge',
      route: '/chatbot',
    },
  ];

  const handleSelectService = (type: 'Restaurant' | 'Café' | 'Hotel', route: string) => {
    playSound('chime');
    setLocation(type, locationId);
    router.push(route);
  };

  return (
    <main className="min-h-screen bg-canvas-charcoal text-premium-white pt-24 pb-16 px-margin-mobile md:px-margin-desktop relative overflow-hidden flex flex-col justify-center">
      {/* Background blurring atmosphere */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#C58A46]/6 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#E7C39A]/6 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full space-y-12 z-10">
        {/* Hub Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-ice-border font-mono text-[9px] text-[#C58A46] tracking-widest uppercase">
            <Compass size={12} className="animate-spin-slow" />
            HospitalityOS Service Selection Hub
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-premium-white">
            How can we serve you?
          </h1>
          {locationId && (
            <p className="text-xs text-[#E7C39A] font-mono">
              Serving Terminal Connection: <span className="font-bold border-b border-[#E7C39A]/30 pb-0.5">{locationId}</span>
            </p>
          )}
        </div>

        {/* 3-Sector Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv, index) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleSelectService(srv.id as any, srv.route)}
                className="glass-card rounded-2xl p-6 border border-ice-border hover:border-[#C58A46]/45 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-6 group hover:translate-y-[-4px] relative overflow-hidden active:scale-[0.98]"
              >
                {/* Accent glow on card hover */}
                <div
                  className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[32px] opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: srv.color }}
                />

                <div className="space-y-4">
                  {/* Badge & Icon Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono tracking-widest text-muted-steel uppercase">
                      {srv.badge}
                    </span>
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${srv.color}15`, color: srv.color }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  {/* Title & tag */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-premium-white group-hover:text-[#E7C39A] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#C58A46] font-medium tracking-wide uppercase">
                      {srv.description}
                    </p>
                  </div>

                  {/* Description details */}
                  <p className="text-xs text-muted-steel leading-relaxed font-sans">
                    {srv.details}
                  </p>
                </div>

                {/* Bottom interactive indicator */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-muted-steel group-hover:text-premium-white transition-colors">
                  <span>ENTER SECTOR</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="text-[#C58A46] font-bold text-xs"
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Help footer */}
        <div className="text-center">
          <button
            onClick={() => router.push('/chatbot')}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-steel hover:text-[#C58A46] transition-colors border border-white/5 bg-white/2 px-4 py-2 rounded-full"
          >
            <HelpCircle size={14} />
            Need assistance choosing? Ask our AI Assistant
          </button>
        </div>
      </div>
    </main>
  );
}
