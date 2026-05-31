'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wifi, BrainCircuit, MessageSquare, Star, ShoppingCart, CheckCircle, Check } from 'lucide-react';

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
      id: 'bistro-steak',
      name: 'Aged Angus Bistro Steak',
      price: 24.50,
      image:
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20pan%20seared%20ribeye%20steak%20on%20dark%20stoneware%20plate%2C%20herb%20butter%20melting%20on%20top%2C%2520rosemary%2520sprig%2C%2520asparagus%2520spears%2C%2520warm%2520cinematic%2520lighting%2C%25208k%2520food%2520photography&image_size=portrait_4_3',
      rating: '4.9',
      description: 'Prime cut flat iron steak, herb compound butter, charred asparagus, micro-greens.'
    },
    {
      id: 'flat-white-silk',
      name: 'Silk Flat White',
      price: 5.90,
      image:
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20flat%20white%20in%20a%20minimalist%20porcelain%20cup%20with%20latte%20art%20rosette%2C%20warm%20amber%20lighting%2C%20cinematic%20shadows%2C%20coffee%20shop%20aesthetic%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
      rating: '4.8',
      description: 'Double ristretto-forward, glossy organic microfoam, natural caramel warmth.'
    },
    {
      id: 'almond-croissant',
      name: 'Almond Croissant',
      price: 5.40,
      image:
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20almond%20croissant%20on%20matte%20stone%20plate%2C%20flaky%20layers%2C%20toasted%20almonds%2C%20warm%20cafe%20lighting%2C%20premium%20bakery%20photography%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
      rating: '4.8',
      description: 'Flaky multi-layered puff pastry, sweet almond frangipane, toasted almond flakes.'
    }
  ];

  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Owner, Aura Grand Bistro & Café London',
      text: 'Migrating our guest ordering stack to HospitalityOS reduced service delays by 42%. AI recommendations lifted add-on dining sales by 38% within the first month.',
      avatar: '/assets/avatar_manager.png'
    },
    {
      name: 'Marcus Kensington',
      role: 'Chef de Cuisine, Grand Bistro',
      text: 'Zero ticket mistakes, unified guest service telemetry, and real-time dashboard queues. It feels like our kitchen and dining operations are finally running on a modern B2B platform.',
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
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#C58A46]/6 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-2/3 -right-32 w-[600px] h-[600px] bg-[#E7C39A]/6 blur-[140px] rounded-full pointer-events-none"></div>

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
              <span className="w-2 h-2 rounded-full bg-[#C58A46] animate-pulse"></span>
              <span className="font-mono text-[9px] text-[#C58A46] uppercase tracking-widest">
                v2.8 AI Guest Concierge Online
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-premium-white leading-tight tracking-tight">
              HospitalityOS
              <span className="block bg-gradient-to-r from-[#C58A46] to-premium-white bg-clip-text text-transparent text-2xl md:text-3xl lg:text-4xl font-semibold mt-4">
                Smart Guest Experience & Operations Platform
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-steel max-w-xl leading-relaxed">
              QR menu + cinematic item modals + AI recommendations — instantly synced to your live operations dashboard and guest request queue.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/qr"
                className="bg-[#C58A46] text-canvas-charcoal font-bold px-8 py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#C58A46]/20 flex items-center gap-2 spring-interaction text-sm"
              >
                Start Guest Order
                <ArrowRight className="font-bold" size={18} />
              </Link>
              <Link
                href="/dashboard"
                className="glass-card text-premium-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-[#C58A46]/50 transition-all text-sm border border-ice-border spring-interaction"
              >
                Open Operations Dashboard
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
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C58A46] animate-ping"></span>
                </h3>
                <Wifi className="text-[#C58A46]" size={24} />
              </div>

              {/* simulated tickets queue */}
              <div className="space-y-4">
                {activeOrders.map((o, idx) => {
                  let badgeClass = 'bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20';
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
                  Full Operations Dashboard
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-[#C58A46]/10 blur-[120px] rounded-full"></div>
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
            <p className="text-[10px] font-mono text-muted-steel uppercase tracking-wider">Guest Upsell Velocity</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-extrabold text-premium-white font-mono">2.4M</h4>
            <p className="text-[10px] font-mono text-muted-steel uppercase tracking-wider">Guest Requests Autonomously Paced</p>
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
              <BrainCircuit className="text-[#E5C158] fill-current" size={32} />
            </div>
            <h3 className="text-xl font-bold text-premium-white tracking-tight">AI Concierge & Guest Upsell Engine</h3>
            <p className="text-sm text-muted-steel leading-relaxed">
              Answer FAQs instantly, recommend combos, and upsell pairings at the perfect moment — without adding staff workload.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-3 py-1 bg-white/5 border border-ice-border rounded-full text-[#E5C158]">
                AI Recommendations
              </span>
              <span className="px-3 py-1 bg-white/5 border border-ice-border rounded-full text-[#E5C158]">
                Direct Table Cart Sync
              </span>
            </div>
          </div>

          {/* Module 2 */}
          <div className="glass-card p-8 md:p-10 rounded-2xl group hover:border-[#E5C158]/35 transition-all duration-500 space-y-6">
            <div className="w-14 h-14 bg-[#E5C158]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="text-[#E5C158]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-premium-white tracking-tight font-sans">
              Operations Dashboard & Telemetry
            </h3>
            <p className="text-sm text-muted-steel leading-relaxed">
              Frictionless service pacing. Synchronize guest requests and checkout authorizations directly to operations dispatch terminals. Zero delay, absolute precision.
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
                Bistro & Café Highlights (Tap to add)
              </h2>
            </div>
            <Link
              href="/chatbot"
              className="glass-card px-5 py-3 rounded-lg text-xs font-bold text-[#E5C158] border border-ice-border hover:border-[#E5C158]/50 transition-all spring-interaction"
            >
              Open AI Concierge
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
                      <Star className="fill-current" size={16} />
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
                      <ShoppingCart className="font-bold" size={16} />
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
            Secure Guest Reservations
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
              <CheckCircle className="font-bold" size={18} />
            </button>
          </div>

          <div className="bg-white/5 rounded-xl border border-ice-border p-5 space-y-4 flex flex-col justify-center">
            <h4 className="text-xs font-bold text-premium-white">Window Booth Selection</h4>
            <p className="text-xs text-muted-steel">
              HospitalityOS will generate a smart ordering session tied to your table or room and route it to the operations dashboard.
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
            <p className="text-sm text-muted-steel">Select the deployment scale that matches your hospitality footprint.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-[1100px] mx-auto">
            {/* Tier 1 */}
            <div className="glass-card rounded-2xl p-8 border border-ice-border space-y-6 flex flex-col justify-between hover:border-premium-white/10 transition-all">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-[#8E939E] uppercase tracking-widest">Starter Plan</span>
                <h3 className="text-2xl font-bold text-premium-white">Starter</h3>
                <p className="text-xs text-muted-steel">Ideal for independent fine dining boutiques and café stores starting guest ordering integrations.</p>
                <div className="pt-4 font-mono">
                  <span className="text-3xl font-extrabold text-[#E5C158]">$99</span>
                  <span className="text-xs text-muted-steel"> / month</span>
                </div>
                <div className="border-t border-ice-border pt-6 space-y-3 text-xs text-muted-steel">
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>1 Active Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>AI Concierge Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>Operations Dashboard Console</span>
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
                <span className="text-[9px] font-mono text-[#E5C158] uppercase tracking-widest">Professional Plan</span>
                <h3 className="text-2xl font-bold text-premium-white">Professional</h3>
                <p className="text-xs text-muted-steel">Curated for high-density restaurant brands and boutique hotels requiring full operational telemetry.</p>
                <div className="pt-4 font-mono">
                  <span className="text-3xl font-extrabold text-[#E5C158]">$249</span>
                  <span className="text-xs text-muted-steel"> / month</span>
                </div>
                <div className="border-t border-ice-border pt-6 space-y-3 text-xs text-muted-steel">
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span className="text-premium-white font-semibold">3 Active Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>Hyper-personalized LLM Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>Advanced Retention & Analytics Hub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>Role-Based Secure Operations Access</span>
                  </div>
                </div>
              </div>
              <Link href="/signup" className="block w-full text-center py-3 bg-[#E5C158] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all spring-interaction">
                Deploy Professional
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="glass-card rounded-2xl p-8 border border-ice-border space-y-6 flex flex-col justify-between hover:border-premium-white/10 transition-all">
              <div className="space-y-4">
                <span className="text-[9px] font-mono text-[#8E939E] uppercase tracking-widest">Enterprise Plan</span>
                <h3 className="text-2xl font-bold text-premium-white">Enterprise</h3>
                <p className="text-xs text-muted-steel">Fully custom dedicated clusters for international restaurant groups and global hotel chains.</p>
                <div className="pt-4 font-mono">
                  <span className="text-3xl font-extrabold text-[#E5C158]">Custom</span>
                </div>
                <div className="border-t border-ice-border pt-6 space-y-3 text-xs text-muted-steel">
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>Unlimited Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
                    <span>Dedicated Cluster & Uptime SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-[#E5C158]" size={18} />
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
            <span className="text-base font-bold text-premium-white">HospitalityOS</span>
            <span className="text-[10px] font-mono text-muted-steel uppercase tracking-widest leading-none">
              Smart Guest Experience & Operations Platform
            </span>
          </div>
          
          <div className="flex gap-8 text-[11px] text-[#8E939E] font-mono">
            <Link className="hover:text-[#E5C158] transition-colors" href="/login">
              Operations Dashboard
            </Link>
            <Link className="hover:text-[#E5C158] transition-colors" href="/chatbot">
              AI Concierge
            </Link>
            <Link className="hover:text-[#E5C158] transition-colors" href="/order">
              Guest Checkout
            </Link>
            <Link className="hover:text-[#E5C158] transition-colors" href="/analytics">
              Analytics Hub
            </Link>
          </div>

          <p className="text-[9px] text-muted-steel/60">© 2026 HospitalityOS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
