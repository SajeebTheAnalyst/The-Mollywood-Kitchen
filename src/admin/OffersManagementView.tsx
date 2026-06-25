import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OfferItem } from '../types';
import { 
  Plus, 
  Tag, 
  Trash2, 
  Edit2, 
  X, 
  Ticket, 
  Calendar,
  Clock,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  Users,
  Cake,
  Award
} from 'lucide-react';

export default function OffersManagementView() {
  const { offers, addOffer, editOffer, deleteOffer } = useStore();
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);

  // Form states matching types.ts
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'student' as OfferItem['category'],
    image: '',
    code: '',
    startDate: '2026-06-25',
    startTime: '11:00',
    endDate: '2026-07-25',
    endTime: '23:00',
    isActive: true,
    isFeatured: false
  });

  const handleOpenCreateForm = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      category: 'student',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
      code: '',
      startDate: '2026-06-25',
      startTime: '11:00',
      endDate: '2026-07-25',
      endTime: '23:00',
      isActive: true,
      isFeatured: false
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (offer: OfferItem) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      category: offer.category || 'student',
      image: offer.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
      code: offer.code,
      startDate: offer.startDate || '2026-06-25',
      startTime: offer.startTime || '12:00',
      endDate: offer.endDate || '2026-07-25',
      endTime: offer.endTime || '23:59',
      isActive: offer.isActive ?? true,
      isFeatured: offer.isFeatured ?? false
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) return;

    const payload: Omit<OfferItem, 'id'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image.trim(),
      code: formData.code.trim().toUpperCase(),
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured
    };

    if (editingOffer) {
      editOffer({ ...payload, id: editingOffer.id });
    } else {
      addOffer(payload);
    }
    setIsFormOpen(false);
  };

  // Helper icons for categories
  const getCategoryIcon = (category: OfferItem['category']) => {
    switch (category) {
      case 'student': return <GraduationCap className="h-4 w-4 text-gold" />;
      case 'family': return <Users className="h-4 w-4 text-gold" />;
      case 'birthday': return <Cake className="h-4 w-4 text-gold" />;
      case 'first': return <Award className="h-4 w-4 text-gold" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">Offers & Coupons Manager</h1>
          <p className="text-xs text-zinc-400 mt-1">Create and manage real-time active restaurant discount campaigns and coupon codes.</p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-amber-400 transition-all border border-gold/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>CREATE NEW PROMO</span>
        </button>
      </div>

      {/* Offers list render */}
      {offers.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
          <Tag className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">No Active Promotional Offers</p>
          <p className="text-zinc-600 text-[11px] mt-1">Click the button above to launch a new meal discount campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-zinc-950/80 border border-zinc-900 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-300 flex flex-col md:flex-row relative group shadow-lg"
            >
              {/* Category Indicator Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 border border-gold/30 text-[9px] font-mono font-bold text-gold uppercase tracking-wider">
                  {getCategoryIcon(offer.category)}
                  <span className="ml-1">{offer.category.replace('-', ' ')}</span>
                </span>
              </div>

              {/* Status Indicator Badge (Top Right) */}
              <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider ${offer.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {offer.isActive !== false ? 'ACTIVE' : 'PAUSED'}
                </span>
                {offer.isFeatured && (
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-black bg-gold text-black uppercase tracking-wider">
                    ★ FEATURED
                  </span>
                )}
              </div>

              {/* Image Column */}
              <div className="w-full md:w-2/5 aspect-[16/10] md:aspect-auto bg-zinc-900 overflow-hidden relative border-r border-zinc-900/60">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-xs font-mono tracking-widest text-gold bg-zinc-950/90 px-3 py-1 rounded-md border border-gold/20 font-black">{offer.code}</span>
                </div>
              </div>

              {/* Information Column */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-base font-black text-white tracking-wide uppercase line-clamp-1">{offer.title}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3 min-h-[50px]">{offer.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-900 flex flex-col space-y-1.5 text-[10px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-gold" />
                    <span>Start: {offer.startDate || 'No Date'} | {offer.startTime || '00:00'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-red-400" />
                    <span>End: {offer.endDate || 'No Date'} | {offer.endTime || '23:59'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleOpenEditForm(offer)}
                    className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit Campaign"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(offer.id)}
                    className="p-1.5 rounded-lg border border-zinc-900 hover:border-red-900 text-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="font-heading text-base font-bold text-white tracking-wider">DELETE PROMO CAMPAIGN?</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to delete this promotional coupon? Customers will no longer see this offer or be able to copy this code on checkout screens.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteConfirmOpen(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOffer(isDeleteConfirmOpen);
                  setIsDeleteConfirmOpen(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-red-500 hover:bg-red-400 transition-all uppercase tracking-widest cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-zinc-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-gold uppercase">OFFERS ENGINE</span>
                <h3 className="font-heading text-base font-bold text-white tracking-wide mt-0.5">
                  {editingOffer ? 'Edit Promo Campaign' : 'Create Promo Campaign'}
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} id="promo-campaign-form" className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Offer Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Student Biryani & Kacchi Delight"
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. CAMPUSBIRI"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono tracking-widest text-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Main Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as OfferItem['category'] })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-2 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="student">Student Offers</option>
                    <option value="family">Family Combo</option>
                    <option value="birthday">Birthday Offers</option>
                    <option value="first">First Order Offers</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Offer Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Unsplash Biryani/Mutton/Kebab image link..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>

              {/* Start Date & Start Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none font-mono"
                  />
                </div>
              </div>

              {/* End Date & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-300 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Offer Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Clear descriptions, what dish or value is discounted..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none"
                />
              </div>

              {/* Active Campaign Switcher */}
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 font-sans">Active Status</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light mt-0.5">Toggle to instantly display or hide this pass on the live promotions list.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {formData.isActive ? (
                    <span className="flex items-center gap-1.5 font-mono text-emerald-400 text-xs font-bold">
                      <span>ACTIVE</span>
                      <ToggleRight className="h-8 w-8 text-emerald-500 fill-emerald-950" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-zinc-500 text-xs">
                      <span>PAUSED</span>
                      <ToggleLeft className="h-8 w-8 text-zinc-700" />
                    </span>
                  )}
                </button>
              </div>

              {/* Homepage Featured Toggle */}
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 font-sans">Homepage Featured Promotion</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light mt-0.5">Highlight this promo card in the large premium Hero spot at the top of the promotions screen.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {formData.isFeatured ? (
                    <span className="flex items-center gap-1.5 font-mono text-gold text-xs font-bold">
                      <span>FEATURED</span>
                      <ToggleRight className="h-8 w-8 text-gold fill-amber-950/40" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-zinc-500 text-xs">
                      <span>STANDARD</span>
                      <ToggleLeft className="h-8 w-8 text-zinc-700" />
                    </span>
                  )}
                </button>
              </div>

            </form>

            {/* Modal Actions */}
            <div className="p-5 border-t border-zinc-900 flex justify-end gap-3 bg-black/40">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-700 bg-zinc-950 font-mono text-xs font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="promo-campaign-form"
                className="px-5 py-2.5 rounded-xl bg-gold text-black font-sans text-xs font-bold hover:bg-amber-400 transition-all uppercase tracking-widest cursor-pointer"
              >
                {editingOffer ? 'Save Changes' : 'Publish Campaign'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
