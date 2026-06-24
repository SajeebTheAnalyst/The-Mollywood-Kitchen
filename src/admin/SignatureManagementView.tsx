import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem } from '../types';

export default function SignatureManagementView() {
  const { menuItems, editMenuItem, showToast } = useStore();

  const toggleSignature = (item: MenuItem) => {
    editMenuItem({ ...item, is_special: !item.is_special });
    showToast(`Signature status updated for ${item.name}`, 'success');
  };

  const signatureItems = menuItems.filter(item => item.is_special);
  const regularItems = menuItems.filter(item => !item.is_special);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Signature Selection Manager</h1>
          <p className="text-xs text-zinc-400 mt-1">Select and manage items to highlight on the front-page Signature Slider.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
          <Star className="h-4 w-4" /> Active Signature Items ({signatureItems.length})
        </h2>
        {signatureItems.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No signature items selected.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signatureItems.map(item => (
              <div key={item.id} className="bg-zinc-950 border border-gold/30 rounded-xl p-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-zinc-900 rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gold">৳{item.price}</p>
                </div>
                <button
                  onClick={() => toggleSignature(item)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                  title="Remove from Signature"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-6 border-t border-zinc-900">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Available Menu Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularItems.map(item => (
            <div key={item.id} className="bg-zinc-950/50 border border-zinc-900 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-zinc-900 rounded-lg" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-zinc-300 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-zinc-500">৳{item.price}</p>
              </div>
              <button
                onClick={() => toggleSignature(item)}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                title="Add to Signature"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
