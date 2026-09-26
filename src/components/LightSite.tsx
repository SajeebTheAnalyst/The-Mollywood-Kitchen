import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, Leaf, Menu as MenuIcon,
  Minus, Plus, ShoppingBag, Star, X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CartItem, MenuItem, Reservation } from '../types';

type SitePath = '/' | '/menu' | '/offers' | '/contact';
type Category = 'Snacks' | 'Fast Food' | 'Rice & Set Menu';

interface SnackItem extends MenuItem {
  siteCategory: Category;
}

const IMG = {
  snacks: 'https://images.pexels.com/photos/34203198/pexels-photo-34203198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  fuchka: 'https://images.pexels.com/photos/38834635/pexels-photo-38834635.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  platter: 'https://images.pexels.com/photos/3993187/pexels-photo-3993187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  street: 'https://images.pexels.com/photos/30604818/pexels-photo-30604818.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  potato: 'https://images.pexels.com/photos/5249331/pexels-photo-5249331.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const DISHES: SnackItem[] = [
  { id: 'piyaju', name: 'Crispy Piyaju Platter', price: 120, description: 'Four golden lentil fritters with a bright house dip in the centre.', rating: 4.9, popular: true, category: 'snacks-beverages', siteCategory: 'Snacks', image: IMG.snacks, ingredients: ['Lentils', 'Onion', 'Green chilli'], spiceLevel: 1, specialty: 'Crisp outside, soft inside.' },
  { id: 'alur-chop', name: 'Golden Alur Chop & Beguni Platter', price: 150, description: 'Spiced potato croquettes and delicate eggplant fritters, made fresh.', rating: 4.8, popular: true, category: 'snacks-beverages', siteCategory: 'Snacks', image: IMG.platter, ingredients: ['Potato', 'Eggplant', 'Spices'], spiceLevel: 1, specialty: 'A nostalgic tea-time favourite.' },
  { id: 'fuchka', name: 'Iconic Fuchka Shells', price: 100, description: 'Crisp shells filled to order with spiced potato, herbs, and tamarind water.', rating: 4.9, popular: true, category: 'snacks-beverages', siteCategory: 'Snacks', image: IMG.fuchka, ingredients: ['Shells', 'Tamarind', 'Potato'], spiceLevel: 2, specialty: 'Tangy, crunchy and made for sharing.' },
  { id: 'chotpoti', name: 'Special Garnished Chotpoti Bowl', price: 140, description: 'Warm chickpeas, potato, tamarind, and crunchy toppings in every spoonful.', rating: 4.8, popular: true, category: 'snacks-beverages', siteCategory: 'Snacks', image: IMG.street, ingredients: ['Chickpeas', 'Potato', 'Tamarind'], spiceLevel: 2, specialty: 'The Koloni Bazar street-food experience.' },
  { id: 'luchi', name: 'Hot Luchi & Spicy Alur Dom', price: 180, description: 'Fresh puffed luchi served with a slow-cooked, warmly spiced potato curry.', rating: 4.7, popular: true, category: 'snacks-beverages', siteCategory: 'Snacks', image: IMG.potato, ingredients: ['Flour', 'Potato', 'Spices'], spiceLevel: 2, specialty: 'Fresh from the pan.' },
  { id: 'burger', name: 'Mollywood Crispy Burger', price: 260, description: 'Crunchy chicken, fresh slaw, and signature sauce in a toasted bun.', rating: 4.7, popular: true, category: 'snacks-beverages', siteCategory: 'Fast Food', image: IMG.street, ingredients: ['Chicken', 'Slaw', 'Bun'], spiceLevel: 1, specialty: 'A satisfying quick bite.' },
  { id: 'noodles', name: 'Street Wok Noodles', price: 220, description: 'High-heat noodles tossed with vegetables and a savoury glaze.', rating: 4.6, popular: false, category: 'chinese', siteCategory: 'Fast Food', image: IMG.platter, ingredients: ['Noodles', 'Vegetables', 'Glaze'], spiceLevel: 1, specialty: 'Smoky wok flavour.' },
  { id: 'rice-set', name: 'Koloni Bazar Rice Set', price: 320, description: 'Steamed rice, dal, seasonal vegetables, chicken bhuna, and a drink.', rating: 4.9, popular: true, category: 'bengali', siteCategory: 'Rice & Set Menu', image: IMG.potato, ingredients: ['Rice', 'Dal', 'Chicken'], spiceLevel: 1, specialty: 'A complete everyday meal.' },
  { id: 'kacchi', name: 'House Kacchi Rice Set', price: 390, description: 'Fragrant rice, tender mutton, potato, and fresh salad.', rating: 4.9, popular: true, category: 'indian', siteCategory: 'Rice & Set Menu', image: IMG.street, ingredients: ['Rice', 'Mutton', 'Potato'], spiceLevel: 2, specialty: 'Slow-cooked for special occasions.' },
];

