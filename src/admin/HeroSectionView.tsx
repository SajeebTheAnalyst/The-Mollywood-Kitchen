import React, { useState, useEffect } from 'react';
import { useStore, HeroSettings } from '../context/StoreContext';
import { Sparkles, Save, Layout, Eye, RefreshCw, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSectionView() {
  const { heroSettings, updateHeroSettings } = useStore();
  
  // Local state for fast keystroke-by-keystroke responsive edits
  const [localSettings, setLocalSettings] = useState<HeroSettings>({
    restaurantName: '',
    headline: '',
    subheading: '',
    heroImage: '',
    buttonText: '',
    buttonLink: '',
    backgroundImage: '',
    googleRating: 0,
    ratingCount: 0,
    yearsOfHeritage: 0
  });

  // Sync from store once
  useEffect(() => {
    if (heroSettings) {
      setLocalSettings(heroSettings);
    }
  }, [heroSettings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroSettings(localSettings);
  };

  const handleRestoreDefaults = () => {
    setLocalSettings({
      restaurantName: "Mollywood Kitchen",
      headline: "Vibrant Bengali Flavors & Modern Sizzling Delights",
      subheading: "A premium culinary journey in Pirganj, Rangpur. Enjoy slow-cooked traditional deshi recipes and premium fusion wok items in an ambient, luxury setting.",
      heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
      buttonText: "Explore Royal Menu",
      buttonLink: "#menu",
      backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920",
      googleRating: 0,
      ratingCount: 0,
      yearsOfHeritage: 0
    });
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Hero Landings Editor</h1>
          <p className="text-xs text-zinc-400 mt-1">Configure headers, marketing slogans and landing button hyperlinks.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3 py-2 border border-zinc-900 hover:border-zinc-800 rounded-xl text-[11px] font-mono font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            form="hero-editor-form"
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>SAVE PARAMETERS</span>
          </button>
        </div>
      </div>

      {/* Two-Column split: Left-Form, Right-Live Mock Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Edit fields (7 cols) */}
        <form onSubmit={handleSave} id="hero-editor-form" className="lg:col-span-6 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-900 pb-3">Landings Configurations</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Brand Restaurant Name</label>
            <input
              type="text"
              required
              value={localSettings.restaurantName}
              onChange={(e) => setLocalSettings({ ...localSettings, restaurantName: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Main Pitch Headline</label>
            <input
              type="text"
              required
              value={localSettings.headline}
              onChange={(e) => setLocalSettings({ ...localSettings, headline: e.target.value })}
              placeholder="e.g. Royal Bengali Biriyanis and clay-oven flavors"
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Slogan / Sub-heading description</label>
            <textarea
              required
              rows={4}
              value={localSettings.subheading}
              onChange={(e) => setLocalSettings({ ...localSettings, subheading: e.target.value })}
              placeholder="Indite a detailed culinary descriptor of food items and seat capacities..."
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">CTA Button Text</label>
              <input
                type="text"
                required
                value={localSettings.buttonText}
                onChange={(e) => setLocalSettings({ ...localSettings, buttonText: e.target.value })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Button Link Target</label>
              <input
                type="text"
                required
                value={localSettings.buttonLink}
                onChange={(e) => setLocalSettings({ ...localSettings, buttonLink: e.target.value })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-20 outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex justify-between items-center">
              <span>Hero Slide Image (Graphic URL)</span>
              <span className="text-gold/50 text-[9px] lowercase">Recommended: 1400x1400px (1:1), Min: 1200x1200px. JPG, PNG, WEBP</span>
            </label>
            <input
              type="url"
              required
              value={localSettings.heroImage}
              onChange={(e) => setLocalSettings({ ...localSettings, heroImage: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-202 outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex justify-between items-center">
              <span>Background Ambiance Image URL</span>
              <span className="text-gold/50 text-[9px] lowercase">recommend: 1920x1080px</span>
            </label>
            <input
              type="url"
              required
              value={localSettings.backgroundImage}
              onChange={(e) => setLocalSettings({ ...localSettings, backgroundImage: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-202 outline-none font-mono"
            />
          </div>

          <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex justify-between">
                <span>Google Rating</span>
                <span className="text-[8px] opacity-40 lowercase">0 to hide</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={localSettings.googleRating}
                onChange={(e) => setLocalSettings({ ...localSettings, googleRating: parseFloat(e.target.value) })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Review Count</label>
              <input
                type="number"
                min="0"
                value={localSettings.ratingCount}
                onChange={(e) => setLocalSettings({ ...localSettings, ratingCount: parseInt(e.target.value) })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Business Heritage (Years)</label>
              <input
                type="number"
                min="0"
                value={localSettings.yearsOfHeritage}
                onChange={(e) => setLocalSettings({ ...localSettings, yearsOfHeritage: parseInt(e.target.value) })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
              />
            </div>
          </div>
        </form>

        {/* Right Live Simulation Card: (5 cols) */}
        <div className="lg:col-span-6 space-y-4 sticky top-6">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">
            <Eye className="h-4 w-4 text-gold leading-none" />
            <span>REAL-TIME CUSTOMER PAGE PREVIEW</span>
          </div>

          {/* Miniature Web viewport container */}
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-900 relative bg-black shadow-2xl flex flex-col justify-between">
            
            {/* Simulated background with dark fog */}
            <div className="absolute inset-0 z-0">
              <img
                src={localSettings.backgroundImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'}
                alt="Ambiance backdrop"
                className="w-full h-full object-cover opacity-25 filter blur-[1px]"
              />
              <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, #000 100%) bg-black/60" />
            </div>

            {/* Simulated header navigation bar */}
            <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-3 flex justify-between items-center px-4 border-b border-zinc-900/30">
              <span className="font-heading text-[10px] font-black text-gold tracking-widest">{localSettings.restaurantName?.toUpperCase() || "MOLLYWOOD"}</span>
              <div className="flex gap-2 text-[8px] font-mono text-zinc-400 uppercase">
                <span>Menu</span>
                <span>Offers</span>
                <span>Contact</span>
              </div>
            </header>

            {/* Simulated main visual block */}
            <div className="absolute inset-x-0 top-14 bottom-0 z-10 flex flex-col justify-center px-6 text-left space-y-4">
              <div className="space-y-1.5 md:max-w-md">
                <span className="inline-flex items-center gap-1 bg-gold/15 text-gold border border-gold/25 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="h-2 w-2" />
                  <span>PREMIUM RANGPUR DINER</span>
                </span>
                
                <h2 className="font-heading text-base md:text-xl font-bold tracking-tight text-white leading-tight drop-shadow">
                  {localSettings.headline || "Taste of Majesty"}
                </h2>
                
                <p className="text-[9px] text-zinc-400 font-light leading-normal line-clamp-3">
                  {localSettings.subheading || "Experience finest deshi cooking specialties."}
                </p>

                {/* Simulated dynamic trust indicators */}
                {(localSettings.googleRating && localSettings.googleRating > 0 || localSettings.yearsOfHeritage && localSettings.yearsOfHeritage > 0) && (
                  <div className="flex items-center gap-3 pt-1">
                    {localSettings.googleRating && localSettings.googleRating > 0 && (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] font-bold text-gold">{localSettings.googleRating}</span>
                          <Star className="h-2 w-2 text-gold fill-current" />
                        </div>
                        <span className="text-[6px] text-zinc-500 uppercase tracking-tighter">Rating</span>
                      </div>
                    )}
                    {localSettings.yearsOfHeritage && localSettings.yearsOfHeritage > 0 && (
                      <div className="flex flex-col border-l border-white/10 pl-3">
                        <span className="text-[10px] font-bold text-gold">{localSettings.yearsOfHeritage}+</span>
                        <span className="text-[6px] text-zinc-500 uppercase tracking-tighter">Heritage</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Simulated button */}
              <div className="inline-flex">
                <span className="px-3 py-1.5 bg-gold hover:bg-gold-light text-black font-sans text-[8px] font-bold uppercase tracking-widest rounded-lg pointer-events-none shadow shadow-gold/20">
                  {localSettings.buttonText || "ORDER MEAL"}
                </span>
                <span className="ml-[10px] px-3 py-1.5 border border-zinc-800 text-zinc-300 font-sans text-[8px] font-bold uppercase tracking-widest rounded-lg pointer-events-none">
                  BOOK TABLE
                </span>
              </div>
            </div>

            {/* Small watermark */}
            <div className="absolute bottom-3 right-4 z-20">
              <span className="font-mono text-[7px] text-zinc-650 tracking-widest uppercase">Live Viewport Replica v1.0</span>
            </div>

          </div>

          <div className="backdrop-blur-md bg-zinc-950/20 border border-zinc-900 p-4 rounded-xl flex items-start gap-3">
            <Layout className="h-4 w-4 text-zinc-550 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-zinc-450">
              <strong>Interactive Slogan bindings active!</strong> Any text typed into the inputs transfers directly to the visitor's preview frame. Tap <strong>Save Parameters</strong> above to persist changes to the primary browser database.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
