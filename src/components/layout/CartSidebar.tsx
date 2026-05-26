'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const updateQty = useStore((state) => state.updateCartQty);
  const removeItem = useStore((state) => state.removeFromCart);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const taxRate = 0.125; // 12.5% VAT
  const total = subtotal * (1 + taxRate);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-end"
          >
            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#15100C] border-l border-ice-border shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-ice-border flex justify-between items-center bg-[#0C0705]/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#C58A46]">shopping_bag</span>
                  <h2 className="text-lg font-bold text-premium-white tracking-tight">Active Table Bill</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 text-[#8E939E] hover:text-premium-white transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Scrollable Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <span className="material-symbols-outlined text-4xl text-[#8E939E]/30">receipt_long</span>
                    <p className="text-sm text-[#8E939E]">No items selected for this table session.</p>
                    <Link
                      href="/order"
                      onClick={onClose}
                      className="px-4 py-2 bg-glass-fill border border-ice-border hover:border-[#C58A46]/50 text-xs font-semibold rounded-lg text-[#C58A46] transition-colors"
                    >
                      Browse Menu Specials
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="glass-card p-4 rounded-xl flex gap-4 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-xs font-bold text-premium-white leading-tight truncate">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-[#C58A46] font-mono mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        {Object.keys(item.options).length > 0 && (
                          <div className="text-[9px] text-[#8E939E] mt-1 flex flex-wrap gap-1">
                            {Object.entries(item.options).map(([k, v]) => (
                              <span key={k} className="bg-white/5 px-1.5 py-0.5 rounded">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quantity adjustment */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-premium-white"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono w-4 text-center text-premium-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-premium-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-full hover:bg-red-500/10 text-[#8E939E] hover:text-red-400 flex items-center justify-center transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              <div className="p-6 border-t border-ice-border bg-[#0C0705]/30 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[#8E939E] text-xs">
                    <span>Subtotal</span>
                    <span className="font-mono text-premium-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#8E939E] text-xs">
                    <span>Est. Service Tax & VAT ({taxRate * 100}%)</span>
                    <span className="font-mono text-premium-white">
                      ${(subtotal * taxRate).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-ice-border pt-3 mt-2 text-premium-white font-bold text-sm">
                    <span>Total Session Value</span>
                    <span className="font-mono text-[#C58A46]">${total.toFixed(2)}</span>
                  </div>
                </div>

                {cart.length > 0 ? (
                  <Link
                    href="/order"
                    onClick={onClose}
                    className="block w-full py-4 bg-[#C58A46] text-canvas-charcoal rounded-xl font-bold text-center text-sm hover:brightness-110 transition-all spring-interaction shadow-lg"
                  >
                    Proceed to Secure Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 bg-white/5 text-[#8E939E] cursor-not-allowed rounded-xl font-bold text-center text-sm"
                  >
                    Cart is Empty
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
