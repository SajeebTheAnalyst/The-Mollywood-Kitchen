import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Check, X, Edit2, Trash2, Plus, UploadCloud, Save, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';

export default function SignatureManagementView() {
  const { menuItems, addMenuItem, editMenuItem, deleteMenuItem, showToast } = useStore();
  
  // Local form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    image: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filter active special signature dishes
  const signatureItems = menuItems.filter(item => item.is_special);
  // Available regular items to toggle
  const regularItems = menuItems.filter(item => !item.is_special);

  // Handle text input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        showToast('Image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save or Update Product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a dish name', 'error');
      return;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      showToast('Please enter a valid positive price', 'error');
      return;
    }

    const priceNum = Number(formData.price);
    const imageToUse = formData.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600';

    if (isEditing && formData.id) {
      // Find the item first to preserve other fields like category, rating, popular, etc.
      const existing = menuItems.find(it => it.id === formData.id);
      if (existing) {
        editMenuItem({
          ...existing,
          name: formData.name.trim(),
          price: priceNum,
          description: formData.description.trim(),
          image: imageToUse,
          is_special: true
        });
        showToast(`"${formData.name}" updated successfully!`, 'success');
      }
    } else {
      // Add as a brand new special/signature item
      const newItem: MenuItem = {
        id: 'sig_' + Date.now(),
        name: formData.name.trim(),
        price: priceNum,
        description: formData.description.trim(),
        image: imageToUse,
        is_special: true,
        category: 'bengali',
        rating: 5.0,
        popular: true,
        ingredients: ["Aromatic Spices", "Fresh Selection"],
        spiceLevel: 2,
        specialty: 'House special signature dish'
      };
      addMenuItem(newItem);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      description: '',
      image: ''
    });
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Load item to edit
  const handleEditClick = (item: MenuItem) => {
    setFormData({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      image: item.image || ''
    });
    setIsEditing(true);
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle item's special status directly
  const toggleSignatureStatus = (item: MenuItem) => {
    editMenuItem({ ...item, is_special: !item.is_special });
    showToast(`Signature status updated for "${item.name}"`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Signature Panel</h1>
          <p className="text-xs text-zinc-400 mt-1">Add, update, and manage your premium highlighted house specialties with direct database persistence.</p>
        </div>
      </div>

      {/* ADD/EDIT FORM CONTAINER */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
        {/* Subtle decorative gold top-bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
        
        <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 className="h-4 w-4 text-gold" /> : <Plus className="h-4 w-4 text-gold" />}
          {isEditing ? 'Edit Signature Dish Details' : 'Add New Signature Dish'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input details columns */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Dish Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Beef Kala Bhuna"
                  className="w-full h-11 bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 text-sm focus:border-gold/50 focus:outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Price (BDT)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 380"
                  className="w-full h-11 bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 text-sm focus:border-gold/50 focus:outline-none transition-all placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this mouthwatering masterpiece..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-4 text-sm focus:border-gold/50 focus:outline-none transition-all placeholder:text-zinc-600 resize-none"
              />
            </div>
          </div>

          {/* Image upload preview box */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Image Upload & Preview</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-32 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gold/40 hover:bg-zinc-900/60 transition-all overflow-hidden group/upload"
              >
                {formData.image ? (
                  <>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover group-hover/upload:opacity-50 transition-all"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-all bg-black/40">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full border border-white/10">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <UploadCloud className="h-6 w-6 text-zinc-500 mx-auto mb-1 group-hover/upload:text-gold transition-colors" />
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Drag & Drop or Click</span>
                    <span className="block text-[9px] text-zinc-600 mt-0.5">Max size 2MB</span>
                  </div>
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden" 
              />
            </div>

            <div className="flex gap-2 mt-4 lg:mt-0">
              <button 
                type="submit"
                className="flex-1 h-11 bg-gold hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {isEditing ? 'Save Product' : 'Create Product'}
              </button>
              {isEditing && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="h-11 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl px-4 flex items-center justify-center transition-all active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ACTIVE SIGNATURE DISHES GRID */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3">
          <h2 className="text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
            <Star className="h-4 w-4 fill-gold text-gold" /> Active Signature Items ({signatureItems.length})
          </h2>
          <span className="text-[10px] font-mono text-zinc-500">Persisted in Local Cache & Cloud</span>
        </div>

        {signatureItems.length === 0 ? (
          <div className="bg-zinc-950/40 border border-zinc-900/80 rounded-xl p-8 text-center">
            <p className="text-xs text-zinc-500 italic">No signature items found. Add items above or toggle available menu items below to showcase them!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {signatureItems.map(item => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-zinc-950 border border-zinc-900 hover:border-gold/20 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all group"
                >
                  {/* Image container */}
                  <div className="aspect-[16/10] w-full bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-3 right-3 bg-black/70 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="text-[9px] font-bold text-gold uppercase tracking-wider">SPECIAL</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-gold transition-colors">{item.name}</h3>
                      <p className="text-xs text-gold font-mono mt-1 font-semibold">৳{item.price}</p>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed">{item.description || 'Premium House Specialty'}</p>
                    </div>

                    {/* Operational Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-zinc-900/80">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="h-10 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        title="Edit Item Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Item
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${item.name}"? This deletes it completely.`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        className="h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Item
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* QUICK ASSIGN SELECTOR FROM OTHER MENU ITEMS */}
      <div className="space-y-4 pt-8 border-t border-zinc-900">
        <div>
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Toggle General Menu Items as Signature</h2>
          <p className="text-xs text-zinc-500 mt-1">Want to showcase an existing menu item in the Signature row? Simply toggle its status here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
          {regularItems.map(item => (
            <div 
              key={item.id} 
              className="bg-zinc-950/40 border border-zinc-900/60 hover:border-zinc-800 rounded-xl p-4 flex items-center gap-4 transition-all"
            >
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-zinc-900 rounded-lg shrink-0 border border-white/5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-zinc-300 truncate">{item.name}</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">৳{item.price}</p>
              </div>
              <button
                onClick={() => toggleSignatureStatus(item)}
                className="h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="Promote to Signature"
              >
                <Check className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
