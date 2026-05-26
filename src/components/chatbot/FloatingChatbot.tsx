'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useChatMutation } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bot, X, User, Send } from 'lucide-react';

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
    { id: 1, sender: 'ai', text: 'Hello! I am your AI Barista Concierge. How can I elevate your premium coffee experience today?' }
  ]);

  const addToCart = useStore((state) => state.addToCart);
  const addNotification = useStore((state) => state.addNotification);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useChatMutation();

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
      keywords: ['sweet', 'sugar', 'caramel', 'honey'],
      text: "For a sweet coffee experience, our AI Barista highly recommends our **Caramel Cloud Cappuccino** ($6.80) or **Saffron Honey Latte** ($7.20). Their rich, velvety microfoam and amber caramel drizzle are perfect sweeteners. Would you like me to add one to your checkout ticket?",
      item: { id: 'caramel-cloud-cappuccino', name: 'Caramel Cloud Cappuccino', price: 6.80, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20cappuccino%20with%20thick%20foam%20and%20caramel%20drizzle%2C%20latte%20art%2C%20warm%20cafe%20lighting%2C%20high%2520contrast%2C%2520premium%2520coffee%2520photography%2C%25208k&image_size=portrait_4_3' }
    },
    {
      keywords: ['cold', 'iced', 'nitro', 'frappe'],
      text: "Our signature **Nitro Cold Brew** ($6.20) is outstanding. It is nitrogen-infused on tap for a cascading, velvety head with a chocolate-forward body. For a sweeter cold drink, try the **Obsidian Iced Mocha** ($6.90). Shall I prepare one over crystal ice for you?",
      item: { id: 'nitro-cold-brew', name: 'Nitro Cold Brew', price: 6.20, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20nitro%20cold%20brew%20cascading%20in%20a%20tall%20glass%2C%20thick%20creamy%20foam%20head%2C%20moody%20dark%20background%2C%20warm%20highlights%2C%20high%2520contrast%2C%25208k%2520beverage%2520photography&image_size=portrait_4_3' }
    },
    {
      keywords: ['cappuccino', 'flat white', 'latte', 'pair', 'combo'],
      text: "A classic milk coffee like our **Silk Flat White** pairs exceptionally well with our warm, buttery **Almond Croissant** ($5.40) or our glazed **Atelier Cinnamon Roll** ($5.90). The flaky pastry layers highlight the espresso's ristretto caramel notes. Shall I add a pastry pairing to your bill?",
      item: { id: 'almond-croissant', name: 'Almond Croissant', price: 5.40, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ultra%20realistic%20almond%20croissant%20on%20matte%20stone%20plate%2C%20flaky%20layers%2C%20toasted%20almonds%2C%20warm%20cafe%20lighting%2C%2520premium%2520bakery%2520photography%2C%25208k%2C%2520shallow%2520depth%2520of%2520field&image_size=portrait_4_3' }
    },
    {
      keywords: ['vegetarian', 'veg', 'meatless'],
      text: "All our bakery pastries, desserts, and our gourmet **Caprese Melt** ($9.60) on toasted Ciabatta are 100% vegetarian. I have logged these preferences for your table.",
      item: null
    },
    {
      keywords: ['book', 'reserve', 'table', 'tonight'],
      text: "Certainly. I have locked in a premium B2B window booth reservation for **2 guests tomorrow at 18:00** under the name Elena Rostova. Your table confirmation has been dispatched.",
      item: null
    }
  ];

  const fallbackResponses = [
    "An exquisite café selection. Our baristas grind every single-origin bean to order to capture maximum flavor. Would you like me to recommend a matching artisan pastry or lock in custom preparation notes?",
    "Understood. Adding your operational preferences to your active table session. What else can I prepare for you today from our gourmet bar?"
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    chatMutation.mutate(userText, {
      onSuccess: (data) => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: data.text, upsellItem: data.upsellItem }
        ]);
      },
      onError: (err) => {
        setIsTyping(false);
        const lowerMessage = userText.toLowerCase();
        const match = sommelierResponses.find(r =>
          r.keywords.some(kw => lowerMessage.includes(kw))
        );

        const text = match ? match.text : fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        const upsellItem = match ? match.item : null;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: text,
            upsellItem: upsellItem
          }
        ]);
      }
    });
  };

  const handleAddUpsell = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      options: { note: 'AI Barista Float Upsell' }
    });
    addNotification(`Added ${item.name} via AI Barista`, 'success');
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
                <Bot className="text-[#C58A46] animate-pulse" size={20} />
                <span className="text-xs font-bold text-premium-white">AI Barista Concierge</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/5 text-[#8E939E] hover:text-premium-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0B0C0E]/10">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-primary-container text-canvas-charcoal' : 'glass-card text-[#C58A46]'}`}>
                      {isUser ? (
                        <User className="font-bold" size={16} />
                      ) : (
                        <Bot className="font-bold" size={16} />
                      )}
                    </div>
                    <div className={`p-3.5 rounded-xl text-xs space-y-2 leading-relaxed ${isUser ? 'bg-[#12141C] border border-white/5 rounded-tr-none text-premium-white' : 'glass-card border-l-2 border-l-[#C58A46]/40 rounded-tl-none text-premium-white'}`}>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C58A46] font-bold">$1</strong>')
                        }}
                      />
                      {!isUser && m.upsellItem && (
                        <div className="p-2 bg-white/5 rounded-lg border border-ice-border flex items-center justify-between gap-3 mt-2">
                          <div className="min-w-0">
                            <p className="font-bold truncate text-[10px] text-premium-white">{m.upsellItem.name}</p>
                            <p className="text-[9px] text-[#C58A46] font-mono">${m.upsellItem.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => handleAddUpsell(m.upsellItem!)}
                            className="px-2.5 py-1 bg-[#C58A46] text-canvas-charcoal font-bold text-[9px] rounded-md hover:brightness-110 shrink-0"
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
                    <Bot className="text-[#C58A46] animate-pulse" size={16} />
                  </div>
                  <div className="glass-card p-4 rounded-xl rounded-tl-none border-l-2 border-l-[#C58A46]/40 w-full shimmer-loader h-12"></div>
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
                placeholder="Ask our AI Barista..."
                className="flex-1 bg-white/5 border border-ice-border rounded-xl px-3 py-2 text-xs text-premium-white focus:outline-none focus:border-[#C58A46] transition-all placeholder:text-muted-steel/30"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 bg-[#C58A46] text-canvas-charcoal rounded-xl flex items-center justify-center hover:brightness-110 transition-colors shrink-0"
              >
                <Send className="font-bold" size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating round Robot badge button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#C58A46] text-canvas-charcoal rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-95 transition-all spring-interaction"
      >
        <Bot className="font-bold" size={32} />
      </button>
    </div>
  );
}
