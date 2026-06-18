import React, { useState, useEffect } from 'react';
import { useStore, ContactSettings } from '../context/StoreContext';
import { Save, Phone, MapPin, Mail, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactInfoView() {
  const { contactSettings, updateContactSettings } = useStore();
  
  const [localSettings, setLocalSettings] = useState<ContactSettings>({
    restaurantName: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    googleMapUrl: '',
    facebook: '',
    instagram: '',
    openingHours: ''
  });

  useEffect(() => {
    if (contactSettings) {
      setLocalSettings(contactSettings);
    }
  }, [contactSettings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings(localSettings);
  };

  const handleRestoreDefaults = () => {
    setLocalSettings({
      restaurantName: "Mollywood Kitchen",
      address: "Pirganj Bus Stand (Above Agrani Bank), Rangpur, Bangladesh",
      phone: "+880 1712-345678",
      whatsapp: "+880 1712-345678",
      email: "info@mollywoodkitchen.com",
      googleMapUrl: "https://maps.google.com/?q=Pirganj+Agrani+Bank+Rangpur",
      facebook: "https://facebook.com/mollywoodkitchen",
      instagram: "https://instagram.com/mollywoodkitchen",
      openingHours: "Daily: 11:30 AM – 10:30 PM (Friday break: 1:00 PM - 2:00 PM)"
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with save action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Contact & Location Editor</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage physical address, support lines, maps coordinate pins and kitchen operation timings.</p>
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
            form="contact-editor-form"
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>SAVE COORDINATES</span>
          </button>
        </div>
      </div>

      {/* 2. visual form blocks layout */}
      <form onSubmit={handleSave} id="contact-editor-form" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Core details column */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-gold border-b border-zinc-900 pb-3 flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-gold leading-none" />
            <span>Operational Hotline Lines</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Primary phone Hotline</label>
            <input
              type="text"
              required
              value={localSettings.phone}
              onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Owner WhatsApp channel</label>
            <input
              type="text"
              required
              value={localSettings.whatsapp}
              onChange={(e) => setLocalSettings({ ...localSettings, whatsapp: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Administrative Support Email</label>
            <input
              type="email"
              required
              value={localSettings.email}
              onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Timing schedule text</label>
            <textarea
              required
              rows={2}
              value={localSettings.openingHours}
              onChange={(e) => setLocalSettings({ ...localSettings, openingHours: e.target.value })}
              placeholder="e.g. Saturday – Thursday: 11:30 AM – 10:30 PM, Friday: 2:00 PM – 10:30 PM..."
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Location & GPS Map details frame column */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-gold border-b border-zinc-900 pb-3 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gold leading-none" />
            <span>Map Coordinates & Anchors</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Physical street Address</label>
            <input
              type="text"
              required
              value={localSettings.address}
              onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Google Map URL</label>
            <input
              type="url"
              required
              value={localSettings.googleMapUrl}
              onChange={(e) => setLocalSettings({ ...localSettings, googleMapUrl: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-202 outline-none font-mono text-zinc-450"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-405">Facebook page URL</label>
              <input
                type="url"
                required
                value={localSettings.facebook}
                onChange={(e) => setLocalSettings({ ...localSettings, facebook: e.target.value })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono text-[10px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-zinc-405">Instagram page URL</label>
              <input
                type="url"
                required
                value={localSettings.instagram}
                onChange={(e) => setLocalSettings({ ...localSettings, instagram: e.target.value })}
                className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono text-[10px]"
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