const HERO_SLIDES = DISHES.slice(0, 5);

/* ---------- helpers ---------- */

function getPath(): SitePath {
  const raw = window.location.pathname.replace(/\/$/, '') || '/';
  if (raw === '/menu' || raw === '/offers' || raw === '/contact') return raw;
  return '/';
}

function navigate(to: SitePath): void {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- small pieces ---------- */

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <span className="font-heading text-lg font-black">M</span>
      </div>
      <div>
        <p className="font-heading text-lg font-black leading-none text-slate-900">Mollywood</p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">Kitchen</p>
      </div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      <Star className="h-4 w-4 fill-current" />
      <span className="text-xs font-bold text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}

function Heading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-10 max-w-xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-amber-700">{eyebrow}</p>
      <h2 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-500">{copy}</p>
    </div>
  );
}

function DishCard({ item, onAdd }: { item: SnackItem; onAdd: (i: SnackItem) => void }) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div className="relative aspect-[1.12] overflow-hidden bg-slate-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
          {item.siteCategory}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-bold leading-tight text-slate-900">{item.name}</h3>
          <span className="shrink-0 text-base font-black text-amber-700">৳{item.price}</span>
        </div>
        <div className="mt-3"><Stars value={item.rating} /></div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{item.description}</p>
        <button
          onClick={() => onAdd(item)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-amber-700"
        >
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </motion.article>
  );
}

/* ---------- navbar ---------- */

