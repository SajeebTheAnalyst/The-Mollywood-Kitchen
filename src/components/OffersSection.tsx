import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Ticket, 
  Check, 
  Clock,
  X,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OfferItem, MenuItem } from '../types';
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

interface OffersSectionProps {
  onAddToCart?: (item: MenuItem, spiceLevel: number, qty: number) => void;
}

export default function OffersSection({ onAddToCart }: OffersSectionProps) {
  const { offers, showToast } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo Code "${code}" copied successfully!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper to trigger the checkout / cart drawer opening
  const openCartDropdown = () => {
    const button = document.getElementById('cart-button');
    if (button) {
      const dropdown = document.getElementById('checkout-dropdown');
      if (!dropdown) {
        (button as HTMLElement).click();
      }
    }
  };

  const handleOfferAddToCart = (offer: OfferItem, orderNow: boolean) => {
    if (!onAddToCart) {
      showToast('Cart system is currently initializing.', 'error');
      return;
    }
    
    // Construct a beautiful virtual MenuItem representing this promotional package
    const virtualItem: MenuItem = {
      id: `offer-${offer.id}`,
      name: offer.title,
      price: offer.offerPrice || 0,
      description: offer.description,
      rating: 5,
      popular: true,
      category: 'bengali',
      image: offer.image,
      ingredients: offer.includedItems ? offer.includedItems.split(',').map(i => i.trim()) : [],
      spiceLevel: 0,
      specialty: 'Special Combo Offer'
    };

    onAddToCart(virtualItem, 0, 1);
    showToast(`Added "${offer.title}" to your order!`, 'success');

    if (orderNow) {
      setTimeout(() => {
        openCartDropdown();
      }, 150);
    }
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
        className="group relative overflow-hidden rounded-2xl bg-zinc-950 border border-gold/20 hover:border-gold/40 transition-all duration-500 flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.06)] w-full md:h-[380px]"
      >
        {/* Left Side: Large Food Image (Exactly 50% of card area) */}
        <div className="w-full md:w-1/2 h-56 md:h-full shrink-0 relative overflow-hidden bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-900/80">
          <img
            src={offer.image}
            alt={offer.title}
            className="h-full w-full object-cover object-center scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800';
            }}
          />
          {/* Tag Category Badge */}
          <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md border border-gold/40 text-gold text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded tracking-widest z-10">
            {offer.category ? `${offer.category} offer` : 'Special Promo'}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Right Side: luxurious Offer Information (50% of card area) */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-7 flex flex-col justify-between space-y-3.5 bg-black">
          
          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-wide uppercase leading-tight group-hover:text-gold transition-colors duration-300 line-clamp-2">
              {offer.title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-zinc-350 font-light leading-relaxed line-clamp-2">
              {offer.description}
            </p>

            {/* Premium Price Tag Indicator */}
            {offer.offerPrice !== undefined && (
              <div className="flex items-center gap-3 pt-0.5">
                <span className="text-xs text-zinc-500 font-mono line-through">
                  ৳{offer.originalPrice ?? (offer.offerPrice + 120)}
                </span>
                <span className="text-lg font-bold font-mono text-gold flex items-center gap-1">
                  <span className="text-[10px] text-gold/60 font-light font-sans">Promo Price:</span>
                  ৳{offer.offerPrice}
                </span>
              </div>
            )}
          </div>

          {/* Expiry / Timer and Promo Code combined in a compact grid */}
          <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
            
            {/* Validity and Timer Column */}
            <div className="space-y-1">
              <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">VALID UNTIL</span>
              <span className="text-xs text-zinc-350 font-mono font-medium block">
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
            <div className="flex items-center justify-between sm:justify-end gap-3 bg-zinc-950 border border-zinc-900 rounded-xl p-2 md:p-2.5">
              <div className="text-left">
                <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">PROMO CODE</span>
                <span className="font-mono text-xs md:text-sm font-black text-white uppercase tracking-wider">
                  {offer.code}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(offer.code)}
                className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer select-none shrink-0 ${
                  copiedCode === offer.code
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900 text-gold hover:bg-zinc-800'
                }`}
              >
                {copiedCode === offer.code ? 'COPIED' : 'COPY'}
              </button>
            </div>

          </div>

          {/* Action Flows */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setSelectedOffer(offer)}
              className="w-full py-2.5 rounded-xl text-[10px] font-mono font-bold tracking-widest uppercase border border-zinc-850 hover:border-gold/30 text-zinc-300 hover:text-white bg-zinc-950 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Info className="h-3.5 w-3.5 text-gold" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => handleOfferAddToCart(offer, false)}
              className="w-full py-2.5 rounded-xl text-[10px] font-sans font-bold tracking-widest uppercase bg-gold hover:bg-amber-400 text-black shadow-lg shadow-gold/5 hover:shadow-gold/15 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add To Cart</span>
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section id="offers" className="py-10 lg:py-14 bg-black border-t border-zinc-900 scroll-mt-10 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-3 mb-8"
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
                <ChevronLeft className="h-5 w-5 block" />
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
                <ChevronRight className="h-5 w-5 block" />
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

      {/* Offers Detail Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold/30 bg-zinc-950 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-[160]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-4 right-4 z-25 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white transition-all hover:border-gold/40 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Large Image Header */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden border-b border-zinc-900">
                <img
                  src={selectedOffer.image}
                  alt={selectedOffer.title}
                  className="h-full w-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block bg-gold text-black text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded tracking-widest mb-2">
                    {selectedOffer.category ? `${selectedOffer.category} package` : 'PROMOTION'}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                    {selectedOffer.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider">Campaign Overview</h4>
                  <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {selectedOffer.description}
                  </p>
                </div>

                {/* Included Items Section */}
                {selectedOffer.includedItems && (
                  <div className="space-y-2 bg-black/40 border border-zinc-900 rounded-xl p-4">
                    <h4 className="text-[10px] font-mono uppercase font-bold text-gold tracking-wider">What's Included in this Offer</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedOffer.includedItems.split(',').map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing and Promo Code Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-zinc-900/30 border border-zinc-900 rounded-xl p-4">
                  {/* Pricing Info */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 tracking-wider block">Exclusive Price Offer</span>
                    <div className="flex items-baseline gap-2">
                      {selectedOffer.offerPrice !== undefined ? (
                        <>
                          <span className="text-sm text-zinc-500 font-mono line-through">
                            ৳{selectedOffer.originalPrice ?? (selectedOffer.offerPrice + 120)}
                          </span>
                          <span className="text-2xl font-bold font-mono text-gold">
                            ৳{selectedOffer.offerPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gold font-sans font-semibold">Special Discount Active</span>
                      )}
                    </div>
                  </div>

                  {/* Copy Promo Code */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 bg-black/40 border border-zinc-900 rounded-lg p-2.5">
                    <div>
                      <span className="text-[8px] text-zinc-500 font-mono font-bold tracking-widest uppercase block">PROMO CODE</span>
                      <span className="font-mono text-sm font-black text-white uppercase tracking-wider">
                        {selectedOffer.code}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(selectedOffer.code)}
                      className={`px-3 py-1.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        copiedCode === selectedOffer.code
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-gold border border-zinc-700'
                      }`}
                    >
                      {copiedCode === selectedOffer.code ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                {/* Footer Controls / Conversion Flow */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-zinc-900">
                  <button
                    onClick={() => {
                      handleOfferAddToCart(selectedOffer, false);
                      setSelectedOffer(null);
                    }}
                    className="flex-1 py-3.5 rounded-xl border border-zinc-800 hover:border-gold/30 hover:text-white bg-zinc-950 text-zinc-300 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4 text-gold" />
                    <span>Add To Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      handleOfferAddToCart(selectedOffer, true);
                      setSelectedOffer(null);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-gold text-black font-sans text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Order Now</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
