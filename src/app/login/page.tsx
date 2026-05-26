'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Utensils, ArrowRight, Loader2, CheckCircle, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const switchRole = useStore((state) => state.switchRole);
  const addNotification = useStore((state) => state.addNotification);

  const [email, setEmail] = useState('owner@auragastronomy.com');
  const [pin, setPin] = useState('880288');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedRole, setSelectedRole] = useState<'Owner' | 'Chef' | 'Guest'>('Owner');

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

  const prefillRole = (emailVal: string, pinVal: string, roleVal: 'Owner' | 'Chef' | 'Guest') => {
    setEmail(emailVal);
    setPin(pinVal);
    setSelectedRole(roleVal);
    addNotification(`Prefilled simulation credentials for ${roleVal}`, 'info');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pin) return;

    setStatus('loading');
    
    // Determine role from input context
    let role: 'Owner' | 'Chef' | 'Guest' = selectedRole;
    if (email.includes('chef')) role = 'Chef';
    else if (email.includes('guest') || email.includes('customer')) role = 'Guest';

    setTimeout(() => {
      switchRole(role);
      setStatus('success');
      addNotification(`Welcome back, Elena. Session authorized under ${role} role.`, 'success');

      setTimeout(() => {
        if (role === 'Owner' || role === 'Chef') {
          router.push('/dashboard');
        } else {
          router.push('/chatbot');
        }
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-canvas-charcoal">
      
      {/* Cinematic Background with Parallax */}
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

      {/* Login Authentication Box */}
      <main className="w-full max-w-[460px] px-margin-mobile py-12 z-10">
        <div className="glass-card p-8 md:p-10 rounded-2xl border border-ice-border shadow-2xl space-y-8">
          
          {/* Branding Header */}
          <header className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity spring-interaction">
              <Utensils className="text-[#E5C158] font-extrabold" size={32} />
              <span className="text-2xl font-extrabold text-premium-white tracking-tight">
                Restaurant<span className="text-[#E5C158]">OS</span>
              </span>
            </Link>
            <p className="text-[9px] font-mono text-muted-steel uppercase tracking-widest leading-none">
              Enterprise Gastronomy Telemetry Terminal
            </p>
          </header>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            {/* User ID */}
            <div className="space-y-2">
              <label className="block font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                Executive ID / Staff Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-ice-border py-2 px-0 font-mono text-sm text-premium-white focus:outline-none focus:ring-0 focus:border-[#E5C158] transition-all placeholder:text-muted-steel/30"
                placeholder="owner@auragastronomy.com"
              />
            </div>

            {/* Security Key */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                  Security Key / PIN
                </label>
                <a className="font-mono text-[8px] text-[#E5C158] uppercase tracking-widest hover:underline" href="#">
                  Reset PIN
                </a>
              </div>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-ice-border py-2 px-0 font-mono text-sm text-premium-white focus:outline-none focus:ring-0 focus:border-[#E5C158] transition-all placeholder:text-muted-steel/30"
                placeholder="••••••••"
              />
            </div>

            {/* Maintain session */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group gap-3">
                <input className="sr-only peer" type="checkbox" defaultChecked />
                <div className="w-9 h-5 bg-white/5 border border-ice-border rounded-full peer peer-checked:bg-[#E5C158] transition-colors relative">
                  <div className="absolute left-0.5 top-0.5 bg-premium-white peer-checked:bg-canvas-charcoal w-3.5 h-3.5 rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="font-mono text-[9px] text-[#8E939E] uppercase tracking-wider">
                  Maintain Session Keys
                </span>
              </label>
            </div>

            {/* Submit button */}
            {status === 'idle' && (
              <button
                type="submit"
                className="w-full py-4 bg-[#E5C158] text-canvas-charcoal font-display-lg text-xs font-extrabold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#E5C158]/10 flex items-center justify-center gap-2 group spring-interaction"
              >
                <span>ACCESS OPERATIONS MATRIX</span>
                <ArrowRight className="font-bold group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            )}

            {status === 'loading' && (
              <button
                disabled
                className="w-full py-4 bg-[#E5C158]/80 text-canvas-charcoal font-display-lg text-xs font-extrabold rounded-xl opacity-80 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Loader2 className="animate-spin" size={18} />
                AUTHENTICATING NODE...
              </button>
            )}

            {status === 'success' && (
              <button
                disabled
                className="w-full py-4 bg-green-500 text-premium-white font-display-lg text-xs font-extrabold rounded-xl flex items-center justify-center gap-2"
              >
                <CheckCircle className="font-bold animate-bounce" size={18} />
                SYSTEM ACCESS GRANTED
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-2 opacity-40">
            <div className="flex-grow border-t border-ice-border"></div>
            <span className="flex-shrink mx-4 font-mono text-[9px] uppercase tracking-widest text-muted-steel">
              Enterprise Credentials
            </span>
            <div className="flex-grow border-t border-ice-border"></div>
          </div>

          {/* Pre-defined simulation roles */}
          <div className="space-y-3">
            <h4 className="text-[9px] font-mono tracking-widest text-muted-steel uppercase text-center leading-none">
              Fast-Track Simulation Roles
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => prefillRole('owner@auragastronomy.com', '880288', 'Owner')}
                type="button"
                className="py-2 rounded-lg bg-white/5 border border-ice-border text-[9px] font-mono text-premium-white hover:border-[#E5C158]/50 transition-all font-semibold"
              >
                Owner HQ
              </button>
              <button
                onClick={() => prefillRole('chef.marcus@auragastronomy.com', '880288', 'Chef')}
                type="button"
                className="py-2 rounded-lg bg-white/5 border border-ice-border text-[9px] font-mono text-premium-white hover:border-[#E5C158]/50 transition-all font-semibold"
              >
                Kitchen Chef
              </button>
              <button
                onClick={() => prefillRole('customer.guest@dining.com', '880288', 'Guest')}
                type="button"
                className="py-2 rounded-lg bg-white/5 border border-ice-border text-[9px] font-mono text-premium-white hover:border-[#E5C158]/50 transition-all font-semibold"
              >
                Guest
              </button>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="text-center pt-2">
            <div className="flex items-center justify-center gap-1.5 text-muted-steel mb-2">
              <Lock size={16} />
              <span className="font-mono text-[8px] uppercase tracking-widest leading-none">
                TLS 1.3 Secure Operational Node
              </span>
            </div>
            <p className="text-[9px] text-muted-steel/60">© 2026 RestaurantOS. All operational terms apply.</p>
          </footer>

        </div>
      </main>
    </div>
  );
}
