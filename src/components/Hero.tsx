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
  const { menuItems, heroSettings } = useStore();
  // Get popular showstopper dishes to map to the highlight reel slider
  const highlightDishes = menuItems.filter(it => it.popular).slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % highlightDishes.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + highlightDishes.length) % highlightDishes.length);
  };

  // Static floating leaves configuration for cinematic atmosphere
  const floatingLeaves = [
    { id: 1, top: '15%', left: '10%', size: 'w-8 h-8', delay: '0s', rotate: 'rotate-45' },
    { id: 2, top: '25%', right: '8%', size: 'w-10 h-10', delay: '1.5s', rotate: 'rotate-12' },
    { id: 3, top: '65%', left: '45%', size: 'w-6 h-6', delay: '3.2s', rotate: 'rotate-90' },
    { id: 4, bottom: '20%', right: '48%', size: 'w-12 h-12', delay: '2.1s', rotate: 'rotate-[180deg]' },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-12 md:py-20 cinematic-gradient-bg min-h-screen flex flex-col justify-between">
      
      {/* Background cinematic visuals: Glowing light leak and film strip watermark */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-accent-red/20 blur-[130px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      {/* Floating Cine-Leaves */}
      {floatingLeaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute ${leaf.top || ''} ${leaf.bottom || ''} ${leaf.left || ''} ${leaf.right || ''} ${leaf.size} pointer-events-none z-10 opacity-70 transition-all duration-[6000ms] animate-float`}
          style={{ animationDelay: leaf.delay }}
        >
          <svg className={`w-full h-full text-zinc-500 fill-zinc-800 ${leaf.rotate}`} viewBox="0 0 24 24">
            <path d="M17,8C8,10 5,16 5,16C5,16 8,9 17,8M21,2C21,2 14,3 10,8C6,12 4,19 4,19C4,19 11,18 15,14C19,10 21,2 21,2Z" />
          </svg>
        </div>
      ))}

      {/* Top Section Layout: Headline vs Hero Spotlight Dish */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8">
          
          {/* Main Headline Block (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            
            {/* Ribbon tag */}
            <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-gold/20 px-3.5 py-1.5 rounded-full w-fit">
              <span className="text-[10px] font-bold tracking-[0.25em] text-gold uppercase">
                Pirganj, Rangpur, Bangladesh
              </span>
            </div>

            {/* Slogan & Heading */}
            <div className="space-y-1">
              <span className="font-heading text-xs font-bold tracking-[0.4em] text-zinc-400 block uppercase">
                {heroSettings.restaurantName || "MOLLYWOOD KITCHEN"}
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                {heroSettings.headline.split('&')[0]} & <br />
                <span className="text-gold-metallic text-glow-gold drop-shadow-xl font-normal block italic sm:inline">{heroSettings.headline.split('&')[1] || "Indian Flavours,"}</span> <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent italic font-normal">
                  {heroSettings.subheading}
                </span>
              </h1>
            </div>

            <p className="font-sans text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed font-light">
              {heroSettings.subheading}
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                onClick={onExploreMenu}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="relative group overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-accent-red to-accent-red-hover hover:from-gold hover:to-gold-dark text-white hover:text-neutral-950 font-bold tracking-widest text-xs uppercase transition-all duration-500 shadow-xl shadow-accent-red/20 hover:shadow-gold/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>{heroSettings.buttonText || "Explore Menu"}</span>
              </motion.button>

              <motion.button
                onClick={onBookTable}
                whileHover={{ scale: 1.05, border: "1px solid #f59e0b", color: "#f59e0b", boxShadow: "0 10px 25px rgba(245, 158, 11, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border border-white text-white font-bold tracking-widest text-xs uppercase bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                Book a Table
              </motion.button>
            </div>

            {/* Customer reviews badge */}
            <div className="flex items-center space-x-4 pt-6 border-t border-zinc-900 max-w-sm">
              <div className="flex -space-x-2.5">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Avatar" referrerPolicy="no-referrer" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Avatar" referrerPolicy="no-referrer" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="Avatar" referrerPolicy="no-referrer" />
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-zinc-800 ring-2 ring-zinc-900 text-[10px] font-bold text-gold">45+</div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-300">Awarded 5 Stars</span>
                <div className="flex items-center space-x-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                  <span className="text-[10px] font-mono font-bold text-zinc-400 ml-1.5">(4.9/5 Rating)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Focal Circular Bowl Spotlight (Right 5 Columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center items-center relative py-8"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              
              {/* Outer Golden Ring Aura */}
              <div className="absolute inset-0 rounded-full border border-gold/15 bg-gradient-to-tr from-zinc-900/40 via-transparent to-zinc-900/40 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-gold/5 pointer-events-none" />
              
              {/* Background glowing backdrop */}
              <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-gold/15 to-accent-red/20 blur-3xl z-0 pointer-events-none" />

              {/* Central Premium Rotating Highlight Dish Plate with Float */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center shadow-2xl shadow-gold/10"
              >
                <img
                  src={heroSettings.heroImage || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"}
                  alt="Spotlight Dish"
                  className="rounded-full w-full h-full object-cover scale-[0.94] border-4 border-zinc-900 shadow-inner hover:scale-[0.98] transition-transform duration-500"
                  style={{ transform: `rotate(${activeIndex * 25}deg)` }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual badges floating on plate */}
                <div className="absolute top-4 right-4 bg-black/90 border border-gold/30 px-2.5 py-1 rounded-full text-[9px] font-bold text-gold tracking-wide flex items-center space-x-1 shadow-lg backdrop-blur-sm shadow-black/80 animate-bounce">
                  <Flame className="h-3 w-3 text-accent-red-hover" />
                  <span>FRESH & DELICIOUS</span>
                </div>
              </motion.div>
              
              {/* Extra foreground leaf decoration */}
              <div className="absolute -bottom-2 -left-4 w-16 h-16 pointer-events-none z-20 animate-wiggle">
                <svg className="w-full h-full text-zinc-600 fill-zinc-900 rotate-[120deg]" viewBox="0 0 24 24">
                  <path d="M17,8C8,10 5,16 5,16C5,16 8,9 17,8M21,2C21,2 14,3 10,8C6,12 4,19 4,19C4,19 11,18 15,14C19,10 21,2 21,2Z" />
                </svg>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Showcase Highlight Plates Reel */}
      <div className="w-full mt-16 md:mt-24 z-10 relative bg-black/40 py-6 border-y border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold font-mono tracking-[0.25em] text-accent-red-hover uppercase">TODAY'S SPECIALS</span>
              <h3 className="font-heading text-lg sm:text-2xl font-black text-white tracking-widest flex items-center space-x-2">
                <span>POPULAR DISHES TODAY</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
              </h3>
            </div>

            {/* Slider Arrows */}
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sliding spotlight card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500">
            {highlightDishes.map((dish, idx) => {
              const virtualIndex = (idx + activeIndex) % highlightDishes.length;
              const displayItem = highlightDishes[virtualIndex];

              return (
                <div
                  key={displayItem.id}
                  onClick={() => onSelectMenuItem(displayItem)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-950/90 border border-zinc-900 p-4 transition-all duration-500 hover:border-gold/30 hover:bg-zinc-900 hover:-translate-y-1 flex items-center space-x-4"
                >
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <img
                      src={displayItem.image}
                      alt={displayItem.name}
                      className="h-full w-full rounded-full object-cover border border-zinc-800 shadow-md group-hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {displayItem.popular && (
                      <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-gold ring-2 ring-zinc-950" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs font-bold text-zinc-100 truncate group-hover:text-gold tracking-wide uppercase">
                      {displayItem.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-light leading-none">
                      {displayItem.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs font-mono font-bold text-gold">
                        ৳{displayItem.price.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-semibold text-zinc-500">
                        ⭐ {displayItem.rating}
                      </span>
                    </div>
                  </div>

                  {/* Add action indicator */}
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 hover:bg-accent-red text-zinc-400 hover:text-white transition-all duration-300">
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Sub Hero Section - About Mollywood Kitchen */}
      <div className="w-full bg-zinc-950 py-16 border-b border-zinc-900 z-10 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block h-1 w-12 bg-gold mb-6" />
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-widest uppercase mb-6">
            About Mollywood Kitchen
          </h2>
          <p className="font-sans text-base sm:text-lg text-gold-metallic font-semibold italic mb-4 leading-relaxed">
            At Mollywood Kitchen, we believe every meal should bring people together.
          </p>
          <div className="space-y-4 max-w-3xl mx-auto text-zinc-400 font-light text-xs sm:text-sm leading-relaxed text-center">
            <p>
              Located in Pirganj, Rangpur, we proudly serve freshly prepared Bengali, Indian, Chinese, and fast-food dishes in a comfortable and welcoming environment. Our goal is to provide great food, friendly service, and affordable prices for everyone.
            </p>
            <p>
              Whether you're visiting for lunch, dinner, or a family gathering, we want every guest to leave happy and satisfied.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
