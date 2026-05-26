'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Bot, ShoppingCart, Mic, Send, Star, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useChatMutation, useQrMenuQuery } from '@/services/api';
import { coffeeMenuItems } from '@/components/coffee-menu/coffeeMenuData';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  upsellItem?: {
    id: string;
    name: string;
    price: number;
    image: string;
  } | null;
}

export default function ChatbotPage() {
  const cart = useStore((state) => state.cart);
  const subtotal = useStore((state) => state.getCartSubtotal());
  const addToCart = useStore((state) => state.addToCart);
  const addNotification = useStore((state) => state.addNotification);
  
  const chatMutation = useChatMutation();
  const qrMenuQuery = useQrMenuQuery();

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to **RestaurantOS**. I’m your **AI Concierge** — I can recommend items, build premium combos, and help you order faster. Try: **“something cold and sweet”**, **“best coffee for evening”**, or **“show popular items”**.",
      time: 'Just Now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!mounted) return null;

  const menuSource = qrMenuQuery.data && qrMenuQuery.data.length > 0 ? qrMenuQuery.data : coffeeMenuItems;

  const localFallback = (message: string) => {
    const t = message.toLowerCase();
    const pickBest = (predicate: (x: any) => boolean) => {
      const items = menuSource.filter(predicate).slice().sort((a, b) => b.rating - a.rating);
      return items[0] || null;
    };

    if (t.includes('cold') || t.includes('iced') || t.includes('refresh')) {
      const pick = pickBest((x) => x.category === 'Cold Coffee' || x.category === 'Refreshers');
      return {
        text: `Cold + premium: **${pick ? pick.name : 'Nitro Cold Brew'}**. Want a pairing (bakery or dessert) too?`,
        upsellItem: pick ? { id: pick.id, name: pick.name, price: pick.price, image: pick.image } : null,
      };
    }

    if (t.includes('sweet') || t.includes('dessert') || t.includes('chocolate')) {
      const pick = pickBest((x) => x.category === 'Desserts' || x.category === 'Bakery');
      return {
        text: `Sweet recommendation: **${pick ? pick.name : 'Espresso Tiramisu'}**. Want me to add it, or build a full combo?`,
        upsellItem: pick ? { id: pick.id, name: pick.name, price: pick.price, image: pick.image } : null,
      };
    }

    if (t.includes('popular') || t.includes('trending')) {
      const pick = pickBest((x) => x.tags?.includes('Trending') || x.tags?.includes('Popular'));
      return {
        text: `Top pick right now: **${pick ? pick.name : 'Silk Flat White'}**. Want the drink only, or a pairing?`,
        upsellItem: pick ? { id: pick.id, name: pick.name, price: pick.price, image: pick.image } : null,
      };
    }

    const pick = pickBest(() => true);
    return {
      text: `Tell me what you want: **hot/cold**, **sweet/bold**, and I’ll recommend the best match. Example: “cold and sweet”.`,
      upsellItem: pick ? { id: pick.id, name: pick.name, price: pick.price, image: pick.image } : null,
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Post User message
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: currentTime
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // 2. Post to backend
    chatMutation.mutate(textToSend, {
      onSuccess: (data) => {
        const aiMsg: Message = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          upsellItem: data.upsellItem
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
      },
      onError: (err) => {
        const fallback = localFallback(textToSend);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: fallback.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            upsellItem: fallback.upsellItem
          }
        ]);
      }
    });
  };

  const handleQuickAdd = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      options: { note: 'AI Concierge Recommendation' }
    });
  };

  const handleMicClick = () => {
    addNotification('Voice concierge microphone active. Listening...', 'info');
  };

  return (
    <main className="pt-nav-height min-h-screen max-w-grid-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-gutter flex-1">
      
      {/* Left Column: Chat Interface */}
      <section className="flex flex-col h-[calc(100vh-nav-height)] py-8 relative">
        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 pb-36 pr-2">
          
          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-primary-container border border-ice-border shadow-lg text-canvas-charcoal'
                      : 'glass-card text-[#C58A46]'
                  }`}
                >
                  {isUser ? (
                    <User className="font-bold" size={24} />
                  ) : (
                    <Bot className="font-bold" size={24} />
                  )}
                </div>

                {/* Content Bubble */}
                <div
                  className={`p-5 rounded-2xl shadow-xl ${
                    isUser
                      ? 'user-bubble rounded-tr-none'
                      : 'glass-card rounded-tl-none border-l-2 border-l-[#C58A46]/40'
                  }`}
                >
                  <p
                    className="font-body-md text-sm text-premium-white leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C58A46] font-bold">$1</strong>')
                    }}
                  />
                  
                  {/* Upsell Card */}
                  {!isUser && msg.upsellItem && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-ice-border flex items-center justify-between gap-4 transition-all hover:border-[#C58A46]/30">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                          <Image
                            src={msg.upsellItem.image}
                            alt={msg.upsellItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-premium-white">{msg.upsellItem.name}</h5>
                          <p className="text-[10px] text-[#C58A46] font-mono">${msg.upsellItem.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickAdd(msg.upsellItem!)}
                        className="px-3 py-1.5 bg-[#C58A46] hover:brightness-110 text-canvas-charcoal font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 spring-interaction"
                      >
                        <ShoppingCart size={16} />
                        Add to Bill
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] font-mono text-muted-steel mt-3 block uppercase tracking-widest leading-none">
                    {isUser ? 'You' : 'AI Concierge'} • {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0">
                <Bot className="text-[#C58A46] animate-pulse" size={24} />
              </div>
              <div className="glass-card p-5 rounded-2xl rounded-tl-none border-l-2 border-l-[#C58A46]/40 w-full shimmer-loader h-20"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interaction Input Bar at Bottom */}
        <div className="absolute bottom-0 left-0 w-full py-6 bg-gradient-to-t from-canvas-charcoal via-canvas-charcoal/95 to-transparent z-10">
          {/* Quick Action Chips */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => handleSendMessage('Recommend something cold and sweet.')}
              className="whitespace-nowrap px-4 py-2 rounded-full glass-card text-xs text-premium-white hover:border-[#C58A46]/50 transition-all spring-interaction"
            >
              🧊 Cold & Sweet
            </button>
            <button
              onClick={() => handleSendMessage('Best coffee for evening?')}
              className="whitespace-nowrap px-4 py-2 rounded-full glass-card text-xs text-premium-white hover:border-[#C58A46]/50 transition-all spring-interaction"
            >
              🌙 Evening Pick
            </button>
            <button
              onClick={() => handleSendMessage('Show popular items.')}
              className="whitespace-nowrap px-4 py-2 rounded-full glass-card text-xs text-premium-white hover:border-[#C58A46]/50 transition-all spring-interaction"
            >
              🔥 Popular Now
            </button>
          </div>
          
          {/* Text Input */}
          <div className="glass-card p-2 rounded-2xl flex items-center gap-2 group transition-all shadow-2xl">
            <div className="flex-1 px-4">
              <input
                id="chat-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputVal);
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-premium-white placeholder:text-muted-steel/40"
                placeholder="Ask the AI Concierge (recommendations, combos, FAQs)..."
              />
            </div>
            <button
              onClick={handleMicClick}
              className="w-10 h-10 flex items-center justify-center text-muted-steel hover:text-[#C58A46] transition-colors spring-interaction rounded-full hover:bg-white/5"
            >
              <Mic size={20} />
            </button>
            <button
              onClick={() => handleSendMessage(inputVal)}
              className="bg-[#C58A46] text-canvas-charcoal px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 spring-interaction shadow-lg"
            >
              <span>Send</span>
              <Send className="font-bold" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Recommendations Sidebar */}
      <aside className="py-8 space-y-6 hidden lg:block overflow-y-auto h-[calc(100vh-nav-height)] custom-scrollbar pr-1">
        
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#C58A46] uppercase mb-4 flex items-center gap-2">
            AI Concierge Picks
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </h2>
          
          <div className="space-y-4">
            {menuSource
              .slice()
              .sort((a, b) => b.rating - a.rating)
              .filter((x) => x.tags?.includes('Trending') || x.tags?.includes('Popular'))
              .slice(0, 2)
              .map((pick) => (
                <div
                  key={pick.id}
                  className="glass-card rounded-xl overflow-hidden group spring-interaction border border-ice-border hover:border-[#C58A46]/35 transition-all"
                >
                  <div className="h-44 relative">
                    <Image
                      src={pick.image}
                      alt={pick.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-md">
                      <Star className="text-[#C58A46] fill-current" size={16} />
                      <span className="text-[10px] font-bold font-mono">{pick.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1 gap-4">
                      <h3 className="text-sm font-bold text-premium-white truncate">{pick.name}</h3>
                      <span className="font-mono text-[#C58A46] text-sm font-bold shrink-0">
                        ${pick.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-muted-steel text-[11px] mb-3 line-clamp-2">
                      {pick.description}
                    </p>
                    <button
                      onClick={() =>
                        handleQuickAdd({
                          id: pick.id,
                          name: pick.name,
                          price: pick.price,
                          image: pick.image
                        })
                      }
                      className="w-full bg-[#C58A46] text-canvas-charcoal py-2.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 spring-interaction"
                    >
                      <ShoppingCart className="font-bold" size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}

          </div>
        </div>

        {/* Current Checklist Summary */}
        <div className="glass-card p-5 rounded-xl border border-ice-border">
          <h4 className="text-[10px] font-mono tracking-widest text-muted-steel uppercase mb-3 opacity-60 leading-none">
            Session Tab Details
          </h4>
          
          <div className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-xs text-muted-steel italic">No items logged on your table yet.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-[#C58A46] flex items-center justify-center bg-[#C58A46]/10 shrink-0">
                    <Check className="text-[#C58A46] font-bold" size={14} />
                  </div>
                  <span className="text-xs text-premium-white flex-1 truncate">
                    {item.name} ({item.qty}x)
                  </span>
                  <span className="font-mono text-muted-steel text-xs shrink-0">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-ice-border">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-muted-steel">Tab Subtotal</span>
              <span className="font-mono text-[#C58A46] font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/order"
              className="block w-full py-3 rounded-lg bg-glass-fill border border-ice-border hover:border-[#C58A46]/50 text-[#C58A46] font-bold text-xs text-center transition-all spring-interaction shadow-lg"
            >
              Finalize & Pay Bill
            </Link>
          </div>
        </div>
      </aside>
    </main>
  );
}
