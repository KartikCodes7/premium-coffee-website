'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, WifiOff, ChevronRight, Sparkles, User, Phone, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useCreateOrderMutation } from '@/services/api';
import { useSoundFeedback } from '@/hooks/useSoundFeedback';

interface RecommendationItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

function getRecommendations(cart: any[]): RecommendationItem[] {
  if (cart.length === 0) return [];
  
  const recommendations: RecommendationItem[] = [];
  const addedIds = new Set(cart.map(item => item.id));

  // Category or keyword match:
  const hasPizza = cart.some(item => item.name.toLowerCase().includes('pizza') || item.name.toLowerCase().includes('bread'));
  const hasBurger = cart.some(item => item.name.toLowerCase().includes('burger') || item.name.toLowerCase().includes('ciabatta') || item.name.toLowerCase().includes('scramble') || item.name.toLowerCase().includes('steak'));
  const hasCoffee = cart.some(item => item.name.toLowerCase().includes('coffee') || item.name.toLowerCase().includes('flat') || item.name.toLowerCase().includes('latte') || item.name.toLowerCase().includes('cortado') || item.name.toLowerCase().includes('brew'));
  const hasPasta = cart.some(item => item.name.toLowerCase().includes('pasta') || item.name.toLowerCase().includes('savory') || item.name.toLowerCase().includes('spaghetti') || item.name.toLowerCase().includes('ravioli'));
  const hasDessert = cart.some(item => item.name.toLowerCase().includes('dessert') || item.name.toLowerCase().includes('sweet') || item.name.toLowerCase().includes('tiramisu') || item.name.toLowerCase().includes('croissant') || item.name.toLowerCase().includes('roll') || item.name.toLowerCase().includes('brownie'));

  const catalog = {
    garlicBread: {
      id: 'gourmet-garlic-bread',
      name: 'Gourmet Garlic Bread',
      price: 5.50,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20garlic%20bread%20on%20a%20slate%20plate%2C%2520golden%2520crust%2C%2520melted%2520garlic%252520butter%252C%252520parsley%252C%252520warm%252520cinematic%25252520lighting%25252C%252525208k%25252520food%25252520photography&image_size=portrait_4_3',
      description: 'Crispy artisanal ciabatta, roasted garlic confit butter, fresh garden parsley.'
    },
    nitroCoffee: {
      id: 'nitro-iced-coffee',
      name: 'Nitro Iced Coffee',
      price: 6.20,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20glass%20of%20nitro%2520cold%2520brew%2520coffee%2520with%2520thick%2520creamy%252520head%252C%252520cascading%252520bubbles%252C%252520frosty%252520glass%252C%252520premium%252520coffee%25252520photography&image_size=portrait_4_3',
      description: 'Creamy nitrogen-infused draft cold brew, cascading micro-bubbles, velvety finish.'
    },
    truffleFries: {
      id: 'truffle-sea-salt-fries',
      name: 'Truffle Sea Salt Fries',
      price: 4.50,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20truffle%20fries%20in%20a%20black%20bowl%2C%2520dusted%2520with%2520parmesan%252520cheese%252C%252520fresh%25252520herbs%252C%25252520luxurious%25252520food%2525252520photography&image_size=portrait_4_3',
      description: 'Hand-cut russet fries, white truffle oil essence, shaved parmesan, flaky sea salt.'
    },
    chocolateShake: {
      id: 'dark-chocolate-shake',
      name: 'Dark Chocolate Shake',
      price: 6.50,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20premium%20dark%20chocolate%20milkshake%20in%20a%20tall%20glass%2C%2520whipped%2520cream%252C%252520chocolate%252520drizzle%252C%252520gourmet%252520dessert%25252520photography&image_size=portrait_4_3',
      description: 'House-made single-origin 72% dark chocolate gelato, organic grass-fed whole milk.'
    },
    fudgeBrownie: {
      id: 'espresso-fudge-brownie',
      name: 'Espresso Fudge Brownie',
      price: 5.50,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20warm%20espresso%20chocolate%20brownie%20with%2520cracked%2520shiny%252520top%252C%252520served%252520on%252520stoneware%252520plate%252C%252520cinematic%25252520lighting&image_size=portrait_4_3',
      description: 'Fudgy triple-chocolate brownie, dark roast espresso injection, flaky Maldon sea salt.'
    },
    almondCroissant: {
      id: 'almond-croissant',
      name: 'Almond Croissant',
      price: 5.40,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20almond%20croissant%20on%20matte%20stone%20plate%2C%20flaky%20layers%2C%20toasted%20almonds%2C%20warm%20cafe%20lighting%2C%20premium%20bakery%20photography%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
      description: 'Flaky multi-layered puff pastry, sweet almond frangipane, toasted almond flakes.'
    },
    yuzuSparkler: {
      id: 'yuzu-citrus-sparkler',
      name: 'Yuzu Citrus Sparkler',
      price: 7.50,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20refreshing%20yuzu%20citrus%20mojito%20mocktail%20with%2520mint%2520leaves%252C%252520lime%252520slices%252C%252520crushed%252520ice%252C%252520glistening%252520condensation&image_size=portrait_4_3',
      description: 'Bright Japanese yuzu purée, muddled garden mint, sparkling organic soda water.'
    },
    flatWhite: {
      id: 'flat-white-silk',
      name: 'Silk Flat White',
      price: 5.90,
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20flat%20white%20in%20a%20minimalist%20porcelain%20cup%20with%20latte%20art%20rosette%2C%20warm%20amber%20lighting%2C%20cinematic%20shadows%2C%20coffee%20shop%20aesthetic%2C%208k%2C%20shallow%20depth%20of%20field&image_size=portrait_4_3',
      description: 'Double ristretto-forward, glossy organic microfoam, natural caramel warmth.'
    }
  };

  const addUnique = (item: RecommendationItem) => {
    if (!addedIds.has(item.id)) {
      recommendations.push(item);
      addedIds.add(item.id);
    }
  };

  if (hasPizza) {
    addUnique(catalog.garlicBread);
    addUnique(catalog.nitroCoffee);
  }
  if (hasBurger) {
    addUnique(catalog.truffleFries);
    addUnique(catalog.chocolateShake);
  }
  if (hasCoffee) {
    addUnique(catalog.fudgeBrownie);
    addUnique(catalog.almondCroissant);
  }
  if (hasPasta) {
    addUnique(catalog.garlicBread);
    addUnique(catalog.yuzuSparkler);
  }
  if (hasDessert) {
    addUnique(catalog.flatWhite);
  }

  if (recommendations.length < 2) {
    addUnique(catalog.truffleFries);
    addUnique(catalog.flatWhite);
    addUnique(catalog.fudgeBrownie);
  }

  return recommendations.slice(0, 3);
}

