import React from 'react';
import { Award, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { motion } from 'motion/react';

interface OwnersSpecialProps {
  onSelectMenuItem: (item: MenuItem) => void;
}

export default function OwnersSpecialAndAbout({ onSelectMenuItem }: OwnersSpecialProps) {
  const { menuItems } = useStore();

  // Get the two premium fish dishes for Owner's Special
  const ownerSpecialDishes = menuItems.filter(it => it.category === 'bengali').slice(0, 2);

  return (
    <div className="bg-black text-white py-12">
      
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
              className="group cursor-pointer overflow-hidden rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-gold/30 transition-all duration-500 flex flex-col md:flex-row shadow-2xl"
            >
              <div className="relative w-full md:w-1/2 h-64 md:h-full min-h-[280px] overflow-hidden bg-zinc-900 p-4">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
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
    </div>
  );
}
