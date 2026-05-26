'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useCreateOrderMutation } from '@/services/api';

export default function OrderPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const updateQty = useStore((state) => state.updateCartQty);
  const removeItem = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const addLiveOrder = useStore((state) => state.addLiveOrder);
  const addNotification = useStore((state) => state.addNotification);

  const createOrderMutation = useCreateOrderMutation();

  // Form states
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [cardName, setCardName] = useState('JULIAN VANDERBILT');
  const [cardNumber, setCardNumber] = useState('5412 7500 8824 8842');
  const [cardExpiry, setCardExpiry] = useState('04/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'POS'>('WALLET');

  // Success Modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState('');

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

  const handleSetWagyuTemp = (itemId: string, temp: string) => {
    // Directly mutate options via Zustand store
    const item = cart.find((i) => i.id === itemId);
    if (item) {
      const updatedOptions = { ...item.options, temperature: temp };
      useStore.setState({
        cart: cart.map((i) => (i.id === itemId ? { ...i, options: updatedOptions } : i))
      });
    }
  };

  const handleAuthorizePayment = () => {
    if (cart.length === 0) {
      addNotification('Cannot check out. Your cart is empty.', 'error');
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
          // Sync with local Zustand orders state
          addLiveOrder({
            name: data.name,
            items: itemsStr,
            total: data.total
          });

          setSuccessTicketId(data.id);
          setShowSuccess(true);

          // Clear local cart
          clearCart();
        },
        onError: () => {
          addNotification('Payment authorization failed. Server offline.', 'error');
        }
      }
    );
  };

  const handleDismissModal = (target: string) => {
    setShowSuccess(false);
    router.push(target);
  };

  return (
    <main className="pt-nav-height max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex-1">
      
      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
        
        {/* Left Column: Cart Review */}
        <section className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-premium-white tracking-tight mb-2">Review Active Order</h1>
            <p className="text-sm text-muted-steel">Premium gastronomic selections prepared by our elite culinary team.</p>
          </div>

          {/* Cart List */}
          <div className="space-y-6">
            {cart.length === 0 ? (
              <div className="glass-card rounded-xl p-10 text-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-[#8E939E]/20">receipt_long</span>
                <div>
                  <h3 className="text-base font-bold text-premium-white">Your checkout is clear</h3>
                  <p className="text-xs text-[#8E939E] mt-1">Add culinary experiences on the sommelier chatbot page to proceed.</p>
                </div>
                <Link
                  href="/chatbot"
                  className="inline-block px-5 py-3 bg-[#E5C158] text-canvas-charcoal rounded-xl text-xs font-bold transition-all spring-interaction shadow-lg"
                >
                  Consult AI Sommelier
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const isWagyu = item.id === 'wagyu-steak' || item.name.includes('Wagyu');
                const selectedTemp = item.options.temperature || 'Medium Rare';

                return (
                  <div
                    key={item.id}
                    className="glass-card rounded-xl p-6 md:p-8 space-y-6 group hover:border-[#E5C158]/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-28 h-28 rounded-lg overflow-hidden border border-ice-border shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-premium-white leading-snug truncate">
                              {item.name}
                            </h3>
                            <p className="text-xs text-muted-steel mt-1">Pre-selected premium session addition.</p>
                          </div>
                          <span className="font-mono text-[#E5C158] text-base font-bold shrink-0">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          {/* Quantity selectors */}
                          <div className="flex items-center gap-3 bg-white/5 rounded-full px-3.5 py-1.5 border border-ice-border">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="hover:text-[#E5C158] transition-colors font-bold text-premium-white"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs w-4 text-center text-premium-white">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="hover:text-[#E5C158] transition-colors font-bold text-premium-white"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400/70 hover:text-red-400 font-mono text-[10px] tracking-widest font-bold uppercase transition-colors"
                          >
                            REMOVE ITEM
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Meat Temp Selector for Wagyu */}
                    {isWagyu && (
                      <div className="bg-white/5 rounded-xl p-4 border border-ice-border space-y-4">
                        <div>
                          <label className="font-mono text-[9px] tracking-widest text-[#8E939E] uppercase block mb-3">
                            Meat Preparation Temperature
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Rare', 'Medium Rare', 'Medium', 'Well Done'].map((t) => (
                              <button
                                key={t}
                                onClick={() => handleSetWagyuTemp(item.id, t)}
                                className={`px-4 py-1.5 rounded-full border text-xs transition-all ${
                                  selectedTemp === t
                                    ? 'bg-[#E5C158] text-canvas-charcoal font-bold border-[#E5C158] shadow-md'
                                    : 'border-ice-border text-[#8E939E] hover:border-premium-white'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-ice-border text-xs">
                          <span className="text-premium-white flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[#E5C158] text-sm">
                              workspace_premium
                            </span>
                            Add Shaved Black Truffle
                          </span>
                          <span className="font-mono text-[#8E939E]">Included</span>
                        </div>
                      </div>
                    )}

                    {/* Options summary for other items */}
                    {!isWagyu && Object.keys(item.options).length > 0 && (
                      <div className="bg-white/5 rounded-xl p-3 border border-ice-border text-xs text-[#8E939E] flex gap-2 items-center flex-wrap">
                        <span className="material-symbols-outlined text-xs text-[#E5C158]">notes</span>
                        {Object.entries(item.options).map(([k, v]) => (
                          <span key={k}>{v}</span>
                        )).reduce((prev, curr) => [prev, <span key="sep">•</span>, curr] as any)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Special notes */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">
              Operational / Dietary Instructions
            </h4>
            <textarea
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              className="w-full glass-card rounded-xl p-5 font-body-md text-sm text-premium-white focus:outline-none focus:border-[#E5C158] transition-all min-h-[110px] placeholder:text-muted-steel/40"
              placeholder="Specify allergies, seating preferences, table number, or custom requests..."
            />
          </div>
        </section>

        {/* Right Column: Checkout Sidebar sticky */}
        <aside className="lg:sticky lg:top-[104px] space-y-6">
          <div className="glass-card rounded-xl overflow-hidden border border-ice-border shadow-2xl">
            {/* Bill Summary */}
            <div className="p-6 border-b border-ice-border space-y-4">
              <h2 className="text-lg font-bold text-premium-white tracking-tight">Receipt Bill Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-steel">
                  <span>Table Subtotal</span>
                  <span className="font-mono text-premium-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-steel">
                  <span>Service Charge (10%)</span>
                  <span className="font-mono text-premium-white">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-steel">
                  <span>Est. Local Taxes & VAT (12.5%)</span>
                  <span className="font-mono text-premium-white">${localTax.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Billing Total and Payment Details */}
            <div className="p-6 bg-gradient-to-b from-[#E5C158]/5 to-transparent">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-premium-white">Grand Total Value</span>
                <span className="font-mono text-2xl text-[#E5C158] font-extrabold">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Selector */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                      paymentMethod === 'WALLET'
                        ? 'border-[#E5C158] bg-[#E5C158]/10 text-[#E5C158]'
                        : 'border-ice-border bg-white/5 text-[#8E939E]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      account_balance_wallet
                    </span>
                    <span className="font-mono text-[10px] font-bold">DIGITAL WALLET</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('POS')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                      paymentMethod === 'POS'
                        ? 'border-[#E5C158] bg-[#E5C158]/10 text-[#E5C158]'
                        : 'border-ice-border bg-white/5 text-[#8E939E]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">credit_card</span>
                    <span className="font-mono text-[10px] font-bold">POS TERMINAL</span>
                  </button>
                </div>

                {/* Credit Card Graphic Cardholder details */}
                <div className="glass-card rounded-xl p-5 border border-ice-border space-y-4 relative overflow-hidden bg-gradient-to-tr from-[#12141C] via-[#1A1C25] to-[#12141C]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="material-symbols-outlined text-premium-white text-3xl font-light">credit_card</span>
                    <div className="relative w-12 h-6 opacity-85">
                      <Image
                        alt="Mastercard"
                        src="/assets/order_mastercard.png"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-mono text-[8px] tracking-widest text-[#8E939E] uppercase block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-transparent border-none p-0 font-body-md text-xs text-premium-white focus:outline-none focus:ring-0 placeholder:text-muted-steel/30 uppercase"
                      placeholder="JULIAN VANDERBILT"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[8px] tracking-widest text-[#8E939E] uppercase block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-transparent border-none p-0 font-mono text-sm text-[#E5C158] focus:outline-none focus:ring-0 tracking-widest placeholder:text-muted-steel/30"
                      placeholder="•••• •••• •••• 8842"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] tracking-widest text-[#8E939E] uppercase block">
                        Expiry
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-body-md text-xs text-premium-white focus:outline-none focus:ring-0 placeholder:text-muted-steel/30"
                        placeholder="04/28"
                      />
                    </div>
                    <div className="space-y-1 text-right">
                      <label className="font-mono text-[8px] tracking-widest text-[#8E939E] uppercase block">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-body-md text-xs text-premium-white focus:outline-none focus:ring-0 text-right placeholder:text-muted-steel/30"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Payment button */}
              <button
                onClick={handleAuthorizePayment}
                className="w-full py-4.5 rounded-xl bg-[#E5C158] text-canvas-charcoal font-display-lg text-sm font-extrabold hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-[#E5C158]/10 flex items-center justify-center gap-2 group spring-interaction"
              >
                <span>AUTHORIZE TABLE PAYMENT</span>
                <span className="material-symbols-outlined font-bold text-sm group-hover:translate-x-1.5 transition-transform">
                  arrow_forward
                </span>
              </button>

              <p className="text-center mt-5 font-mono text-[8px] text-[#8E939E] uppercase tracking-widest opacity-60 leading-none">
                Secured by RestaurantOS 256-bit PCI-DSS Gateway
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-ice-border shadow-2xl text-center space-y-6 transform scale-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/30 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[#E5C158] text-3xl font-extrabold animate-bounce">
                check
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-premium-white tracking-tight">Table Authorization Success</h3>
              <p className="text-xs text-[#8E939E]">
                Your premium dining ticket has been logged directly on the kitchen queue. The shift commander and chef have been notified.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-ice-border font-mono text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8E939E]">Transaction Ticket</span>
                <span className="text-premium-white font-bold">{successTicketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E939E]">Table Booth</span>
                <span className="text-[#E5C158] font-bold">Window Booth 4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E939E]">Kitchen Status</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                  Preparing
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDismissModal('/order/track')}
                className="py-3 bg-glass-fill border border-ice-border hover:border-[#E5C158]/50 text-premium-white font-bold text-xs rounded-xl transition-all spring-interaction"
              >
                Track Pacing Live
              </button>
              <button
                onClick={() => handleDismissModal('/dashboard')}
                className="py-3 bg-[#E5C158] text-canvas-charcoal font-bold text-xs rounded-xl hover:brightness-110 transition-all spring-interaction shadow-lg"
              >
                Monitor Chef Ops
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
