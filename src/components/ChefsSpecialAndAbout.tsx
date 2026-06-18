import React, { useState } from 'react';
import { Award, Star, Quote, Sparkles, Film, Heart, Compass, ShieldCheck } from 'lucide-react';
import { REVIEWS_DATA } from '../data';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface ChefsSpecialProps {
  onSelectMenuItem: (item: MenuItem) => void;
}

export default function ChefsSpecialAndAbout({ onSelectMenuItem }: ChefsSpecialProps) {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Get the two premium fish dishes for Chef's Special
  const chefSpecialDishes = MENU_ITEMS.filter(it => it.category === 'bengali').slice(0, 2);

  const benefits = [
    {
      id: 1,
      icon: <Heart className="h-6 w-6 text-gold" />,
      title: 'Warm & Cozy Setting',
      desc: 'Our dining area is tidy, spacious, and perfect for families, student groups, and travelers passing through Pirganj.'
    },
    {
      id: 2,
      icon: <Sparkles className="h-6 w-6 text-gold" />,
      title: 'Rich Authentic Flavors',
      desc: 'Carefully curated dishes balancing authentic Bengali comfort stews and premium-cooked Indian and Chinese specialties.'
    },
    {
      id: 3,
      icon: <ShieldCheck className="h-6 w-6 text-gold" />,
      title: 'Affordable & Welcoming',
      desc: 'We are committed to serving premium quality food at budget-friendly rates with pleasant and efficient hospitality.'
    }
  ];

  return (
    <div className="bg-black text-white py-12 space-y-24">
      
      {/* 1. CHEFS SPECIAL FEATURE STORY BLOCK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Sub Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1 border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase bg-zinc-950">
            <Award className="h-3.5 w-3.5 text-gold" />
            <span>OUR SIGNATURE RECIPES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest leading-none">
            CHEF’S SIGNATURE SPECIALS
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold via-accent-red to-gold mx-auto rounded-full" />
        </div>        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {chefSpecialDishes.map((dish, i) => (
            <motion.div 
              key={dish.id}
              onClick={() => onSelectMenuItem(dish)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-900/80 hover:border-gold/30 hover:bg-zinc-900/10 transition-all duration-500 flex flex-col md:flex-row shadow-lg"
            >
              <div className="relative w-full md:w-1/2 h-56 md:h-full min-h-[220px] overflow-hidden bg-zinc-900">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="h-full w-full object-cover group-hover:scale-105 duration-500 grayscale-[20%]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
                
                {/* Visual badge */}
                <div className="absolute top-4 left-4 z-10 bg-black/80 border border-gold/30 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-gold uppercase tracking-wide">
                  GOLDEN RECIPE
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                    <span className="text-[10px] text-zinc-500 font-mono font-bold ml-1">{dish.rating}</span>
                  </div>
                  <h3 className="font-heading text-lg font-black text-white tracking-wide uppercase group-hover:text-gold">{dish.name}</h3>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed line-clamp-3">{dish.description}</p>
                </div>

                <div className="border-t border-zinc-900 pt-3 flex items-center justify-between">
                  <span className="font-mono text-base font-black text-gold">৳{dish.price.toLocaleString()}</span>
                  <span className="text-[9px] font-semibold text-zinc-500 hover:text-white transition-colors uppercase tracking-wider">
                    REVEAL DETAILS &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* 2. WHY CHOOSE MOLLYWOOD KITCHEN */}
      <section className="bg-zinc-950 border-y border-zinc-900/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Benefits left board (5 Columns) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center space-x-1.5 bg-zinc-900 border border-gold/20 px-3 py-1 rounded-full text-[9px] font-bold text-gold tracking-widest uppercase">
                <Sparkles className="h-3 w-3" />
                <span>OUR CORE STRENGTHS</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-widest leading-tight">
                WHY GUESTS LOVE OUR KITCHEN
              </h2>
              <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                We believe dining should make you feel right at home. We combine premium fresh ingredients, classic homestyle recipes, and cozy table setups to ensure a satisfying experience.
              </p>
              
              <div className="border-l-2 border-gold pl-4 italic text-xs text-zinc-400 font-light mt-4">
                "Providing clean, delicious, and pocket-friendly meals for everyone in Rangpur." 
                <p className="text-[10px] font-bold font-mono tracking-wider text-gold not-italic mt-1.5">— Mollywood Kitchen Family</p>
              </div>
            </div>

            {/* Benefits grid details (7 Columns) */}
            <div className="lg:col-span-1" />
            <div className="lg:col-span-6 space-y-6">
              {benefits.map((b) => (
                <div 
                  key={b.id} 
                  className="p-5 rounded-2xl bg-black border border-zinc-900 flex items-start space-x-4 hover:border-gold/25 duration-300"
                >
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex-shrink-0">
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-heading text-sm sm:text-base font-bold text-zinc-100 tracking-wide">{b.title}</h4>
                    <p className="text-xs text-zinc-400 font-light mt-1.5 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. CUSTOMER REVIEWS SLIDER OR CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Sub Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1 border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase bg-zinc-950">
            <Quote className="h-3.5 w-3.5 text-gold" />
            <span>GUEST EXPERIENCES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest leading-none">
            WHAT OUR GUESTS SAY
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold via-accent-red to-gold mx-auto rounded-full" />
        </div>

        {/* Reviews Carousel block */}
        <div className="relative max-w-4xl mx-auto rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-10 text-center shadow-lg">
          <div className="absolute top-6 left-6 text-gold/10 pointer-events-none">
            <Quote className="h-16 w-16 stroke-[1]" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeReviewIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="space-y-6 relative z-10"
            >
              <div className="flex justify-center items-center space-x-0.5">
                {[...Array(REVIEWS_DATA[activeReviewIdx].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-light italic max-w-2xl mx-auto">
                "{REVIEWS_DATA[activeReviewIdx].content}"
              </p>

              <div className="flex flex-col items-center">
                <img 
                  src={REVIEWS_DATA[activeReviewIdx].avatar} 
                  alt={REVIEWS_DATA[activeReviewIdx].name} 
                  className="h-12 w-12 rounded-full border border-gold object-cover shadow-md mb-2"
                  referrerPolicy="no-referrer"
                />
                <h5 className="font-heading text-sm font-bold text-zinc-100 tracking-wider font-mono">
                  {REVIEWS_DATA[activeReviewIdx].name}
                </h5>
                <p className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase mt-0.5">
                  {REVIEWS_DATA[activeReviewIdx].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bullet Nav dots */}
          <div className="flex justify-center space-x-2 mt-8 z-10 relative">
            {REVIEWS_DATA.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReviewIdx(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  activeReviewIdx === i 
                    ? 'w-7 bg-gold' 
                    : 'bg-zinc-805 bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