export default function OrderPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const updateQty = useStore((state) => state.updateCartQty);
  const removeItem = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const addLiveOrder = useStore((state) => state.addLiveOrder);
  const addNotification = useStore((state) => state.addNotification);
  const isOffline = useStore((state) => state.isOffline);
  const addToCartStore = useStore((state) => state.addToCart);

  // Dynamic Location Setup
  const tableNumber = useStore((state) => state.tableNumber);
  const locationId = useStore((state) => state.locationId);
  const activeLocation = locationId || tableNumber;
  const formattedLocation = activeLocation
    ? (activeLocation.includes('Table') || activeLocation.includes('Room') || activeLocation.includes('Café') || activeLocation.includes('Coffee'))
      ? activeLocation
      : `Table ${activeLocation}`
    : '';

  // Zustand persistent guest state details
  const guestNameStore = useStore((state) => state.guestName);
  const guestPhoneStore = useStore((state) => state.guestPhone);
  const guestInstructionsStore = useStore((state) => state.guestInstructions);
  const setGuestDetails = useStore((state) => state.setGuestDetails);

  const createOrderMutation = useCreateOrderMutation();
  const { playSound } = useSoundFeedback();

  // Form states
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [cardName, setCardName] = useState('Rahul Patil');
  const [phone, setPhone] = useState('9876543210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Counter'>('UPI');

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefill details from Zustand store
  useEffect(() => {
    if (mounted) {
      if (guestNameStore) setCardName(guestNameStore);
      if (guestPhoneStore) setPhone(guestPhoneStore);
      if (guestInstructionsStore) setDietaryNotes(guestInstructionsStore);
    }
  }, [mounted, guestNameStore, guestPhoneStore, guestInstructionsStore]);

  // Sync back to Zustand store on change
  useEffect(() => {
    if (mounted) {
      setGuestDetails(cardName, phone, dietaryNotes);
    }
  }, [cardName, phone, dietaryNotes, setGuestDetails, mounted]);

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
      options: { note: 'Checkout dynamic upsell add' }
    });
  };

  const handleAuthorizePayment = () => {
    if (cart.length === 0) {
      addNotification('Cannot check out. Your request is empty.', 'error');
      return;
    }

    if (!cardName.trim() || !phone.trim()) {
      addNotification('Guest Name and Phone Number are required.', 'error');
      return;
    }

    if (isOffline) {
      playSound('chime');
      addNotification('Cannot place request: Reconnecting to operations queue...', 'error');
      return;
    }

    const itemsStr = cart.map((i) => `${i.name} (${i.qty}x)`).join(', ');

    // Add order to live queue on backend
    createOrderMutation.mutate(
      {
        name: cardName,
        phone: phone,
        tableNumber: activeLocation || '4',
        paymentMethod: paymentMethod === 'Counter' ? 'Pay at Counter' : 'UPI',
        specialInstructions: dietaryNotes,
        items: itemsStr,
        total: grandTotal
      },
      {
        onSuccess: (data: any) => {
          playSound('success');
          
          // Sync with local Zustand orders state
          addLiveOrder({
            id: data.id,
            name: data.name,
            phone: data.phone,
            tableNumber: data.tableNumber,
            paymentMethod: data.paymentMethod,
            specialInstructions: data.specialInstructions,
            items: itemsStr,
            total: data.total,
            kotNumber: data.kotNumber,
            createdAt: data.createdAt,
            status: data.status,
            time: data.time
          });

          // Clear local cart
          clearCart();
          
          // Redirect to timeline with table parameter persisted
          router.push(`/order/track?id=${data.id}&table=${activeLocation || '4'}`);
        },
        borderColor: 'red',
        onError: () => {
          addNotification('Payment authorization failed. Server offline.', 'error');
        }
      } as any
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
            OPERATIONS TELEMETRY OFFLINE: RECONNECTING TO SERVICE QUEUES...
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
          <span className="text-muted-steel">Guest Tab • </span>
          <span className="text-[#C58A46] font-bold">{formattedLocation || 'Guest Terminal'}</span>
        </div>
      </div>

      {/* Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
        
        {/* Left Column: Cart Review */}
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-premium-white tracking-tight mb-2 flex items-center gap-3">
              Review Guest Request
              {formattedLocation && (
                <span className="text-xs bg-[#C58A46]/10 text-[#C58A46] border border-[#C58A46]/20 px-2.5 py-1 rounded-full font-mono uppercase font-bold">
                  {formattedLocation}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-steel">Gourmet dining specialties and craft recipes prepared by our master culinary team.</p>
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
                    <h3 className="text-base font-bold text-premium-white">Your Guest Request is empty</h3>
                    <p className="text-xs text-[#8E939E] mt-1 max-w-xs mx-auto">Add a gourmet specialty dish or artisan pastry to begin.</p>
                  </div>
                </div>

                {/* Quick Add Curated Recommendations */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h4 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">Curated Gastronomy Specials</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleQuickAddRecommendation(
                        'bistro-steak',
                        'Aged Angus Bistro Steak',
                        24.50,
                        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20gourmet%20pan%20seared%20ribeye%20steak%20on%20dark%20stoneware%20plate%2C%20herb%20butter%20melting%20on%20top%2C%2520rosemary%2520sprig%2C%2520asparagus%2520spears%2C%2520warm%2520cinematic%2520lighting%2C%25208k%2520food%2520photography&image_size=portrait_4_3'
                      )}
                      className="p-3 bg-white/3 border border-ice-border rounded-xl hover:border-[#C58A46]/25 transition-all text-left flex justify-between items-center gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-premium-white truncate">Angus Bistro Steak</p>
                        <p className="text-[10px] text-muted-steel mt-0.5">Seared prime cut</p>
                      </div>
                      <span className="font-mono text-xs text-[#C58A46] font-bold shrink-0">$24.50 +</span>
                    </button>

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
                  </div>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const isCoffee = item.category?.includes('Café') || item.category?.includes('Coffee') || item.id.includes('latte') || item.id.includes('cappuccino') || item.id.includes('espresso');
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

          {/* DYNAMIC AI RECOMMENDED PAIRINGS ENGINE */}
          {cart.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-ice-border space-y-4 bg-gradient-to-tr from-[#12141C] to-transparent">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C58A46] animate-pulse" />
                <h4 className="text-xs font-bold text-premium-white">AI Recommended Pairings</h4>
              </div>
              <p className="text-[10px] text-muted-steel">Perfect additions selected dynamically based on your current request.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {getRecommendations(cart).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white/3 border border-ice-border rounded-xl flex flex-col justify-between space-y-3 hover:border-[#C58A46]/25 transition-all text-left group"
                  >
                    <div className="space-y-2">
                      <div className="relative h-20 w-full rounded-lg overflow-hidden border border-ice-border">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-premium-white truncate">{item.name}</h5>
                        <p className="text-[9px] text-muted-steel line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-mono text-xs text-[#C58A46] font-bold">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleQuickAddRecommendation(item.id, item.name, item.price, item.image)}
                        className="px-2.5 py-1 rounded bg-[#C58A46]/10 text-[#C58A46] hover:bg-[#C58A46] hover:text-canvas-charcoal transition-all text-[9px] font-bold spring-interaction"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operational notes */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">
              Special Instructions
            </h4>
            <textarea
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              className="w-full glass-card rounded-xl p-4 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all min-h-[90px] placeholder:text-muted-steel/30"
              placeholder="Specify preparation instructions, allergies, dietary requests, or table pacing..."
            />
          </div>
        </section>

        {/* Right Column: Checkout Sidebar */}
        <aside className="space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden border border-ice-border shadow-2xl">
            {/* Bill Summary */}
            <div className="p-6 border-b border-ice-border space-y-4">
              <h2 className="text-base font-bold text-premium-white tracking-tight flex items-center justify-between">
                <span>Bill Summary</span>
                {formattedLocation && <span className="font-mono text-xs bg-[#C58A46]/10 text-[#C58A46] px-2 py-0.5 rounded">{formattedLocation}</span>}
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

              {/* PAYMENT SELECTOR ARCHITECTURE */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#C58A46] bg-[#C58A46]/10 text-[#C58A46] shadow-[0_0_15px_rgba(197,138,70,0.08)]'
                        : 'border-white/5 bg-white/3 text-[#8E939E] hover:border-white/10'
                    }`}
                  >
                    <span className="font-bold text-xs">UPI QR Code</span>
                    <span className="text-[9px] font-mono opacity-80">Instant Digital Pay</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('Counter')}
                    className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border transition-all ${
                      paymentMethod === 'Counter'
                        ? 'border-[#C58A46] bg-[#C58A46]/10 text-[#C58A46] shadow-[0_0_15px_rgba(197,138,70,0.08)]'
                        : 'border-white/5 bg-white/3 text-[#8E939E] hover:border-white/10'
                    }`}
                  >
                    <span className="font-bold text-xs">Pay at Counter</span>
                    <span className="text-[9px] font-mono opacity-80">Settle at checkout</span>
                  </button>
                </div>

                {/* Prep time display */}
                <div className="p-3.5 bg-white/3 border border-ice-border rounded-xl flex items-center justify-between text-xs">
                  <span className="text-muted-steel font-medium">Estimated Prep Time</span>
                  <span className="font-mono text-[#C58A46] font-bold animate-pulse">12-15 minutes</span>
                </div>

                {/* Guest Details Form always visible for operations tracking */}
                <div className="glass-card rounded-xl p-4 border border-ice-border space-y-4 relative overflow-hidden bg-gradient-to-tr from-[#12141C] via-[#161821] to-[#12141C]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-widest text-muted-steel uppercase">Operations Dispatch Form</span>
                    <Sparkles className="h-4 w-4 text-[#C58A46] opacity-75" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-mono text-[7px] tracking-widest text-[#8E939E] uppercase block flex items-center gap-1">
                      <User size={10} className="text-[#C58A46]" /> Guest Name (Required)
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-xs text-premium-white focus:outline-none focus:border-[#C58A46] uppercase font-bold"
                      placeholder="e.g. Rahul Patil"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[7px] tracking-widest text-[#8E939E] uppercase block flex items-center gap-1">
                      <Phone size={10} className="text-[#C58A46]" /> Guest Phone (Required)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-premium-white focus:outline-none focus:border-[#C58A46] tracking-wider"
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>

                  {paymentMethod === 'Counter' && (
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="font-mono text-[7px] tracking-widest text-muted-steel uppercase block">
                        Prepare order instantly, pay at counter later
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'UPI' && (
                    <div className="pt-2 border-t border-white/5 space-y-1 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-mono text-[7px] tracking-widest text-green-400 uppercase block font-bold">
                        UPI QR Code active at table
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Payment button */}
              <button
                onClick={handleAuthorizePayment}
                disabled={cart.length === 0 || createOrderMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-[#C58A46] text-canvas-charcoal font-mono text-xs font-extrabold hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 group spring-interaction shadow-lg"
              >
                <span>PLACE GUEST ORDER</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center mt-4 font-mono text-[8px] text-[#8E939E] uppercase tracking-widest opacity-60">
                Syncing directly with Aura Operations telemetry
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
