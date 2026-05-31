'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Bell,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Hash,
  Link2,
  Eye,
  Grid3X3,
  ZoomIn,
} from 'lucide-react';
import { generateQRDataUrl, getTableScanUrl, downloadQR } from '@/lib/qr-utils';

interface QRCardData {
  table: number;
  dataUrl: string;
  url: string;
}

export default function QRGeneratorPage() {
  const [mounted, setMounted] = useState(false);
  const [singleTable, setSingleTable] = useState<number>(1);
  const [singleQR, setSingleQR] = useState<string>('');
  const [singleUrl, setSingleUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Batch generation
  const [batchFrom, setBatchFrom] = useState(1);
  const [batchTo, setBatchTo] = useState(8);
  const [batchQRs, setBatchQRs] = useState<QRCardData[]>([]);
  const [showBatch, setShowBatch] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);

  // Preview modal
  const [previewQR, setPreviewQR] = useState<QRCardData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate single QR whenever table number changes
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    (async () => {
      try {
        const url = getTableScanUrl(singleTable);
        const dataUrl = await generateQRDataUrl(singleTable, {
          width: 512,
          darkColor: '#0C0705',
          lightColor: '#F6F0E8',
        });
        if (!cancelled) {
          setSingleQR(dataUrl);
          setSingleUrl(url);
        }
      } catch (err) {
        console.error('QR generation error:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted, singleTable]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(singleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = singleUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [singleUrl]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await downloadQR(singleTable, `HospitalityOS-Table-${singleTable}-QR.png`);
    } catch (err) {
      console.error('Download error:', err);
    }
    setTimeout(() => setDownloading(false), 1000);
  }, [singleTable]);

  const handleBatchGenerate = useCallback(async () => {
    setBatchGenerating(true);
    const results: QRCardData[] = [];

    const start = Math.min(batchFrom, batchTo);
    const end = Math.max(batchFrom, batchTo);

    for (let t = start; t <= end; t++) {
      const url = getTableScanUrl(t);
      const dataUrl = await generateQRDataUrl(t, {
        width: 384,
        darkColor: '#0C0705',
        lightColor: '#F6F0E8',
      });
      results.push({ table: t, dataUrl, url });
    }

    setBatchQRs(results);
    setBatchGenerating(false);
    setShowBatch(true);
  }, [batchFrom, batchTo]);

  const handleBatchDownloadAll = useCallback(async () => {
    for (const qr of batchQRs) {
      await downloadQR(qr.table, `HospitalityOS-Table-${qr.table}-QR.png`);
      // Small delay between downloads
      await new Promise((r) => setTimeout(r, 300));
    }
  }, [batchQRs]);

  if (!mounted) return null;

  return (
    <main className="pt-nav-height min-h-screen bg-[#0B0C0E] text-premium-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#C58A46]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-[#E7C39A]/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16 space-y-12">
        
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-[#C58A46]" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#C58A46]">
              QR Ordering System • Operations Dashboard
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-premium-white leading-tight">
            Table QR Generator
          </h1>
          <p className="text-sm md:text-base text-muted-steel max-w-2xl leading-relaxed">
            Generate high-resolution, printable QR codes for each table or room. Guests scan to instantly
            access your premium menu with table-linked operations dispatch.
          </p>
        </motion.section>

        {/* Single Table QR Generator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Controls Panel */}
          <div className="glass-card rounded-3xl p-8 space-y-8 border border-white/8">
            <div className="space-y-2">
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">Configure</p>
              <h2 className="text-xl font-extrabold tracking-tight text-premium-white">
                Single Table QR
              </h2>
            </div>

            {/* Table Number Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-premium-white">
                <Hash className="h-4 w-4 text-[#C58A46]" />
                Table / Room Number
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSingleTable(Math.max(1, singleTable - 1))}
                  className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 text-premium-white hover:bg-[#C58A46]/10 hover:border-[#C58A46]/30 transition-all flex items-center justify-center text-lg font-bold"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={singleTable}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v >= 1 && v <= 99) setSingleTable(v);
                  }}
                  className="flex-1 h-12 rounded-xl bg-black/30 border border-white/10 text-center text-2xl font-extrabold text-[#C58A46] font-mono focus:border-[#C58A46]/40 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => setSingleTable(Math.min(99, singleTable + 1))}
                  className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 text-premium-white hover:bg-[#C58A46]/10 hover:border-[#C58A46]/30 transition-all flex items-center justify-center text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Generated URL */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-premium-white">
                <Link2 className="h-4 w-4 text-[#C58A46]" />
                Menu URL
              </label>
              <div className="relative">
                <div className="w-full h-11 rounded-xl bg-black/30 border border-white/10 px-4 flex items-center overflow-hidden">
                  <span className="text-xs font-mono text-muted-steel truncate flex-1">
                    {singleUrl || 'Generating...'}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-[#C58A46]/10 hover:border-[#C58A46]/30 transition-all flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-steel" />
                  )}
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-steel">
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 h-12 rounded-xl bg-[#C58A46] text-canvas-charcoal font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#C58A46]/20"
              >
                {downloading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Download className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {downloading ? 'Downloading...' : 'Download PNG'}
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 text-premium-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#C58A46]/10 hover:border-[#C58A46]/30 transition-all"
              >
                <Copy className="h-4 w-4" />
                Copy URL
              </button>
            </div>
          </div>

          {/* QR Preview Panel */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 border border-white/8 relative overflow-hidden">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <div className="relative z-10 flex flex-col items-center space-y-6">
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">
                Live Preview
              </p>

              {/* QR Code Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={singleTable}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  {/* Glow ring behind QR */}
                  <div className="absolute -inset-4 rounded-3xl bg-[#C58A46]/5 blur-xl" />
                  
                  <div className="relative bg-[#F6F0E8] rounded-2xl p-5 shadow-2xl">
                    {singleQR ? (
                      <img
                        src={singleQR}
                        alt={`QR Code for Table ${singleTable}`}
                        className="w-52 h-52"
                      />
                    ) : (
                      <div className="w-52 h-52 flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-[#0C0705]/20 animate-pulse" />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Table Label */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C58A46]/10 border border-[#C58A46]/20">
                  <Bell className="h-4 w-4 text-[#C58A46]" />
                  <span className="text-sm font-bold text-[#C58A46]">
                    Table / Room {singleTable}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-muted-steel uppercase tracking-widest">
                  Scan to order • Aura Grand Bistro
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Batch QR Generator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card rounded-3xl p-8 space-y-6 border border-white/8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">Batch Operations</p>
              <h2 className="text-xl font-extrabold tracking-tight text-premium-white">
                Multi-Table QR Generator
              </h2>
              <p className="text-xs text-muted-steel">
                Generate QR codes for a range of tables at once. Perfect for printing table cards.
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#C58A46]/10 border border-[#C58A46]/20 flex items-center justify-center">
              <Grid3X3 className="h-5 w-5 text-[#C58A46]" />
            </div>
          </div>

          {/* Range Controls */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest uppercase text-muted-steel">
                From Table
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={batchFrom}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 99) setBatchFrom(v);
                }}
                className="w-24 h-11 rounded-xl bg-black/30 border border-white/10 text-center text-lg font-bold text-[#C58A46] font-mono focus:border-[#C58A46]/40 focus:outline-none transition-colors"
              />
            </div>
            <span className="text-muted-steel font-mono text-sm pb-2.5">→</span>
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest uppercase text-muted-steel">
                To Table
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={batchTo}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 99) setBatchTo(v);
                }}
                className="w-24 h-11 rounded-xl bg-black/30 border border-white/10 text-center text-lg font-bold text-[#C58A46] font-mono focus:border-[#C58A46]/40 focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleBatchGenerate}
              disabled={batchGenerating}
              className="h-11 px-6 rounded-xl bg-[#C58A46] text-canvas-charcoal font-bold text-sm flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-[#C58A46]/20"
            >
              {batchGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <QrCode className="h-4 w-4" />
                </motion.div>
              ) : (
                <QrCode className="h-4 w-4" />
              )}
              {batchGenerating ? 'Generating...' : `Generate ${Math.abs(batchTo - batchFrom) + 1} QR Codes`}
            </button>
          </div>

          {/* Batch Results */}
          <AnimatePresence>
            {showBatch && batchQRs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-xs font-bold text-premium-white">
                    {batchQRs.length} QR Codes Generated
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBatchDownloadAll}
                      className="h-9 px-4 rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-premium-white hover:bg-[#C58A46]/10 hover:border-[#C58A46]/30 transition-all flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download All
                    </button>
                    <button
                      onClick={() => setShowBatch(false)}
                      className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ChevronUp className="h-4 w-4 text-muted-steel" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {batchQRs.map((qr, idx) => (
                    <motion.div
                      key={qr.table}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="group glass-card rounded-2xl p-4 flex flex-col items-center gap-3 border border-white/8 hover:border-[#C58A46]/30 transition-all cursor-pointer relative"
                      onClick={() => setPreviewQR(qr)}
                    >
                      {/* Hover overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-[#C58A46]/0 group-hover:bg-[#C58A46]/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn className="h-6 w-6 text-[#C58A46]" />
                      </div>
                      
                      <div className="bg-[#F6F0E8] rounded-xl p-2.5">
                        <img
                          src={qr.dataUrl}
                          alt={`QR Table ${qr.table}`}
                          className="w-24 h-24"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bell className="h-3 w-3 text-[#C58A46]" />
                        <span className="text-xs font-bold text-premium-white">
                          Table {qr.table}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Printable Table Card Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="glass-card rounded-3xl p-8 space-y-4 border border-white/8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C58A46]/10 border border-[#C58A46]/20 flex items-center justify-center shrink-0">
              <Printer className="h-5 w-5 text-[#C58A46]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-premium-white tracking-tight">
                Print-Ready Table Cards
              </h3>
              <p className="text-xs text-muted-steel leading-relaxed">
                Download individual or batch QR codes at 1024×1024 resolution — optimized for
                table tent cards, acrylic stands, and menu inserts. Each QR routes guests through
                a premium scan animation before opening your live menu.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['1024px HD', 'Error Correction H', 'Print Optimized', 'Dark Luxury Theme'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[9px] font-mono text-muted-steel uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setPreviewQR(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-card rounded-3xl p-10 flex flex-col items-center gap-6 border border-white/10 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#C58A46]">
                QR Preview
              </p>

              <div className="relative">
                <div className="absolute -inset-6 rounded-3xl bg-[#C58A46]/8 blur-2xl" />
                <div className="relative bg-[#F6F0E8] rounded-2xl p-6 shadow-2xl">
                  <img
                    src={previewQR.dataUrl}
                    alt={`QR Table ${previewQR.table}`}
                    className="w-64 h-64"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C58A46]/10 border border-[#C58A46]/20">
                  <Bell className="h-4 w-4 text-[#C58A46]" />
                  <span className="text-sm font-bold text-[#C58A46]">
                    Table {previewQR.table}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-muted-steel uppercase tracking-widest text-center break-all px-4">
                  {previewQR.url}
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={async () => {
                    await downloadQR(previewQR.table, `HospitalityOS-Table-${previewQR.table}-QR.png`);
                  }}
                  className="flex-1 h-11 rounded-xl bg-[#C58A46] text-canvas-charcoal font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(previewQR.url);
                  }}
                  className="flex-1 h-11 rounded-xl border border-white/10 bg-white/5 text-premium-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#C58A46]/10 hover:border-[#C58A46]/30 transition-all"
                >
                  <Copy className="h-4 w-4" />
                  Copy URL
                </button>
              </div>

              <button
                onClick={() => setPreviewQR(null)}
                className="text-[10px] font-mono text-muted-steel uppercase tracking-widest hover:text-premium-white transition-colors"
              >
                Close Preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
