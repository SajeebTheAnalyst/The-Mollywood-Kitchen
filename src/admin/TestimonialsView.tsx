import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ReviewItem } from '../types';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  X, 
  Star, 
  UserPlus, 
  Check, 
  UserCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestimonialsView() {
  const { reviews, addReview, editReview, deleteReview, showToast } = useStore();

  // Dialog togglers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);

  // States
  const [formData, setFormData] = useState({
    name: '',
    role: 'Local Guide',
    rating: 5,
    content: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });

  const handleOpenCreateForm = () => {
    setEditingReview(null);
    setFormData({
      name: '',
      role: 'Family Diner',
      rating: 5,
      content: '',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (review: ReviewItem) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      role: review.role || 'Gourmet Diner',
      rating: review.rating,
      content: review.content,
      avatar: review.avatar
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;

    const payload: Omit<ReviewItem, 'id'> = {
      name: formData.name.trim(),
      role: formData.role.trim() || 'Verified Diner',
      rating: formData.rating,
      content: formData.content.trim(),
      avatar: formData.avatar
    };

    if (editingReview) {
      editReview({ ...payload, id: editingReview.id });
    } else {
      addReview(payload);
    }
    setIsFormOpen(false);
  };

  // Human photo presets to prevent empty states
  const avatarPresets = [
    { name: 'Casual Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Professional Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Business Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Cozy Female', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header with create trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Testimonials Director</h1>
          <p className="text-xs text-zinc-400 mt-1">Review feedback, manage display positions, and authorize reviews for main showcases.</p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>AUTHORIZE TESTIMONIAL</span>
        </button>
      </div>

      {/* 2. Reviews masonry render */}
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-3xl">
          <MessageSquare className="h-8 w-8 text-zinc-650 mx-auto mb-3" />
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">No Authorized Reviews Cataloged</p>
          <p className="text-[10px] text-zinc-600 mt-1">Tap the button above to publish customer quotes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between hover:border-gold/25 transition-all duration-300 relative group border-gold-glow"
            >
              <div className="space-y-3">
                {/* Gold Rating Stars indicators */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3 w-3 ${
                        idx < rev.rating ? 'text-gold fill-gold' : 'text-zinc-800'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed h-16 overflow-y-auto pr-1">
                  "{rev.content}"
                </p>
              </div>

              {/* User bottom metadata card */}
              <div className="flex items-center justify-between gap-4 border-t border-zinc-900/60 pt-4 mt-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="h-8 w-8 rounded-full object-cover bg-zinc-900 shrink-0 border border-zinc-800"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-zinc-100 truncate">{rev.name}</p>
                    <p className="text-[9px] font-mono text-zinc-550 truncate uppercase tracking-widest">{rev.role || 'Verified Diner'}</p>
                  </div>
                </div>

                {/* CRUD button trigger bar */}
                <div className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                  <button
                    onClick={() => handleOpenEditForm(rev)}
                    className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(rev.id)}
                    className="p-1.5 rounded-lg border border-zinc-900 hover:border-rose-900 text-rose-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Testimonial dialog confirmation overlay */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl scaleUp">
            <h3 className="font-heading text-base font-bold text-white tracking-wider">PULL CUSTOMER REVIEW?</h3>
            <p className="text-xs text-zinc-450 mt-2 leading-relaxed">
              Are you sure you want to stop publishing this customer review? It will be archived and removed from landing sliders instantly.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteConfirmOpen(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-803 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteReview(isDeleteConfirmOpen);
                  setIsDeleteConfirmOpen(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold font-sans text-black bg-rose-500 hover:bg-rose-450 transition-all uppercase tracking-widest"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit dialog modal drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between border-gold-glow text-zinc-200">
            
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-gold uppercase">TESTIMONIAL DIORAMA</span>
                <h3 className="font-heading text-base font-bold text-white tracking-wide mt-0.5">
                  {editingReview ? `Edit Review from ${editingReview.name}` : 'Approve New Review Quote'}
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form parameters */}
            <form onSubmit={handleSaveForm} id="review-testimonial-form" className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Shakil Al-Mahmud"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Customer Role Tag</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Local Food Critic"
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-250 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rating selection slide */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Rating Gilded Stars ({formData.rating}★)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-2.5 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="5">Excellent Perfect (5 Stars) ★★★★★</option>
                    <option value="4">Great Quality (4 Stars) ★★★★☆</option>
                    <option value="3">Average Standard (3 Stars) ★★★☆☆</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Avatar Image Link</label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Avatar quick presets selection shortcuts */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase font-bold text-zinc-500">Suggested Demographic Presets</span>
                <div className="grid grid-cols-4 gap-2">
                  {avatarPresets.map(preset => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => setFormData({ ...formData, avatar: preset.url })}
                      className={`p-1 border border-zinc-905 bg-zinc-950 rounded-lg text-center truncate cursor-pointer text-[9px] select-none ${
                        formData.avatar === preset.url 
                          ? 'border-gold text-gold font-bold font-mono' 
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Authorized Quote Statement</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Provide feedback details here, describing taste profiles, seating ambiance, clean layouts..."
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none leading-relaxed"
                />
              </div>

            </form>

            <div className="p-5 border-t border-zinc-900 flex justify-end gap-3 bg-black/40">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-700 bg-zinc-955 font-mono text-xs font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
              >
                Cancel Action
              </button>
              <button
                type="submit"
                form="review-testimonial-form"
                className="px-5 py-2.5 rounded-xl bg-gold text-black font-sans text-xs font-bold hover:bg-gold-light hover:shadow hover:shadow-gold/10 transition-all uppercase tracking-widest cursor-pointer"
              >
                Incorporate Testimonial
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
