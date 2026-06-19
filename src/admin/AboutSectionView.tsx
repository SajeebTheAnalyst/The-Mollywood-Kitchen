import React, { useState, useEffect } from 'react';
import { useStore, AboutSettings } from '../context/StoreContext';
import { Save, Library, Award, Compass, Sparkles } from 'lucide-react';

export default function AboutSectionView() {
  const { aboutSettings, updateAboutSettings, profileSettings } = useStore();
  
  const [localSettings, setLocalSettings] = useState<AboutSettings>({
    story: '',
    mission: '',
    vision: '',
    founders: '',
    images: []
  });

  useEffect(() => {
    if (aboutSettings) {
      setLocalSettings(aboutSettings);
    }
  }, [aboutSettings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutSettings(localSettings);
  };

  const handleRestoreDefaults = () => {
    setLocalSettings({
      story: "Mollywood Kitchen opened its doors in Pirganj, Rangpur with one simple vision: to bring a premium yet cozy dining experience to our local community. Though we have a humble capacity of 20 to 25 seats, every single seat is treated to visual and gustatory luxury. We specialize in slow-cooked traditional Bengali platters, rich clay-oven Indian items, and fresh fiery-wok Chinese food, all prepared by seasoned hands.",
      mission: "To serve exceptionally delicious, hygienic, deshi-flavored food with modern professional service and visual warmth.",
      vision: "To establish our royal deshi-fusion kitchen as Rangpur Division's leading culinary landmark for families and food lovers.",
      founders: `Owner & Founder, ${profileSettings.ownerName}`,
      images: [
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3e?auto=format&fit=crop&q=80&w=600"
      ]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with save trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">About Section Editor</h1>
          <p className="text-xs text-zinc-400 mt-1">Configure restaurant origin legends, values, statements and story boards.</p>
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
            form="about-editor-form"
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>SAVE ORIGINS</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Edit forms */}
      <form onSubmit={handleSave} id="about-editor-form" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Story copy (7 cols) */}
        <div className="md:col-span-7 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-1.5">
            <Library className="h-4 w-4 text-gold leading-none" />
            <span>Our Origin Chronicle</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Restaurant Story Biography</label>
            <textarea
              required
              rows={8}
              value={localSettings.story}
              onChange={(e) => setLocalSettings({ ...localSettings, story: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none leading-relaxed font-sans"
              placeholder="Indite how you founded, current seat volume, recipe parameters, etc..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Founders / Leadership Credits</label>
            <input
              type="text"
              required
              value={localSettings.founders}
              onChange={(e) => setLocalSettings({ ...localSettings, founders: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
              placeholder={`${profileSettings.ownerName}, CEO Founder`}
            />
          </div>
        </div>

        {/* Right Side: Mission & Vision (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-gold leading-none" />
              <span>Core Operational Mandate</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Mission Statement</label>
                <textarea
                  required
                  rows={3}
                  value={localSettings.mission}
                  onChange={(e) => setLocalSettings({ ...localSettings, mission: e.target.value })}
                  placeholder="e.g. To serve hygienic, deshi-flavored food with professional service..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Long-Term Corporate Vision</label>
                <textarea
                  required
                  rows={3}
                  value={localSettings.vision}
                  onChange={(e) => setLocalSettings({ ...localSettings, vision: e.target.value })}
                  placeholder="e.g. To establish Rangpur's leading landmark for deshi-fusion families..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Picture placeholders URLs */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-gold" />
              <span>Origins Story Banners</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-500">Origin Photo 1 URL</label>
                <input
                  type="url"
                  value={localSettings.images[0] || ''}
                  onChange={(e) => {
                    const copy = [...localSettings.images];
                    copy[0] = e.target.value;
                    setLocalSettings({ ...localSettings, images: copy });
                  }}
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-505">Origin Photo 2 URL</label>
                <input
                  type="url"
                  value={localSettings.images[1] || ''}
                  onChange={(e) => {
                    const copy = [...localSettings.images];
                    copy[1] = e.target.value;
                    setLocalSettings({ ...localSettings, images: copy });
                  }}
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none font-mono"
                />
              </div>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}
