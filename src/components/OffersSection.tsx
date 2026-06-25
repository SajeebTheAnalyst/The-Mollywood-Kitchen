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
      <span className="text-red-500 font-mono text-[9px] font-bold tracking-wider uppercase bg-red-950/20 px-2 py-0.5 rounded border border-red-500/10">
        Expired
      </span>
    );
  }

  if (status === 'upcoming') {
    return (
      <div className="flex items-center space-x-1 text-amber-500 font-mono text-[9px] font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/10">
        <Clock className="h-3 w-3 animate-pulse text-amber-500" />
        <span>STARTS: {timeLeft}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-gold font-mono text-[9px] font-bold bg-gold/5 px-2 py-0.5 rounded border border-gold/15 animate-pulse">
      <Clock className="h-3 w-3 text-gold" />
      <span>ENDS: {timeLeft}</span>
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

  // Filter and sort active offers (sorting by displayOrder ascending)
  const activeOffers = offers
    .filter(o => {
      // Must be active and set to show on homepage
      if (o.isActive === false) return false;
      if (o.showOnHome === false) return false;
      
      const now = new Date();
      const endStr = `${o.endDate || '2026-12-31'}T${o.endTime || '23:59'}:00`;
      const endDate = new Date(endStr);
      return now <= endDate;
    })
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
  };

  if (activeOffers.length === 0) {
    return null; // hide section if no active offers exist
  }

  // Adjust current index if it goes out of bounds when offers are deleted or updated
  const safeIndex = currentIndex >= activeOffers.length ? 0 : currentIndex;

  const renderOfferCard = (offer: OfferItem) => {
    return (
      <div
        className="group relative overflow-hidden rounded-2xl bg-zinc-950 border border-gold/20 hover:border-gold/40 transition-all duration-500 flex flex-col md:flex-row shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.04)] w-full md:h-[260px]"
      >
        {/* Left Side: Large Food Image (Exactly 45% of card area) */}
        <div className="w-full md:w-[45%] h-44 md:h-full shrink-0 relative overflow-hidden bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-900/80">
          <img
            src={offer.image}
            alt={offer.title}
            className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Compact Offer Information (55% of card area) */}
        <div className="w-full md:w-[55%] p-5 sm:p-6 flex flex-col justify-between space-y-3 bg-black">
          
          {/* Title and Description */}
          <div className="space-y-1.5 md:space-y-2">
            <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase leading-tight group-hover:text-gold transition-colors duration-300 line-clamp-1">
              {offer.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed line-clamp-2 md:line-clamp-3">
              {offer.description}
            </p>
          </div>

          {/* Expiry / Timer and Promo Code combined in a compact grid */}
          <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            
            {/* Validity and Timer Column */}
            <div className="space-y-1">
              <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">VALID UNTIL</span>
              <span className="text-xs text-zinc-300 font-mono font-medium block">
                {offer.endDate ? new Date(`${offer.endDate}T${offer.endTime || '23:59'}:00`).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Limited Season'}
              </span>
              <div className="pt-0.5">
                <OfferTimer offer={offer} />
              </div>
            </div>

            {/* Code Copy Column */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="text-left sm:text-right">
                <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">PROMO CODE</span>
                <span className="font-mono text-base font-black text-gold uppercase tracking-wider leading-none">
                  {offer.code}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(offer.code)}
                className={`px-4 py-2.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 border cursor-pointer select-none shrink-0 ${
                  copiedCode === offer.code
                    ? 'bg-emerald-500 border-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/10'
                    : 'bg-gold border-gold text-black hover:bg-amber-400 hover:shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                }`}
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Ticket className="h-3.5 w-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  };

  return (
    <section id="offers" className="py-16 lg:py-24 bg-black border-t border-zinc-900 scroll-mt-10 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-3 mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-zinc-400 tracking-[0.3em] uppercase">
            <Tag className="h-3 w-3 text-gold" />
            <span>EXQUISITE RESTAURANT OFFERS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight leading-none uppercase">
            SPECIAL <span className="text-gold italic font-normal">PROMOTIONS</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light leading-relaxed">
            Experience our premium culinary masterpieces with our hand-crafted, limited-edition promotional offers.
          </p>
        </motion.div>

        {activeOffers.length === 1 ? (
          /* Single Offer Display */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            {renderOfferCard(activeOffers[0])}
          </motion.div>
        ) : (
          /* Multiple Offers Carousel Slider */
          <div className="relative max-w-5xl mx-auto">
            
            {/* Horizontal Slider Layout: ◀ [Offer Card] ▶ */}
            <div className="flex items-center justify-between gap-3 sm:gap-6 md:gap-8 w-full">
              
              {/* Left Arrow Button (◀) */}
              <button
                onClick={handlePrev}
                className="p-3 sm:p-4 rounded-full border border-gold/25 bg-zinc-950 text-gold hover:text-white hover:bg-zinc-900 hover:border-gold/50 transition-all cursor-pointer select-none shrink-0"
                aria-label="Previous Offer"
              >
                <span className="text-xs sm:text-sm font-bold block select-none">◀</span>
              </button>

              {/* Offer Card Viewport */}
              <div className="flex-1 overflow-hidden min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-full"
                  >
                    {renderOfferCard(activeOffers[safeIndex])}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Arrow Button (▶) */}
              <button
                onClick={handleNext}
                className="p-3 sm:p-4 rounded-full border border-gold/25 bg-zinc-950 text-gold hover:text-white hover:bg-zinc-900 hover:border-gold/50 transition-all cursor-pointer select-none shrink-0"
                aria-label="Next Offer"
              >
                <span className="text-xs sm:text-sm font-bold block select-none">▶</span>
              </button>

            </div>

            {/* Slider Indicators (● ○ ○) */}
            <div className="flex justify-center items-center space-x-2.5 mt-6 sm:mt-8">
              {activeOffers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === safeIndex 
                      ? 'bg-gold border border-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
                      : 'bg-transparent border border-zinc-700 hover:border-gold/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
