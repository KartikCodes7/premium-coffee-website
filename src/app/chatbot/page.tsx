'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useChatMutation } from '@/services/api';

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

  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Good evening! I'm your AI Sommelier and Culinary Concierge. I've noted you are examining our premium dinner options tonight. Would you like a tailored wine pairing for our **Signature Wagyu**, a dietary check, or maybe a quick reservation at our window booth?",
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

  // Client-Side AI Engine Logic
  const sommelierResponses = [
    {
      keywords: ['wine', 'wagyu', 'steak', 'pair', 'red wine'],
      text: "For our succulent **Signature Wagyu**, our Sommelier highly recommends the **2018 Napa Valley Cabernet Sauvignon** ($95/bottle). Its robust, velvet tannins slice beautifully through the rich Wagyu fat. Shall I add a bottle of this vintage to your selection?",
      item: { id: 'napa-cabernet', name: 'Napa Valley Cabernet 2018', price: 95.00, image: '/assets/order_gin.png' }
    },
    {
      keywords: ['scallop', 'seafood', 'white wine', 'chardonnay', 'chablis'],
      text: "Our caramelized **Seared Scallops** pair impeccably with the crisp **Chablis Premier Cru 2020** ($110/bottle). The high acidity and bright mineral citrus notes highlight the delicate sweetness of Hokkaido shellfish. Would you like me to reserve a bottle for your table?",
      item: { id: 'chablis-2020', name: 'Chablis Premier Cru 2020', price: 110.00, image: '/assets/order_gin.png' }
    },
    {
      keywords: ['gluten', 'allergy', 'coeliac', 'wheat'],
      text: "Absolutely. Our **Seared Scallops** with saffron emulsion and our **Signature Wagyu** (when prepared with marrow reduction instead of teriyaki marrow jus) are 100% gluten-free. I have notified the kitchen of this preference.",
      item: null
    },
    {
      keywords: ['book', 'reserve', 'table', 'tonight'],
      text: "I can coordinate a reservation for you instantly. I've locked in a prime glassmorphic window booth for **4 guests tonight at 20:30** under the name Elena. I have sent the confirmation via SMS.",
      item: null
    },
    {
      keywords: ['cocktail', 'drink', 'gin', 'obsidian'],
      text: "Try our signature **Obsidian Gin & Tonic** ($22.00). It features cold-brewed butterfly pea flower infused gin, wild elderflower tonic, and a fresh rosemary sprig. Shall I prepare one at the bar for you?",
      item: { id: 'obsidian-gin', name: 'Obsidian Gin & Tonic', price: 22.00, image: '/assets/order_gin.png' }
    }
  ];

  const fallbackResponses = [
    "An excellent selection. Our master chefs prepare each signature dish to reflect modern gastronomy. Would you like me to arrange an optimal beverage accompaniment or record special preparation notes for the culinary crew?",
    "Understood. I am adding that operational preference to your table context. What else can I assist you with regarding our premium evening menu?",
    "Fascinating preference. At Aura Gastronomy, we curate each detail of the seating layout and dish pacing to optimize your evening. Would you like to review checkout subtotal details?"
  ];

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
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: "My apologies. I encountered a minor networking delay while accessing our wine reserve logs. Please try again.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      options: { note: 'AI Sommelier Recommendation' }
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
                      : 'glass-card text-[#E5C158]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl font-bold">
                    {isUser ? 'person' : 'smart_toy'}
                  </span>
                </div>

                {/* Content Bubble */}
                <div
                  className={`p-5 rounded-2xl shadow-xl ${
                    isUser
                      ? 'user-bubble rounded-tr-none'
                      : 'glass-card rounded-tl-none border-l-2 border-l-[#E5C158]/40'
                  }`}
                >
                  <p
                    className="font-body-md text-sm text-premium-white leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E5C158] font-bold">$1</strong>')
                    }}
                  />
                  
                  {/* Upsell Card */}
                  {!isUser && msg.upsellItem && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-ice-border flex items-center justify-between gap-4 transition-all hover:border-[#E5C158]/30">
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
                          <p className="text-[10px] text-[#E5C158] font-mono">${msg.upsellItem.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickAdd(msg.upsellItem!)}
                        className="px-3 py-1.5 bg-[#E5C158] hover:brightness-110 text-canvas-charcoal font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1 spring-interaction"
                      >
                        <span className="material-symbols-outlined text-xs">add_shopping_cart</span>
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
                <span className="material-symbols-outlined text-[#E5C158] text-xl animate-pulse">smart_toy</span>
              </div>
              <div className="glass-card p-5 rounded-2xl rounded-tl-none border-l-2 border-l-[#E5C158]/40 w-full shimmer-loader h-20"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interaction Input Bar at Bottom */}
        <div className="absolute bottom-0 left-0 w-full py-6 bg-gradient-to-t from-canvas-charcoal via-canvas-charcoal/95 to-transparent z-10">
          {/* Quick Action Chips */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => handleSendMessage('What wines pair well with the Signature Wagyu?')}
              className="whitespace-nowrap px-4 py-2 rounded-full glass-card text-xs text-premium-white hover:border-[#E5C158]/50 transition-all spring-interaction"
            >
              🍷 Pair Wagyu Steak
            </button>
            <button
              onClick={() => handleSendMessage('Are there any gluten-free entrees?')}
              className="whitespace-nowrap px-4 py-2 rounded-full glass-card text-xs text-premium-white hover:border-[#E5C158]/50 transition-all spring-interaction"
            >
              🌾 Gluten-Free Items
            </button>
            <button
              onClick={() => handleSendMessage('Book a table for 4 guests tonight')}
              className="whitespace-nowrap px-4 py-2 rounded-full glass-card text-xs text-premium-white hover:border-[#E5C158]/50 transition-all spring-interaction"
            >
              📅 Book Window Booth
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
                placeholder="Ask the AI Sommelier or Menu Concierge..."
              />
            </div>
            <button
              onClick={handleMicClick}
              className="w-10 h-10 flex items-center justify-center text-muted-steel hover:text-[#E5C158] transition-colors spring-interaction rounded-full hover:bg-white/5"
            >
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button
              onClick={() => handleSendMessage(inputVal)}
              className="bg-[#E5C158] text-canvas-charcoal px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 spring-interaction shadow-lg"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-sm font-bold">send</span>
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Recommendations Sidebar */}
      <aside className="py-8 space-y-6 hidden lg:block overflow-y-auto h-[calc(100vh-nav-height)] custom-scrollbar pr-1">
        
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#E5C158] uppercase mb-4 flex items-center gap-2">
            Culinary Sommelier Recommendations
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          </h2>
          
          <div className="space-y-4">
            
            {/* Recommendation 1 */}
            <div className="glass-card rounded-xl overflow-hidden group spring-interaction border border-ice-border hover:border-[#E5C158]/35 transition-all">
              <div className="h-44 relative">
                <Image
                  src="/assets/chatbot_steak.png"
                  alt="Signature Wagyu"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[#E5C158] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-[10px] font-bold font-mono">4.9</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-premium-white">Signature Wagyu</h3>
                  <span className="font-mono text-[#E5C158] text-sm font-bold">$124.00</span>
                </div>
                <p className="text-muted-steel text-[11px] mb-3 line-clamp-2">
                  Grade A5 Kobe beef, butter-poached with smoked marrow jus and truffle mash.
                </p>
                <button
                  onClick={() =>
                    handleQuickAdd({
                      id: 'wagyu-steak',
                      name: 'Signature Wagyu',
                      price: 124.00,
                      image: '/assets/chatbot_steak.png'
                    })
                  }
                  className="w-full bg-[#E5C158] text-canvas-charcoal py-2.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 spring-interaction"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add_shopping_cart</span>
                  Add to Table Order
                </button>
              </div>
            </div>

            {/* Recommendation 2 */}
            <div className="glass-card rounded-xl overflow-hidden group spring-interaction border border-ice-border hover:border-[#E5C158]/35 transition-all">
              <div className="h-44 relative">
                <Image
                  src="/assets/chatbot_scallops.png"
                  alt="Seared Scallops"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[#E5C158] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-[10px] font-bold font-mono">4.7</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-premium-white">Seared Scallops</h3>
                  <span className="font-mono text-[#E5C158] text-sm font-bold">$38.00</span>
                </div>
                <p className="text-muted-steel text-[11px] mb-3 line-clamp-2">
                  Hokkaido scallops with pea purée, crispy pancetta, and citrus emulsion.
                </p>
                <button
                  onClick={() =>
                    handleQuickAdd({
                      id: 'seared-scallops',
                      name: 'Seared Scallops',
                      price: 38.00,
                      image: '/assets/chatbot_scallops.png'
                    })
                  }
                  className="w-full bg-[#E5C158] text-canvas-charcoal py-2.5 rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 spring-interaction"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add_shopping_cart</span>
                  Add to Table Order
                </button>
              </div>
            </div>

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
                  <div className="w-4 h-4 rounded border border-[#E5C158] flex items-center justify-center bg-[#E5C158]/10 shrink-0">
                    <span className="material-symbols-outlined text-[#E5C158] text-[10px] font-bold">check</span>
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
              <span className="font-mono text-[#E5C158] font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/order"
              className="block w-full py-3 rounded-lg bg-glass-fill border border-ice-border hover:border-[#E5C158]/50 text-[#E5C158] font-bold text-xs text-center transition-all spring-interaction shadow-lg"
            >
              Finalize & Pay Bill
            </Link>
          </div>
        </div>
      </aside>
    </main>
  );
}
