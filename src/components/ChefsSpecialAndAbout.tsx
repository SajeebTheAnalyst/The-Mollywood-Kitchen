import React, { useState } from 'react';
import { Award, Star, Quote, Sparkles, Film, Heart, Compass, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OwnersSpecialProps {
  onSelectMenuItem: (item: MenuItem) => void;
}

export default function OwnersSpecialAndAbout({ onSelectMenuItem }: OwnersSpecialProps) {
  const { menuItems, reviews, aboutSettings } = useStore();
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Get the two premium fish dishes for Owner's Special
  const ownerSpecialDishes = menuItems.filter(it => it.category === 'bengali').slice(0, 2);

  // Ensure index remains in bounds when reviews list changes
  const activeReview = reviews.length > 0 ? reviews[activeReviewIdx % reviews.length] : null;

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
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.3em] uppercase">
            <Award className="h-3.5 w-3.5 text-gold" />
            <span>Masterpiece Recipes</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
            Owner's <span className="text-gold italic font-normal">Signature</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {ownerSpecialDishes.map((dish, i) => (
            <motion.div 
              key={dish.id}
              onClick={() => onSelectMenuItem(dish)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer overflow-hidden rounded-sm bg-zinc-950 border border-white/5 hover:border-gold/30 transition-all duration-500 flex flex-col md:flex-row shadow-2xl"
            >
              <div className="relative w-full md:w-1/2 h-64 md:h-full min-h-[280px] overflow-hidden bg-zinc-900">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                
                {/* Visual badge */}
                <div className="absolute top-4 left-4 z-10 bg-gold text-black px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest">
                  Heritage Dish
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-gold text-gold" />
                    ))}
                    <span className="text-[10px] text-text-secondary font-bold tracking-widest ml-2">{dish.rating}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-text-primary tracking-widest uppercase transition-colors group-hover:text-gold">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-text-secondary font-light leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                  <span className="font-heading text-xl font-black text-gold">৳{dish.price.toLocaleString()}</span>
                  <span className="text-[9px] font-bold text-text-secondary group-hover:text-gold transition-colors uppercase tracking-[0.2em]">
                    Details &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* 2. WHY CHOOSE MOLLYWOOD KITCHEN */}
      <section className="bg-zinc-950/50 border-y border-white/5 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Benefits left board (5 Columns) */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.3em] uppercase">
                <Sparkles className="h-3 w-3 text-gold" />
                <span>Our Heritage</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight uppercase">
                {aboutSettings.story ? "About Mollywood" : "Dining with Distinction"}
              </h2>
              <p className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed font-light">
                {aboutSettings.story || "We believe dining should make you feel right at home. We combine premium fresh ingredients, classic homestyle recipes, and cozy table setups to ensure a satisfying experience."}
              </p>
              
              <div className="border-l border-gold pl-6 py-2 italic text-sm text-text-secondary font-light mt-8">
                "{aboutSettings.mission || "Providing clean, delicious, and pocket-friendly meals for everyone in Rangpur."}" 
                <p className="text-[10px] font-bold tracking-[0.3em] text-gold not-italic mt-4 uppercase">— {aboutSettings.founders || "Mollywood Kitchen Family"}</p>
              </div>
            </div>

            {/* Benefits grid details (7 Columns) */}
            <div className="lg:col-span-1" />
            <div className="lg:col-span-6 space-y-8">
              {benefits.map((b) => (
                <div 
                  key={b.id} 
                  className="p-8 rounded-sm bg-black/40 border border-white/5 flex items-start space-x-6 hover:border-gold/20 transition-all duration-500"
                >
                  <div className="p-4 rounded-sm bg-white/5 border border-white/10 flex-shrink-0">
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-heading text-lg font-bold text-text-primary tracking-widest uppercase">{b.title}</h4>
                    <p className="text-xs text-text-secondary font-light mt-2 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. CUSTOMER REVIEWS SLIDER OR CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Sub Header */}
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.2em] uppercase">
            <Quote className="h-3.5 w-3.5 text-gold" />
            <span>Testimonials</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
            Guest <span className="text-gold italic font-normal">Experiences</span>
          </h2>
        </div>

        {/* Reviews Carousel block */}
        <div className="relative max-w-4xl mx-auto rounded-sm border border-white/5 bg-zinc-950/80 p-8 sm:p-16 text-center shadow-2xl backdrop-blur-sm">
          <div className="absolute top-10 left-10 text-gold/5 pointer-events-none">
            <Quote className="h-32 w-32 stroke-[1]" />
          </div>

          <AnimatePresence mode="wait">
            {activeReview ? (
              <motion.div 
                key={activeReviewIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10 relative z-10"
              >
                <div className="flex justify-center items-center space-x-1.5">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>

                <p className="font-sans text-lg sm:text-xl md:text-2xl text-text-primary leading-relaxed font-light italic max-w-3xl mx-auto tracking-wide">
                  "{activeReview.content}"
                </p>

                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={activeReview.avatar} 
                      alt={activeReview.name} 
                      className="h-16 w-16 rounded-full border border-gold/30 object-cover shadow-2xl p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-1 border-2 border-zinc-950">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                  </div>
                  <h5 className="font-heading text-base font-bold text-text-primary tracking-widest uppercase">
                    {activeReview.name}
                  </h5>
                  <p className="text-[10px] text-text-secondary font-bold tracking-[0.2em] uppercase mt-1">
                    {activeReview.role}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="py-12 relative z-10">
                <p className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">Experience our hospitality first hand</p>
              </div>
            )}
          </AnimatePresence>

          {/* Bullet Nav dots */}
          <div className="flex justify-center space-x-3 mt-12 z-10 relative">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveReviewIdx(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  activeReviewIdx === i 
                    ? 'w-10 bg-gold' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
