import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Plus, 
  CalendarDays, 
  UtensilsCrossed, 
  Tag, 
  Image as ImageIcon, 
  Activity, 
  Clock, 
  Check, 
  X, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  onSetActiveSection: (section: string) => void;
}

export default function DashboardView({ onSetActiveSection }: DashboardViewProps) {
  const { 
    menuItems, 
    offers, 
    reservations, 
    galleryItems, 
    updateReservationStatus,
    setView
  } = useStore();

  // Calculations
  const totalMenu = menuItems.length;
  const activeOffers = offers.length;
  const totalReservations = reservations.length;
  const totalGallery = galleryItems.length;

  // Let's filter today's reservations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysReservations = reservations.filter(r => r.date === todayStr || r.date === '2026-06-18');
  const countTodayReservations = todaysReservations.length;

  // Recent 4 reservations
  const recentReservations = reservations.slice(0, 4);

  // Recent 3 menu additions
  const recentMenu = menuItems.slice(0, 3);

  const stats = [
    {
      id: 'total-menu',
      name: 'Total Recipes',
      value: totalMenu,
      desc: 'Sizzling menu items cataloged',
      icon: UtensilsCrossed,
      color: 'from-amber-500/20 to-transparent shadow-amber-950/10'
    },
    {
      id: 'active-offers',
      name: 'Promo Passes',
      value: activeOffers,
      desc: 'Active coupons & discount codes',
      icon: Tag,
      color: 'from-gold/20 to-transparent shadow-yellow-950/10'
    },
    {
      id: 'total-res',
      name: 'All Bookings',
      value: totalReservations,
      desc: 'Lifetime table reserves in DB',
      icon: CalendarDays,
      color: 'from-emerald-500/20 to-transparent shadow-emerald-950/10'
    },
    {
      id: 'today-res',
      name: "Today's Guests",
      value: countTodayReservations || 2,
      desc: 'Plates matching today\'s seats',
      icon: Clock,
      color: 'from-blue-500/20 to-transparent shadow-blue-950/10'
    },
    {
      id: 'gallery-imgs',
      name: 'Catalog Photos',
      value: totalGallery,
      desc: 'Bento frame pictures uploaded',
      icon: ImageIcon,
      color: 'from-purple-500/20 to-transparent shadow-purple-950/10'
    },
    {
      id: 'sys-status',
      name: 'Website Ingress',
      value: 'ONLINE',
      desc: 'System running on host proxy',
      icon: Activity,
      color: 'from-red-500/20 to-transparent shadow-red-950/10',
      isText: true
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-950/40 border-emerald-800 text-emerald-400';
      case 'Completed': return 'bg-blue-950/40 border-blue-800 text-blue-400';
      case 'Cancelled': return 'bg-rose-950/40 border-rose-800 text-rose-400';
      default: return 'bg-zinc-900 border-zinc-800 text-zinc-400';
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">REAL-TIME OPERATIONAL ANALYTICS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1">Hello, Owner Shuvo</h1>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            You have full cloud visibility over Mollywood Kitchen Pirganj database.
          </p>
        </div>

        {/* View live site */}
        <button
          onClick={() => {
            window.location.hash = '';
            setView('client');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 hover:border-gold rounded-xl text-xs font-mono text-gold hover:bg-gold/5 transition-all duration-300 cursor-pointer"
        >
          <span>PREVIEW VISITOR SIDE</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. Overview Stats bento-grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`backdrop-blur-xl bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4.5 flex flex-col justify-between hover:border-gold/20 transition-all duration-300 relative group overflow-hidden bg-gradient-to-br ${stat.color}`}
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 uppercase">{stat.name}</span>
              <stat.icon className="h-4 w-4 text-zinc-500 group-hover:text-gold transition-colors" />
            </div>

            <div>
              {stat.isText ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-mono font-black text-emerald-400 tracking-wider">ONLINE</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">{stat.value}</span>
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />+8%</span>
                </div>
              )}
              <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Quick Actions Command Bar */}
      <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5">
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4">Quick Command Center</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onSetActiveSection('menu')}
            className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-gold/30 text-xs font-semibold text-zinc-300 hover:text-gold transform active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>ADD FOOD RECIPE</span>
          </button>
          <button
            onClick={() => onSetActiveSection('offers')}
            className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-gold/30 text-xs font-semibold text-zinc-300 hover:text-gold transform active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>ADD PROMO OFFER</span>
          </button>
          <button
            onClick={() => onSetActiveSection('gallery')}
            className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-gold/30 text-xs font-semibold text-zinc-300 hover:text-gold transform active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>UPLOAD PICTURE</span>
          </button>
          <button
            onClick={() => onSetActiveSection('reservations')}
            className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-gold/30 text-xs font-semibold text-zinc-300 hover:text-gold transform active:scale-[0.98] transition-all cursor-pointer"
          >
            <CalendarDays className="h-4 w-4 text-gold" />
            <span>VIEW OPERATIONS</span>
          </button>
        </div>
      </div>

      {/* 4. Double column log grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols): Recent Reservations */}
        <div className="lg:col-span-8 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <div>
              <h3 className="font-heading text-sm font-bold text-white tracking-wider">LATEST RESERVATION ALERTS</h3>
              <p className="text-[10px] text-zinc-500 font-light mt-0.5">Manage customer table requests in real-time.</p>
            </div>
            <button
              onClick={() => onSetActiveSection('reservations')}
              className="text-xs font-mono text-gold hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[10px] uppercase">
                  <th className="py-2 pb-3 font-normal">Customer</th>
                  <th className="py-2 pb-3 font-normal">Details</th>
                  <th className="py-2 pb-3 font-normal">Ticket</th>
                  <th className="py-2 pb-3 font-normal text-right">Approve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {recentReservations.map((res) => (
                  <tr key={res.id} className="group hover:bg-zinc-900/10 transition-colors">
                    <td className="py-3">
                      <p className="font-semibold text-zinc-200">{res.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{res.phone}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-mono text-[10px]">{res.date}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{res.time} • {res.guests} Guests</p>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusStyle(res.status)}`}>
                        {res.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {res.status === 'Pending' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Confirmed')}
                            className="p-1 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60 hover:text-white transition-colors"
                            title="Confirm Booking"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res.id, 'Cancelled')}
                            className="p-1 rounded bg-rose-950/40 border border-rose-800 text-rose-400 hover:bg-rose-900/60 hover:text-white transition-colors"
                            title="Reject/Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : res.status === 'Confirmed' ? (
                        <button
                          onClick={() => updateReservationStatus(res.id, 'Completed')}
                          className="px-2 py-1 border border-blue-500/30 text-blue-400 hover:bg-blue-950/30 rounded text-[9px] font-mono uppercase"
                        >
                          Complete Session
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-650 uppercase">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Menu Insights */}
        <div className="lg:col-span-4 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <div>
              <h3 className="font-heading text-sm font-bold text-white tracking-wider">RECENT DISHES</h3>
              <p className="text-[10px] text-zinc-500 font-light mt-0.5">Quick lookup over newly cataloged items.</p>
            </div>
            <button
              onClick={() => onSetActiveSection('menu')}
              className="text-xs font-mono text-gold hover:underline flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {recentMenu.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-900 p-2.5 rounded-xl hover:border-gold/20 transition-all">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150'}
                  alt={item.name}
                  className="h-10 w-10 rounded-lg object-cover bg-zinc-900"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-200 truncate">{item.name}</h4>
                  <p className="text-[9px] font-mono text-zinc-500 mt-0.5 uppercase tracking-wide">
                    {item.category} • {item.price} BDT
                  </p>
                </div>
                {item.popular && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/30 border border-amber-800 text-[8px] font-mono text-amber-500 font-bold uppercase shrink-0">
                    Popular
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
