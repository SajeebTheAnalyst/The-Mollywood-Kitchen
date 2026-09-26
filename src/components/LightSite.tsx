import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Check, Facebook, Instagram, Mail, MapPin, Menu as MenuIcon,
  Minus, Phone, Plus, ShoppingBag, X, Youtube, Flame, Sparkles, Clock, Utensils,
  Search, Shield, HelpCircle, User, Star
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MenuItem, CartItem, Reservation } from '../types';
import { MENU_ITEMS } from '../data';

/* ─── constants & routing ───────────────────────── */
const LOGO_URL = 'https://i.ibb.co/LhndH8VP/Logo.png';
const HERO_ITEMS = MENU_ITEMS.slice(0, 6);

type SitePath = '/' | '/menu' | '/offers' | '/contact' | string;
type Category = 'Snacks' | 'Fast Food' | 'Rice & Set Menu';

function getPath(): string {
  const raw = window.location.pathname.replace(/\/$/, '') || '/';
  return raw;
}

function navigate(to: string): void {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── floating 3D herbal leaves vfx ─────────────── */
function FloatingLeaves() {
  const leaves = [
    { x: '12%', y: '18%', size: 28, rot: 25, dur: 7, delay: 0, depth: 'blur-[1px]' },
    { x: '82%', y: '12%', size: 36, rot: -45, dur: 9, delay: 1.2, depth: 'blur-[2px]' },
    { x: '90%', y: '68%', size: 24, rot: 50, dur: 6.5, delay: 0.5, depth: 'blur-none' },
    { x: '62%', y: '82%', size: 32, rot: -20, dur: 8, delay: 2, depth: 'blur-[1px]' },
    { x: '45%', y: '8%', size: 20, rot: 40, dur: 6, delay: 3, depth: 'blur-[0.5px]' },
    { x: '70%', y: '42%', size: 22, rot: -60, dur: 7.5, delay: 1.8, depth: 'blur-none' },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className={`absolute ${l.depth}`}
          style={{ left: l.x, top: l.y }}
          animate={{
            y: [0, -26, 0],
            x: [0, 14, 0],
            rotate: [0, l.rot, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: l.dur,
            repeat: Infinity,
            delay: l.delay,
            ease: 'easeInOut',
          }}
        >
          {/* Stylized realistic green leaf */}
          <svg width={l.size} height={l.size} viewBox="0 0 40 40" fill="none" className="drop-shadow-md">
            <path
              d="M36 4C24 4 12 12 6 24C4 28 6 34 10 36C16 38 28 32 34 20C38 12 37 6 36 4Z"
              fill="url(#leaf-grad)"
            />
            <path
              d="M36 4C22 18 10 34 10 36"
              stroke="#15803d"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="leaf-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4ade80" />
                <stop offset="0.5" stopColor="#22c55e" />
                <stop offset="1" stopColor="#15803d" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── 3D tilt card container ────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const springRotX = useSpring(rotX, { stiffness: 220, damping: 22 });
  const springRotY = useSpring(rotY, { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── food card with 3D hover & glow ────────────── */
function FoodCard({
  item,
  onSelect,
  onAdd,
  onFlyCart,
}: {
  key?: React.Key;
  item: MenuItem;
  onSelect: (i: MenuItem) => void;
  onAdd: (i: MenuItem) => void;
  onFlyCart?: (e: React.MouseEvent, img: string) => void;
}) {
  const categoryLabel: Record<string, string> = {
    snacks: 'Snacks',
    'fast-food': 'Fast Food',
    'rice-set-menu': 'Rice & Set Menu',
  };

  return (
    <TiltCard className="cursor-pointer h-full">
      <motion.article
        whileHover={{
          y: -8,
          scale: 1.02,
          boxShadow: '0 25px 50px -12px rgba(217, 119, 6, 0.22)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={() => onSelect(item)}
        className="group relative h-full overflow-hidden rounded-3xl border border-amber-100/80 bg-white/90 backdrop-blur-md p-4 shadow-sm transition-all hover:border-amber-400"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Soft glowing hover gradient overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-amber-500/5 via-transparent to-orange-500/10" />

        {/* image frame - object contain zero clipping */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-2 flex items-center justify-center">
          <motion.img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
          />
          {/* category pill */}
          <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 shadow-sm border border-amber-200/60">
            {categoryLabel[item.category] || item.category}
          </span>
          {/* popular badge */}
          {item.popular && (
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-black text-white shadow-md shadow-amber-500/30">
              <Flame className="h-3 w-3 fill-current" /> Hot
            </span>
          )}
        </div>

        {/* content */}
        <div className="p-3 pt-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-extrabold text-lg leading-snug text-slate-900 group-hover:text-amber-600 transition-colors">
                {item.name}
              </h3>
              <span className="shrink-0 font-black text-amber-600 text-xl tracking-tight">৳{item.price}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">{item.description}</p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Details
            </button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item);
                if (onFlyCart) onFlyCart(e, item.image);
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700 transition-all"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Order
            </motion.button>
          </div>
        </div>
      </motion.article>
    </TiltCard>
  );
}

/* ─── modern sign-in oauth modal ─────────────────── */
function SignInModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-amber-100 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 p-2 border border-amber-200">
                <img src={LOGO_URL} alt="Logo" className="h-full object-contain" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-slate-900">Welcome to Mollywood</h2>
              <p className="mt-1 text-xs text-slate-500">Sign in to track orders, save favorites & unlock VIP table bookings.</p>
            </div>

            {/* OAuth buttons */}
            <div className="mt-7 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  alert('Google Sign In initialized for Mollywood Kitchen');
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-md"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  alert('Facebook Sign In initialized for Mollywood Kitchen');
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1877F2] py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#166fe5]"
              >
                <Facebook className="h-5 w-5 fill-current" />
                Continue with Facebook
              </motion.button>
            </div>

            <div className="relative my-6 text-center">
              <span className="relative z-10 bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or Continue As Guest
              </span>
              <div className="absolute inset-0 top-1/2 border-t border-slate-100" />
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Continue Browsing Menu
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── navbar ─────────────────────────────────────── */
function Navbar({
  current,
  cartCount,
  openCart,
  openSignIn,
  cartBadgeRef,
}: {
  current: string;
  cartCount: number;
  openCart: () => void;
  openSignIn: () => void;
  cartBadgeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links: Array<[string, string]> = [
    ['Home', '/'],
    ['Menu', '/menu'],
    ['Offers', '/offers'],
    ['Contact', '/contact'],
  ];

  const activePath = current.startsWith('/menu/') ? '/menu' : current;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-md border-b border-amber-100/60'
          : 'bg-white/75 backdrop-blur-lg border-b border-slate-100/50'
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand Logo & Bold Title */}
        <button onClick={() => navigate('/')} aria-label="Home" className="flex items-center gap-3 group text-left">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/10 to-orange-500/20 p-1 border border-amber-200/80 transition-transform group-hover:scale-105">
            <img
              src={LOGO_URL}
              alt="Mollywood Kitchen"
              className="h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                Mollywood
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-600">Kitchen</span>
            </div>
            <p className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700/80 -mt-0.5">
              Cinema · Culinary · Hangout
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label, to]) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`relative py-1 text-sm font-bold transition-colors ${
                activePath === to ? 'text-amber-600 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
              {activePath === to && (
                <motion.span
                  layoutId="nav-glow-pill"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/contact')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs font-extrabold text-amber-700 transition hover:bg-amber-500 hover:text-white hover:border-amber-500 shadow-sm"
          >
            Book a Table
          </button>

          <button
            onClick={openSignIn}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40 shadow-sm"
          >
            <User className="h-3.5 w-3.5 text-amber-600" />
            <span>Sign In</span>
          </button>

          {/* Cart Icon with Live Ref for Fly-to-Cart */}
          <div ref={cartBadgeRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-amber-600 shadow-md shadow-slate-900/10"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge-count"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-md border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <button
            onClick={() => setMobile(!mobile)}
            className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobile ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-5 md:hidden"
          >
            <div className="py-4 space-y-2">
              {links.map(([label, to]) => (
                <button
                  key={to}
                  onClick={() => {
                    setMobile(false);
                    navigate(to);
                  }}
                  className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                    activePath === to ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobile(false);
                  navigate('/contact');
                }}
                className="block w-full rounded-2xl bg-amber-500 px-4 py-3 text-center text-sm font-extrabold text-white shadow-md shadow-amber-500/30 mt-2"
              >
                Book a Table
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─── hero section (reference-inspired 3D arc orbit) ── */
function Hero({
  onSelect,
  onAdd,
  onFlyCart,
}: {
  onSelect: (item: MenuItem) => void;
  onAdd: (item: MenuItem, qty: number) => void;
  onFlyCart?: (e: React.MouseEvent, img: string) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [heroQty, setHeroQty] = useState(1);

  // Auto-rotating autonomous loop every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_ITEMS.length);
      setHeroQty(1);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const active = HERO_ITEMS[activeIdx];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fffef9] via-[#fffbf0] to-[#fff8e7] min-h-[calc(100vh-76px)] flex items-center py-10 lg:py-16">
      {/* Rich ambient radial glowing orbs (Clean luxury background - no cover image banner) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full bg-orange-400/10 blur-[100px]" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      {/* Floating 3D herbal green leaves drifting across canvas */}
      <FloatingLeaves />

      <div className="relative mx-auto grid max-w-7xl w-full items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_1.1fr] lg:gap-14">
        {/* ── Left Column: Big Bold Typography & Controls ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl z-20"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 backdrop-blur-md px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-amber-700 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <span className="h-2 w-2 rounded-full bg-amber-500 -ml-4" />
            Now Open · Koloni Bazar, Pirganj
          </motion.div>

          {/* Big Bold Headline */}
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.04]">
            Where Cinema Meets{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500">
              Culinary Magic.
            </span>
          </h1>

          {/* Active Dish Highlight Price & Title */}
          <div className="mt-5 flex items-baseline gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-baseline gap-3"
              >
                <span className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">৳{active.price}.00</span>
                <span className="text-sm font-bold text-slate-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                  {active.name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dynamic Body Paragraph */}
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
            Indulge in authentic local delights, street classics, and handcrafted fusion platters at{' '}
            <strong className="text-slate-800">Koloni Bazar, Pirganj, Rangpur</strong>. Pure taste, crafted fresh daily.
          </p>

          {/* Quick Order Quantity & Add To Cart CTA Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm">
              <button
                onClick={() => setHeroQty(Math.max(1, heroQty - 1))}
                className="text-slate-400 hover:text-amber-600 transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-black text-slate-900">{heroQty}</span>
              <button
                onClick={() => setHeroQty(heroQty + 1)}
                className="text-slate-400 hover:text-amber-600 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Glowing Order Now CTA */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 20px 35px -8px rgba(217, 119, 6, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                onAdd(active, heroQty);
                if (onFlyCart) onFlyCart(e, active.image);
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-amber-500/25 transition-all"
            >
              <ShoppingBag className="h-4 w-4" /> Order Now
            </motion.button>

            {/* Explore Menu */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/menu')}
              className="flex items-center gap-2 rounded-2xl border-2 border-slate-900/80 bg-transparent px-6 py-3.5 text-sm font-extrabold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Explore Full Menu <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 flex items-center gap-8 border-t border-amber-200/50 pt-6">
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Fresh Daily Ingredients</p>
            </div>
            <div className="h-8 w-px bg-amber-200/60" />
            <div>
              <p className="text-2xl font-black text-slate-900">৳20+</p>
              <p className="text-xs text-slate-500 font-medium">Pocket-Friendly Bites</p>
            </div>
            <div className="h-8 w-px bg-amber-200/60" />
            <div>
              <p className="text-2xl font-black text-slate-900">Koloni</p>
              <p className="text-xs text-slate-500 font-medium">Bazar, Pirganj Location</p>
            </div>
          </div>
        </motion.div>

        {/* ── Right Column: 3D Autonomous Floating Dish & Orbit Arc (Reference Layout) ── */}
        <div className="relative flex items-center justify-center min-h-[460px] lg:min-h-[580px]">
          {/* Circular Orbit Curved Arc Dotted Line (Matching Reference Image) */}
          <svg className="absolute w-[440px] sm:w-[540px] h-[440px] sm:h-[540px] pointer-events-none opacity-40">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Orbiting Interactive Mini-Dish Nodes along circular path */}
          {HERO_ITEMS.map((item, i) => {
            const total = HERO_ITEMS.length;
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const radius = 210; // orbit radius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isSelected = i === activeIdx;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveIdx(i);
                  setHeroQty(1);
                }}
                whileHover={{ scale: 1.25, zIndex: 40 }}
                animate={{
                  x,
                  y,
                  scale: isSelected ? 1.15 : 0.8,
                  opacity: isSelected ? 1 : 0.7,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-full border-2 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/30'
                    : 'border-white bg-white shadow-md hover:border-amber-300'
                }`}
                title={item.name}
              >
                <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
              </motion.button>
            );
          })}

          {/* Main Large Hero Dish (450px+, 100% Borderless, Natural Shadow, 3D Floating) */}
          <div className="relative z-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  y: [0, -12, 0],
                }}
                exit={{ opacity: 0, scale: 0.85, rotate: 15 }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.5 },
                  rotate: { duration: 0.5 },
                  y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
                onClick={() => onSelect(active)}
                className="cursor-pointer group flex flex-col items-center"
              >
                {/* Large Plate Image - Zero Hard Borders, Natural Float */}
                <div className="relative h-[340px] w-[340px] sm:h-[440px] sm:w-[440px] lg:h-[480px] lg:w-[480px] flex items-center justify-center">
                  {/* Natural Floating Soft Drop Shadow */}
                  <div className="absolute inset-8 rounded-full bg-amber-950/15 blur-2xl transform translate-y-10 group-hover:blur-3xl transition-all" />

                  <img
                    src={active.image}
                    alt={active.name}
                    className="relative z-10 h-full w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Floating Dish Info Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative -mt-6 z-30 flex items-center gap-3 rounded-full border border-amber-200/80 bg-white/95 backdrop-blur-xl px-5 py-2.5 shadow-xl shadow-amber-900/10"
                >
                  <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-900">{active.name}</span>
                  <span className="text-xs font-black text-amber-600">৳{active.price}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">· Click to view</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── dedicated menu detail canvas (/menu/[id]) ─── */
