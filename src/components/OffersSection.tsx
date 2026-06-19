import React, { useState } from 'react';
import { Tag, Sparkles, Ticket, Check, Film, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

export default function OffersSection() {
  const { offers } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Only render active elements
  const activeOffers = offers.filter(o => o.active);

  return (
    <section id="offers" className="py-20 lg:py-28 bg-black/95 border-t border-zinc-900 scroll-mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.3em] uppercase">
            <Tag className="h-3 w-3 text-gold" />
            <span>Exclusive Promotions</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
            Seasonal <span className="text-gold italic font-normal">Delights</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-secondary max-w-md mx-auto font-light leading-relaxed">
            Claim delicious promo code discounts on our signature recipes! Present these promo codes to your server or use them during checkouts.
          </p>
        </motion.div>

        {/* Promo Cards Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeOffers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative overflow-hidden rounded-sm bg-zinc-950 border border-white/5 hover:border-gold/30 transition-all duration-500 p-6 flex flex-col md:flex-row gap-8 items-center shadow-2xl"
            >
              
              {/* Visual Thumbnail Banner */}
              <div className="relative w-full md:w-48 h-56 md:h-full min-h-[200px] rounded-sm overflow-hidden bg-zinc-900 flex-shrink-0">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Offer Text Configurations */}
              <div className="flex-1 w-full flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold px-3 py-1 bg-gold text-black rounded-sm tracking-widest uppercase">
                      {offer.badge}
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary tracking-widest uppercase">
                      {offer.category}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-text-primary tracking-widest uppercase leading-tight">
                    {offer.title}
                  </h3>
                  
                  <div className="text-3xl font-heading font-black text-gold tracking-wider leading-none">
                    {offer.discount}
                  </div>

                  <p className="font-sans text-xs text-text-secondary font-light leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Promo Coupon copy bar */}
                <div className="border-t border-white/5 pt-6 flex items-center justify-between gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[9px] text-text-secondary font-bold tracking-[0.2em] uppercase leading-none">Promotion Code</span>
                    <span className="font-mono text-sm font-black text-text-primary uppercase tracking-widest">{offer.code}</span>
                  </div>

                  {/* Copy trigger button */}
                  <motion.button
                    onClick={() => handleCopyCode(offer.code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 border cursor-pointer ${
                      copiedCode === offer.code
                        ? 'bg-emerald-500 border-emerald-500 text-black'
                        : 'bg-transparent border-white/10 text-text-secondary hover:border-gold hover:text-gold'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="h-3.5 w-3.5" />
                        <span>Claim Code</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
