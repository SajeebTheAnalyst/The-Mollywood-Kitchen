import React, { useState, useEffect } from 'react';
import { useStore, WebsiteSettings } from '../context/StoreContext';
import { Save, Globe, Eye, Palette, Key } from 'lucide-react';

export default function WebsiteSettingsView() {
  const { websiteSettings, updateWebsiteSettings } = useStore();
  
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>({
    logo: '',
    favicon: '',
    primaryColor: '',
    secondaryColor: '',
    footerText: '',
    copyright: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: ''
  });

  useEffect(() => {
    if (websiteSettings) {
      setLocalSettings(websiteSettings);
    }
  }, [websiteSettings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings(localSettings);
  };

  const handleRestoreDefaults = () => {
    setLocalSettings({
      logo: "/mollywood_logo.jpg",
      favicon: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=32",
      primaryColor: "#F59E0B",
      secondaryColor: "#8B0101",
      footerText: "Mollywood Kitchen delivers royalty in every single deshi and wok-kissed bite.",
      copyright: "© 2026 Mollywood Kitchen. All Rights Reserved. Crafted with Glassmorphism.",
      seoTitle: "Mollywood Kitchen - Best Royal Bangladeshi, Indian & Chinese Restaurant in Pirganj, Rangpur",
      seoDescription: "Dine and experience premium slow-cooked biriyanis, authentic Bengali meals, hot tandoor, and sizzling Chinese platters.",
      seoKeywords: "Mollywood Kitchen, Pirganj Restaurant, Rangpur Food, Bengali Meal, Biriyani, Indian Food, Chinese Food",
      ogImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Website & SEO Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">Control search tags keywords, layout theme accent hex grids, footer credentials and logo branding.</p>
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
            form="website-settings-form"
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>SAVE METADATA</span>
          </button>
        </div>
      </div>

      {/* 2. config form split layout */}
      <form onSubmit={handleSave} id="website-settings-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Global styling & Footer (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-gold border-b border-zinc-900 pb-3 flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-gold leading-none" />
            <span>Theming Accent & Branding Resources</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Primary Color (HEX)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localSettings.primaryColor}
                  onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                  className="h-9 w-9 bg-black border border-zinc-900 rounded cursor-pointer outline-none shrink-0"
                />
                <input
                  type="text"
                  value={localSettings.primaryColor}
                  onChange={(e) => setLocalSettings({ ...localSettings, primaryColor: e.target.value })}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-404">Secondary Color (HEX)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localSettings.secondaryColor}
                  onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
                  className="h-9 w-9 bg-black border border-zinc-900 rounded cursor-pointer outline-none shrink-0"
                />
                <input
                  type="text"
                  value={localSettings.secondaryColor}
                  onChange={(e) => setLocalSettings({ ...localSettings, secondaryColor: e.target.value })}
                  className="w-full bg-black border border-zinc-905 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Header Brand Logo URL</label>
              <input
                type="text"
                required
                value={localSettings.logo}
                onChange={(e) => setLocalSettings({ ...localSettings, logo: e.target.value })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-202 outline-none font-mono text-[10px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Favicon Shortcut icon URL</label>
              <input
                type="text"
                required
                value={localSettings.favicon}
                onChange={(e) => setLocalSettings({ ...localSettings, favicon: e.target.value })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-202 outline-none font-mono text-[10px]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-404 block">Footer Brand Slogan Text</label>
            <input
              type="text"
              required
              value={localSettings.footerText}
              onChange={(e) => setLocalSettings({ ...localSettings, footerText: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/30 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-404 block">Copyright disclaimer phrase</label>
            <input
              type="text"
              required
              value={localSettings.copyright}
              onChange={(e) => setLocalSettings({ ...localSettings, copyright: e.target.value })}
              className="w-full bg-black border border-zinc-905 focus:border-gold/30 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
            />
          </div>

        </div>

        {/* Right: SEO Crawler configurations (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-gold border-b border-zinc-900 pb-3 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-gold leading-none" />
            <span>Search Engines indexing (SEO Meta)</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">HTML Title Meta</label>
            <input
              type="text"
              required
              value={localSettings.seoTitle}
              onChange={(e) => setLocalSettings({ ...localSettings, seoTitle: e.target.value })}
              placeholder="Google search landing title"
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-gold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">SEO crawl description</label>
            <textarea
              required
              rows={3}
              value={localSettings.seoDescription}
              onChange={(e) => setLocalSettings({ ...localSettings, seoDescription: e.target.value })}
              placeholder="Meta crawler description story limit to 160 characters..."
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-404 block">SEO Categorized search Keywords</label>
            <textarea
              required
              rows={2}
              value={localSettings.seoKeywords}
              onChange={(e) => setLocalSettings({ ...localSettings, seoKeywords: e.target.value })}
              placeholder="comma, separated, tags, e.g. Biriyani, Pirganj, Mollywood..."
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-305 outline-none resize-none leading-relaxed font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-404">Social Share (Open Graph) image URL</label>
            <input
              type="url"
              required
              value={localSettings.ogImage}
              onChange={(e) => setLocalSettings({ ...localSettings, ogImage: e.target.value })}
              className="w-full bg-black border border-zinc-905 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-400 outline-none font-mono text-[10px]"
            />
          </div>
        </div>

      </form>

    </div>
  );
}
