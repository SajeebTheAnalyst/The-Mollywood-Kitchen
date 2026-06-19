import React, { useState } from 'react';
import { Play, ArrowLeft, ArrowRight, Star, Flame, ShoppingCart, Film, Leaf } from 'lucide-react';
import { MenuItem } from '../types';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onExploreMenu: () => void;
  onBookTable: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
}

export default function Hero({
  onExploreMenu,
  onBookTable,
  onSelectMenuItem
}: HeroProps) {
  const { menuItems, heroSettings } = useStore();
  const highlightDishes = menuItems.filter(it => it.popular).slice(0, 4);

  return (
    <>
      {/* 1. HERO SECTION (Top Half) */}
      <section className="relative min-h-[90vh] lg:h-[85vh] flex flex-col justify-center overflow-hidden bg-bg-premium pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-accent-red/5 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[30rem] h-[30rem] rounded-full bg-gold/5 blur-[100px]" />
          
          {/* Floating Atmospheric Greenery */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 15, 0],
              x: [0, 10, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[15%] left-[8%] blur-[1px]"
          >
            <Leaf className="h-10 w-10 rotate-12" color="#16a34a" fill="#22c55e" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -20, 0],
              x: [0, -15, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[25%] left-[45%] blur-[2px]"
          >
            <Leaf className="h-16 w-16 -rotate-12" color="#15803d" fill="#16a34a" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [10, 40, 10]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] right-[5%] blur-[1px]"
          >
            <Leaf className="h-8 w-8" color="#16a34a" fill="#22c55e" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 40, 0],
              rotate: [-10, -30, -10]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] right-[20%] blur-[2px]"
          >
            <Leaf className="h-12 w-12" color="#15803d" fill="#16a34a" strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 lg:gap-0 items-center z-10">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col space-y-10"
          >
            <div className="space-y-8">
              {/* Premium Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3"
              >
                <motion.span 
                  animate={{ 
                    color: ["#D4AF37", "#DC2626", "#D4AF37"],
                    opacity: [1, 0.4, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl font-bold"
                >
                  |
                </motion.span>
                <span className="text-[10px] font-bold tracking-[0.4em] text-text-secondary uppercase">
                  Explore the premium food
                </span>
              </motion.div>

              <h1 className="font-heading text-6xl md:text-[6.5rem] font-bold text-white leading-[0.95] tracking-tight whitespace-pre-line italic">
                {heroSettings.headline || "Experience the\nArt of Bengali\nDining"}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6">
                <motion.button
                  onClick={onExploreMenu}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-accent-red text-white font-bold tracking-wide text-sm shadow-xl transition-all cursor-pointer shadow-accent-red/20"
                >
                  View Menu
                </motion.button>

                <motion.button
                  onClick={onBookTable}
                  whileHover={{ scale: 1.05, backgroundColor: "white", color: "black" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full border-2 border-white text-white font-bold tracking-wide text-sm transition-all cursor-pointer"
                >
                  Book A Table
                </motion.button>
              </div>
            </div>

            {/* Review Section (Simplified) */}
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 text-gold fill-current" />
                ))}
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-text-secondary uppercase">
                Top Rated Dining
              </span>
            </div>
          </motion.div>

          {/* Right Content - Fixed Circular Frame (700x700px on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[320px] lg:max-w-[650px] aspect-square rounded-full flex-shrink-0 group">
              {/* Luxury Glowing Aura */}
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 30px 2px rgba(212, 175, 55, 0.1)", 
                    "0 0 60px 15px rgba(212, 175, 55, 0.25)", 
                    "0 0 30px 2px rgba(212, 175, 55, 0.1)"
                  ],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full z-0"
              />
              
              <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 z-10">
                <img
                  src={heroSettings.heroImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=100&w=1400"}
                  alt="Main Dish"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED ITEMS SECTION (Below Hero) */}
      <section className="relative z-20 bg-bg-premium py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col space-y-12">
            <div className="flex items-center">
              <span className="text-[10px] tracking-[0.4em] text-text-secondary uppercase whitespace-nowrap">Signature Selection</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 overflow-x-auto lg:overflow-visible pb-10 lg:pb-0 no-scrollbar snap-x">
              {highlightDishes.map((dish) => (
                <motion.div
                  key={dish.id}
                  whileHover={{ y: -15 }}
                  onClick={() => onSelectMenuItem(dish)}
                  className="bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/5 group cursor-pointer flex flex-col shadow-2xl snap-center min-w-[280px] sm:min-w-0 h-full"
                >
                  <div className="aspect-square w-full rounded-[2rem] overflow-hidden mb-6">
                    <img src={dish.image} alt={dish.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-white line-clamp-1">{dish.name}</h4>
                      <p className="text-sm text-zinc-400 line-clamp-2 italic">{dish.description || 'Premium House Specialty'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                      <span className="text-2xl font-bold text-accent-red font-mono">৳{dish.price}</span>
                      <button className="h-12 w-12 rounded-full bg-accent-red flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 active:scale-95 shadow-accent-red/20">
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