function Navbar({ current, cart, openCart }: { current: SitePath; cart: CartItem[]; openCart: () => void }) {
  const [mobile, setMobile] = useState(false);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const links: Array<[string, SitePath]> = [
    ['Home', '/'], ['Menu', '/menu'], ['Offers', '/offers'], ['Contact', '/contact'],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <button onClick={() => navigate('/')} aria-label="Home"><Logo /></button>

        <nav className="hidden gap-9 md:flex">
          {links.map(([label, to]) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`relative py-2 text-sm font-semibold transition-colors ${current === to ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {label}
              {current === to && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-600" />}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={openCart} className="relative rounded-full p-2.5 text-slate-700 transition hover:bg-slate-100" aria-label="Open cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">{count}</span>
            )}
          </button>
          <button onClick={() => navigate('/contact')} className="hidden rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-amber-700 sm:block">
            Book a table
          </button>
          <button onClick={() => setMobile(!mobile)} className="rounded-full p-2 md:hidden" aria-label="Toggle menu">
            {mobile ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav className="border-t border-slate-100 bg-white px-5 py-3 md:hidden">
          {links.map(([label, to]) => (
            <button key={to} onClick={() => { setMobile(false); navigate(to); }} className="block w-full border-b border-slate-100 py-3 text-left text-sm font-semibold text-slate-700">
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ---------- hero ---------- */

function FloatingLeaves() {
  return (
    <>
      <motion.div animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute left-2 top-16 text-emerald-500/70">
        <Leaf className="h-8 w-8 rotate-45 fill-emerald-100" />
      </motion.div>
      <motion.div animate={{ y: [0, 14, 0], rotate: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute right-6 top-12 text-emerald-500/70">
        <Leaf className="h-7 w-7 -rotate-45 fill-emerald-100" />
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-16 right-10 text-emerald-500/70">
        <Leaf className="h-6 w-6 rotate-90 fill-emerald-100" />
      </motion.div>
    </>
  );
}

function Hero({ onAdd }: { onAdd: (i: SnackItem) => void }) {
  const [index, setIndex] = useState(0);
  const active = HERO_SLIDES[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((c) => (c + 1) % HERO_SLIDES.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="overflow-hidden bg-[#fffdf8]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:pb-24 lg:pt-24">
        {/* left */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Fresh from Koloni Bazar
          </span>
          <h1 className="mt-6 font-heading text-5xl font-black leading-[0.98] tracking-tight text-slate-900 sm:text-7xl">
            Where Cinema Meets <span className="text-amber-700">Culinary.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">
            Crispy local snacks, iconic street bites, and everyday hangouts—elevated at Koloni Bazar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigate('/menu')} className="rounded-full bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700">
              View Menu
            </button>
            <button onClick={() => navigate('/contact')} className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-900 hover:text-slate-900">
              Book a Table
            </button>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-amber-500 text-amber-500" />)}
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <p className="text-sm font-bold text-slate-800">5.0 rating</p>
              <p className="text-xs text-slate-500">Loved by 2,000+ snack fans</p>
            </div>
          </div>
        </div>

        {/* right — animated circular plate */}
        <div className="relative mx-auto flex min-h-[390px] w-full max-w-[590px] items-center justify-center">
          <FloatingLeaves />
          <div className="absolute h-[310px] w-[310px] rounded-full bg-amber-100/70 blur-3xl sm:h-[430px] sm:w-[430px]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 110, y: 80, rotate: -12, scale: 0.75 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 2, scale: 1 }}
              exit={{ opacity: 0, x: -100, y: -30, rotate: 12, scale: 0.82 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[270px] sm:w-[410px]"
            >
              <div className="rounded-full border-[14px] border-white bg-white p-3 shadow-[0_25px_60px_rgba(15,23,42,0.16)] sm:border-[18px]">
                <img src={active.image} alt={active.name} className="aspect-square w-full rounded-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-8 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Now serving</p>
                <p className="mt-1 max-w-[180px] font-heading text-lg font-bold leading-tight text-slate-900">{active.name}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">৳{active.price}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* prev / next */}
          <div className="absolute bottom-2 right-2 z-20 flex gap-2">
            <button onClick={() => setIndex((index - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-amber-500 hover:text-amber-700" aria-label="Previous dish">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setIndex((index + 1) % HERO_SLIDES.length)} className="rounded-full bg-slate-900 p-3 text-white transition hover:bg-amber-700" aria-label="Next dish">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button onClick={() => onAdd(active)} className="absolute bottom-2 left-2 z-20 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-800 transition hover:border-amber-500 hover:text-amber-700">
            Add this to cart
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- pages ---------- */

function HomePage({ onAdd }: { onAdd: (i: SnackItem) => void }) {
  return (
    <>
      <Hero onAdd={onAdd} />

      {/* Popular Menu preview */}
      <section className="bg-slate-50 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="Made for sharing" title="Our Popular Menu" copy="Small plates, big flavour, and the familiar comfort of your favourite local bites." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DISHES.slice(0, 4).map((item) => <DishCard key={item.id} item={item} onAdd={onAdd} />)}
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => navigate('/menu')} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-amber-600 hover:text-amber-700">
              Explore full menu <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 rounded-[2rem] bg-slate-900 p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Your table is waiting</p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-black text-white sm:text-4xl">Bring your people. We'll bring the good part.</h2>
          </div>
          <button onClick={() => navigate('/contact')} className="shrink-0 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-amber-100">Reserve a table</button>
        </div>
      </section>
    </>
  );
}

function MenuPage({ onAdd }: { onAdd: (i: SnackItem) => void }) {
  const [cat, setCat] = useState<Category>('Snacks');
  const items = useMemo(() => DISHES.filter((d) => d.siteCategory === cat), [cat]);
  const cats: Category[] = ['Snacks', 'Fast Food', 'Rice & Set Menu'];

  return (
    <main className="bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading eyebrow="The good stuff" title="Find your next favourite bite." copy="Pick a category, choose your plate, and make your everyday hangout a little more delicious." />
        <div className="mb-10 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${cat === c ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-700'}`}>{c}</button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <DishCard key={item.id} item={item} onAdd={onAdd} />)}
        </div>
      </div>
    </main>
  );
}