function DedicatedMenuDetailView({
  item,
  onBack,
  onAdd,
  onSelectOther,
  onFlyCart,
}: {
  item: MenuItem;
  onBack: () => void;
  onAdd: (item: MenuItem, qty: number) => void;
  onSelectOther: (item: MenuItem) => void;
  onFlyCart?: (e: React.MouseEvent, img: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [activeSpice, setActiveSpice] = useState(item.spiceLevel ?? 1);

  const categoryLabel: Record<string, string> = {
    snacks: 'Snacks',
    'fast-food': 'Fast Food',
    'rice-set-menu': 'Rice & Set Menu',
  };

  const related = useMemo(
    () => MENU_ITEMS.filter((i) => i.id !== item.id && i.category === item.category).slice(0, 3),
    [item]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffdfa] via-white to-slate-50 px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Back navigation & Breadcrumbs */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-700 shadow-sm transition hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Menu
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="cursor-pointer hover:text-slate-700" onClick={() => navigate('/')}>
              Home
            </span>
            <span>/</span>
            <span className="cursor-pointer hover:text-slate-700" onClick={() => navigate('/menu')}>
              Menu
            </span>
            <span>/</span>
            <span className="text-amber-600">{item.name}</span>
          </nav>
        </div>

        {/* Master Showcase Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.1fr] lg:gap-16 items-start rounded-[3rem] border border-amber-100 bg-white/90 backdrop-blur-xl p-6 sm:p-12 shadow-xl shadow-amber-500/5">
          {/* Left: Full Frame Uncropped Image Presentation */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[480px] rounded-[2.5rem] bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-amber-100/30 p-8 flex items-center justify-center border border-amber-200/50 shadow-inner">
              {/* Natural shadow */}
              <div className="absolute inset-12 rounded-full bg-amber-950/15 blur-2xl transform translate-y-8" />
              <motion.img
                src={item.image}
                alt={item.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]"
              />

              {/* Tags */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-black text-amber-700 border border-amber-200 shadow-sm">
                  {categoryLabel[item.category] || item.category}
                </span>
                {item.popular && (
                  <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-black text-white shadow-md">
                    ★ Popular Pick
                  </span>
                )}
              </div>
            </div>

            {/* Quick Nutrition / Prep Specs */}
            {item.nutrition && (
              <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[480px]">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Portion</p>
                  <p className="mt-0.5 text-xs font-black text-slate-800">{item.nutrition.portion}</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Calories</p>
                  <p className="mt-0.5 text-xs font-black text-slate-800">{item.nutrition.calories}</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Prep Time</p>
                  <p className="mt-0.5 text-xs font-black text-slate-800">{item.nutrition.prepTime}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Detailed Culinary Story, Ingredients & Ordering */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                Freshly Prepared at Mollywood Kitchen
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                {item.name}
              </h1>

              {/* Price display */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-4xl font-black text-amber-600">৳{item.price * qty}</span>
                {qty > 1 && (
                  <span className="text-xs font-bold text-slate-400">(৳{item.price} each × {qty})</span>
                )}
              </div>

              <p className="mt-5 text-base leading-relaxed text-slate-600">{item.description}</p>

              {/* Cooking Process Narrative */}
              {item.preparation && (
                <div className="mt-6 rounded-2xl border border-amber-200/70 bg-amber-50/40 p-5">
                  <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-800">
                    <Utensils className="h-4 w-4" /> How We Prepare It
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-amber-950/80">{item.preparation}</p>
                </div>
              )}

              {/* Ingredients Chips */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Key Ingredients & Spices
                  </h4>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {item.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                      >
                        ✦ {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level Preference */}
              <div className="mt-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Spice Preference</h4>
                <div className="mt-2.5 flex gap-2">
                  {[
                    { val: 0, label: 'Mild' },
                    { val: 1, label: 'Medium' },
                    { val: 2, label: 'Spicy' },
                    { val: 3, label: 'Extra Hot' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      onClick={() => setActiveSpice(s.val)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        activeSpice === s.val
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ordering Controls & Fly-To-Cart */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-slate-400 hover:text-amber-600 transition"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-base font-black text-slate-900">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-slate-400 hover:text-amber-600 transition">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  onAdd(item, qty);
                  if (onFlyCart) onFlyCart(e, item.image);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 px-8 text-sm font-black text-white shadow-xl shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <ShoppingBag className="h-5 w-5" /> Add {qty} to Order (৳{item.price * qty})
              </motion.button>
            </div>
          </div>
        </div>

        {/* Related Dishes from same category */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-black text-slate-900">More from {categoryLabel[item.category]}</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((rel) => (
                <FoodCard
                  key={rel.id}
                  item={rel}
                  onSelect={onSelectOther}
                  onAdd={(i) => onAdd(i, 1)}
                  onFlyCart={onFlyCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── home page ──────────────────────────────────── */
function HomePage({
  onSelect,
  onAdd,
  onFlyCart,
}: {
  onSelect: (i: MenuItem) => void;
  onAdd: (i: MenuItem, qty?: number) => void;
  onFlyCart?: (e: React.MouseEvent, img: string) => void;
}) {
  const popular = MENU_ITEMS.filter((i) => i.popular).slice(0, 4);

  return (
    <>
      <Hero onSelect={onSelect} onAdd={(item, qty) => onAdd(item, qty)} onFlyCart={onFlyCart} />

      {/* Popular Picks Section */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 relative">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Pure Local Flavours</p>
            <h2 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">Our Popular Picks</h2>
            <p className="mt-3 text-base text-slate-500">
              From crispy evening tea-time bites to hearty lunch platters — freshly prepared at Koloni Bazar.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onSelect={onSelect}
                onAdd={(i) => onAdd(i, 1)}
                onFlyCart={onFlyCart}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 rounded-full border-2 border-amber-500 bg-amber-50/80 px-8 py-4 text-sm font-extrabold text-amber-700 shadow-md shadow-amber-500/15 transition hover:bg-amber-500 hover:text-white"
            >
              Explore Full 12-Dish Menu <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Modern Table Reservation Callout */}
      <section className="bg-slate-900 px-5 py-20 sm:px-8 relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 rounded-[3rem] border border-slate-800 bg-slate-950/60 p-8 sm:p-14 backdrop-blur-xl">
          <div className="max-w-xl">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              Reserve Your Hangout
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
              Bring your friends & family. We'll set the best table.
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Located conveniently at Koloni Bazar, Pirganj, Rangpur. Experience warm hospitality and sizzling hot
              platters.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contact')}
            className="shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-amber-500/30 hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Book a Table Now
          </motion.button>
        </div>
      </section>
    </>
  );
}

/* ─── menu page ──────────────────────────────────── */
function MenuPage({
  onSelect,
  onAdd,
  onFlyCart,
}: {
  onSelect: (i: MenuItem) => void;
  onAdd: (i: MenuItem, qty?: number) => void;
  onFlyCart?: (e: React.MouseEvent, img: string) => void;
}) {
  const [cat, setCat] = useState<Category>('Snacks');
  const catMap: Record<Category, string> = {
    Snacks: 'snacks',
    'Fast Food': 'fast-food',
    'Rice & Set Menu': 'rice-set-menu',
  };
  const cats: Category[] = ['Snacks', 'Fast Food', 'Rice & Set Menu'];
  const items = useMemo(() => MENU_ITEMS.filter((d) => d.category === catMap[cat]), [cat]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-slate-50 px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">The Mollywood Kitchen Menu</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            Fresh Bites, Everyday Prices.
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Select a category to explore our authentic snacks, crispy fast food, and signature set menus.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative rounded-full px-7 py-3 text-sm font-extrabold transition-all ${
                cat === c
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onSelect={onSelect}
                onAdd={(i) => onAdd(i, 1)}
                onFlyCart={onFlyCart}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ─── offers page ────────────────────────────────── */
function OffersPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">Exclusive Deals</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-black text-slate-900">Grand Opening Specials</h1>
        <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
          We are launching exciting student combos and family bundles very soon.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-amber-300 bg-amber-50/60 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500 text-white shadow-lg shadow-amber-500/30">
            <Sparkles className="h-10 w-10" />
          </div>
          <h3 className="mt-6 text-2xl font-black text-slate-900">Offers Arriving Soon</h3>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Follow our official Facebook page to be the first to grab exclusive discount coupons on opening week!
          </p>
          <a
            href="https://www.facebook.com/mollywoodkitchen"
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center gap-2 rounded-full bg-[#1877F2] px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#166fe5] transition"
          >
            <Facebook className="h-4 w-4" /> Follow @mollywoodkitchen
          </a>
        </div>
      </div>
    </main>
  );
}

/* ─── contact page ───────────────────────────────── */
function ContactPage() {
  const { addReservation, contactSettings } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<Reservation>({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: '',
    time: '',
    specialRequest: '',
  });

  const update = (k: keyof Reservation, v: string) =>
    setForm((c) => ({ ...c, [k]: k === 'guests' ? Number(v) : v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addReservation(form);
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center max-w-xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">Get In Touch</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-slate-900">Visit & Hang Out</h1>
          <p className="mt-3 text-sm text-slate-500">
            We are located in the heart of Koloni Bazar, Pirganj, Rangpur.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Info Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 sm:p-10 text-white shadow-xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/15 blur-2xl" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Our Location</p>
            <h2 className="mt-2 text-2xl font-black">Mollywood Kitchen</h2>
            <div className="mt-8 space-y-6 text-sm text-slate-300">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold text-white">Address</p>
                  <p>{contactSettings?.address || 'Koloni Bazar, Pirganj, Rangpur'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold text-white">Direct Phone</p>
                  <p>{contactSettings?.phone || '+88 01890416021'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="font-bold text-white">Email</p>
                  <p>mosaddekhosensajeeb@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Connect With Us</p>
              <div className="flex gap-3">
                {[
                  { href: 'https://www.facebook.com/mollywoodkitchen', icon: <Facebook className="h-4 w-4" />, label: 'Facebook' },
                  { href: 'https://www.instagram.com/themollywoodkitchen/', icon: <Instagram className="h-4 w-4" />, label: 'Instagram' },
                  { href: 'https://www.youtube.com/@SajeebTheAnalyst', icon: <Youtube className="h-4 w-4" />, label: 'YouTube' },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-amber-500 shadow-sm"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/80 p-8 sm:p-10 shadow-sm">
            {sent ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-900">Reservation Request Received!</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-sm">
                  We'll contact you to confirm your table at Mollywood Kitchen.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-xs font-bold text-amber-600 underline underline-offset-4"
                >
                  Submit another reservation
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-2xl font-black text-slate-900">Book a Table</h2>
                  <p className="text-xs text-slate-500">Reserve your spot for groups, family dinners or meetings.</p>
                </div>
                <label>
                  <span className="mb-1 block text-xs font-bold text-slate-600">Your Name</span>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-bold text-slate-600">Phone Number</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-bold text-slate-600">Date</span>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-bold text-slate-600">Guests</span>
                  <select
                    value={form.guests}
                    onChange={(e) => update('guests', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1 block text-xs font-bold text-slate-600">Special Notes</span>
                  <textarea
                    value={form.specialRequest}
                    onChange={(e) => update('specialRequest', e.target.value)}
                    rows={2}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="Birthday setup, window seating, etc."
                  />
                </label>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="sm:col-span-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-black text-white shadow-lg shadow-amber-500/25"
                >
                  Request Table Reservation
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── cart drawer ────────────────────────────────── */
function CartDrawer({
  cart,
  onClose,
  onRemove,
  onUpdate,
}: {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: string, spice: number) => void;
  onUpdate: (id: string, spice: number, qty: number) => void;
}) {
  const total = cart.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-600">Your Basket</p>
            <h2 className="mt-0.5 text-2xl font-black text-slate-900">Current Order</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="mt-4 font-black text-slate-800 text-lg">Your basket is empty</p>
              <p className="mt-1 text-xs text-slate-400">Add some crispy local bites or set menus.</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/menu');
                }}
                className="mt-6 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-amber-600 transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.menuItem.id}-${item.spiceLevel}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 rounded-2xl bg-amber-50/40 border border-amber-100 p-3.5"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="truncate text-sm font-bold text-slate-900">{item.menuItem.name}</p>
                        <button
                          onClick={() => onRemove(item.menuItem.id, item.spiceLevel)}
                          className="text-slate-300 hover:text-rose-500 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs font-black text-amber-600">৳{item.menuItem.price * item.quantity}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => onUpdate(item.menuItem.id, item.spiceLevel, item.quantity - 1)}
                          className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-amber-600"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdate(item.menuItem.id, item.spiceLevel, item.quantity + 1)}
                          className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-amber-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-100 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Grand Total</span>
              <span className="text-3xl font-black text-slate-900">৳{total}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                alert(`Order of ৳${total} placed! Kitchen will prepare fresh items at Koloni Bazar.`);
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 transition"
            >
              Confirm & Place Order
            </motion.button>
          </div>
        )}
      </motion.aside>
    </div>
  );
}

/* ─── advanced multi-column dark glassmorphic footer ── */
function Footer({ setView }: { setView: (v: any) => void }) {
  const socials = [
    { href: 'https://www.facebook.com/mollywoodkitchen', icon: <Facebook className="h-4 w-4" />, label: 'Facebook' },
    { href: 'https://www.instagram.com/themollywoodkitchen/', icon: <Instagram className="h-4 w-4" />, label: 'Instagram' },
    { href: 'https://www.youtube.com/@SajeebTheAnalyst', icon: <Youtube className="h-4 w-4" />, label: 'YouTube' },
  ];

  const quickLinks: Array<[string, string]> = [
    ['Home', '/'],
    ['Menu', '/menu'],
    ['Offers', '/offers'],
    ['Contact', '/contact'],
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-100 p-10 sm:p-14 lg:p-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo & Brand Title */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 p-1 border border-white/20">
                <img
                  src={LOGO_URL}
                  alt="Mollywood Kitchen"
                  className="h-full object-contain brightness-0 invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-black text-white">Mollywood</span>
                <span className="text-xl font-black text-amber-400 ml-1">Kitchen</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Where Cinema Meets Culinary Magic. Authentic local snacks, street classics, and hearty meals at Koloni Bazar, Pirganj.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-amber-400">Quick Links</p>
            <nav className="space-y-2.5">
              {quickLinks.map(([label, to]) => (
                <button
                  key={label}
                  onClick={() => navigate(to)}
                  className="block text-xs font-bold text-slate-400 transition hover:text-amber-400"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => navigate('/offers')}
                className="block text-xs font-bold text-slate-400 transition hover:text-amber-400"
              >
                Special Offers
              </button>
              <button
                onClick={() => setView('admin-login')}
                className="block text-xs text-slate-500 transition hover:text-slate-300 pt-2"
              >
                Admin Panel Login
              </button>
            </nav>
          </div>

          {/* Column 3: Contact & Location */}
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-amber-400">Location & Contact</p>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex gap-2.5 items-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p>Koloni Bazar, Pirganj, Rangpur</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p>+88 01890416021</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <a href="mailto:mosaddekhosensajeeb@gmail.com" className="hover:text-amber-400 transition break-all">
                  mosaddekhosensajeeb@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Owner Credits & 3D Glowing Socials */}
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-amber-400">Owner & Curation</p>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 backdrop-blur-md">
              <p className="text-[11px] font-bold text-amber-300">Founded & Curated by</p>
              <p className="mt-0.5 text-sm font-black text-white">Mosaddek Hosen Sajeeb</p>
              <p className="mt-1 text-[10px] text-slate-400">@SajeebTheAnalyst</p>
            </div>

            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-amber-500 shadow-md"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© 2026 Mollywood Kitchen. All rights reserved.</p>
          <p className="text-amber-500/80 font-bold">Koloni Bazar · Pirganj · Rangpur</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── fly-to-cart particle overlay ──────────────── */
interface FlyParticle {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

/* ─── main light site application ────────────────── */
export default function LightSite() {
  const { setView } = useStore();
  const [current, setCurrent] = useState<string>(getPath());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [particles, setParticles] = useState<FlyParticle[]>([]);
  const cartBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setCurrent(getPath());
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  }, []);

  // Fly to Cart trajectory generator
  const triggerFlyToCart = (e: React.MouseEvent, image: string) => {
    const startX = e.clientX;
    const startY = e.clientY;
    let endX = window.innerWidth - 80;
    let endY = 38;

    if (cartBadgeRef.current) {
      const rect = cartBadgeRef.current.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }

    const particleId = Date.now() + Math.random();
    setParticles((prev) => [...prev, { id: particleId, startX, startY, endX, endY, image }]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 850);
  };

  const addToCart = (item: MenuItem, qty = 1) =>
    setCart((items) => {
      const ex = items.find((e) => e.menuItem.id === item.id);
      return ex
        ? items.map((e) => (e.menuItem.id === item.id ? { ...e, quantity: e.quantity + qty } : e))
        : [...items, { menuItem: item, quantity: qty, spiceLevel: item.spiceLevel ?? 0 }];
    });

  const removeFromCart = (id: string, spice: number) =>
    setCart((items) => items.filter((i) => !(i.menuItem.id === id && i.spiceLevel === spice)));

  const updateQty = (id: string, spice: number, qty: number) =>
    qty <= 0
      ? removeFromCart(id, spice)
      : setCart((items) =>
          items.map((i) => (i.menuItem.id === id && i.spiceLevel === spice ? { ...i, quantity: qty } : i))
        );

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Check if current route is detail view `/menu/:id`
  const isDetailRoute = current.startsWith('/menu/');
  const detailItemId = isDetailRoute ? current.replace('/menu/', '') : null;
  const detailItem = detailItemId ? MENU_ITEMS.find((i) => i.id === detailItemId) : null;

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar
        current={current}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
        openSignIn={() => setSignInOpen(true)}
        cartBadgeRef={cartBadgeRef}
      />

      {/* Dynamic Animated Fly-to-Cart Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              position: 'fixed',
              left: p.startX - 24,
              top: p.startY - 24,
              scale: 1,
              opacity: 1,
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            animate={{
              left: p.endX - 16,
              top: p.endY - 16,
              scale: 0.25,
              opacity: 0.8,
              rotate: 360,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-2xl border-2 border-amber-500"
          >
            <img src={p.image} alt="" className="h-full w-full object-contain" />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isDetailRoute && detailItem ? (
            <DedicatedMenuDetailView
              item={detailItem}
              onBack={() => navigate('/menu')}
              onAdd={(item, qty) => addToCart(item, qty)}
              onSelectOther={(item) => navigate(`/menu/${item.id}`)}
              onFlyCart={triggerFlyToCart}
            />
          ) : current === '/menu' ? (
            <MenuPage
              onSelect={(item) => navigate(`/menu/${item.id}`)}
              onAdd={(item, qty) => addToCart(item, qty)}
              onFlyCart={triggerFlyToCart}
            />
          ) : current === '/offers' ? (
            <OffersPage />
          ) : current === '/contact' ? (
            <ContactPage />
          ) : (
            <HomePage
              onSelect={(item) => navigate(`/menu/${item.id}`)}
              onAdd={(item, qty) => addToCart(item, qty)}
              onFlyCart={triggerFlyToCart}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <Footer setView={setView} />

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onUpdate={updateQty}
          />
        )}
      </AnimatePresence>

      {/* Sign In Modal */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
