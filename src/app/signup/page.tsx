'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Utensils, ArrowRight, Loader2, CheckCircle, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function SignupPage() {
  const router = useRouter();
  const switchRole = useStore((state) => state.switchRole);
  const switchLocation = useStore((state) => state.switchLocation);
  const addNotification = useStore((state) => state.addNotification);

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<'Owner' | 'Chef' | 'Guest'>('Owner');
  const [restaurantName, setRestaurantName] = useState('Aura Gastronomy');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      bgRef.current.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pin || !restaurantName) return;

    setStatus('loading');

    setTimeout(() => {
      // Register into global store state
      switchRole(role);
      switchLocation(`${restaurantName} (London)`);
      setStatus('success');
      addNotification(`New SaaS Node created under ${restaurantName}`, 'success');

      setTimeout(() => {
        if (role === 'Owner' || role === 'Chef') {
          router.push('/dashboard');
        } else {
          router.push('/chatbot');
        }
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-canvas-charcoal">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          ref={bgRef}
          className="relative w-full h-full scale-105 transition-transform duration-700 ease-out"
        >
          <Image
            src="/assets/login_bg.png"
            alt="Cinematic luxury restaurant backdrop"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85"></div>
      </div>

      {/* Auth Box Container */}
      <main className="w-full max-w-[480px] px-margin-mobile py-12 z-10">
        <div className="glass-card p-8 md:p-10 rounded-2xl border border-ice-border shadow-2xl space-y-6">
          
          {/* Header */}
          <header className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity spring-interaction">
              <Utensils className="text-[#E5C158] font-extrabold" size={32} />
              <span className="text-2xl font-extrabold text-premium-white tracking-tight">
                Restaurant<span className="text-[#E5C158]">OS</span>
              </span>
            </Link>
            <p className="text-[9px] font-mono text-muted-steel uppercase tracking-widest leading-none">
              Deploy a new B2B Gastronomy Node
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSignupSubmit}>
            {/* Restaurant Name */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                Restaurant Brand / Tenant ID
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-ice-border py-2 px-0 font-mono text-sm text-premium-white focus:outline-none focus:ring-0 focus:border-[#E5C158] transition-all placeholder:text-muted-steel/30"
                placeholder="e.g. Aura Sushi"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                Executive Email / Staff ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-ice-border py-2 px-0 font-mono text-sm text-premium-white focus:outline-none focus:ring-0 focus:border-[#E5C158] transition-all placeholder:text-muted-steel/30"
                placeholder="executive@restaurant.com"
              />
            </div>

            {/* PIN */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                Secure PIN Key (6 Digits)
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-ice-border py-2 px-0 font-mono text-sm text-premium-white focus:outline-none focus:ring-0 focus:border-[#E5C158] transition-all placeholder:text-muted-steel/30"
                placeholder="••••••"
              />
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                Initial Deployment Console Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-canvas-charcoal border border-ice-border rounded-xl px-4 py-2 text-xs text-[#8E939E] focus:outline-none focus:border-[#E5C158] transition-all"
              >
                <option value="Owner">Owner / HQ Overview</option>
                <option value="Chef">Kitchen Chef View</option>
                <option value="Guest">Customer Guest Flow</option>
              </select>
            </div>

            {/* Submit button */}
            {status === 'idle' && (
              <button
                type="submit"
                className="w-full py-3.5 bg-[#E5C158] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-1 group spring-interaction"
              >
                <span>PROVISION SAAS OPERATIONS CONSOLE</span>
                <ArrowRight className="font-bold group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            )}

            {status === 'loading' && (
              <button
                disabled
                className="w-full py-3.5 bg-[#E5C158]/80 text-canvas-charcoal font-bold text-xs rounded-xl opacity-80 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Loader2 className="animate-spin" size={18} />
                PROVISIONING DEPLOYMENT CLUSTER...
              </button>
            )}

            {status === 'success' && (
              <button
                disabled
                className="w-full py-3.5 bg-green-500 text-premium-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <CheckCircle className="font-bold animate-bounce" size={18} />
                NODE PROVISIONED SUCCESSFULLY
              </button>
            )}
          </form>

          {/* Footer Section */}
          <footer className="text-center pt-2">
            <div className="flex items-center justify-center gap-1.5 text-muted-steel mb-2">
              <Lock size={16} />
              <span className="font-mono text-[8px] uppercase tracking-widest leading-none">
                Provisioning Node TLS 1.3 Secure
              </span>
            </div>
            <p className="text-[9px] text-muted-steel/60">
              Already deployed?{' '}
              <Link href="/login" className="text-[#E5C158] hover:underline font-bold">
                Access HQ Admin
              </Link>
            </p>
          </footer>

        </div>
      </main>
    </div>
  );
}
