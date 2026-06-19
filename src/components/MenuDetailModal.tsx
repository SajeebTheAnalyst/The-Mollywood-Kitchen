import React, { useState, useEffect } from 'react';
import { X, Flame, Check, ShoppingCart, Star, Award, Leaf } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, spiceLevel: number, quantity: number) => void;
}

export default function MenuDetailModal({
  item,
  onClose,
  onAddToCart
}: MenuDetailModalProps) {
  const [selectedSpice, setSelectedSpice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [showConfirmText, setShowConfirmText] = useState(false);

  // Reset local adjustments on selection update
  useEffect(() => {
    if (item) {
      setSelectedSpice(item.spiceLevel);
      setQuantity(1);
      setExcludedIngredients([]);
      setShowConfirmText(false);
    }
  }, [item]);

  if (!item) return null;

  const handleIngredientToggle = (ing: string) => {
    if (excludedIngredients.includes(ing)) {
      setExcludedIngredients(prev => prev.filter(x => x !== ing));
    } else {
      setExcludedIngredients(prev => [...prev, ing]);
    }
  };

  const handleAddAction = () => {
    onAddToCart(item, selectedSpice, quantity);
    setShowConfirmText(true);
    setTimeout(() => {
      setShowConfirmText(false);
      onClose();
    }, 1200);
  };

  const spiceLevels = [
    { level: 0, label: 'Mild / Sweet', color: 'text-zinc-400 bg-zinc-900 border-zinc-800' },
    { level: 1, label: 'Mild Kick 🌶️', color: 'text-amber-500 bg-amber-950/20 border-amber-900/30' },
    { level: 2, label: 'Medium Flame 🔥', color: 'text-orange-500 bg-orange-950/20 border-orange-900/30' },
    { level: 3, label: 'Extreme Inferno 🌋', color: 'text-red-500 bg-red-950/30 border-red-900/40' }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl overflow-hidden rounded-sm bg-zinc-950 border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-scaleUp max-h-[90vh] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button overlay */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-[160] rounded-sm bg-black/80 p-3 text-text-secondary hover:text-text-primary border border-white/10 transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left half: Giant food image panel */}
        <div className="relative w-full lg:w-5/12 h-64 lg:h-auto min-h-[300px]">
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover grayscale opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
          
          {/* Rating elements overlay */}
          <div className="absolute bottom-6 left-6 z-10 flex flex-col space-y-1 bg-black/40 px-4 py-3 rounded-sm backdrop-blur-sm border border-white/5">
            <div className="flex items-center space-x-1.5">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="text-sm font-bold text-text-primary">{item.rating}</span>
            </div>
            <span className="text-[9px] font-bold text-text-secondary tracking-[0.2em] uppercase">Guest Rating</span>
          </div>
          
          {item.popular && (
            <div className="absolute top-6 left-6 z-10 bg-gold text-black text-[9px] font-black px-4 py-1.5 rounded-sm shadow-xl uppercase tracking-[0.3em]">
              Signature
            </div>
          )}
        </div>

        {/* Right half: Fully responsive detail config form text */}
        <div className="w-full lg:w-7/12 p-8 sm:p-12 overflow-y-auto max-h-[60vh] lg:max-h-[90vh] flex flex-col justify-between space-y-8">
          
          {/* Premium Header */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.4em] text-text-secondary uppercase">{item.category}</span>
            <h2 className="font-heading text-3xl font-black text-text-primary tracking-widest uppercase">{item.name}</h2>
            <div className="text-2xl font-heading font-black text-gold">৳{item.price.toLocaleString()}</div>
            <p className="font-sans text-sm text-text-secondary leading-relaxed font-light mt-4">{item.description}</p>
          </div>

          {/* Specialty Textbox */}
          <div className="rounded-sm bg-white/5 p-5 border border-white/10 flex items-start space-x-4">
            <Award className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-[10px] font-bold text-text-primary uppercase tracking-[0.2em]">Chef's Speciality</h4>
              <p className="text-xs text-text-secondary mt-2 italic font-light leading-relaxed">{item.specialty}</p>
            </div>
          </div>

          {/* Ingredient Selector configuration (Exclusive touch) */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-text-primary tracking-[0.3em] uppercase flex items-center space-x-3">
              <Leaf className="h-4 w-4 text-emerald-500" />
              <span>Personalize Ingredients</span>
            </h4>
            
            <div className="flex flex-wrap gap-2.5">
              {item.ingredients.map((ing) => {
                const isExcluded = excludedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleIngredientToggle(ing)}
                    className={`px-4 py-2 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 border ${
                      isExcluded
                        ? 'border-red-900/40 bg-red-950/20 text-red-400 opacity-50'
                        : 'border-white/10 bg-white/5 text-text-secondary hover:border-gold/30 hover:text-text-primary'
                    }`}
                  >
                    {ing}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice Level Section */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-text-primary tracking-[0.3em] uppercase flex items-center space-x-3">
              <Flame className="h-4 w-4 text-gold" />
              <span>Spice Intensity</span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {spiceLevels.map((s) => (
                <button
                  key={s.level}
                  onClick={() => setSelectedSpice(s.level)}
                  className={`p-4 rounded-sm border text-left transition-all duration-500 ${
                    selectedSpice === s.level
                      ? 'border-gold bg-gold/5 ring-1 ring-gold/20 shadow-lg'
                      : 'border-white/10 bg-zinc-950 text-text-secondary hover:border-white/20 hover:text-text-primary'
                  }`}
                >
                  <p className="text-[9px] font-bold text-text-secondary tracking-widest uppercase">Level {s.level + 1}</p>
                  <h5 className="mt-2 text-[10px] font-bold leading-tight uppercase tracking-widest">{s.label.split(' ')[0]}</h5>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Cart integration footer layout */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            
            {/* Quantity Adjuster */}
            <div className="flex items-center space-x-3 bg-zinc-950 border border-white/10 p-1 rounded-sm w-fit shadow-inner">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-sm bg-white/5 text-text-primary flex items-center justify-center hover:bg-white/10 transition-colors uppercase font-bold"
              >
                -
              </button>
              <span className="w-12 text-center font-heading font-black text-base text-text-primary">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="h-10 w-10 rounded-sm bg-white/5 text-text-primary flex items-center justify-center hover:bg-white/10 transition-colors uppercase font-bold"
              >
                +
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleAddAction}
              disabled={showConfirmText}
              className={`flex-1 flex justify-center items-center space-x-4 py-5 rounded-sm font-black tracking-[0.3em] text-[11px] uppercase transition-all duration-500 shadow-2xl ${
                showConfirmText
                  ? 'bg-emerald-950 text-emerald-400'
                  : 'bg-gold text-black hover:bg-white hover:text-black shadow-gold/5'
              }`}
            >
              {showConfirmText ? (
                <>
                  <Check className="h-4.5 w-4.5" />
                  <span>Dish Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <span>Add to Order - ৳{(item.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
