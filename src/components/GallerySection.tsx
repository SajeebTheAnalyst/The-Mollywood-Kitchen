import React from 'react';
import { Camera, Film, Play, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';

export default function GallerySection() {
  const { galleryItems } = useStore();
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-black scroll-mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center space-x-1.5 bg-zinc-900 border border-gold/20 px-3 py-1 rounded-full text-[10px] font-bold text-gold tracking-widest uppercase">
            <Camera className="h-3.5 w-3.5" />
            <span>RESTAURANT PHOTO GALLERY</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest leading-none">
            OUR KITCHEN & DINING GALLERY
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gold via-accent-red to-gold mx-auto rounded-full" />
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light">
            A fine glimpse behind our kitchen doors. Witness our sizzling hot tandoor ovens, expert high-heat wok tossing, and warm cozy dining spaces.
          </p>
        </motion.div>

        {/* Bento Grid layout with variable column spans for rhythm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => {
            // Give different aesthetic grid layouts
            const isLarge = index === 2 || index === 5;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-900 transition-all duration-700 min-h-[260px] flex flex-col justify-end ${
                  isLarge ? 'sm:col-span-2' : 'sm:col-span-1'
                }`}
              >
                
                {/* Full-bleed high-res image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-[1.05] duration-[8000ms] ease-out pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Black Overlay Gradient for title legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                {/* Grid Visual Accents */}
                <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-zinc-950/90 border border-gold/30 p-2 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-gold" />
                </div>

                {/* Content Overlay details */}
                <div className="p-6 z-10 space-y-1.5 relative translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div className="flex items-center space-x-1">
                    <Camera className="h-3.5 w-3.5 text-gold" />
                    <span className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase">Spotlight {index + 1}</span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide uppercase leading-tight group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[11px] text-zinc-400 font-light leading-relaxed truncate opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.subtitle}
                  </p>
                </div>

                {/* Custom border highlight effect */}
                <div className="absolute -inset-px border border-transparent rounded-2xl group-hover:border-gold/35 pointer-events-none transition-colors duration-500" />

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
