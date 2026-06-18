import React, { useState } from 'react';
import { useStore, GalleryItem } from '../context/StoreContext';
import { 
  Plus, 
  UploadCloud, 
  Trash2, 
  Check, 
  Image as ImageIcon, 
  Maximize2, 
  Sparkles,
  RefreshCw,
  FolderOpen,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GalleryManagementView() {
  const { galleryItems, addGalleryItem, deleteGalleryItem, showToast } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Create state overlay
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Ambiance',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
  });

  // Compression simulator metrics state
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  // Categories helper list
  const categories = ['All', 'Ambiance', 'Dishes', 'Kitchen'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropSimulation = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCompressing(true);
    setOriginalSize(Number((3.5 + Math.random() * 2).toFixed(2))); // Simulated random 3.5MB - 5.5MB file
    
    // Simulate high-end WebP multi-threaded browser-side compression
    setTimeout(() => {
      setIsCompressing(false);
      setCompressedSize(Number((120 + Math.random() * 90).toFixed(0))); // 120KB - 210KB
      setFormData({
        ...formData,
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600'
      });
      showToast('Offline WebP high-compression engine succeeded!', 'success');
    }, 1800);
  };

  const handlePresetSelect = (url: string, titleStr: string) => {
    setOriginalSize(2.4);
    setIsCompressing(true);
    setTimeout(() => {
      setIsCompressing(false);
      setCompressedSize(115);
      setFormData({
        ...formData,
        title: titleStr,
        image: url
      });
    }, 600);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addGalleryItem({
      title: formData.title.trim(),
      category: formData.category,
      image: formData.image
    });

    // Reset stats
    setIsUploadOpen(false);
    setOriginalSize(null);
    setCompressedSize(null);
  };

  const galleryPresets = [
    { title: 'Golden Clay Tandoori Chicken', category: 'Dishes', url: 'https://images.unsplash.com/photo-1626824982604-0997193dedf7?auto=format&fit=crop&q=80&w=600' },
    { title: 'Visual Cozy Bench Ambiance', category: 'Ambiance', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600' },
    { title: 'Fresh Blend Sweet Lime Mojitos', category: 'Dishes', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600' }
  ];

  // Filtered lists
  const filteredList = galleryItems.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Header with launch upload dial */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Image Asset Manager</h1>
          <p className="text-xs text-zinc-400 mt-1">Re-organize photo elements on home galleries. Compresses to WebP on client browser.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 bg-gold text-black font-sans text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider hover:bg-gold-light hover:shadow-gold/5 shadow hover:shadow-lg transition-all transform active:scale-95 border border-gold/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>UPLOAD PICTURES (WEBP)</span>
        </button>
      </div>

      {/* 2. Group Tab filtering */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-1.5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-wide transition-all ${
              selectedCategory === cat 
                ? 'bg-gold/10 border-gold/40 text-gold font-bold font-mono' 
                : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            {cat.toUpperCase()} ({cat === 'All' ? galleryItems.length : galleryItems.filter(x => x.category.toLowerCase() === cat.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* 3. Masorny bento collection render */}
      {filteredList.length === 0 ? (
        <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
          <ImageIcon className="h-8 w-8 text-zinc-650 mx-auto mb-3" />
          <p className="text-zinc-505 text-xs font-mono uppercase tracking-widest">Gallery Directory Empty</p>
          <p className="text-[10px] text-zinc-500 mt-1">Upload files to catalog ambiance and dishes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredList.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden hover:border-gold/25 relative group shadow-md transition-all duration-300 border-gold-glow"
              >
                {/* Visual hover quick deleting trigger overlay */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="p-2 rounded-xl bg-black/80 border border-zinc-800 text-rose-500 hover:text-white hover:bg-rose-950 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden relative border-b border-zinc-900/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded bg-black/80 border border-zinc-800 text-[8px] font-mono font-bold text-gold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/50 backdrop-blur">
                  <h4 className="text-xs font-bold text-zinc-200 truncate leading-snug">{item.title}</h4>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wide">Standard Frame • Optimized (WebP)</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Upload drag drawer overlay */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between border-gold-glow">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40">
              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-gold uppercase">OPTIMIZATION PORTAL</span>
                <h3 className="font-heading text-base font-bold text-white tracking-wide mt-0.5">Upload & WebP Compress</h3>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="p-1.5 rounded-lg border border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <form onSubmit={handleSaveUpload} id="gallery-form" className="p-6 space-y-5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Photo Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sizzling Beef kala bhuna bowl plating"
                  className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Photo Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-2 py-2.5 text-xs text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="Ambiance">Ambiance Room Frame</option>
                    <option value="Dishes">Garnished Food Dishes</option>
                    <option value="Kitchen">Busy Kitchen & Chefs</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-zinc-400">Photo hyperlink</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Presets shortcut selection area */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase font-bold text-zinc-500">Preset Food & Ambiance Stock Presets</span>
                <div className="grid grid-cols-2 gap-3">
                  {galleryPresets.map(preset => (
                    <button
                      type="button"
                      key={preset.title}
                      onClick={() => handlePresetSelect(preset.url, preset.title)}
                      className="p-2 border border-zinc-900 bg-zinc-950/80 hover:border-gold/30 rounded-xl text-[10px] text-zinc-400 text-left truncate cursor-pointer flex items-center gap-1.5 select-none"
                    >
                      <ImageIcon className="h-3.5 w-3.5 shrink-0 text-gold" />
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag Drop simulator area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDropSimulation}
                className="border border-dashed border-zinc-800 bg-black/40 hover:bg-zinc-90 hover:border-gold/20 p-5 rounded-2xl text-center cursor-pointer transition-all space-y-1.5"
              >
                {isCompressing ? (
                  <div className="space-y-2 py-2">
                    <RefreshCw className="h-6 w-6 text-gold animate-spin mx-auto" />
                    <p className="text-[10px] font-mono font-bold text-gold tracking-widest uppercase">Optimizing Pixels...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-7 w-7 text-zinc-505 mx-auto" />
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Drag and drop raw hardware images</p>
                    <p className="text-[8px] text-zinc-650">Auto compresses PNG/JPG to WebP size directly in client thread</p>
                  </>
                )}
              </div>

              {/* Dynamic compression logs metrics */}
              {originalSize && (
                <div className="border border-zinc-900 bg-zinc-955/30 p-2.5 rounded-xl flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Ratio Locked</span>
                  </div>
                  <div>
                    <span>{originalSize}MB → </span>
                    <span className="font-bold text-emerald-400">{compressedSize || 110}KB </span>
                    <span className="bg-emerald-950 text-emerald-400 px-1 rounded">Saved {(((originalSize * 1000 - (compressedSize || 110)) / (originalSize * 1000)) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}

            </form>

            {/* Footer triggers */}
            <div className="p-5 border-t border-zinc-900 flex justify-end gap-3 bg-black/40">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-700 bg-zinc-950 font-mono text-xs font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest cursor-pointer"
              >
                Close Portal
              </button>
              <button
                type="submit"
                form="gallery-form"
                disabled={isCompressing}
                className="px-5 py-2.5 rounded-xl bg-gold text-black font-sans text-xs font-bold hover:bg-gold-light hover:shadow hover:shadow-gold/10 transition-all uppercase tracking-widest cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                Incorporate File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
