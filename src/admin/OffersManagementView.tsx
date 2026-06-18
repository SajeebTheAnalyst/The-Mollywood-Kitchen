import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OfferItem } from '../types';
import { 
  Plus, 
  Sparkles, 
  Tag, 
  Trash2, 
  Edit2, 
  X, 
  Ticket, 
  Check, 
  ExternalLink, 
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OffersManagementView() {
  const { offers, addOffer, editOffer, deleteOffer, showToast } = useStore();
  
  // Modal toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);

  // Form states matching spec + types.ts
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    discount: '',
    description: '',
    badge: 'NEW PROMO',
    category: 'today' as OfferItem['category'],
    image: '',
    code: '',
    // Additional specs fields
    startDate: '2026-06-18',
    endDate: '2026-07-18',
    buttonText: 'CLAIM NOW',
    buttonLink: '#menu',
    isActive: true
  });

  const handleOpenCreateForm = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      tagline: 'Delicious special discount for you',
      discount: '15% FLAT',
      description: '',
      badge: 'LIMITED TIME',
      category: 'today',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      code: 'MOLLY15',
      startDate: '2026-06-18',
      endDate: '2026-08-18',
      buttonText: 'EXPLORE MEAL',
      buttonLink: '#menu',
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (offer: OfferItem) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      tagline: offer.tagline || 'Limited tasty coupon deal',
      discount: offer.discount || '15% OFF',
      description: offer.description,
      badge: offer.badge || 'LIMITED',
      category: offer.category || 'today',
      image: offer.image,
      code: offer.code,
      startDate: '2026-06-18',
      endDate: '2026-09-18',
      buttonText: 'ORDER ONLINE',
      buttonLink: '#menu',
      isActive: true
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) return;

    const payload: Omit<OfferItem, 'id'> = {
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      discount: formData.discount.trim(),
      description: formData.description.trim(),
      badge: formData.badge.trim(),
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      code: formData.code.trim().toUpperCase()
    };

    if (editingOffer) {
      editOffer({ ...payload, id: editingOffer.id });
    } else {
      addOffer(payload);
    }
    setIsFormOpen(false);
  };

  const codePresets = ['MOLLY20', 'BIRIYANI15', 'CHEFGOLD', 'LUNCH10', 'SWEETFREE'];

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Offers & Promotions Manager</h1>
          <p className="text-xs text-zinc-400 mt-1">Control coupon passes, discount codes and seasonal food combo deal banners.</p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>CREATE PROMO DEAL</span>
        </button>
      </div>

      {/* 2. Offers list render */}
      {offers.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
          <Tag className="h-8 w-8 text-zinc-650 mx-auto mb-3" />
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">No Active Promotional Offers</p>
          <p className="text-zinc-600 text-[11px] mt-1">Click the button above to launch a new meal discount campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="backdrop-blur-xl bg-zinc-904/40 border border-zinc-900 rounded-2xl overflow-hidden hover:border-gold/25 transition-all duration-300 flex flex-col md:flex-row relative group shadow-sm hover:shadow-gold/5 border-gold-glow"
            >
              {/* Gold Ribbon Badge overlay */}
              <div className="absolute top-3 left-3 z-10 shrink-0">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 border border-gold text-[8px] font-mono font-black text-gold uppercase tracking-wider">
                  {offer.badge || 'PROMO'}
                </span>
              </div>

              {/* Photo representation column */}
              <div className="w-full md:w-2/5 aspect-[16/10] md:aspect-auto bg-zinc-950 overflow-hidden relative border-r border-zinc-900/60">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-sm font-sans font-black text-gold tracking-tighter uppercase drop-shadow">{offer.discount || 'Special'}</span>
                  <p className="text-[10px] text-zinc-150 font-mono tracking-wider mt-1">{offer.code}</p>
                </div>
              </div>

              {/* Description and metadata column */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-heading text-sm sm:text-base font-black text-zinc-100 tracking-wide line-clamp-1">{offer.title}</h3>
                  <p className="text-[10px] font-mono text-zinc-500 italic mt-0.5">"{offer.tagline || 'Promo Pass'}"</p>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed line-clamp-2 h-8">{offer.description}</p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-900/40">
                  <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    <span>Expires: Sep 2026</span>
                  </div>

                  {/* Settings and controls buttons */}
                  <div className="inline-flex gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditForm(offer)}
                      className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Campaign"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setIsDeleteConfirmOpen(offer.id)}
                      className="p-1.5 rounded-lg border border-zinc-900 hover:border-rose-900 text-rose-500 hover:text-white transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Delete Overlay */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl scaleUp">
            <h3 className="font-heading text-base font-bold text-white tracking-wider">DELETE PROMO CAMPAIGN?</h3>
            <p className="text-xs text-zinc-450 mt-2 leading-relaxed">
              Are you sure you want to stop this promotional campaign? Customers will no longer be able to copy or input this coupon on checkout screens.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteConfirmOpen(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOffer(isDeleteConfirmOpen);
                  setIsDeleteConfirmOpen(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold font-sans text-black bg-rose-500 hover:bg-rose-400 transition-all uppercase tracking-widest"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Form Drawer Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-3">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between border-gold-glow text-zinc-200">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-gold uppercase">CAMPAIGN CREATOR</span>
                <h3 className="font-heading text-base font-bold text-white tracking-wide mt-0.5">
                  {editingOffer ? `Edit Promo: ${editingOffer.title}` : 'Build New Promotional Campaign'}
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form layout */}
            <form onSubmit={handleSaveForm} id="promo-campaign-form" className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Student Midweek Feast"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4.5 py-2.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. STUDYKICKS"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4.5 py-2.5 text-xs text-zinc-200 outline-none font-mono tracking-widest text-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Discount Amount</label>
                  <input
                    type="text"
                    required
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g. 20% OFF or Free Desserts"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Campaign Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. COSY EXCLUSIVE"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Main Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as OfferItem['category'] })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-2 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="today">Today's Specials</option>
                    <option value="weekend">Weekend Special</option>
                    <option value="combo">Family / Group Combo</option>
                    <option value="student">Student Perks</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Code Presets Shortcuts</label>
                 <div className="flex flex-wrap gap-1.5 pt-1">
                   {codePresets.map(preset => (
                     <button
                       type="button"
                       key={preset}
                       onClick={() => setFormData({ ...formData, code: preset })}
                       className="px-2 py-1 rounded bg-zinc-900 border border-zinc-805 hover:border-gold/45 text-[10px] font-mono text-zinc-300"
                     >
                       {preset}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Campaign Subhead</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Spend flat 1000 BDT or above and claim dessert."
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Campaign Photo URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Paste unsplash graphic link or equivalent..."
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Active Campaign Description Text</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clearly list requirements: e.g. Valid on all traditional platters, dessert combo exclusions..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none"
                />
              </div>

              {/* Specification layout parameters */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Slogan CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Button Hyperlink</label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Toggles for Spec Active Campaign */}
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-250 font-sans">Active Status Toggle</h4>
                  <p className="text-[10px] text-zinc-550 leading-relaxed font-light mt-0.5">Toggle to pull visual campaign banner temporarily from website views.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {formData.isActive ? (
                    <span className="flex items-center gap-1.5 font-mono text-emerald-400 text-xs font-bold">
                      <span>ACTIVE</span>
                      <ToggleRight className="h-8 w-8 text-emerald-500 fill-emerald-950" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-zinc-550 text-xs">
                      <span>PAUSED</span>
                      <ToggleLeft className="h-8 w-8 text-zinc-700" />
                    </span>
                  )}
                </button>
              </div>

            </form>

            {/* Save Campaign buttons */}
            <div className="p-5 border-t border-zinc-900 flex justify-end gap-3 bg-black/40">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-700 bg-zinc-950 font-mono text-xs font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
              >
                Close Editor
              </button>
              <button
                type="submit"
                form="promo-campaign-form"
                className="px-5 py-2.5 rounded-xl bg-gold text-black font-sans text-xs font-bold hover:bg-gold-light hover:shadow hover:shadow-gold/10 transition-all uppercase tracking-widest cursor-pointer"
              >
                {editingOffer ? 'Save Campaign' : 'Publish Campaign'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
