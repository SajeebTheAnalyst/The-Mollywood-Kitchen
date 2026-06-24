import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { 
  Plus, 
  Search, 
  Grid, 
  List as ListIcon, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Flame, 
  Star, 
  UploadCloud, 
  Check, 
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OWNER_CATEGORIES = [
  'Bengali Meals',
  'Family Combo',
  'Biriyani & Indian',
  'Chinese',
  'Set Menu',
  'Snacks',
  'Desserts',
  'Cold Drinks',
  'Fresh Juice',
  'Mojito',
  'Tea & Coffee'
];

export default function MenuManagementView() {
  const { 
    menuItems, 
    addMenuItem, 
    editMenuItem, 
    deleteMenuItem, 
    duplicateMenuItem, 
    showToast 
  } = useStore();

  // Navigation & View controllers
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Active item details for CRUD edit/create overlay
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    price: 150,
    description: '',
    category: 'bengali' as MenuItem['category'],
    ownerCategory: 'Bengali Meals',
    image: '',
    ingredientsInput: '',
    ingredientsList: [] as string[],
    spiceLevel: 0,
    specialty: '',
    popular: false,
    featured: false,
    available: true,
    is_special: false
  });

  // Load editing state details on edit click
  const handleOpenCreateForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      price: 100,
      description: '',
      category: 'bengali',
      ownerCategory: 'Bengali Meals',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      ingredientsInput: '',
      ingredientsList: ['Fresh organic ingredients', 'Deshi Spices'],
      spiceLevel: 0,
      specialty: 'Cozy and home-cooked savory taste',
      popular: false,
      featured: false,
      available: true,
      is_special: false
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: MenuItem) => {
    setEditingItem(item);
    // Try to matches owner category from initial list or defaults
    let matchedOwner = 'Bengali Meals';
    if (item.category === 'indian') matchedOwner = 'Biriyani & Indian';
    if (item.category === 'chinese') matchedOwner = 'Chinese';
    if (item.category === 'snacks-beverages') {
      if (item.name.toLowerCase().includes('tea') || item.name.toLowerCase().includes('coffee')) matchedOwner = 'Tea & Coffee';
      else matchedOwner = 'Cold Drinks';
    }

    setFormData({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      ownerCategory: matchedOwner,
      image: item.image,
      ingredientsInput: '',
      ingredientsList: item.ingredients || ['Fresh deshi source'],
      spiceLevel: item.spiceLevel,
      specialty: item.specialty || '',
      popular: item.popular || false,
      featured: item.popular && item.price > 200, // mock featured mapping
      available: true,
      is_special: item.is_special || false
    });
    setIsFormOpen(true);
  };

  // Add tag ingredients helpers
  const handleAddIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = formData.ingredientsInput.trim().replace(/,$/, '');
      if (val && !formData.ingredientsList.includes(val)) {
        setFormData({
          ...formData,
          ingredientsList: [...formData.ingredientsList, val],
          ingredientsInput: ''
        });
      }
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setFormData({
      ...formData,
      ingredientsList: formData.ingredientsList.filter((_, i) => i !== idx)
    });
  };

  // Preset food image trigger choices
  const presetFoodImages = [
    { name: 'Kala Bhuna', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
    { name: 'Biriyani Rice', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600' },
    { name: 'Butter Curry', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=600' },
    { name: 'Cold Lassi / Juice', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600' },
    { name: 'Warm Brew Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sizzling Woks', url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600' }
  ];

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload: Omit<MenuItem, 'id'> = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image || presetFoodImages[0].url,
      ingredients: formData.ingredientsList,
      spiceLevel: formData.spiceLevel,
      specialty: formData.specialty.trim() || 'Cozy savory specialty',
      popular: formData.popular,
      is_special: formData.is_special,
      rating: 5
    };

    if (editingItem) {
      editMenuItem({ ...payload, id: editingItem.id });
    } else {
      addMenuItem(payload);
    }
    setIsFormOpen(false);
  };

  // Filtering list
  const filteredList = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Subcategory mapping
    if (selectedSubCategory !== 'All') {
      if (selectedSubCategory === 'Bengali Meals' || selectedSubCategory === 'Snacks') {
        return matchesSearch && item.category === 'bengali';
      }
      if (selectedSubCategory === 'Biriyani & Indian') {
        return matchesSearch && item.category === 'indian';
      }
      if (selectedSubCategory === 'Chinese' || selectedSubCategory === 'Set Menu') {
        return matchesSearch && item.category === 'chinese';
      }
      if (selectedSubCategory === 'Tea & Coffee' || selectedSubCategory === 'Cold Drinks' || selectedSubCategory === 'Fresh Juice' || selectedSubCategory === 'Mojito') {
        return matchesSearch && item.category === 'snacks-beverages';
      }
    }
    return matchesSearch;
  });

  // Simple clean pagination
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (dir: 'next' | 'prev') => {
    if (dir === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (dir === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Add Trigger Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Menu & Recipe Database</h1>
          <p className="text-xs text-zinc-400 mt-1">Add, update, search or replicate dishes in your active dining service.</p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>ADD NEW RECIPE</span>
        </button>
      </div>

      {/* 2. Search, filter and Layout Toggles Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-zinc-950/40 p-4 border border-zinc-900 rounded-2xl">
        <div className="md:col-span-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search food by name, description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black border border-zinc-900 focus:border-gold/45 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        {/* Categories select dropdown filter */}
        <div className="md:col-span-5 flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider shrink-0">Tags:</span>
          <select
            value={selectedSubCategory}
            onChange={(e) => {
              setSelectedSubCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black border border-zinc-900 focus:border-gold/30 rounded-xl px-3 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer"
          >
            <option value="All">All Restaurant Sub-Categories</option>
            {OWNER_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Layout managers */}
        <div className="md:col-span-3 flex justify-end gap-2 shrink-0">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-2 rounded-lg border transition-all ${
              layoutMode === 'grid' 
                ? 'bg-zinc-900 border-zinc-800 text-gold' 
                : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            className={`p-2 rounded-lg border transition-all ${
              layoutMode === 'list' 
                ? 'bg-zinc-900 border-zinc-800 text-gold' 
                : 'border-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Simplified List View"
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Catalog Listing Render */}
      {paginatedList.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-3xl space-y-3">
          <p className="text-zinc-550 text-xs font-mono tracking-widest uppercase">No Active Matches Found</p>
          <p className="text-zinc-400 text-sm font-light max-w-xs mx-auto">Try typing a different name or clear category selection filter.</p>
        </div>
      ) : layoutMode === 'grid' ? (
        
        /* Grid Render (Modular cinematic cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedList.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden hover:border-gold/20 flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-[8px] font-mono text-zinc-300 uppercase tracking-widest">
                        {item.category}
                      </span>
                      {item.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[8px] font-mono font-bold text-gold uppercase tracking-widest">
                          Popular★
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-heading text-sm font-bold text-zinc-100 group-hover:text-gold transition-colors">{item.name}</h3>
                      <p className="font-sans text-xs font-black text-gold mt-0.5 shrink-0">{item.price} BDT</p>
                    </div>
                    <p className="text-[11px] text-zinc-450 leading-relaxed font-light line-clamp-2 h-8">{item.description}</p>
                    <p className="text-[9px] font-mono text-zinc-550 italic leading-snug line-clamp-1">Specialty: {item.specialty || 'Unmatched hygiene standards'}</p>
                  </div>
                </div>

                {/* Operations Actions Buttons Footer */}
                <div className="p-4 pt-0 border-t border-zinc-900/40 flex items-center justify-between gap-1 mt-3">
                  <button
                    onClick={() => handleOpenEditForm(item)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => duplicateMenuItem(item.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                      title="Clone/Replicate Entry"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setIsDeleteConfirmOpen(item.id)}
                      className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-950/40 transition-colors"
                      title="Delete recipe delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        
        /* List Render (Compact table format) */
        <div className="border border-zinc-900 bg-zinc-950/40 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[10px] uppercase bg-black/40">
                  <th className="p-4 font-normal">Food name</th>
                  <th className="p-4 font-normal">Category</th>
                  <th className="p-4 font-normal">Ingredients</th>
                  <th className="p-4 font-normal">Price</th>
                  <th className="p-4 font-normal text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {paginatedList.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-9 w-9 rounded-lg object-cover bg-zinc-900 shrink-0" 
                        />
                        <div>
                          <p className="font-semibold text-zinc-200 group-hover:text-gold transition-colors">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 font-light truncate max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400 font-mono text-[10px] truncate max-w-xs">
                      {item.ingredients?.join(', ') || 'Fresh daily items'}
                    </td>
                    <td className="p-4 font-bold text-gold font-sans">{item.price} BDT</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => handleOpenEditForm(item)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateMenuItem(item.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                          title="Clone"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setIsDeleteConfirmOpen(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-white hover:bg-rose-950/40 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Elegant Page Navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4 border-t border-zinc-900">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className="p-2 border border-zinc-900 hover:border-zinc-700 text-zinc-400 disabled:opacity-30 disabled:pointer-events-none rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className="p-2 border border-zinc-900 hover:border-zinc-700 text-zinc-400 disabled:opacity-30 disabled:pointer-events-none rounded-xl transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Overlays */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl scaleUp">
            <h3 className="font-heading text-base font-bold text-white tracking-wider">DELETE RECIPE ENTRY?</h3>
            <p className="text-xs text-zinc-450 mt-2 leading-relaxed">
              Are you sure you want to delete this menu food item? In-app configurations will be updated instantly. This cannot be undone.
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
                  deleteMenuItem(isDeleteConfirmOpen);
                  setIsDeleteConfirmOpen(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold font-sans text-black bg-rose-500 hover:bg-rose-400 transition-all uppercase tracking-widest"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create / Edit Sliding Overlay Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fadeIn p-2 md:p-4">
          <div className="w-full max-w-2xl h-full md:h-[95vh] bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden relative border-gold-glow">
            
            {/* Form Header */}
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-gold uppercase">RECIPE EDITOR</span>
                <h3 className="font-heading text-lg font-bold text-white tracking-wide mt-0.5">
                  {editingItem ? `Edit Recipe: ${editingItem.name}` : 'Create New Menu Recipe'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body content */}
            <form onSubmit={handleSaveForm} id="recipe-editor-form" className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left side column details */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Recipe Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mutton Rogan Josh"
                      className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Standard Price (BDT)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Spice Level</label>
                      <select
                        value={formData.spiceLevel}
                        onChange={(e) => setFormData({ ...formData, spiceLevel: Number(e.target.value) })}
                        className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-305 outline-none cursor-pointer"
                      >
                        <option value="0">Non-spicy 🌶️ x 0</option>
                        <option value="1">Mild Kick 🌶️ x 1</option>
                        <option value="2">Medium Hot 🌶️ x 2</option>
                        <option value="3">Inferno Hot 🌶️ x 3</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Primary Website Tab</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem['category'] })}
                      className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer font-mono"
                    >
                      <option value="bengali">🐟 Bengali Platter Tab</option>
                      <option value="indian">🍛 Indian Hot Clay Oven Tab</option>
                      <option value="chinese">🥢 Chinese & Set Menu Tab</option>
                      <option value="snacks-beverages">🍹 Cold Drinks & Snacks Tab</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Owner sub-category</label>
                    <select
                      value={formData.ownerCategory}
                      onChange={(e) => setFormData({ ...formData, ownerCategory: e.target.value })}
                      className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-3 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer"
                    >
                      {OWNER_CATEGORIES.map(oc => (
                        <option value={oc} key={oc}>{oc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Specialty description</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      placeholder="e.g. Traditional clay-oven smoked premium cut."
                      className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                {/* Right side column: images, tags, materials */}
                <div className="space-y-4">
                  
                  {/* Food representation preview */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 flex justify-between items-center">
                      <span>Photo URL</span>
                    </label>
                    <div className="text-[10px] text-zinc-500 mb-2 leading-relaxed bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                      <span className="font-bold text-zinc-300 block mb-1">Upload Size Instructions:</span>
                      • <strong>Hero Image:</strong> 1200x1200px<br />
                      • <strong>Featured/Signature/Menu Item:</strong> 800x800px<br />
                      • <strong>Gallery:</strong> 1200x800px
                    </div>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                    />
                  </div>

                  {/* Image Preview Block */}
                  {formData.image && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 block">Live Preview (object-contain)</span>
                      <div className="w-full h-40 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center overflow-hidden p-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="h-full w-full object-contain" 
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Preset quick image selection area */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-zinc-500">Quick Image Selection Presets</span>
                    <div className="grid grid-cols-3 gap-2">
                      {presetFoodImages.map(img => (
                        <button
                          type="button"
                          key={img.name}
                          onClick={() => setFormData({ ...formData, image: img.url })}
                          className={`p-1.5 rounded-lg border text-[9px] text-center truncate cursor-pointer select-none transition-all ${
                            formData.image === img.url 
                              ? 'bg-gold/20 border-gold/60 text-gold font-bold font-mono' 
                              : 'bg-zinc-950 border-zinc-900 text-zinc-450 hover:text-white'
                          }`}
                        >
                          {img.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drag and Drop Visual Simulation */}
                  <div className="border border-dashed border-zinc-800 bg-black/40 hover:bg-zinc-900/10 hover:border-gold/20 p-4 rounded-xl text-center cursor-pointer transition-all space-y-1" onClick={() => showToast('In development mode, please choose an image preset or paste a URL.', 'success')}>
                    <UploadCloud className="h-6 w-6 text-zinc-505 mx-auto" />
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide">Drag & drop item photo</p>
                    <p className="text-[8px] text-zinc-650">Compresses to optimal WebP layout instantly</p>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl space-y-3.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">Recipe Indexing Tags</span>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.popular}
                          onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                          className="accent-gold h-4 w-4 rounded border-zinc-900 bg-black"
                        />
                        <span>Mark as signature "Popular Owner's Dish" ★</span>
                      </label>
                      <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_special}
                          onChange={(e) => setFormData({ ...formData, is_special: e.target.checked })}
                          className="accent-gold h-4 w-4 rounded border-zinc-900 bg-black"
                        />
                        <span>Mark as "Special Food" (Glow Animation) 🌟</span>
                      </label>
                      <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="accent-gold h-4 w-4 rounded border-zinc-900 bg-black"
                        />
                        <span>Featured on website hero slideshow section</span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* Description & Ingredients row details */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Description story</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a culinary background, savory taste descriptors or plate portions details..."
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Ingredients list</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.ingredientsInput}
                      onChange={(e) => setFormData({ ...formData, ingredientsInput: e.target.value })}
                      onKeyDown={handleAddIngredient}
                      placeholder="Type ingredient (e.g. Saffron) and press Enter or comma"
                      className="w-full bg-black border border-zinc-900 focus:border-gold/45 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                    />
                  </div>

                  {/* Render ingredient chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.ingredientsList.map((ing, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-350"
                      >
                        <span>{ing}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </form>

            {/* Form Footer Controls */}
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
                form="recipe-editor-form"
                className="px-5 py-2.5 rounded-xl bg-gold text-black font-sans text-xs font-bold hover:bg-gold-light hover:shadow hover:shadow-gold/10 transition-all uppercase tracking-widest cursor-pointer"
              >
                {editingItem ? 'Save Recipe Changes' : 'Publish Recipe'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
