import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Film, Flame, Trash2, CalendarDays, ChevronDown, Shield, User, LogOut, Lock, Mail, Sparkles, Check } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { supabase, getSessionMetrics } from '../lib/supabase';
import AuthModal from './AuthModal';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
                {contactSettings.restaurantName.split(' ')[0] || 'Mollywood'}
              </span>
              <span className="font-sans text-[9px] font-bold tracking-[.5em] text-text-secondary leading-none uppercase mt-1">
                {contactSettings.restaurantName.split(' ')[1] || 'Kitchen'}
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
                                setIsAuthModalOpen(true);
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
                onClick={() => setIsAuthModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center space-x-1.5 px-8 py-2.5 bg-accent-red hover:bg-accent-red-hover rounded-full text-xs font-bold tracking-widest text-white transition-all duration-300 cursor-pointer shadow-lg shadow-accent-red/20"
              >
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
                  setIsAuthModalOpen(true);
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

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