function OffersPage() {
  const { offers } = useStore();
  const fallback = [
    { id: 'snack-box', title: 'Snack Box for Two', description: 'Choose any two crispy platters and two cool drinks for a relaxed shared bite.', code: 'MOVIEBITE', offerPrice: 299, originalPrice: 380, image: IMG.platter },
    { id: 'table-night', title: 'Table Night Treat', description: 'Reserve a table for four and enjoy a complimentary bowl of our house Chotpoti.', code: 'TABLETIME', offerPrice: 0, originalPrice: 140, image: IMG.street },
  ];
  const cards = offers.length ? offers.slice(0, 2) : fallback;

  return (
    <main className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Heading eyebrow="Good news" title="Special offers for good company." copy="Limited-time treats for the moments when one snack is never enough." />
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((o) => (
            <article key={o.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
                <img src={o.image || IMG.platter} alt={o.title} className="h-full min-h-[230px] w-full object-cover" />
                <div className="p-7 sm:p-9">
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Limited offer</span>
                  <h2 className="mt-5 font-heading text-3xl font-black text-slate-900">{o.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{o.description}</p>
                  <div className="mt-6 flex items-end gap-3">
                    <span className="text-3xl font-black text-amber-700">{o.offerPrice ? `৳${o.offerPrice}` : 'Free'}</span>
                    {o.originalPrice && <span className="text-sm text-slate-400 line-through">৳{o.originalPrice}</span>}
                  </div>
                  <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Use code</span>
                    <span className="font-mono text-sm font-bold text-slate-900">{o.code}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function ContactPage() {
  const { addReservation, contactSettings } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<Reservation>({ name: '', phone: '', email: '', guests: 2, date: '', time: '', specialRequest: '' });

  const update = (key: keyof Reservation, value: string) =>
    setForm((c) => ({ ...c, [key]: key === 'guests' ? Number(value) : value }));

  const submit = (e: React.FormEvent) => { e.preventDefault(); addReservation(form); setSent(true); };

  const fields: Array<[keyof Reservation, string, string]> = [
    ['name', 'Your name', 'text'], ['phone', 'Phone number', 'tel'], ['email', 'Email address', 'email'], ['date', 'Date', 'date'], ['time', 'Preferred time', 'time'],
  ];

  return (
    <main className="bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading eyebrow="Come say hello" title="Make it a plan." copy="We're right at Koloni Bazar, ready for crispy snacks, easy conversations, and unhurried evenings." />
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* info card */}
          <div className="rounded-[2rem] bg-slate-900 p-8 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Visit us</p>
            <h2 className="mt-4 font-heading text-3xl font-black">Mollywood Kitchen</h2>
            <div className="mt-9 space-y-6 text-sm leading-6 text-slate-300">
              <div><p className="font-bold text-white">Address</p><p>{contactSettings.address || 'Koloni Bazar, Chaitrokol, Pirganj, Rangpur'}</p></div>
              <div><p className="font-bold text-white">Call</p><p>{contactSettings.phone || '+88 01890416021'}</p></div>
              <div><p className="font-bold text-white">Hours</p><p>{contactSettings.openingHours || 'Daily, 11:30 AM – 10:30 PM'}</p></div>
            </div>
          </div>

          {/* form */}
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-10">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-8 w-8" /></div>
                <h2 className="mt-6 font-heading text-3xl font-black text-slate-900">You're on the list.</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">We've received your reservation request. Our team will confirm the table shortly.</p>
                <button onClick={() => setSent(false)} className="mt-7 text-sm font-bold text-amber-700 underline underline-offset-4">Make another reservation</button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="font-heading text-3xl font-black text-slate-900">Reserve a table</h2>
                  <p className="mt-2 text-sm text-slate-500">Tell us when you're coming and we'll take care of the rest.</p>
                </div>
                {fields.map(([key, label, type]) => (
                  <label key={key}>
                    <span className="mb-2 block text-xs font-bold text-slate-600">{label}</span>
                    <input
                      required={key !== 'email'}
                      type={type}
                      value={String(form[key] ?? '')}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                    />
                  </label>
                ))}
                <label>
                  <span className="mb-2 block text-xs font-bold text-slate-600">Guests</span>
                  <select value={form.guests} onChange={(e) => update('guests', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none">
                    <option value={1}>1 guest</option><option value={2}>2 guests</option><option value={4}>4 guests</option><option value={6}>6 guests</option><option value={8}>8 guests</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold text-slate-600">Anything we should know?</span>
                  <textarea value={form.specialRequest} onChange={(e) => update('specialRequest', e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100" />
                </label>
                <button type="submit" className="sm:col-span-2 rounded-xl bg-amber-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700">Request a table</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- cart drawer ---------- */

function CartDrawer({ cart, onClose, onRemove, onUpdate }: {
  cart: CartItem[]; onClose: () => void;
  onRemove: (id: string, spice: number) => void;
  onUpdate: (id: string, spice: number, qty: number) => void;
}) {
  const total = cart.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
  return (
    <div className="fixed inset-0 z-50">
      <button onClick={onClose} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" aria-label="Close cart" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Your order</p>
            <h2 className="font-heading text-2xl font-black text-slate-900">Cart</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close cart"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
              <p className="mt-4 font-bold text-slate-700">Your cart is empty</p>
              <p className="mt-1 text-sm text-slate-500">Add a local favourite to get started.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={`${item.menuItem.id}-${item.spiceLevel}`} className="flex gap-3">
                  <img src={item.menuItem.image} alt={item.menuItem.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">{item.menuItem.name}</p>
                      <button onClick={() => onRemove(item.menuItem.id, item.spiceLevel)} className="text-slate-400 hover:text-rose-600" aria-label="Remove item"><X className="h-4 w-4" /></button>
                    </div>
                    <p className="mt-1 text-xs font-bold text-amber-700">৳{item.menuItem.price * item.quantity}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button onClick={() => onUpdate(item.menuItem.id, item.spiceLevel, item.quantity - 1)} className="rounded-full border border-slate-200 p-1 text-slate-600"><Minus className="h-3 w-3" /></button>
                      <span className="text-xs font-bold text-slate-700">{item.quantity}</span>
                      <button onClick={() => onUpdate(item.menuItem.id, item.spiceLevel, item.quantity + 1)} className="rounded-full border border-slate-200 p-1 text-slate-600"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total</span>
            <span className="text-2xl font-black text-slate-900">৳{total}</span>
          </div>
          <button disabled={cart.length === 0} className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-200">Continue to checkout</button>
        </div>
      </aside>
    </div>
  );
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <Logo />
        <p className="text-xs text-slate-400">© 2026 Mollywood Kitchen. Made for everyday cravings.</p>
      </div>
    </footer>
  );
}

/* ---------- main export ---------- */

export default function LightSite() {
  const [current, setCurrent] = useState<SitePath>(getPath());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setCurrent(getPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const addToCart = (item: SnackItem) =>
    setCart((items) => {
      const existing = items.find((e) => e.menuItem.id === item.id);
      return existing
        ? items.map((e) => (e.menuItem.id === item.id ? { ...e, quantity: e.quantity + 1 } : e))
        : [...items, { menuItem: item, quantity: 1, spiceLevel: item.spiceLevel }];
    });

  const removeFromCart = (id: string, spice: number) =>
    setCart((items) => items.filter((i) => !(i.menuItem.id === id && i.spiceLevel === spice)));

  const updateQty = (id: string, spice: number, qty: number) =>
    qty <= 0 ? removeFromCart(id, spice)
    : setCart((items) => items.map((i) => (i.menuItem.id === id && i.spiceLevel === spice ? { ...i, quantity: qty } : i)));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar current={current} cart={cart} openCart={() => setCartOpen(true)} />

      {current === '/' && <HomePage onAdd={addToCart} />}
      {current === '/menu' && <MenuPage onAdd={addToCart} />}
      {current === '/offers' && <OffersPage />}
      {current === '/contact' && <ContactPage />}

      <Footer />

      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdate={updateQty} />}
    </div>
  );
}
