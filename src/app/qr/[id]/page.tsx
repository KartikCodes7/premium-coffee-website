'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { QrCode, Scan, Cpu } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QRWelcomePage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const setLocation = useStore((state) => state.setLocation);
  const addNotification = useStore((state) => state.addNotification);
  const [parsed, setParsed] = useState<{ type: 'Restaurant' | 'Café' | 'Hotel'; name: string } | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;
    
    // Parsing rules:
    // table-x ➔ "Table x" (Restaurant)
    // room-x ➔ "Room x" (Hotel)
    // cafe-x ➔ "Table x" (Café - standard tables)
    const normalized = id.toLowerCase();
    let type: 'Restaurant' | 'Café' | 'Hotel' = 'Restaurant';
    let name = id;

    if (normalized.startsWith('cafe-')) {
      const num = id.slice(5);
      type = 'Café';
      name = `Table ${num}`;
    } else if (normalized.startsWith('room-')) {
      const num = id.slice(5);
      type = 'Hotel';
      name = `Room ${num}`;
    } else if (normalized.startsWith('table-')) {
      const num = id.slice(6);
      type = 'Restaurant';
      name = `Table ${num}`;
    }

    setParsed({ type, name });
    setLocation(type, name);
    
    addNotification(`Terminal synchronized at ${name} (${type})`, 'success');

    // Simulate progress bar loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    // Auto redirect to services after 2.6s
    const timer = setTimeout(() => {
      router.push('/services');
    }, 2600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [id, setLocation, addNotification, router]);

  if (!parsed) {
    return (
      <div className="min-h-screen bg-canvas-charcoal flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#C58A46] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-canvas-charcoal text-premium-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#C58A46]/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#E7C39A]/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Welcomer card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-card rounded-3xl p-8 border border-ice-border shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-8 z-10"
      >
        {/* Top Tech Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-ice-border font-mono text-[9px] text-[#C58A46] tracking-widest uppercase">
          <Cpu size={12} className="animate-pulse" />
          HospitalityOS Terminal Secured
        </div>

        {/* QR Scan Container with laser line */}
        <div className="relative w-40 h-40 rounded-2xl bg-white/3 border border-ice-border flex items-center justify-center overflow-hidden group">
          {/* Glowing Scanner Line */}
          <motion.div
            animate={{ top: ['0%', '98%', '0%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C58A46] to-transparent shadow-[0_0_8px_#C58A46] z-10"
          />
          
          {/* Subtle grid mesh backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(246,240,232,0.02)_1px,transparent_1px)] [background-size:12px_12px] opacity-60"></div>
          
          <QrCode className="text-[#C58A46] opacity-90 drop-shadow-[0_0_12px_rgba(197,138,70,0.4)]" size={72} />
          
          {/* Floating dots mimicking corners */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C58A46]/70 rounded-tl"></div>
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C58A46]/70 rounded-tr"></div>
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C58A46]/70 rounded-bl"></div>
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C58A46]/70 rounded-br"></div>
        </div>

        {/* Welcome Messages */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-premium-white">
            Welcome to HospitalityOS
          </h1>
          
          <div className="flex justify-center">
            <motion.span
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="inline-flex items-center px-4 py-1.5 rounded-xl bg-[#C58A46]/10 border border-[#C58A46]/25 text-[#E7C39A] text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(197,138,70,0.05)]"
            >
              Serving {parsed.name}
            </motion.span>
          </div>
        </div>

        {/* Micro Pacing Logs / Status */}
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono text-muted-steel">
            <span>Synchronizing session...</span>
            <span className="text-[#E7C39A] font-bold">{progress}%</span>
          </div>
          
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="h-full bg-[#C58A46] rounded-full"
            />
          </div>

          <div className="text-[9px] font-mono text-muted-steel/60 uppercase tracking-widest">
            {progress < 40 && 'Initializing secure token...'}
            {progress >= 40 && progress < 80 && 'Mapping table credentials...'}
            {progress >= 80 && progress < 100 && 'Configuring guest experience...'}
            {progress === 100 && 'Redirection active...'}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
