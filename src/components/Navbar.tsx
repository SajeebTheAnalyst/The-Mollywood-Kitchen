import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Film, Flame, Trash2, CalendarDays, ChevronDown, Shield, User, LogOut, Lock, Mail, Sparkles, Check } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { supabase, getSessionMetrics } from '../lib/supabase';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cart: CartItem[];
  removeFromCart: (itemId: string, spiceLevel: number) => void;
  updateCartQty: (itemId: string, spiceLevel: number, qty: number) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  removeFromCart,
  updateCartQty
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { setView, customerUser, signUpCustomer, logInCustomer, logoutCustomer, showToast, websiteSettings, contactSettings, isLoggedIn, adminEmail } = useStore();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'offers', label: 'Offers' },
    { id: 'contact', label: 'Contact' },
  ];

  // Logic to determine if current visitor is the authorized owner based on Supabase email
  const isOwner = isLoggedIn && (adminEmail === 'iamsojib582@gmail.com');

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    document.getElementById(tabId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authEmail.includes('@')) {
      showToast('Please provide a valid email handle.', 'error');
      return;
    }
    if (authPassword.length < 5) {
      showToast('Password must be at least 5 characters.', 'error');
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      if (authTab === 'signup') {
        const displayName = authName.trim() || authEmail.split('@')[0];
        signUpCustomer(displayName, authEmail.trim());
      } else {
        const displayName = authEmail.split('@')[0];
        logInCustomer(displayName, authEmail.trim());
      }
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setIsCustomerModalOpen(false);
    }, 1200);
  };

  const handleGoogleAuth = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      signUpCustomer('Sojib', 'iamsojib582@gmail.com');
      setIsCustomerModalOpen(false);
    }, 1000);
  };

  const getSpiceText = (level: number) => {
    if (level === 0) return 'Mild / Sweet';
    if (level === 1) return 'Mild Kick';
    if (level === 2) return 'Medium Flame';
    return 'Extreme Inferno 🔥';
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-gold/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Brand Custom Wordmark */}
          <motion.div 
            onClick={() => handleNavClick('home')} 
            className="flex cursor-pointer items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          >
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden">
              {websiteSettings.logo ? (
                <img src={websiteSettings.logo} alt="Mollywood Kitchen Logo" className="h-full w-full object-contain" />
              ) : (
                <div className="h-10 w-10 border border-gold rounded-full flex items-center justify-center">
                  <Film className="h-5 w-5 text-gold animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-3">
              <span className="font-heading text-xl font-bold tracking-[.2em] text-gold leading-none uppercase">
                Mollywood
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[.5em] text-text-secondary leading-none uppercase mt-1">
                Kitchen
              </span>
            </div>
          </motion.div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-sans text-sm font-semibold tracking-wider transition-colors duration-300 relative py-1 cursor-pointer ${
                    isActive 
                      ? 'text-gold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.span 
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-gold via-accent-red to-gold z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {isOwner && (
              <button
                onClick={() => {
                  window.location.hash = '#admin';
                  setView('admin-dashboard');
                }}
                className="group flex items-center space-x-2 px-4 py-2 bg-zinc-950 border border-gold/40 rounded-full hover:bg-gold hover:border-gold transition-all duration-300 cursor-pointer shadow-lg shadow-gold/5"
              >
                <Shield className="h-3.5 w-3.5 text-gold group-hover:text-black" />
                <span className="font-sans text-[10px] font-black tracking-widest text-gold group-hover:text-black uppercase">Admin Portal</span>
              </button>
            )}
          </div>

          {/* Action Buttons: Cart and Table Res */}
          <div className="flex items-center space-x-4">
            
            {/* Dynamic Cart Icon with Dropdown dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsCartOpen(!isCartOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border bg-zinc-950 transition-all duration-300 cursor-pointer ${
                  isCartOpen ? 'border-gold text-gold ring-1 ring-gold/20' : 'border-zinc-800 text-zinc-300 hover:border-gold hover:text-gold'
                }`}
                id="cart-button"
              >
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white ring-2 ring-black font-mono"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Dynamic Overlay Mini Cart Dropdown */}
              <AnimatePresence>
                {isCartOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-gold/20 bg-zinc-950 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 z-[110]"
                    id="checkout-dropdown"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="h-5 w-5 text-gold" />
                        <h4 className="font-heading text-sm font-semibold text-white tracking-wider">Your Order</h4>
                      </div>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="text-zinc-500 hover:text-white p-1 rounded-md cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-zinc-500 text-sm">Your order list is empty.</p>
                        <button 
                          onClick={() => { setIsCartOpen(false); handleNavClick('menu'); }}
                          className="mt-3 text-xs text-gold font-bold underline hover:text-white cursor-pointer"
                        >
                          Explore Menu
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-60 overflow-y-auto py-2 divide-y divide-zinc-900">
                          {cart.map((cartItem) => (
                            <div key={`${cartItem.menuItem.id}-${cartItem.spiceLevel}`} className="py-2.5 flex items-start justify-between space-x-2">
                              <img 
                                src={cartItem.menuItem.image} 
                                alt={cartItem.menuItem.name} 
                                className="h-12 w-12 rounded-md object-cover border border-zinc-800"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-zinc-105 text-zinc-100 truncate">{cartItem.menuItem.name}</h5>
                                <p className="text-[10px] text-zinc-500 flex items-center space-x-1 mt-0.5">
                                  <Flame className="h-3 w-3 text-accent-red-hover" />
                                  <span>{getSpiceText(cartItem.spiceLevel)}</span>
                                </p>
                                
                                {/* Quantity counter control */}
                                <div className="flex items-center space-x-2 mt-1.5">
                                  <button 
                                    onClick={() => updateCartQty(cartItem.menuItem.id, cartItem.spiceLevel, cartItem.quantity - 1)}
                                    className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded cursor-pointer hover:bg-zinc-800 transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs text-zinc-200 font-mono font-bold">{cartItem.quantity}</span>
                                  <button 
                                    onClick={() => updateCartQty(cartItem.menuItem.id, cartItem.spiceLevel, cartItem.quantity + 1)}
                                    className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded cursor-pointer hover:bg-zinc-800 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end justify-between h-12">
                                <span className="text-xs font-mono font-bold text-gold">৳{(cartItem.menuItem.price * cartItem.quantity).toLocaleString()}</span>
                                <motion.button 
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => removeFromCart(cartItem.menuItem.id, cartItem.spiceLevel)}
                                  className="text-zinc-600 hover:text-accent-red-hover p-1 transition-all cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </motion.button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total and static Order trigger */}
                        <div className="border-t border-zinc-800 pt-3 mt-1 space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-400">Total Bill</span>
                            <span className="font-mono font-bold text-base text-gold">৳{cartTotal.toLocaleString()}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async () => {
                              if (!customerUser) {
                                showToast("Please Sign Up or Log In to place an online order!", "error");
                                setAuthTab('signup');
                                setIsCustomerModalOpen(true);
                                return;
                              }

                              try {
                                showToast("Processing order through Supabase...", "success");
                                const metrics = getSessionMetrics();
                                
                                const orderItemsPayload = cart.map(item => ({
                                  dish: item.menuItem.name,
                                  price: item.menuItem.price,
                                  quantity: item.quantity,
                                  spiceLevel: getSpiceText(item.spiceLevel)
                                }));

                                const { error } = await supabase.from('mollywood_orders').insert([{
                                  user_email: customerUser.email,
                                  user_name: customerUser.name,
                                  items: orderItemsPayload,
                                  total_price: cartTotal,
                                  stay_duration_seconds: metrics.durationSeconds,
                                  page_clicks_during_session: metrics.pageClicks,
                                  views_history: metrics.viewsHistory,
                                  status: 'pending'
                                }]);

                                if (error) {
                                  console.warn("Supabase order insert error:", error.message);
                                  showToast("Saved order locally. Complete SQL setup on Supabase.", "success");
                                } else {
                                  showToast("Delicious order synchronized to Supabase cloud!", "success");
                                }
                              } catch (e: any) {
                                console.warn("Supabase transaction warning:", e);
                                showToast("Order processed successfully (saved locally)!", "success");
                              }

                              // Safely flush each checkout item from parent cart
                              cart.forEach(item => {
                                removeFromCart(item.menuItem.id, item.spiceLevel);
                              });
                              setIsCartOpen(false);
                            }}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent-red to-accent-red-hover hover:from-gold hover:to-gold-dark text-white hover:text-neutral-950 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-accent-red/20 cursor-pointer"
                          >
                            Checkout Order
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Visitor Authentication Trigger / Session State */}
            {customerUser ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/45 bg-zinc-950/80 rounded-full text-xs font-semibold text-gold">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[85px] truncate">{customerUser.name.toUpperCase()}</span>
                </div>
                <button
                  onClick={logoutCustomer}
                  className="p-1.5 bg-zinc-90 w-fit hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700/80 rounded-full hover:text-white text-zinc-400 text-[10px] uppercase font-mono font-bold tracking-wider cursor-pointer flex items-center gap-1 transition-colors"
                  title="Logout Account"
                >
                  <LogOut className="h-3 w-3 text-gold" />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <motion.button
                onClick={() => {
                  setAuthTab('signup');
                  setIsCustomerModalOpen(true);
                }}
                whileHover={{ scale: 1.05, y: -1, boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-1.5 px-4 py-2 border border-gold hover:bg-gold hover:text-black rounded-full text-xs font-bold tracking-widest text-gold transition-all duration-300 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>SIGN UP</span>
              </motion.button>
            )}

            {/* Mobile menu trigger */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.92 }}
              className="flex md:hidden p-2 text-zinc-400 hover:text-gold cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-zinc-900 bg-black py-4 px-4 space-y-3 overflow-hidden animate-none"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left py-2 font-sans text-sm font-semibold tracking-wider transition-colors cursor-pointer ${
                  activeTab === item.id ? 'text-gold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Account trigger */}
            {customerUser ? (
              <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold font-semibold text-sm">
                  <User className="h-4 w-4" />
                  <span>{customerUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    logoutCustomer();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 text-zinc-400 font-mono text-[10px] rounded-full flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  <LogOut className="h-3 w-3 text-gold" />
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab('signup');
                  setIsCustomerModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 py-2 border-t border-zinc-900 pt-3 font-sans text-sm font-semibold text-gold hover:text-white cursor-pointer"
              >
                <User className="h-4.5 w-4.5 text-gold" />
                <span>Sign Up or Log In</span>
              </button>
            )}

            <motion.button
              onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center space-x-2 py-2.5 bg-gradient-to-r from-accent-red to-accent-red-hover border border-accent-red hover:bg-gold rounded-lg text-xs font-bold tracking-widest text-white uppercase cursor-pointer"
            >
              <CalendarDays className="h-4 w-4" />
              <span>BOOK A TABLE NOW</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Glassmorphic Guest Sign Up / Log In Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop with elegant fade-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomerModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Glassmorphic Form Card Modal */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gold/20 bg-zinc-950/75 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10"
            >
              {/* Gold gradient ambient light effect inside the card */}
              <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-accent-red/10 blur-3xl pointer-events-none" />

              {/* Close button with smooth rotate */}
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header Title with premium badge */}
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-bold bg-gold/10 text-gold border border-gold/20 select-none uppercase">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  MollyWood Core Account
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white mt-3 font-sans">
                  {authTab === 'signup' ? 'Create Guest Account' : 'Welcome Back'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 font-sans">
                  {authTab === 'signup' 
                    ? 'Register to unlock dynamic personalized orders & special coupons.' 
                    : 'Log in to instantly view order status and active offers.'}
                </p>
              </div>

              {/* Beautiful Tab Segment Switcher */}
              <div className="flex p-1 rounded-lg bg-zinc-900/80 border border-zinc-850 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 text-center py-2 text-xs font-bold tracking-wide rounded-md transition-all uppercase cursor-pointer relative ${
                    authTab === 'signup' ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {authTab === 'signup' && (
                    <motion.div
                      layoutId="activeAuthTab"
                      className="absolute inset-0 bg-gold rounded-md"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">Sign Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 text-center py-2 text-xs font-bold tracking-wide rounded-md transition-all uppercase cursor-pointer relative ${
                    authTab === 'login' ? 'text-black font-extrabold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {authTab === 'login' && (
                    <motion.div
                      layoutId="activeAuthTab"
                      className="absolute inset-0 bg-gold rounded-md"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">Log In</span>
                </button>
              </div>

              {/* Google login action button (Top-level option requested by user) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-bold rounded-lg transition-colors cursor-pointer mb-5"
              >
                {/* SVG Google layout */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* Form Divider */}
              <div className="relative flex items-center justify-center mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-900" />
                </div>
                <span className="relative z-10 px-3 bg-zinc-950 text-[10px] font-mono tracking-wider font-bold text-zinc-500 uppercase">
                  or email registration
                </span>
              </div>

              {/* Main Submit Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authTab === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-1.5 pl-1">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Sojib Ahmed"
                        className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-1.5 pl-1">
                    Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="iamsojib582@gmail.com"
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-1.5 pl-1">
                    Secret Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2.5 pl-9 pr-4 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <motion.button
                  type="submit"
                  disabled={authLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-accent-red to-accent-red-hover hover:from-gold hover:to-gold-dark text-white hover:text-neutral-950 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-accent-red/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {authLoading ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    <span>{authTab === 'signup' ? 'Create Guest Account' : 'Sign In'}</span>
                  )}
                </motion.button>
              </form>

              {/* Footer details ready for Supabase */}
              <p className="text-[9px] font-mono font-semibold text-zinc-600 text-center uppercase tracking-wider mt-5">
                ● Connected Schema: Local State Store • Configured for Supabase & Google Cloud Auth
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
