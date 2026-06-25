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
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-bold text-text-secondary tracking-[0.3em] uppercase">
            <Camera className="h-3.5 w-3.5 text-gold" />
            <span>Visual Glimpse</span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight leading-none uppercase">
            Captured <span className="text-gold italic font-normal">Moments</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-text-secondary max-w-md mx-auto font-light leading-relaxed">
            A fine glimpse behind our kitchen doors. Witness our sizzling hot tandoor ovens, expert high-heat wok tossing, and warm cozy dining spaces.
          </p>
        </motion.div>

        {/* Bento Grid layout with variable column spans for rhythm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className={`group relative overflow-hidden rounded-xl bg-zinc-950 border border-zinc-900 transition-all duration-500 min-h-[340px] flex flex-col justify-end ${
                  isLarge ? 'sm:col-span-2' : 'sm:col-span-1'
                }`}
              >
                
                {/* Full-bleed high-res image in original brilliant color */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700 ease-out pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Soft, light subtle dark overlay for text contrast without darkening the whole image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Content Overlay details */}
                <div className="p-6 sm:p-8 z-10 space-y-2 relative transition-all duration-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-gold uppercase bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-gold/20">{item.category || 'Gallery'} 0{index + 1}</span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary tracking-wide uppercase transition-colors duration-300 drop-shadow-md">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-zinc-300 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-sm">
                    View authentic captures of {item.title}
                  </p>
                </div>

                {/* Custom border highlight effect */}
                <div className="absolute -inset-px border border-transparent rounded-sm group-hover:border-gold/20 pointer-events-none transition-colors duration-500" />

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
