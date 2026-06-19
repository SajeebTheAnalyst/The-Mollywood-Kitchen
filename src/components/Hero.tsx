import React, { useState } from 'react';
import { Play, ArrowLeft, ArrowRight, Star, Flame, ShoppingCart, Film } from 'lucide-react';
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
  const { menuItems } = useStore();
  const highlightDishes = menuItems.filter(it => it.popular).slice(0, 4);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-bg-premium py-20 px-4 sm:px-6 lg:px-8">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[60rem] h-[60rem] rounded-full bg-gold/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-gold-secondary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 border-l-2 border-gold px-4 py-1"
            >
              <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Premium Dining Experience</span>
            </motion.div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-black text-text-primary leading-[1.1] tracking-tight">
              Authentic <br />
              <span className="text-gold">Bengali Flavours</span>
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed font-light">
              Traditional Bengali recipes crafted with fresh ingredients, rich flavours, and warm hospitality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <motion.button
              onClick={onExploreMenu}
              whileHover={{ scale: 1.05, backgroundColor: "#C98A2E" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-sm bg-gold text-black font-bold tracking-widest text-xs uppercase shadow-2xl transition-all duration-300 cursor-pointer"
            >
              Explore Menu
            </motion.button>

            <motion.button
              onClick={onBookTable}
              whileHover={{ scale: 1.05, borderColor: "#D4AF37", color: "#D4AF37" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-sm border border-text-secondary text-text-secondary font-bold tracking-widest text-xs uppercase hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              Reservation
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-8 pt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-gold">4.9/5</span>
              <span className="text-[10px] tracking-widest text-text-secondary uppercase">Google Rating</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-gold">15+</span>
              <span className="text-[10px] tracking-widest text-text-secondary uppercase">Years of Heritage</span>
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[500px] aspect-square">
            {/* Soft Shadow behind the image */}
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-[80px] animate-pulse" />
            
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative z-10 w-full h-full"
            >
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=100&w=800"
                alt="Premium Bengali Kacchi Biryani"
                className="w-full h-full object-cover rounded-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-8 border-bg-premium"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gold-secondary text-black p-4 rounded-full font-bold text-sm shadow-xl flex flex-col items-center">
                <span>Must</span>
                <span>Try</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Popular Slider Preview (Simplified for Premium feel) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block w-full max-w-7xl px-8">
        <div className="flex items-center space-x-6">
          <span className="text-[10px] tracking-[0.4em] text-text-secondary uppercase whitespace-nowrap">Signature Dishes</span>
          <div className="h-px w-full bg-white/10" />
          <div className="flex space-x-4">
            {highlightDishes.map((dish) => (
              <div 
                key={dish.id} 
                className="group cursor-pointer"
                onClick={() => onSelectMenuItem(dish)}
              >
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
