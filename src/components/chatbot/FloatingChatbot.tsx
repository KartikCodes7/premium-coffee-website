'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface FloatingMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  upsellItem?: {
    id: string;
    name: string;
    price: number;
    image: string;
  } | null;
}

export default function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<FloatingMessage[]>([
    { id: 1, sender: 'ai', text: 'Good evening! I am your AI Sommelier and Culinary Concierge. How can I elevate your dining experience tonight?' }
  ]);

  const addToCart = useStore((state) => state.addToCart);
  const addNotification = useStore((state) => state.addNotification);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Disable floating assistant if we are already inside the full screen chatbot page
  if (pathname === '/chatbot' || pathname === '/login' || pathname === '/signup') return null;
  if (!mounted) return null;

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
    "Understood. I am adding that operational preference to your table context. What else can I assist you with regarding our premium evening menu?"
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      const match = sommelierResponses.find(r =>
        r.keywords.some(kw => lower.includes(kw))
      );

      const responseText = match ? match.text : fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      const upsellItem = match ? match.item : null;

      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText, upsellItem }]);
    }, 1200);
  };

  const handleAddUpsell = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      options: { note: 'AI Sommelier Float Upsell' }
    });
    addNotification(`Added ${item.name} via AI Sommelier`, 'success');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9997]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-80 h-96 bg-[#12141C] border border-ice-border rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-ice-border bg-[#0B0C0E]/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#E5C158] text-base animate-pulse">smart_toy</span>
                <span className="text-xs font-bold text-premium-white">AI Sommelier Lounge</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/5 text-[#8E939E] hover:text-premium-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0B0C0E]/10">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-primary-container text-canvas-charcoal' : 'glass-card text-[#E5C158]'}`}>
                      <span className="material-symbols-outlined text-xs font-bold">{isUser ? 'person' : 'smart_toy'}</span>
                    </div>
                    <div className={`p-3.5 rounded-xl text-xs space-y-2 leading-relaxed ${isUser ? 'bg-[#12141C] border border-white/5 rounded-tr-none text-premium-white' : 'glass-card border-l-2 border-l-[#E5C158]/40 rounded-tl-none text-premium-white'}`}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#E5C158] font-bold">$1</strong>')
                        }}
                      />
                      {!isUser && m.upsellItem && (
                        <div className="p-2 bg-white/5 rounded-lg border border-ice-border flex items-center justify-between gap-3 mt-2">
                          <div className="min-w-0">
                            <p className="font-bold truncate text-[10px] text-premium-white">{m.upsellItem.name}</p>
                            <p className="text-[9px] text-[#E5C158] font-mono">${m.upsellItem.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => handleAddUpsell(m.upsellItem!)}
                            className="px-2.5 py-1 bg-[#E5C158] text-canvas-charcoal font-bold text-[9px] rounded-md hover:brightness-110 shrink-0"
                          >
                            Add to Cart
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full glass-card flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#E5C158] text-xs animate-pulse">smart_toy</span>
                  </div>
                  <div className="glass-card p-4 rounded-xl rounded-tl-none border-l-2 border-l-[#E5C158]/40 w-full shimmer-loader h-12"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-2 border-t border-ice-border bg-[#0B0C0E]/30 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask sommelier pairings..."
                className="flex-1 bg-white/5 border border-ice-border rounded-xl px-3 py-2 text-xs text-premium-white focus:outline-none focus:border-[#E5C158] transition-all placeholder:text-muted-steel/30"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 bg-[#E5C158] text-canvas-charcoal rounded-xl flex items-center justify-center hover:brightness-110 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-sm font-bold">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating round Robot badge button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#E5C158] text-canvas-charcoal rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-95 transition-all spring-interaction"
      >
        <span className="material-symbols-outlined text-2xl font-bold">smart_toy</span>
      </button>
    </div>
  );
}
