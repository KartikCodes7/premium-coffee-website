'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Homepage() {
  const router = useRouter();
  const orders = useStore((state) => state.orders);
  const addToCart = useStore((state) => state.addToCart);
  const addNotification = useStore((state) => state.addNotification);

  // Form states
  const [bookingDate, setBookingDate] = useState<'TONIGHT' | 'TOMORROW' | 'TUESDAY'>('TONIGHT');
  const [bookingHour, setBookingHour] = useState<'18:00' | '20:30' | '22:00'>('20:30');
  
  // Testimonials state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const signatureDishes = [
    {
      id: 'seared-scallops',
      name: 'Seared Scallops',
      price: 38.00,
      image: '/assets/chatbot_scallops.png',
      rating: '4.9',
      description: 'Hokkaido scallops with pea purée, crispy pancetta, and citrus emulsion.'
    },
    {
      id: 'wagyu-steak',
      name: 'Signature Wagyu',
      price: 124.00,
      image: '/assets/chatbot_steak.png',
      rating: '5.0',
      description: 'Grade A5 Kobe beef, butter-poached with smoked marrow jus and truffle mash.'
    },
    {
      id: 'napa-cabernet',
      name: 'Napa Valley Cabernet 2018',
      price: 95.00,
      image: '/assets/order_gin.png',
      rating: '4.8',
      description: 'Robust dark fruit profile, velvet tannins, pairing beautifully with dry-aged steak.'
    }
  ];

  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Owner, Aura Hospitality London',
      text: 'Migrating our table logistics to RestaurantOS reduced kitchen pacing delays by 42%. The AI sommelier recommendations have driven wine ticket sales up by 38% since launch.',
      avatar: '/assets/avatar_manager.png'
    },
    {
      name: 'Marcus Kensington',
      role: 'Chef de Cuisine, Grand Bistro',
      text: 'Zero ticket mistakes, unified staff telemetry, and real-time dashboard queues. It feels like our kitchen is finally running on a modern B2B operating system.',
      avatar: '/assets/avatar_user.png'
    }
  ];

  const handleBuy = (dish: typeof signatureDishes[0]) => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      options: { note: 'Lander special order' }
    });
  };

  const handleBookTable = () => {
    addNotification(`New reservation booked under Elena (4 guests) ${bookingDate.toLowerCase()} at ${bookingHour}`, 'success');
    router.push('/chatbot');
  };

  const activeOrders = orders.slice(0, 3);

  return (
    <main className="pt-nav-height flex-1 bg-canvas-charcoal relative overflow-hidden">
      
      {/* Background Cinematic blurred blobs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#E5C158]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-2/3 -right-32 w-[600px] h-[600px] bg-[#ffe08b]/5 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-[calc(100vh-nav-height)] flex items-center px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          
          {/* Hero Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center px-3.5 py-1.5 glass-card rounded-full gap-2 border border-ice-border">
              <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse"></span>
              <span className="font-mono text-[9px] text-[#E5C158] uppercase tracking-widest">
                v2.8 AI Neural Concierge Online
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-premium-white leading-tight tracking-tight">
              The AI Operating System for{' '}
              <span className="bg-gradient-to-r from-[#E5C158] to-premium-white bg-clip-text text-transparent">
                Premium Gastronomy
              </span>
              .
            </h1>
            
            <p className="text-base md:text-lg text-muted-steel max-w-xl leading-relaxed">
              Automate Michelin-star dining room queues, real-time sommelier pairings, and multi-tenant telemetry inside a unified B2B environment.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/signup"
                className="bg-[#E5C158] text-canvas-charcoal font-bold px-8 py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#E5C158]/20 flex items-center gap-2 spring-interaction text-sm"
              >
                Launch Restaurant Sandbox
                <span className="material-symbols-outlined font-bold text-sm">arrow_forward</span>
              </Link>
              <Link
                href="/chatbot"
                className="glass-card text-premium-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-[#E5C158]/50 transition-all text-sm border border-ice-border spring-interaction"
              >
                Consult Sommelier Assistant
              </Link>
            </div>
          </motion.div>

          {/* Hero Right Column: simulated queue feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="floating-element glass-card rounded-2xl p-6 border border-ice-border shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-premium-white flex items-center gap-2">
                  HQ Live Operations stream
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E5C158] animate-ping"></span>
                </h3>
                <span className="material-symbols-outlined text-[#E5C158]">sensors</span>
              </div>

              {/* simulated tickets queue */}
              <div className="space-y-4">
                {activeOrders.map((o, idx) => {
                  let badgeClass = 'bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20';
                  if (o.status === 'Served') {
                    badgeClass = 'bg-green-500/10 text-green-400 border border-green-500/20';
                  }

                  return (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3.5 glass-card rounded-xl border border-ice-border relative overflow-hidden transition-all hover:border-[#E5C158]/20"
                    >
                      {idx === 0 && <div className="shimmer absolute inset-0 opacity-10"></div>}
                      <div className="flex gap-4 items-center min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#E5C158]/10 flex items-center justify-center text-[#E5C158] font-bold font-mono text-xs shrink-0">
                          {o.id.substring(4)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-premium-white truncate">{o.name}</p>
                          <p className="text-[10px] text-muted-steel truncate max-w-[180px]">{o.items}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeClass} shrink-0`}>
                        {o.status}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-ice-border flex justify-between items-center text-xs font-mono">
                <span className="text-muted-steel">
                  Avg. Pacing: <span className="text-[#E5C158] font-bold">18.4m</span>
                </span>
                <Link href="/dashboard" className="text-[#E5C158] hover:underline flex items-center gap-1">
                  Full Operations console
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-[#E5C158]/10 blur-[120px] rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-ice-border bg-white/2">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-extrabold text-[#E5C158] font-mono">18.4m</h4>
            <p className="text-[10px] font-mono text-muted-steel uppercase tracking-wider">Average Kitchen Pacing</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-extrabold text-premium-white font-mono">99.98%</h4>
            <p className="text-[10px] font-mono text-muted-steel uppercase tracking-wider">Operations Telemetry Uptime</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-extrabold text-[#E5C158] font-mono">+38%</h4>
            <p className="text-[10px] font-mono text-muted-steel uppercase tracking-wider">Beverage Upsell Velocity</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-extrabold text-premium-white font-mono">2.4M</h4>
            <p className="text-[10px] font-mono text-muted-steel uppercase tracking-wider">Orders Autonomously Paced</p>
          </div>
        </div>
      </section>

      {/* B2B Modules Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase">
            Engineered for Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-premium-white tracking-tight">
            Enterprise Infrastructure Modules
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Module 1 */}
          <div className="glass-card p-8 md:p-10 rounded-2xl group hover:border-[#E5C158]/35 transition-all duration-500 space-y-6">
            <div className="w-14 h-14 bg-[#E5C158]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[#E5C158] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
            </div>
            <h3 className="text-xl font-bold text-premium-white tracking-tight">Sommelier & Concierge AI</h3>
            <p className="text-sm text-muted-steel leading-relaxed">
              Elevate every guest experience with hyper-personalized sommelier recommendations and diet-aware modifications. Upsell matching vintages dynamically at the optimal checkout window.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-3 py-1 bg-white/5 border border-ice-border rounded-full text-[#E5C158]">
                Sommelier DNA
              </span>
              <span className="px-3 py-1 bg-white/5 border border-ice-border rounded-full text-[#E5C158]">
                Direct Table Cart Sync
              </span>
            </div>
          </div>

          {/* Module 2 */}
          <div className="glass-card p-8 md:p-10 rounded-2xl group hover:border-[#E5C158]/35 transition-all duration-500 space-y-6">
            <div className="w-14 h-14 bg-[#E5C158]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-[#E5C158] text-2xl">chat_bubble</span>
            </div>
            <h3 className="text-xl font-bold text-premium-white tracking-tight font-sans">
              Operations Telemetry Terminal
            </h3>
            <p className="text-sm text-muted-steel leading-relaxed">
              Frictionless queue pacing. Synchronize cart entries and checkout authorizations directly to kitchen duty commander displays. Zero delay, absolute precision.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-3 py-1 bg-white/5 border border-ice-border rounded-full text-[#E5C158]">
                Reactive State
              </span>
              <span className="px-3 py-1 bg-white/5 border border-ice-border rounded-full text-[#E5C158]">
                B2B Role Simulation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes Showcase */}
      <section className="py-24 bg-gradient-to-b from-[#12141C] to-canvas-charcoal border-y border-ice-border">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase">
                Selected Experiences
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-premium-white tracking-tight mt-1">
                Curated Gastronomic Signature Dishes
              </h2>
            </div>
            <Link
              href="/chatbot"
              className="glass-card px-5 py-3 rounded-lg text-xs font-bold text-[#E5C158] border border-ice-border hover:border-[#E5C158]/50 transition-all spring-interaction"
            >
              Consult AI Sommelier
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDishes.map((dish) => (
              <div
                key={dish.id}
                className="glass-card rounded-2xl overflow-hidden group border border-ice-border hover:border-[#E5C158]/35 transition-all"
              >
                <div className="h-56 overflow-hidden relative">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-premium-white">{dish.name}</h3>
                    <div className="flex items-center gap-1 text-[#E5C158] font-mono text-xs">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-steel line-clamp-2">{dish.description}</p>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-mono text-sm text-[#E5C158] font-bold">
                      ${dish.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleBuy(dish)}
                      className="bg-white/5 border border-ice-border hover:border-[#E5C158]/50 text-premium-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 spring-interaction"
                    >
                      <span>Buy</span>
                      <span className="material-symbols-outlined text-xs font-bold">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-[960px] mx-auto text-center space-y-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase">
            Painless Planning
          </span>
          <h2 className="text-3xl font-extrabold text-premium-white tracking-tight">
            Secure Guest Attendance
          </h2>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-2xl border border-ice-border text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider mb-2">
                  Dining Date
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {(['TONIGHT', 'TOMORROW', 'TUESDAY'] as const).map((date) => (
                    <button
                      key={date}
                      onClick={() => setBookingDate(date)}
                      className={`py-2 rounded-lg border transition-all ${
                        bookingDate === date
                          ? 'bg-[#E5C158]/10 text-[#E5C158] border-[#E5C158]/35 font-bold'
                          : 'bg-white/5 border-ice-border hover:border-premium-white text-premium-white'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider mb-2">
                  Preferred Window Hour
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {(['18:00', '20:30', '22:00'] as const).map((hour) => (
                    <button
                      key={hour}
                      onClick={() => setBookingHour(hour)}
                      className={`py-2 rounded-lg border transition-all ${
                        bookingHour === hour
                          ? 'bg-[#E5C158]/10 text-[#E5C158] border-[#E5C158]/35 font-bold'
                          : 'bg-white/5 border-ice-border hover:border-premium-white text-premium-white'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleBookTable}
              className="w-full py-4 rounded-xl bg-[#E5C158] text-canvas-charcoal font-display-lg text-xs font-extrabold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 spring-interaction"
            >
              <span>CONFIRM INTELLIGENT RESERVATION</span>
              <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
            </button>
          </div>

          <div className="bg-white/5 rounded-xl border border-ice-border p-5 space-y-4 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-premium-white">Window Booth Selection</h4>
            <p className="text-xs text-muted-steel">
              AI Sommelier Concierge will lock in a prime glassmorphic window booth matching this telemetry configuration.
            </p>
            <div className="h-28 rounded-lg overflow-hidden border border-ice-border relative">
              <Image
                src="/assets/login_bg.png"
                alt="Window Booth View"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-[10px] font-mono bg-[#E5C158]/90 text-canvas-charcoal px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  Booth 4 Selected
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slide Module */}
      <section className="py-24 border-t border-ice-border bg-white/1">
        <div className="max-w-[800px] mx-auto px-margin-mobile text-center space-y-8">
          <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase">Success Telemetry Stories</span>
          
          <div className="relative h-48 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <p className="text-base md:text-xl font-medium text-premium-white leading-relaxed italic">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E5C158]/30">
                    <Image
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left text-xs">
                    <h5 className="font-bold text-premium-white">{testimonials[activeTestimonial].name}</h5>
                    <p className="text-muted-steel font-mono text-[9px] uppercase tracking-wider">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeTestimonial === idx ? 'bg-[#E5C158] w-6' : 'bg-white/15 hover:bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Premium SaaS Subscription Pricing Preview */}
      <section className="py-24 border-t border-ice-border bg-gradient-to-b from-canvas-charcoal to-[#12141C]">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#E5C158] uppercase">Premium Subscriptions</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-premium-white tracking-tight">Calibrated SaaS Operational Tiers</h2>
            <p className="text-sm text-muted-steel">Select the deployment node scale that matches your hospitality footprint.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-[1100px] mx-auto">
            {/* Tier 1 */}
            <div className="glass-card rounded-2xl p-8 border border-ice-border space-y-6 flex flex-col justify-between hover:border-premium-white/10 transition-all">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-[#8E939E] uppercase tracking-widest">Bistro Node</span>
                <h3 className="text-2xl font-bold text-premium-white">Bistro Starter</h3>
                <p className="text-xs text-muted-steel">Ideal for independent fine dining boutiques starting order automations.</p>
                <div className="pt-4 font-mono">
                  <span className="text-3xl font-extrabold text-[#E5C158]">$99</span>
                  <span className="text-xs text-muted-steel"> / month</span>
                </div>
                <div className="border-t border-ice-border pt-6 space-y-3 text-xs text-muted-steel">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>1 Active Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>AI Sommelier Concierge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>Ops Telemetry Console</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="block w-full text-center py-3 bg-white/5 border border-ice-border text-premium-white font-bold text-xs rounded-xl hover:bg-white/10 transition-all">
                Access Sandbox
              </Link>
            </div>

            {/* Tier 2 - Recommended */}
            <div className="glass-card rounded-2xl p-8 border border-[#E5C158] space-y-6 flex flex-col justify-between relative bg-[#E5C158]/3 shadow-2xl hover:brightness-105 transition-all">
              <span className="absolute -top-3 right-6 bg-[#E5C158] text-canvas-charcoal text-[9px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                RECOMMENDED
              </span>
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-[#E5C158] uppercase tracking-widest">Elite Node</span>
                <h3 className="text-2xl font-bold text-premium-white">Elite Diner</h3>
                <p className="text-xs text-muted-steel">Curated for high-density luxury brands requiring unlimited telemetry metrics.</p>
                <div className="pt-4 font-mono">
                  <span className="text-3xl font-extrabold text-[#E5C158]">$249</span>
                  <span className="text-xs text-muted-steel"> / month</span>
                </div>
                <div className="border-t border-ice-border pt-6 space-y-3 text-xs text-muted-steel">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span className="text-premium-white font-semibold">3 Active Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>Hyper-personalized LLM Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>Advanced Retention cohort Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>Role-Based Protected Access</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="block w-full text-center py-3 bg-[#E5C158] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all spring-interaction">
                Deploy Elite Cluster
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="glass-card rounded-2xl p-8 border border-ice-border space-y-6 flex flex-col justify-between hover:border-premium-white/10 transition-all">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-[#8E939E] uppercase tracking-widest">Enterprise Cluster</span>
                <h3 className="text-2xl font-bold text-premium-white">Enterprise OS</h3>
                <p className="text-xs text-muted-steel">Fully custom dedicated clusters for international restaurant groups.</p>
                <div className="pt-4 font-mono">
                  <span className="text-3xl font-extrabold text-[#E5C158]">Custom</span>
                </div>
                <div className="border-t border-ice-border pt-6 space-y-3 text-xs text-muted-steel">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>Unlimited Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>Dedicated cluster & SLA Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E5C158] text-sm">check</span>
                    <span>OpenAI API Dedicated Fine-Tuning</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="block w-full text-center py-3 bg-white/5 border border-ice-border text-premium-white font-bold text-xs rounded-xl hover:bg-white/10 transition-all">
                Contact HQ Architect
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-canvas-charcoal border-t border-ice-border">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-premium-white">RestaurantOS</span>
            <span className="text-[10px] font-mono text-muted-steel uppercase tracking-widest leading-none">
              Enterprise Precision for the Modern Table
            </span>
          </div>
          
          <div className="flex gap-8 text-[11px] text-[#8E939E] font-mono">
            <Link className="hover:text-[#E5C158] transition-colors" href="/login">
              HQ Admin
            </Link>
            <Link className="hover:text-[#E5C158] transition-colors" href="/chatbot">
              Concierge Sommelier
            </Link>
            <Link className="hover:text-[#E5C158] transition-colors" href="/order">
              Guest Checkout
            </Link>
            <Link className="hover:text-[#E5C158] transition-colors" href="/analytics">
              Analytics Hub
            </Link>
          </div>

          <p className="text-[9px] text-muted-steel/60">© 2026 RestaurantOS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
