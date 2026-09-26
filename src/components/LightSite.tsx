import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import {
  ArrowRight, Check, Facebook, Instagram, Mail, MapPin, Menu as MenuIcon,
  Minus, Phone, Plus, ShoppingBag, X, Youtube, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { MenuItem, CartItem, Reservation } from '../types';
import { MENU_ITEMS } from '../data';

/* ─── types ─────────────────────────────────────── */
type SitePath = '/' | '/menu' | '/offers' | '/contact';
type Category = 'Snacks' | 'Fast Food' | 'Rice & Set Menu';

const LOGO_URL = 'https://i.ibb.co/LhndH8VP/Logo.png';
const COVER_URL = 'https://i.ibb.co/fGMkkgLv/Cover-image.png';

const HERO_ITEMS = MENU_ITEMS.slice(0, 5);

/* ─── routing helpers ─────────────────────────────── */
function getPath(): SitePath {
  const raw = window.location.pathname.replace(/\/$/, '') || '/';
  if (raw === '/menu' || raw === '/offers' || raw === '/contact') return raw as SitePath;
  return '/';
}
function navigate(to: SitePath): void {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── floating leaf particles ─────────────────────── */
function FloatingLeaves() {
  const leaves = [
    { x: '8%',  y: '15%', delay: 0,   dur: 5,   size: 14, rot: 20  },
    { x: '88%', y: '10%', delay: 1.5, dur: 6.5, size: 10, rot: -35 },
    { x: '75%', y: '75%', delay: 0.7, dur: 4.5, size: 12, rot: 60  },
    { x: '18%', y: '70%', delay: 2.2, dur: 7,   size: 8,  rot: -15 },
    { x: '50%', y: '5%',  delay: 3,   dur: 5.5, size: 9,  rot: 45  },
  ];
  return (
    <>
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: l.x, top: l.y }}
          animate={{ y: [0, -18, 0], rotate: [0, l.rot, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
        >
          <svg width={l.size} height={l.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6 8 2 14 12 22C22 14 18 8 12 2Z" fill="#d97706" opacity="0.6" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* ─── 3D tilt card ───────────────────────────────── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const springRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const springRotY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── food card ───────────────────────────────────── */
function FoodCard({ item, onSelect, onAdd }: { key?: React.Key; item: MenuItem; onSelect: (i: MenuItem) => void; onAdd: (i: MenuItem) => void }) {
  const categoryLabel: Record<string, string> = {
    'snacks': 'Snacks',
    'fast-food': 'Fast Food',
    'rice-set-menu': 'Rice & Set Menu',
  };
  return (
    <TiltCard className="cursor-pointer h-full">
      <motion.article
        whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(15,23,42,0.13)' }}
        onClick={() => onSelect(item)}
        className="group h-full overflow-hidden rounded-2xl border border-white bg-white shadow-md transition-all"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* image */}
        <div className="relative bg-amber-50 overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            style={{ objectFit: 'contain' }}
          />
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-100">
            {categoryLabel[item.category] || item.category}
          </span>
          {item.popular && (
            <span className="absolute top-3 right-3 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold text-white">
              Popular
            </span>
          )}
        </div>
        {/* body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-lg leading-tight text-slate-900">{item.name}</h3>
            <span className="shrink-0 font-black text-amber-600 text-lg">৳{item.price}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(item); }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-colors hover:bg-amber-600"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </motion.article>
    </TiltCard>
  );
}

/* ─── detail modal ───────────────────────────────── */
function DetailModal({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: (i: MenuItem, qty: number) => void }) {
  const [qty, setQty] = useState(1);
  const categoryLabel: Record<string, string> = {
    'snacks': 'Snacks', 'fast-food': 'Fast Food', 'rice-set-menu': 'Rice & Set Menu',
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-slate-600 shadow-md hover:text-slate-900 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
          {/* image — no cropping */}
          <div className="bg-amber-50 w-full flex items-center justify-center" style={{ minHeight: 260 }}>
            <img
              src={item.image}
              alt={item.name}
              className="w-full"
              style={{ maxHeight: 300, objectFit: 'contain' }}
            />
          </div>
          {/* content */}
          <div className="p-7">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              {categoryLabel[item.category]}
            </span>
            <h2 className="mt-1 text-2xl font-black text-slate-900">{item.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.description}</p>
            {item.specialty && (
              <p className="mt-2 text-xs italic text-amber-700">✦ {item.specialty}</p>
            )}
            <div className="mt-6 flex items-center justify-between gap-4">
              {/* qty */}
              <div className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-slate-500 hover:text-amber-600 transition">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-900">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-slate-500 hover:text-amber-600 transition">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {/* price */}
              <span className="text-2xl font-black text-amber-600">৳{item.price * qty}</span>
              {/* add */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { onAdd(item, qty); onClose(); }}
                className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── navbar ─────────────────────────────────────── */
function Navbar({ current, cartCount, openCart, setView }: {
  current: SitePath; cartCount: number;
  openCart: () => void;
  setView: (v: any) => void;
}) {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links: Array<[string, SitePath]> = [
    ['Home', '/'], ['Menu', '/menu'], ['Offers', '/offers'], ['Contact', '/contact'],
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-white/80 backdrop-blur-lg'}`}>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* logo */}
        <button onClick={() => navigate('/')} aria-label="Home" className="flex items-center">
          <img src={LOGO_URL} alt="Mollywood Kitchen" className="h-10 object-contain" onError={(e) => {
            const t = e.currentTarget; t.onerror = null;
            t.style.display = 'none';
          }} />
        </button>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label, to]) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`relative py-1 text-sm font-semibold transition-colors ${current === to ? 'text-amber-700' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {label}
              {current === to && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-amber-500"
                />
              )}
            </button>
          ))}
        </nav>

        {/* actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/contact')}
            className="hidden sm:block rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-500 hover:text-white hover:border-amber-500"
          >
            Book a Table
          </button>
          <button
            onClick={() => setView('admin-login')}
            className="hidden sm:block rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            Sign In
          </button>
          <button
            id="cart-btn"
            onClick={openCart}
            className="relative rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setMobile(!mobile)}
            className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobile ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile nav */}
      <AnimatePresence>
        {mobile && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white px-5 md:hidden"
          >
            <div className="py-3 space-y-1">
              {links.map(([label, to]) => (
                <button
                  key={to}
                  onClick={() => { setMobile(false); navigate(to); }}
                  className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${current === to ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => { setMobile(false); navigate('/contact'); }}
                className="block w-full rounded-xl bg-amber-500 px-4 py-3 text-left text-sm font-bold text-white mt-2"
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

/* ─── hero section ────────────────────────────────── */
function Hero({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir: number) => {
    setDirection(dir);
    setActiveIdx(i => (i + dir + HERO_ITEMS.length) % HERO_ITEMS.length);
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 4500);
    return () => clearInterval(t);
  }, []);

  const active = HERO_ITEMS[activeIdx];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fffdf5] via-[#fffbea] to-[#fef3c7] min-h-[calc(100vh-68px)] flex items-center">
      {/* cover bg overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={COVER_URL} alt="" className="h-full w-full object-cover" style={{ opacity: 0.06 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffdf5]/90 via-[#fffdf5]/60 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl w-full items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* ── left col ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Now Open · Koloni Bazar, Pirganj
          </motion.span>

          <h1 className="mt-6 text-5xl font-black leading-[0.96] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Where Cinema{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-amber-600">Meets</span>
              <motion.span
                className="absolute -bottom-1 left-0 h-3 rounded-full bg-amber-200/60 z-0"
                initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            </span>{' '}
            Culinary.
          </h1>

          <p className="mt-6 text-base leading-7 text-slate-500 sm:text-lg max-w-md">
            Crispy local snacks, iconic street bites, and everyday hangouts at{' '}
            <span className="font-semibold text-slate-700">Koloni Bazar, Pirganj, Rangpur.</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/menu')}
              className="flex items-center gap-2 rounded-full bg-amber-500 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-amber-500/30 transition hover:bg-amber-600"
            >
              View Menu <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 rounded-full border-2 border-slate-800 bg-transparent px-7 py-4 text-sm font-bold text-slate-800 transition hover:bg-slate-800 hover:text-white"
            >
              Book a Table
            </motion.button>
          </div>
        </motion.div>

        {/* ── right col: arc carousel ── */}
        <div className="relative flex items-center justify-center min-h-[420px]">
          <FloatingLeaves />

          {/* ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
          </div>

          {/* thumbnails arc */}
          <div className="absolute inset-0 pointer-events-none">
            {HERO_ITEMS.map((item, i) => {
              const total = HERO_ITEMS.length;
              const offset = ((i - activeIdx) + total) % total;
              if (offset === 0) return null;
              const angle = (offset / total) * Math.PI * 1.6 - Math.PI * 0.4;
              const rx = 190, ry = 150;
              const cx = Math.cos(angle) * rx, cy = Math.sin(angle) * ry;
              const scale = 0.55 + (offset === 1 || offset === total - 1 ? 0.1 : 0);
              const opacity = offset === 1 || offset === total - 1 ? 0.85 : 0.45;
              return (
                <motion.button
                  key={item.id}
                  className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-[3px] border-white shadow-xl"
                  style={{ translateX: cx, translateY: cy }}
                  animate={{ scale, opacity, x: cx, y: cy }}
                  transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                  onClick={() => { setDirection(offset < total / 2 ? 1 : -1); setActiveIdx(i); }}
                  aria-label={`Show ${item.name}`}
                >
                  <div className="h-20 w-20 bg-amber-50">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* main plate */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.85, rotate: d * 6 }),
                center: { opacity: 1, x: 0, scale: 1, rotate: 0 },
                exit: (d: number) => ({ opacity: 0, x: -d * 80, scale: 0.85, rotate: -d * 6 }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 cursor-pointer"
              onClick={() => onSelect(active)}
            >
              <div className="relative flex h-[280px] w-[280px] items-center justify-center rounded-[2.5rem] border-[12px] border-white bg-amber-50 shadow-[0_30px_70px_rgba(15,23,42,0.18)] sm:h-[340px] sm:w-[340px]">
                <img
                  src={active.image}
                  alt={active.name}
                  className="h-full w-full p-2"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {/* info badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="absolute -bottom-5 -left-4 rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-xl sm:-left-8"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Now Serving</p>
                <p className="mt-0.5 max-w-[160px] font-bold leading-tight text-slate-900 text-sm">{active.name}</p>
                <p className="mt-0.5 text-xs font-black text-amber-500">৳{active.price}</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* prev / next */}
          <div className="absolute bottom-0 right-0 flex gap-2 z-20">
            <button
              onClick={() => go(-1)}
              className="rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:border-amber-400 hover:text-amber-600"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              className="rounded-full bg-slate-900 p-3 text-white shadow-sm transition hover:bg-amber-600"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── section heading ────────────────────────────── */
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-600">{eyebrow}</p>
      <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">{subtitle}</p>}
    </div>
  );
}

/* ─── home page ──────────────────────────────────── */
function HomePage({ onSelect, onAdd }: { onSelect: (i: MenuItem) => void; onAdd: (i: MenuItem) => void }) {
  const popular = MENU_ITEMS.filter(i => i.popular).slice(0, 4);

  return (
    <>
      <Hero onSelect={onSelect} />

      {/* popular items */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Made for sharing"
            title="Our Popular Picks"
            subtitle="From crispy street snacks to hearty set menus — find your everyday favourite."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map(item => (
              <FoodCard key={item.id} item={item} onSelect={onSelect} onAdd={onAdd} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-6 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-500 hover:text-white hover:border-amber-500"
            >
              Explore Full Menu <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-slate-50 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 sm:px-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Your table is waiting</p>
                <h2 className="mt-3 max-w-xl text-3xl font-black text-white sm:text-4xl">
                  Bring your people. We'll bring the good part.
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/contact')}
                className="shrink-0 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-400"
              >
                Reserve a Table
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── menu page ──────────────────────────────────── */
function MenuPage({ onSelect, onAdd }: { onSelect: (i: MenuItem) => void; onAdd: (i: MenuItem) => void }) {
  const [cat, setCat] = useState<Category>('Snacks');
  const catMap: Record<Category, string> = {
    'Snacks': 'snacks', 'Fast Food': 'fast-food', 'Rice & Set Menu': 'rice-set-menu',
  };
  const cats: Category[] = ['Snacks', 'Fast Food', 'Rice & Set Menu'];
  const items = useMemo(() => MENU_ITEMS.filter(d => d.category === catMap[cat]), [cat]);

  return (
    <main className="min-h-screen bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our menu"
          title="Find your next favourite bite."
          subtitle="Real food, honest prices. Choose your category and order your plate."
        />
        <div className="mb-10 flex flex-wrap gap-2">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative rounded-full px-6 py-2.5 text-sm font-bold transition-colors ${cat === c ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map(item => (
              <FoodCard key={item.id} item={item} onSelect={onSelect} onAdd={onAdd} />
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
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Special deals"
          title="Offers for every occasion."
          subtitle="Stay tuned — exciting deals are being crafted just for you."
        />
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-amber-200 bg-amber-50/50 text-center p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-slate-800">Coming Soon</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            We're preparing some great offers for our opening. Check back soon or follow us on social media!
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.facebook.com/mollywoodkitchen"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-xs font-bold text-white hover:opacity-90 transition"
            >
              <Facebook className="h-4 w-4" /> Follow on Facebook
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── contact page ───────────────────────────────── */
function ContactPage() {
  const { addReservation, contactSettings } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<Reservation>({ name: '', phone: '', email: '', guests: 2, date: '', time: '', specialRequest: '' });
  const update = (k: keyof Reservation, v: string) => setForm(c => ({ ...c, [k]: k === 'guests' ? Number(v) : v }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); addReservation(form); setSent(true); };

  const fields: Array<[keyof Reservation, string, string]> = [
    ['name', 'Your name', 'text'],
    ['phone', 'Phone number', 'tel'],
    ['email', 'Email address', 'email'],
    ['date', 'Preferred date', 'date'],
    ['time', 'Preferred time', 'time'],
  ];

  return (
    <main className="min-h-screen bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Come visit us"
          title="Make it a plan."
          subtitle="We're right at Koloni Bazar — ready for crispy snacks, easy conversations, and unhurried evenings."
        />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* info */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/15 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Visit us</p>
              <h2 className="mt-4 text-2xl font-black">Mollywood Kitchen</h2>
              <div className="mt-8 space-y-5 text-sm leading-6 text-slate-300">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">Address</p>
                    <p>{contactSettings?.address || 'Koloni Bazar, Pirganj, Rangpur'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">Call</p>
                    <p>{contactSettings?.phone || '+88 01890416021'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p>mosaddekhosensajeeb@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                {[
                  { href: 'https://www.facebook.com/mollywoodkitchen', icon: <Facebook className="h-4 w-4" />, label: 'Facebook' },
                  { href: 'https://www.instagram.com/themollywoodkitchen/', icon: <Instagram className="h-4 w-4" />, label: 'Instagram' },
                  { href: 'https://www.youtube.com/@SajeebTheAnalyst', icon: <Youtube className="h-4 w-4" />, label: 'YouTube' },
                ].map(s => (
                  <motion.a
                    key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                    whileHover={{ scale: 1.12, y: -2 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-amber-500"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* form */}
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-7 sm:p-10">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="mt-6 text-2xl font-black text-slate-900">You're on the list!</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">We've received your request. Our team will confirm your table shortly.</p>
                <button onClick={() => setSent(false)} className="mt-7 text-sm font-bold text-amber-600 underline underline-offset-4 hover:text-amber-700">
                  Make another reservation
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-2xl font-black text-slate-900">Reserve a Table</h2>
                  <p className="mt-1 text-sm text-slate-500">Tell us when you're coming and we'll take care of the rest.</p>
                </div>
                {fields.map(([key, label, type]) => (
                  <label key={key}>
                    <span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>
                    <input
                      required={key !== 'email'}
                      type={type}
                      value={String(form[key] ?? '')}
                      onChange={e => update(key, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                    />
                  </label>
                ))}
                <label>
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Guests</span>
                  <select
                    value={form.guests}
                    onChange={e => update('guests', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-bold text-slate-600">Anything we should know?</span>
                  <textarea
                    value={form.specialRequest}
                    onChange={e => update('specialRequest', e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </label>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="sm:col-span-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600"
                >
                  Request a Table
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
function CartDrawer({ cart, onClose, onRemove, onUpdate }: {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: string, spice: number) => void;
  onUpdate: (id: string, spice: number, qty: number) => void;
}) {
  const total = cart.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">Your order</p>
            <h2 className="mt-0.5 text-2xl font-black text-slate-900">Cart</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="mt-4 font-bold text-slate-700">Your cart is empty</p>
              <p className="mt-1 text-sm text-slate-400">Add a local favourite to get started.</p>
              <button onClick={onClose} className="mt-6 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600 transition">
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div
                    key={`${item.menuItem.id}-${item.spiceLevel}`}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 rounded-2xl bg-slate-50 p-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                      <img src={item.menuItem.image} alt={item.menuItem.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="truncate text-sm font-bold text-slate-900">{item.menuItem.name}</p>
                        <button onClick={() => onRemove(item.menuItem.id, item.spiceLevel)} className="shrink-0 text-slate-300 hover:text-rose-500 transition" aria-label="Remove">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-amber-600">৳{item.menuItem.price * item.quantity}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => onUpdate(item.menuItem.id, item.spiceLevel, item.quantity - 1)} className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:border-amber-400 hover:text-amber-600 transition">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => onUpdate(item.menuItem.id, item.spiceLevel, item.quantity + 1)} className="rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:border-amber-400 hover:text-amber-600 transition">
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
              <span className="text-sm font-semibold text-slate-500">Total</span>
              <span className="text-2xl font-black text-slate-900">৳{total}</span>
            </div>
            <button className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition hover:bg-amber-600">
              Proceed to Checkout
            </button>
          </div>
        )}
      </motion.aside>
    </div>
  );
}

/* ─── footer ─────────────────────────────────────── */
function Footer({ setView }: { setView: (v: any) => void }) {
  const socials = [
    { href: 'https://www.facebook.com/mollywoodkitchen', icon: <Facebook className="h-5 w-5" />, label: 'Facebook' },
    { href: 'https://www.instagram.com/themollywoodkitchen/', icon: <Instagram className="h-5 w-5" />, label: 'Instagram' },
    { href: 'https://www.youtube.com/@SajeebTheAnalyst', icon: <Youtube className="h-5 w-5" />, label: 'YouTube' },
  ];
  const quickLinks: Array<[string, SitePath]> = [
    ['Home', '/'], ['Menu', '/menu'], ['Offers', '/offers'], ['Contact', '/contact'],
  ];

  return (
    <footer className="border-t border-slate-100 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-2">
            <img
              src={LOGO_URL}
              alt="Mollywood Kitchen"
              className="h-12 object-contain brightness-0 invert"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
              Crispy local snacks, iconic street bites, and everyday hangouts at Koloni Bazar, Pirganj, Rangpur.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(s => (
                <motion.a
                  key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  whileHover={{ scale: 1.14, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-amber-500"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Quick Links</p>
            <nav className="space-y-2">
              {quickLinks.map(([label, to]) => (
                <button
                  key={label}
                  onClick={() => navigate(to)}
                  className="block text-sm text-slate-400 transition hover:text-amber-400"
                >
                  {label}
                </button>
              ))}
              <button className="block text-sm text-slate-400 transition hover:text-amber-400">Privacy Policy</button>
              <button className="block text-sm text-slate-400 transition hover:text-amber-400">FAQ</button>
              <button
                onClick={() => setView('admin-login')}
                className="block text-xs text-slate-600 transition hover:text-slate-400 mt-2"
              >
                Admin Login
              </button>
            </nav>
          </div>

          {/* contact */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Contact</p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p>Koloni Bazar, Pirganj, Rangpur</p>
              </div>
              <div className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <a href="mailto:mosaddekhosensajeeb@gmail.com" className="hover:text-amber-400 transition break-all">
                  mosaddekhosensajeeb@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">© 2026 Mollywood Kitchen. All rights reserved.</p>
          <p className="text-xs text-slate-600">Crafted with ❤️ in Pirganj, Rangpur</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── main export ────────────────────────────────── */
export default function LightSite() {
  const { setView } = useStore();
  const [current, setCurrent] = useState<SitePath>(getPath());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fn = () => setCurrent(getPath());
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  }, []);

  const addToCart = (item: MenuItem, qty = 1) =>
    setCart(items => {
      const ex = items.find(e => e.menuItem.id === item.id);
      return ex
        ? items.map(e => e.menuItem.id === item.id ? { ...e, quantity: e.quantity + qty } : e)
        : [...items, { menuItem: item, quantity: qty, spiceLevel: item.spiceLevel ?? 0 }];
    });

  const removeFromCart = (id: string, spice: number) =>
    setCart(items => items.filter(i => !(i.menuItem.id === id && i.spiceLevel === spice)));

  const updateQty = (id: string, spice: number, qty: number) =>
    qty <= 0
      ? removeFromCart(id, spice)
      : setCart(items => items.map(i => i.menuItem.id === id && i.spiceLevel === spice ? { ...i, quantity: qty } : i));

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar current={current} cartCount={cartCount} openCart={() => setCartOpen(true)} setView={setView} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {current === '/' && <HomePage onSelect={setSelected} onAdd={addToCart} />}
          {current === '/menu' && <MenuPage onSelect={setSelected} onAdd={addToCart} />}
          {current === '/offers' && <OffersPage />}
          {current === '/contact' && <ContactPage />}
        </motion.div>
      </AnimatePresence>

      <Footer setView={setView} />

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

      <AnimatePresence>
        {selected && (
          <DetailModal
            item={selected}
            onClose={() => setSelected(null)}
            onAdd={(item, qty) => { addToCart(item, qty); setCartOpen(true); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
