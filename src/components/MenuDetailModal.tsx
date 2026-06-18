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
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-zinc-950 border border-gold/20 shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button overlay */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-[160] rounded-full bg-black/80 p-2.5 text-zinc-400 hover:text-white border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-gold"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left half: Giant food image panel */}
        <div className="relative w-full lg:w-1/2 h-52 sm:h-72 lg:h-auto min-h-[220px]">
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
          
          {/* Rating elements overlay */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-col space-y-1 bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-zinc-800/80">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="text-sm font-bold font-mono text-white">{item.rating}</span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-400 tracking-wider">CUSTOMER FAVORITE</span>
          </div>
          
          {item.popular && (
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-gradient-to-r from-gold to-gold-dark text-black text-[10px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest">
              <Award className="h-3.5 w-3.5" />
              <span>MOST POPULAR</span>
            </div>
          )}
        </div>

        {/* Right half: Fully responsive detail config form text */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[60vh] lg:max-h-[90vh] flex flex-col justify-between space-y-6">
          
          {/* Premium Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-gold uppercase">{item.category} selection</span>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wide">{item.name}</h2>
            <div className="text-xl font-mono font-bold text-gold-metallic">৳{item.price.toLocaleString()}</div>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed font-light mt-2">{item.description}</p>
          </div>

          {/* Specialty Textbox */}
          <div className="rounded-xl bg-zinc-900/60 p-3 border border-zinc-800/80 flex items-start space-x-2.5">
            <Award className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-none">Chef's Speciality Notes</h4>
              <p className="text-[11px] text-zinc-400 mt-1 italic font-light">{item.specialty}</p>
            </div>
          </div>

          {/* Ingredient Selector configuration (Exclusive touch) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-300 tracking-wider flex items-center space-x-2">
              <Leaf className="h-4 w-4 text-emerald-500" />
              <span>EDIT INGREDIENTS LIST</span>
            </h4>
            <p className="text-[10px] text-zinc-500">Tap to toggle ingredients we should skip from your plate:</p>
            
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing) => {
                const isExcluded = excludedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleIngredientToggle(ing)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300 flex items-center space-x-1.5 border ${
                      isExcluded
                        ? 'border-red-900/40 bg-red-950/20 text-red-400 line-through'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-gold/30 hover:text-white'
                    }`}
                  >
                    {!isExcluded && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                    <span>{ing}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice Level Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-300 tracking-wider flex items-center space-x-2">
              <Flame className="h-4 w-4 text-accent-red-hover" />
              <span>CHOOSE SPICE LEVEL</span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {spiceLevels.map((s) => (
                <button
                  key={s.level}
                  onClick={() => setSelectedSpice(s.level)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    selectedSpice === s.level
                      ? 'border-gold bg-zinc-900 text-gold scale-[1.03] shadow-md shadow-gold/5'
                      : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:border-zinc-800 hover:text-white'
                  }`}
                >
                  <p className="text-[10px] text-zinc-500 leading-none">Level {s.level + 1}</p>
                  <h5 className="mt-1 leading-tight truncate">{s.label}</h5>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Cart integration footer layout */}
          <div className="border-t border-zinc-900 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Quantity Adjuster */}
            <div className="flex items-center space-x-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl w-fit">
              <span className="text-[11px] font-mono font-bold text-zinc-400 px-3 uppercase tracking-wider">QUANTITY</span>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="h-8 w-8 rounded-lg bg-zinc-900 text-zinc-300 flex items-center justify-center hover:bg-zinc-800 font-bold"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-black text-sm text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="h-8 w-8 rounded-lg bg-zinc-900 text-zinc-300 flex items-center justify-center hover:bg-zinc-805 hover:bg-zinc-800 font-bold"
              >
                +
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleAddAction}
              disabled={showConfirmText}
              className={`flex-1 flex justify-center items-center space-x-3 py-3 rounded-xl font-bold tracking-widest text-xs uppercase transition-all duration-500 shadow-xl border ${
                showConfirmText
                  ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                  : 'bg-gradient-to-r from-accent-red to-accent-red-hover border-accent-red text-white hover:from-gold hover:to-gold-dark hover:text-neutral-950 hover:border-gold shadow-accent-red/15'
              }`}
            >
              {showConfirmText ? (
                <>
                  <Check className="h-4.5 w-4.5 animate-bounce" />
                  <span>DISH ADDED TO CART!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <span>ADD TO CART - ৳{(item.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
