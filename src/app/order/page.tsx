'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, WifiOff, CreditCard, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCreateOrderMutation } from '@/services/api';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

export default function OrderPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const updateQty = useStore((state) => state.updateCartQty);
  const removeItem = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const addLiveOrder = useStore((state) => state.addLiveOrder);
  const addNotification = useStore((state) => state.addNotification);
  const tableNumber = useStore((state) => state.tableNumber);
  const isOffline = useStore((state) => state.isOffline);
  const addToCartStore = useStore((state) => state.addToCart);

  const createOrderMutation = useCreateOrderMutation();
  const { playSound } = useSoundFeedback();

  // Form states
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [cardName, setCardName] = useState('JULIAN VANDERBILT');
  const [cardNumber, setCardNumber] = useState('5412 7500 8824 8842');
  const [cardExpiry, setCardExpiry] = useState('04/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'POS'>('WALLET');

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const serviceRate = 0.10; // 10%
  const taxRate = 0.125; // 12.5%
  
  const serviceCharge = subtotal * serviceRate;
  const localTax = subtotal * taxRate;
  const grandTotal = subtotal + serviceCharge + localTax;

  const handleQuickAddRecommendation = (id: string, name: string, price: number, image: string) => {
    playSound('pip');
    addToCartStore({
      id,
      name,
      price,
      image,
      options: { note: 'Checkout recommendation add' }
    });
  };

  const handleAuthorizePayment = () => {
    if (cart.length === 0) {
      addNotification('Cannot check out. Your cart is empty.', 'error');
      return;
    }

    if (isOffline) {
      playSound('chime');
      addNotification('Cannot place order: Reconnecting to kitchen queue...', 'error');
      return;
    }

    const itemsStr = cart.map((i) => `${i.name} (${i.qty}x)`).join(', ');

    // Add order to live queue on backend
    createOrderMutation.mutate(
      {
        name: cardName || 'Julian V.',
        items: itemsStr,
        total: grandTotal
      },
      {
        onSuccess: (data) => {
          playSound('success');
          
          // Sync with local Zustand orders state
          addLiveOrder({
            name: data.name,
            items: itemsStr,
            total: data.total
          });

          // Clear local cart
          clearCart();
          
          // Redirect to timeline with table parameter persisted
          router.push(`/order/track?id=${data.id}&table=${tableNumber || '4'}`);
        },
        onError: () => {
          addNotification('Payment authorization failed. Server offline.', 'error');
        }
      }
    );
  };

  return (
    <main className="pt-nav-height max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-1 flex flex-col space-y-6">
      
      {/* 1. Offline B2B Connection state banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-xl border border-red-500/35 bg-red-500/10 text-red-400 flex items-center gap-3 text-xs font-mono font-bold gold-glow justify-center shrink-0"
          >
            <WifiOff className="h-4.5 w-4.5 text-red-400 animate-pulse" />
            B2B TELEMETRY OFFLINE: RECONNECTING TO KITCHEN QUEUES...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/menu"
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-ice-border hover:border-[#C58A46]/35 text-xs text-premium-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#C58A46]" />
          Back to Menu
        </Link>
        <div className="text-right font-mono text-xs">
          <span className="text-muted-steel">Cart Ticket • </span>
          <span className="text-[#C58A46] font-bold">{tableNumber ? `Table ${tableNumber}` : 'Room Service'}</span>
        </div>
      </div>

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
        
        {/* Left Column: Cart Review */}
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-premium-white tracking-tight mb-2">Review Checkout</h1>
            <p className="text-sm text-muted-steel">Gourmet coffee and fresh recipes prepared by our specialist barista team.</p>
          </div>

          {/* Cart List */}
          <div className="space-y-4">
            {cart.length === 0 ? (
              /* SMART EMPTY STATE */
              <div className="glass-card rounded-2xl p-8 border border-ice-border space-y-6">
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#C58A46]/10 border border-[#C58A46]/20 flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-7 w-7 text-[#C58A46]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-premium-white">Your checkout is clear</h3>
                    <p className="text-xs text-[#8E939E] mt-1 max-w-xs mx-auto">Add a gourmet coffee or bakery recipe to begin.</p>
                  </div>
                </div>

                {/* Quick Add Curated Recommendations */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h4 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">Curated Cafe Specials</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleQuickAddRecommendation(
                        'flat-white-silk',
                        'Silk Flat White',
                        5.90,
                        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20flat%20white%20in%20a%20minimalist%20porcelain%20cup%20with%20latte%20art%20rosette%2C%20warm%20amber%20lighting%2C%20cinematic%20shadows%2C%20coffee%20shop%20aesthetic%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3'
                      )}
                      className="p-3 bg-white/3 border border-ice-border rounded-xl hover:border-[#C58A46]/25 transition-all text-left flex justify-between items-center gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-premium-white truncate">Silk Flat White</p>
                        <p className="text-[10px] text-muted-steel mt-0.5">Classic morning riser</p>
                      </div>
                      <span className="font-mono text-xs text-[#C58A46] font-bold shrink-0">$5.90 +</span>
                    </button>

                    <button
                      onClick={() => handleQuickAddRecommendation(
                        'nitro-cold-brew',
                        'Nitro Cold Brew',
                        6.20,
                        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20nitro%20cold%20brew%20cascading%20in%20a%20tall%20glass%2C%20thick%20creamy%20foam%20head%2C%20moody%20dark%20background%2C%20warm%20highlights%2C%20high%20contrast%2C%208k%20beverage%20photography&image_size=portrait_4_3'
                      )}
                      className="p-3 bg-white/3 border border-ice-border rounded-xl hover:border-[#C58A46]/25 transition-all text-left flex justify-between items-center gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-premium-white truncate">Nitro Cold Brew</p>
                        <p className="text-[10px] text-muted-steel mt-0.5">Chocolate foam head</p>
                      </div>
                      <span className="font-mono text-xs text-[#C58A46] font-bold shrink-0">$6.20 +</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const isCoffee = item.category?.includes('Coffee') || item.id.includes('latte') || item.id.includes('cappuccino');
                const selectedPrep = item.options.preparation || 'Oat Milk';

                return (
                  <div
                    key={item.id}
                    className="glass-card rounded-xl p-5 md:p-6 space-y-4 group hover:border-[#C58A46]/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-ice-border shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-sm font-bold text-premium-white truncate">
                              {item.name}
                            </h3>
                            <p className="text-[10px] text-muted-steel mt-0.5">Gourmet specialty serving.</p>
                          </div>
                          <span className="font-mono text-[#C58A46] text-sm font-bold shrink-0">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1 border border-ice-border">
                            <button
                              onClick={() => { updateQty(item.id, item.qty - 1); playSound('pip'); }}
                              className="hover:text-[#C58A46] transition-colors font-bold text-premium-white text-xs"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs w-4 text-center text-premium-white">{item.qty}</span>
                            <button
                              onClick={() => { updateQty(item.id, item.qty + 1); playSound('pip'); }}
                              className="hover:text-[#C58A46] transition-colors font-bold text-premium-white text-xs"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => { removeItem(item.id); playSound('pip'); }}
                            className="text-red-400/70 hover:text-red-400 font-mono text-[9px] tracking-widest font-bold uppercase transition-colors"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preparation selectors for coffee */}
                    {isCoffee && (
                      <div className="bg-white/3 rounded-lg p-3 border border-ice-border/40 space-y-3">
                        <label className="font-mono text-[8px] tracking-widest text-[#8E939E] uppercase block">
                          Milk Preference
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Whole Milk', 'Oat Milk', 'Almond Milk', 'No Milk'].map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                playSound('pip');
                                const updatedOptions = { ...item.options, preparation: t };
                                useStore.setState({
                                  cart: cart.map((i) => (i.id === item.id ? { ...i, options: updatedOptions } : i))
                                });
                              }}
                              className={`px-3 py-1 rounded-full border text-[10px] transition-all ${
                                selectedPrep === t
                                  ? 'bg-[#C58A46]/20 text-[#C58A46] font-bold border-[#C58A46]'
                                  : 'border-white/5 text-[#8E939E] hover:border-white/20'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Operational notes */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">
              Special Instructions
            </h4>
            <textarea
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              className="w-full glass-card rounded-xl p-4 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all min-h-[90px] placeholder:text-muted-steel/30"
              placeholder="Specify sugar levels, allergies, decaf, or table pacing instructions..."
            />
          </div>
        </section>

        {/* Right Column: Checkout Sidebar */}
        <aside className="space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden border border-ice-border shadow-2xl">
            {/* Bill Summary */}
            <div className="p-6 border-b border-ice-border space-y-4">
              <h2 className="text-base font-bold text-premium-white tracking-tight flex items-center justify-between">
                <span>Receipt Bill Summary</span>
                {tableNumber && <span className="font-mono text-xs bg-[#C58A46]/10 text-[#C58A46] px-2 py-0.5 rounded">Table {tableNumber}</span>}
              </h2>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs text-muted-steel">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-premium-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-steel">
                  <span>Service Fee (10.0%)</span>
                  <span className="font-mono text-premium-white">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-steel">
                  <span>Local VAT & Tax (12.5%)</span>
                  <span className="font-mono text-premium-white">${localTax.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Total & Checkout Architecture */}
            <div className="p-6 bg-gradient-to-b from-[#C58A46]/5 to-transparent">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-premium-white">Grand Total</span>
                <span className="font-mono text-xl text-[#C58A46] font-extrabold">${grandTotal.toFixed(2)}</span>
              </div>

              {/* PAYMENT READY ARCHITECTURE */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                      paymentMethod === 'WALLET'
                        ? 'border-[#C58A46] bg-[#C58A46]/10 text-[#C58A46]'
                        : 'border-white/5 bg-white/3 text-[#8E939E]'
                    }`}
                  >
                    <span className="font-mono text-[9px] font-bold">DIGITAL WALLET</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('POS')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                      paymentMethod === 'POS'
                        ? 'border-[#C58A46] bg-[#C58A46]/10 text-[#C58A46]'
                        : 'border-white/5 bg-white/3 text-[#8E939E]'
                    }`}
                  >
                    <span className="font-mono text-[9px] font-bold">POS TERMINAL</span>
                  </button>
                </div>

                <div className="glass-card rounded-xl p-4 border border-ice-border space-y-3 relative overflow-hidden bg-gradient-to-tr from-[#12141C] via-[#161821] to-[#12141C]">
                  <div className="flex justify-between items-start">
                    <CreditCard className="text-premium-white font-light" size={28} />
                    <Sparkles className="h-4 w-4 text-[#C58A46] opacity-75" />
                  </div>
                  
                  <div className="space-y-0.5">
                    <label className="font-mono text-[7px] tracking-widest text-[#8E939E] uppercase block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-transparent border-none p-0 font-sans text-xs text-premium-white focus:outline-none focus:ring-0 uppercase font-bold"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="font-mono text-[7px] tracking-widest text-[#8E939E] uppercase block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-transparent border-none p-0 font-mono text-xs text-[#C58A46] focus:outline-none focus:ring-0 tracking-widest"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Payment button */}
              <button
                onClick={handleAuthorizePayment}
                disabled={cart.length === 0 || createOrderMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-[#C58A46] text-canvas-charcoal font-mono text-xs font-extrabold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 group spring-interaction shadow-lg"
              >
                <span>AUTHORIZE KITCHEN DEPLOYMENT</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center mt-4 font-mono text-[8px] text-[#8E939E] uppercase tracking-widest opacity-60">
                Syncing directly with Aura Kitchen telemetry
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
