import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Ticket, 
  Check, 
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OfferItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Live Countdown Timer linked to actual admin controls (Start/End Date + Time)
function OfferTimer({ offer }: { offer: OfferItem }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [status, setStatus] = useState<'upcoming' | 'active' | 'expired'>('active');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      const startStr = `${offer.startDate || '2026-06-01'}T${offer.startTime || '00:00'}:00`;
      const endStr = `${offer.endDate || '2026-12-31'}T${offer.endTime || '23:59'}:00`;
      
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      
      if (now < startDate) {
        setStatus('upcoming');
        const diff = startDate.getTime() - now.getTime();
        setTimeLeft(formatDuration(diff));
      } else if (now > endDate) {
        setStatus('expired');
        setTimeLeft('Expired');
      } else {
        setStatus('active');
        const diff = endDate.getTime() - now.getTime();
        setTimeLeft(formatDuration(diff));
      }
    };

    const formatDuration = (ms: number) => {
      const totalSecs = Math.floor(ms / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      if (days > 0) {
        return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
      }
      return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [offer]);

  if (status === 'expired') {
    return (
      <span className="text-red-500 font-mono text-xs font-bold tracking-wider uppercase bg-red-950/20 px-3 py-1 rounded-full border border-red-500/10">
        Expired
      </span>
    );
  }

  if (status === 'upcoming') {
    return (
      <div className="flex items-center space-x-1.5 text-amber-500 font-mono text-xs font-bold bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/10">
        <Clock className="h-3.5 w-3.5 animate-pulse text-amber-500" />
        <span>STARTS IN: {timeLeft}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1.5 text-gold font-mono text-xs font-bold bg-gold/5 px-3 py-1 rounded-full border border-gold/15">
      <Clock className="h-3.5 w-3.5 animate-pulse text-gold" />
      <span>EXPIRES IN: {timeLeft}</span>
    </div>
  );
}

export default function OffersSection() {
  const { offers } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter active offers and automatically hide expired ones
  const activeOffers = offers.filter(o => {
    if (o.isActive === false) return false;
    
    const now = new Date();
    const endStr = `${o.endDate || '2026-12-31'}T${o.endTime || '23:59'}:00`;
    const endDate = new Date(endStr);
    return now <= endDate;
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
  };

  if (activeOffers.length === 0) {
    return null; // hide section if no active offers exist
  }

  // Adjust current index if it goes out of bounds when offers are deleted
  const safeIndex = currentIndex >= activeOffers.length ? 0 : currentIndex;

  const renderOfferCard = (offer: OfferItem) => {
    return (
      <div
        className="group relative overflow-hidden rounded-3xl bg-zinc-950 border border-gold/15 hover:border-gold/30 transition-all duration-500 flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.06)] w-full"
      >
        {/* Left Side: Large Food Image (45% exact layout) */}
        <div className="w-full md:w-[45%] h-72 md:h-auto min-h-[320px] relative overflow-hidden shrink-0 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-900/80">
          <img
            src={offer.image}
            alt={offer.title}
            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-700 ease-out"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Offer Information (55% exact layout) */}
        <div className="w-full md:w-[55%] p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-zinc-950">
          
          {/* Title and Description */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wide uppercase leading-tight group-hover:text-gold transition-colors duration-300">
              {offer.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* Expiry and Real Countdown Timer */}
          <div className="pt-5 border-t border-zinc-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">VALID UNTIL</span>
              <span className="text-xs text-zinc-300 font-mono font-medium">
                {offer.endDate ? new Date(`${offer.endDate}T${offer.endTime || '23:59'}:00`).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Limited Season'}
              </span>
            </div>

            <div className="shrink-0">
              <OfferTimer offer={offer} />
            </div>
          </div>

          {/* Promo Code & Copy Button */}
          <div className="pt-5 border-t border-zinc-900/80 flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase block mb-1">PROMO CODE</span>
              <span className="font-mono text-lg sm:text-xl font-black text-gold uppercase tracking-wider leading-none">
                {offer.code}
              </span>
            </div>

            <button
              onClick={() => handleCopyCode(offer.code)}
              className={`px-5 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 border cursor-pointer select-none shrink-0 ${
                copiedCode === offer.code
                  ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-bold'
                  : 'bg-gold border-gold text-black hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]'
              }`}
            >
              {copiedCode === offer.code ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Ticket className="h-4 w-4" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section id="offers" className="py-20 lg:py-28 bg-black border-t border-zinc-900 scroll-mt-10 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-zinc-400 tracking-[0.3em] uppercase">
            <Tag className="h-3 w-3 text-gold" />
            <span>VIP EXCLUSIVE PROMOTIONS</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase">
            SPECIAL <span className="text-gold italic font-normal">PROMOTIONS</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
            Experience our premium culinary masterpieces with bespoke seasonal luxury passes. Present your coupon code to your server to claim your reward.
          </p>
        </motion.div>

        {activeOffers.length === 1 ? (
          /* Single Offer Display */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {renderOfferCard(activeOffers[0])}
          </motion.div>
        ) : (
          /* Multiple Offers Carousel Slider */
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full"
              >
                {renderOfferCard(activeOffers[safeIndex])}
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation (← Offer →) & Indicators (● ○ ○) */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-10">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handlePrev}
                  className="text-gold hover:text-amber-400 font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer select-none bg-zinc-950 border border-gold/15 hover:border-gold/30 px-4 py-2 rounded-xl"
                >
                  <span>← PREV</span>
                </button>
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest px-3 py-1 bg-zinc-900/30 rounded-lg border border-zinc-900">
                  {safeIndex + 1} / {activeOffers.length}
                </span>
                <button
                  onClick={handleNext}
                  className="text-gold hover:text-amber-400 font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer select-none bg-zinc-950 border border-gold/15 hover:border-gold/30 px-4 py-2 rounded-xl"
                >
                  <span>NEXT →</span>
                </button>
              </div>
              
              <div className="flex justify-center items-center space-x-2.5">
                {activeOffers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === safeIndex ? 'w-6 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'w-2.5 bg-zinc-800 hover:bg-zinc-600'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
