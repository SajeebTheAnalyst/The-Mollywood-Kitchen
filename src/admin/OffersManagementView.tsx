import React, { useState, useRef } from 'react';
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
  Award,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_OFFER_IMAGES = [
  { name: 'Kacchi Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Mutton Rezala', url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800' },
  { name: 'Tandoori Chicken', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800' },
  { name: 'Mixed Platter', url: 'https://images.unsplash.com/photo-1598103442097-8b743e2b95c6?auto=format&fit=crop&q=80&w=800' },
  { name: 'Bengali Special', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800' },
  { name: 'Beef Kala Bhuna', url: 'https://images.unsplash.com/photo-1603360946369-fa9902792685?auto=format&fit=crop&q=80&w=800' }
];

export default function OffersManagementView() {
  const { offers, addOffer, editOffer, deleteOffer, showToast } = useStore();
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    isFeatured: false,
    displayOrder: 0,
    showOnHome: true,
    originalPrice: '' as string | number,
    offerPrice: '' as string | number,
    includedItems: ''
  });

  // Handle local file upload & convert to base64 for instant preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        showToast('Offer image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

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
      isFeatured: false,
      displayOrder: offers.length + 1,
      showOnHome: true,
      originalPrice: '',
      offerPrice: '',
      includedItems: ''
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
      isFeatured: offer.isFeatured ?? false,
      displayOrder: offer.displayOrder ?? 0,
      showOnHome: offer.showOnHome ?? true,
      originalPrice: offer.originalPrice ?? '',
      offerPrice: offer.offerPrice ?? '',
      includedItems: offer.includedItems ?? ''
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
      isFeatured: formData.isFeatured,
      displayOrder: Number(formData.displayOrder) || 0,
      showOnHome: formData.showOnHome,
      originalPrice: formData.originalPrice !== '' ? Number(formData.originalPrice) : undefined,
      offerPrice: formData.offerPrice !== '' ? Number(formData.offerPrice) : undefined,
      includedItems: formData.includedItems.trim() || undefined
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
                  <div className="flex items-center gap-4 text-zinc-400 border-t border-zinc-900/60 pt-1.5 mt-1">
                    <span>Order: <strong className="text-gold font-bold">{offer.displayOrder ?? 0}</strong></span>
                    <span>Show on Home: <strong className="text-gold font-bold">{offer.showOnHome !== false ? 'YES' : 'NO'}</strong></span>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-1">
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

                <div className="space-y-1 col-span-1">
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

                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 1"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Price fields & Included Items row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Original Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 400 (Optional)"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono text-zinc-300"
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Offer Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                    placeholder="e.g. 280 (Optional)"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono text-gold font-bold"
                  />
                </div>

                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Included Items</label>
                  <input
                    type="text"
                    value={formData.includedItems}
                    onChange={(e) => setFormData({ ...formData, includedItems: e.target.value })}
                    placeholder="e.g. Biryani, Drinks, Salad"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Offer Image</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-gold font-sans text-[10px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <UploadCloud className="h-3 w-3" />
                    <span>Upload Local File</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Paste Unsplash link OR upload a local file above..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                />

                {/* Preset Choices */}
                <div className="pt-1">
                  <span className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Or Select Premium Food Presets</span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {PRESET_OFFER_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: preset.url }));
                          showToast(`Selected "${preset.name}" preset image!`, 'success');
                        }}
                        className={`relative h-10 rounded-lg overflow-hidden border transition-all cursor-pointer group/preset ${formData.image === preset.url ? 'border-gold shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'border-zinc-900 hover:border-zinc-700'}`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover opacity-75 group-hover/preset:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preset:opacity-100 transition-opacity">
                          <span className="text-[7px] font-bold text-white uppercase text-center leading-none px-0.5">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
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

              {/* Show On Homepage Toggle */}
              <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 font-sans">Show On Homepage</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light mt-0.5">Toggle to display this active promo card in the promotions carousel on the homepage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, showOnHome: !(formData.showOnHome ?? true) })}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {formData.showOnHome !== false ? (
                    <span className="flex items-center gap-1.5 font-mono text-gold text-xs font-bold">
                      <span>SHOW</span>
                      <ToggleRight className="h-8 w-8 text-gold fill-amber-950/40" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-mono text-zinc-500 text-xs">
                      <span>HIDE</span>
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
