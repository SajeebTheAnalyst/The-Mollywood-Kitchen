import React, { useState } from 'react';
import { Tag, Sparkles, Ticket, Check, Film, Flame } from 'lucide-react';
import { OFFERS_DATA } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

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
          <div className="inline-flex items-center space-x-1.5 bg-zinc-900 border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase">
            <Tag className="h-3 w-3" />
            <span>SPECIAL OFFERS & PROMOTIONS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest leading-none">
            TODAY’S SPECIAL DEALS
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold via-accent-red to-gold mx-auto rounded-full" />
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light">
            Claim delicious promo code discounts on our signature recipes! Present these promo codes to your server or use them during checkouts.
          </p>
        </motion.div>

        {/* Promo Cards Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {OFFERS_DATA.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-900/80 hover:border-gold/30 hover:bg-zinc-900/10 transition-all duration-500 p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg hover:shadow-gold/5"
            >
              
              {/* Visual Thumbnail Banner */}
              <div className="relative w-full md:w-44 h-48 md:h-full min-h-[170px] rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="h-full w-full object-cover grayscale-[30%] hover:scale-[1.03] hover:grayscale-0 duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Accent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                
                {/* Savings ribbon tag inside image */}
                <div className="absolute top-3 left-3 bg-accent-red text-white text-[10px] font-black px-3 py-1 rounded tracking-wider shadow-md uppercase">
                  ACTIVE DEALS
                </div>
              </div>

              {/* Offer Text Configurations */}
              <div className="flex-1 w-full flex flex-col justify-between space-y-4">
                
                <div className="space-y-1.5">
                  
                  {/* Badge Row */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-extrabold pb-0.5 px-2 bg-gradient-to-r from-gold to-gold-dark text-neutral-900 rounded-full tracking-wider uppercase">
                      {offer.badge}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-zinc-500">CATEGORY: {offer.category.toUpperCase()}</span>
                  </div>

                  {/* Title and slogan */}
                  <h3 className="font-heading text-lg font-black text-white tracking-wide uppercase">
                    {offer.title}
                  </h3>
                  <p className="text-[10px] font-mono tracking-widest font-extrabold text-gold uppercase leading-none">
                    {offer.tagline}
                  </p>
                  
                  {/* Price/Discount Display */}
                  <div className="text-xl font-heading font-black text-glow-red text-amber-500 pt-1 tracking-wider leading-none">
                    {offer.discount}
                  </div>

                  <p className="font-sans text-xs text-zinc-400 font-light leading-relaxed mt-2">
                    {offer.description}
                  </p>
                </div>

                {/* Promo Coupon copy bar */}
                <div className="border-t border-zinc-900 pt-4 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase leading-none">PROMO CODE</span>
                    <span className="font-mono text-sm font-black text-white mt-1 select-all">{offer.code}</span>
                  </div>

                  {/* Copy trigger button */}
                  <motion.button
                    onClick={() => handleCopyCode(offer.code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-widest transition-all duration-300 flex items-center space-x-1.5 border cursor-pointer ${
                      copiedCode === offer.code
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-gold hover:text-gold'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>COPIED CODE</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="h-3.5 w-3.5 animate-pulse" />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </motion.button>
                </div>

              </div>
              
              {/* Gold light corner indicator decoration */}
              <div className="absolute right-0 bottom-0 h-4 w-4 bg-gradient-to-tr from-gold/10 via-transparent to-transparent pointer-events-none" />

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
