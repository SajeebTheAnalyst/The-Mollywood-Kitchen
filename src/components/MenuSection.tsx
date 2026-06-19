import React, { useState } from 'react';
import { Sparkles, Search, SlidersHorizontal, Flame, Star, ShoppingCart, Info } from 'lucide-react';
import { MenuItem } from '../types';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

interface MenuSectionProps {
  onSelectMenuItem: (item: MenuItem) => void;
  onQuickAddToCart: (item: MenuItem, spiceLevel: number, qty: number) => void;
}

export default function MenuSection({
  onSelectMenuItem,
  onQuickAddToCart
}: MenuSectionProps) {
  const { menuItems } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('bengali');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyPopular, setOnlyPopular] = useState<boolean>(false);

  const categories = [
    { id: 'bengali', label: '🐟 Bengali' },
    { id: 'indian', label: '🍛 Indian' },
    { id: 'chinese', label: '🥢 Chinese & Set Menu' },
    { id: 'snacks-beverages', label: '🍹 Drinks & Snacks' },
  ];

  // Filtering Logic
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = searchQuery ? true : (item.category === selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPopular = !onlyPopular || item.popular;
    return matchesCategory && matchesSearch && matchesPopular;
  });

  const getSpiceStyle = (level: number) => {
    if (level === 0) return 'hidden';
    if (level === 1) return 'text-amber-500 bg-amber-950/30';
    if (level === 2) return 'text-orange-500 bg-orange-950/30';
    return 'text-red-500 bg-red-950/30 font-bold';
  };

  const getSpiceLabel = (level: number) => {
    if (level === 1) return 'Mild 🌶️';
    if (level === 2) return 'Hot 🔥';
    if (level === 3) return 'Inferno 🔥🔥';
    return '';
  };

  return (
    <section id="menu" className="py-20 lg:py-28 bg-black scroll-mt-10">
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
            <Sparkles className="h-3 w-3 text-gold" />
            <span>Signature Collection</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
            Our <span className="text-gold italic font-normal">Kitchen</span> Menu
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-secondary max-w-xl mx-auto font-light leading-relaxed">
            Discover our rich variety of freshly prepared Bengali, Indian, Chinese, and fast-food favorites cooked with premium ingredients and authentic spices.
          </p>
        </motion.div>

        {/* Category Navigation - Highly Responsive, Centered Flex-Wrap */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 w-full">
          {categories.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-3 px-6 rounded-sm text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border ${
                selectedCategory === c.id
                  ? 'bg-gold text-black border-gold shadow-xl shadow-gold/10'
                  : 'bg-transparent text-text-secondary border-white/10 hover:text-text-primary hover:border-white/30'
              }`}
            >
              {c.label}
            </motion.button>
          ))}
        </div>

        {/* Filter & Search Bar - Clean & Symmetrical */}
        <div className="bg-zinc-950/90 border border-zinc-900 p-4 rounded-2xl mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between z-10 relative">
          
          {/* Quick Search bar */}
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search our delicious dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-white text-xs pl-10 pr-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-gold placeholder:text-zinc-500 transition-colors"
            />
          </div>

          {/* Toggle Blockbuster feature */}
          <button
            onClick={() => setOnlyPopular(!onlyPopular)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
              onlyPopular
                ? 'bg-gold/15 border-gold text-gold shadow-md shadow-gold/5'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Popular Only</span>
          </button>
          
        </div>

        {/* Display Filtered Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-zinc-900 bg-zinc-950/20 max-w-md mx-auto">
            <Info className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
            <h4 className="font-heading text-base font-bold text-zinc-300">No dishes match your search</h4>
            <p className="text-xs text-zinc-500 mt-1">Try resetting the popular filter or clearing some words.</p>
            <button
              onClick={() => { setSelectedCategory('bengali'); setSearchQuery(''); setOnlyPopular(false); }}
              className="mt-4 px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-gold text-[10px] uppercase font-bold tracking-widest rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, boxShadow: "0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(245,158,11,0.06)" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-sm bg-zinc-950 border border-white/5 hover:border-gold/30 hover:bg-zinc-900/50 transition-all duration-500 p-4"
                >
                
                {/* Visual Thumbnail Plate Header */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-900 mb-4 cursor-pointer" onClick={() => onSelectMenuItem(item)}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-sm flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    <span className="text-[10px] font-bold text-white tracking-widest">{item.rating}</span>
                  </div>

                  {/* Spice Level Overlay */}
                  {item.spiceLevel > 0 && (
                    <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-sm text-[8px] font-bold tracking-[0.2em] uppercase flex items-center space-x-1 ${getSpiceStyle(item.spiceLevel)}`}>
                      <Flame className="h-3 w-3" />
                      <span>{getSpiceLabel(item.spiceLevel)}</span>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {item.popular && (
                    <span className="absolute top-3 right-3 bg-gold text-black text-[8px] font-black px-2 py-1 rounded-sm tracking-[0.3em] uppercase">
                      Signature
                    </span>
                  )}
                </div>

                {/* Card description layout details */}
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-gold tracking-widest uppercase truncate transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed font-light line-clamp-2 mt-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions & pricing footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="font-heading text-lg font-bold text-gold">
                      ৳{item.price.toLocaleString()}
                    </span>

                    {/* Quick detail selector CTA */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onSelectMenuItem(item)}
                        className="text-text-secondary hover:text-white text-[9px] font-bold uppercase tracking-[0.2em] transition-colors underline underline-offset-4"
                      >
                        Details
                      </button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          onQuickAddToCart(item, item.spiceLevel, 1);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition-all duration-300 shadow-lg shadow-gold/5"
                      >
                        <ShoppingCart className="h-4.5 w-4.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      </div>
    </section>
  );
}
