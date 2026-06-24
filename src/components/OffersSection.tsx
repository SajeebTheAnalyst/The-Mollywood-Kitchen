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

  const activeOffers = offers.filter(o => o.isActive !== false);

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
              className="relative overflow-hidden rounded-[2rem] bg-zinc-950 border border-gold/10 hover:border-gold/30 transition-all duration-500 flex flex-col md:flex-row shadow-2xl"
            >
              
              {/* Visual Thumbnail Banner */}
              <div className="relative w-full md:w-5/12 h-64 md:h-full min-h-[250px] bg-zinc-900 flex-shrink-0 p-4">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Offer Text Configurations */}
              <div className="flex-1 w-full p-8 md:p-10 flex flex-col justify-between space-y-6 bg-zinc-950/90 z-10">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-black px-3 py-1 bg-accent-red text-white rounded-full tracking-widest uppercase shadow-xl">
                      {offer.badge || 'SPECIAL OFFER'}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
                      {offer.category || 'PROMO'}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl md:text-3xl font-black text-gold tracking-widest uppercase leading-tight line-clamp-2">
                    {offer.title}
                  </h3>
                  
                  <div className="flex flex-col">
                     <span className="text-zinc-500 line-through text-sm font-mono decoration-red-500/50">
                        Before: ৳{offer.beforePrice || 400}
                     </span>
                     <span className="font-heading text-3xl font-black text-accent-red mt-1">
                        Now ৳{offer.nowPrice || 280}
                     </span>
                  </div>

                  <p className="font-sans text-xs text-zinc-300 font-light leading-relaxed">
                    {offer.description}
                  </p>
                  
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Expires: {offer.endDate || 'Limited Time'}
                  </div>
                </div>

                {/* Promo Coupon copy bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[9px] text-zinc-500 font-bold tracking-[0.2em] uppercase leading-none">Promotion Code</span>
                    <span className="font-mono text-lg font-black text-white uppercase tracking-widest">{offer.code}</span>
                  </div>

                  {/* Copy trigger button */}
                  <motion.button
                    onClick={() => handleCopyCode(offer.code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 border cursor-pointer shrink-0 ${
                      copiedCode === offer.code
                        ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        : 'bg-white border-white text-black hover:bg-zinc-200 shadow-lg'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="h-4 w-4" />
                        <span>{offer.buttonText || 'CLAIM CODE'}</span>
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
