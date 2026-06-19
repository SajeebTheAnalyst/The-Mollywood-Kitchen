import React, { useState, useEffect } from 'react';
import { supabase, getSessionMetrics } from '../lib/supabase';
import { useStore } from '../context/StoreContext';
import { 
  User, Shield, Calendar, Clock, ShoppingBag, Sparkles, LogOut, 
  ChevronRight, RefreshCw, Star, Info, HelpCircle, FileText, ArrowRight,
  Compass, MousePointer, Layers, Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GuestDashboard() {
  const { customerUser, logoutCustomer, showToast } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'bookings' | 'orders'>('analytics');
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (customerUser) {
      fetchCustomerData();
      // Periodically update active metrics
      const interval = setInterval(() => {
        setMetrics(getSessionMetrics());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [customerUser]);

  const fetchCustomerData = async () => {
    if (!customerUser) return;
    setLoading(true);
    setMetrics(getSessionMetrics());
    
    try {
      // 1. Fetch Guest Bookings
      const { data: bData, error: bErr } = await supabase
        .from('mollywood_bookings')
        .select('*')
        .eq('user_email', customerUser.email)
        .order('created_at', { ascending: false });

      if (bData) setBookings(bData);

      // 2. Fetch Guest Orders
      const { data: oData, error: oErr } = await supabase
        .from('mollywood_orders')
        .select('*')
        .eq('user_email', customerUser.email)
        .order('created_at', { ascending: false });

      if (oData) setOrders(oData);

    } catch (err) {
      console.warn('Real-time database loading warning (Tables might not be active):', err);
    } finally {
      setLoading(false);
    }
  };

  if (!customerUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0B0B0B] py-16 px-4">
        <div className="max-w-md w-full bg-zinc-950 border border-white/5 rounded-sm p-12 text-center space-y-8 shadow-2xl">
          <div className="h-20 w-20 rounded-full bg-white/5 text-gold border border-white/10 flex items-center justify-center mx-auto shadow-xl">
            <Shield className="h-10 w-10" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-widest text-text-primary uppercase font-heading">Private Access</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-light font-sans">
              Please authentic identity via the navigation portal to access your signature profile, curated orders, and priority banquet records.
            </p>
          </div>
          <div className="pt-4">
            <div className="h-px bg-white/5 w-24 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Generate customized tier based on mock metrics
  const clickCount = metrics?.pageClicks || 0;
  const staySeconds = metrics?.durationSeconds || 0;
  let userTier = 'Silver Ambassador';
  let tierColor = 'text-text-secondary border-white/10 bg-white/5';

  if (clickCount > 15 || staySeconds > 120) {
    userTier = 'Grand Imperial Platinum';
    tierColor = 'text-gold border-gold/30 bg-gold/5';
  } else if (clickCount > 6 || staySeconds > 45) {
    userTier = 'Royal Golden Sovereign';
    tierColor = 'text-gold border-gold text-black bg-gold';
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambient High-Tech Gradients */}
      <div className="absolute top-0 left-1/4 h-[800px] w-[800px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10 space-y-12">
        
        {/* Welcome Glassmorphic Banner */}
        <div className="relative rounded-sm border border-white/5 bg-zinc-950 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -right-32 -top-32 h-[300px] w-[300px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              {/* High Tech Avatar Badge */}
              <div className="relative flex-shrink-0">
                <div className="h-24 w-24 rounded-sm bg-white/5 p-1 border border-white/10 shadow-2xl flex items-center justify-center">
                  <div className="h-full w-full rounded-sm bg-zinc-900 flex items-center justify-center border border-white/5">
                    <User className="h-10 w-10 text-gold" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-4 border-zinc-950" />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-3xl font-black text-text-primary tracking-widest uppercase font-heading">
                    Hello, {customerUser.name}
                  </h2>
                  <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-sm text-[9px] font-black tracking-[0.3em] uppercase border ${tierColor} transition-all duration-500 shadow-xl`}>
                    <Star className="h-3 w-3" />
                    {userTier}
                  </span>
                </div>
                <p className="text-xs text-text-secondary tracking-widest font-bold uppercase">
                  Identity Verified: <span className="text-gold">{customerUser.email}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={fetchCustomerData}
                disabled={loading}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-text-primary transition-all duration-500 cursor-pointer flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-gold ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Profile</span>
              </button>

              <button
                onClick={logoutCustomer}
                className="px-6 py-3 bg-white/5 hover:bg-red-950/20 border border-white/10 hover:border-red-900/40 rounded-sm text-text-secondary hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all duration-500 cursor-pointer flex items-center gap-3 shadow-xl"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>End Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Real-time Session Duration */}
          <div className="bg-zinc-950 border border-white/5 p-8 rounded-sm shadow-2xl flex items-center gap-6">
            <div className="h-14 w-14 rounded-sm bg-white/5 border border-white/10 text-gold flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="block text-[9px] font-bold tracking-[0.3em] text-text-secondary uppercase">Guest Presence</span>
              <span className="block text-2xl font-black text-text-primary tracking-widest font-heading">
                {metrics?.durationSeconds || 0}s
              </span>
            </div>
          </div>

          {/* Interactive Click Counter */}
          <div className="bg-zinc-950 border border-white/5 p-8 rounded-sm shadow-2xl flex items-center gap-6">
            <div className="h-14 w-14 rounded-sm bg-white/5 border border-white/10 text-gold flex items-center justify-center">
              <MousePointer className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="block text-[9px] font-bold tracking-[0.3em] text-text-secondary uppercase">Interactions</span>
              <span className="block text-2xl font-black text-text-primary tracking-widest font-heading uppercase">
                {metrics?.pageClicks || 0}
              </span>
            </div>
          </div>

          {/* Views visited history */}
          <div className="bg-zinc-950 border border-white/5 p-8 rounded-sm shadow-2xl flex items-center gap-6">
            <div className="h-14 w-14 rounded-sm bg-white/5 border border-white/10 text-gold flex items-center justify-center">
              <Compass className="h-6 w-6" />
            </div>
            <div className="overflow-hidden space-y-1">
              <span className="block text-[9px] font-bold tracking-[0.3em] text-text-secondary uppercase">Active Path</span>
              <span className="block text-xs font-bold text-text-primary truncate uppercase tracking-widest" title={metrics?.viewsHistory}>
                {metrics?.viewsHistory || 'Mollywood Segment'}
              </span>
            </div>
          </div>

          {/* Special Guest Reward */}
          <div className="bg-zinc-950 border border-white/5 p-8 rounded-sm shadow-2xl flex items-center gap-6 border-gold/10">
            <div className="h-14 w-14 rounded-sm bg-gold/5 border border-gold/20 text-gold flex items-center justify-center shadow-xl">
              <Percent className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <span className="block text-[9px] font-bold tracking-[0.3em] text-text-secondary uppercase">Active Perk</span>
              <span className="block text-sm font-black text-gold tracking-widest uppercase">
                {clickCount > 10 ? '20% Privilege' : '10% Welcome'}
              </span>
            </div>
          </div>

        </div>

        {/* Tabbed details interface */}
        <div className="bg-zinc-950 border border-white/5 rounded-sm overflow-hidden shadow-2xl">
          
          {/* Sub Tab Header */}
          <div className="bg-black/40 border-b border-white/5 px-8 pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex gap-1 overflow-x-auto pb-0">
              <button
                onClick={() => setActiveSubTab('analytics')}
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-b-2 ${
                  activeSubTab === 'analytics' ? 'border-gold text-gold bg-white/5' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Metrics
              </button>
              <button
                onClick={() => setActiveSubTab('orders')}
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-b-2 ${
                  activeSubTab === 'orders' ? 'border-gold text-gold bg-white/5' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveSubTab('bookings')}
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border-b-2 ${
                  activeSubTab === 'bookings' ? 'border-gold text-gold bg-white/5' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Reservations ({bookings.length})
              </button>
            </div>

            <div className="pb-6">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Live Cloud Synchronized
              </span>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {activeSubTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-6">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-primary">Guest Intelligence Report</h4>
                      <p className="text-sm text-text-secondary leading-relaxed font-light font-sans max-w-2xl">
                        As you explore our curated culinary selections and heritage recipes, our architecture maps your presence to refine the Mollywood House dining journey.
                      </p>

                      <div className="bg-black/40 p-8 border border-white/5 rounded-sm space-y-6 shadow-inner">
                        <div className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Digital Signature</span>
                          <span className="text-[10px] font-bold text-text-primary truncate max-w-xs">{metrics?.userAgent?.split(' ')[0]}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Viewport Calibration</span>
                          <span className="text-[10px] font-bold text-text-primary">{metrics?.screenSize}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Referral Origin</span>
                          <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">{metrics?.referrer || 'Direct'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Retention Index</span>
                          <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">{metrics?.bounceRateIndicator}</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-white/5 border border-white/10 p-8 rounded-sm flex flex-col justify-between space-y-8 shadow-2xl">
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-gold uppercase tracking-[0.3em] leading-tight">Privilege Progression</h4>
                        <p className="text-[10px] text-text-secondary font-light leading-relaxed">
                          We reward our most loyal explorers with priority banquet access and high-fidelity perks.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="bg-gold h-full rounded-full transition-all duration-[1500ms] shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                            style={{ width: `${Math.min((clickCount / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                          <span>Activity: {clickCount} / 10</span>
                          <span className={clickCount >= 10 ? 'text-gold' : ''}>{clickCount >= 10 ? 'Level Unlocked' : 'Progression'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="overflow-x-auto"
                >
                  {orders.length === 0 ? (
                    <div className="py-20 text-center space-y-6">
                      <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-xl">
                        <ShoppingBag className="h-8 w-8 text-text-secondary/20" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.3em]">No Heritage Orders</p>
                        <p className="text-[10px] text-text-secondary/60 max-w-sm mx-auto font-light leading-relaxed">
                          Your synchronized checkout receipts will appear here after your first signature dining purchase.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] border-b border-white/5">
                        <tr>
                          <th className="pb-6 px-4">Receipt</th>
                          <th className="pb-6 px-4">Selection</th>
                          <th className="pb-6 px-4">Presence</th>
                          <th className="pb-6 px-4 text-right font-black">Sum Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map((or) => (
                          <tr key={or.id} className="text-text-primary hover:bg-white/5 transition-colors group">
                            <td className="py-8 px-4 font-bold text-gold text-[10px] tracking-widest">{or.id}</td>
                            <td className="py-8 px-4">
                              {or.items && Array.isArray(or.items) ? (
                                <div className="space-y-3">
                                  {or.items.map((it: any, i: number) => (
                                    <span key={i} className="block text-[11px] font-bold tracking-widest uppercase">
                                      {it.dish} <span className="text-[10px] text-text-secondary ml-2 font-light">×{it.quantity}</span>
                                    </span>
                                  ))}
                                </div>
                              ) : 'Dish Item'}
                            </td>
                            <td className="py-8 px-4 text-[10px] text-text-secondary tracking-widest uppercase font-bold">
                              {or.stay_duration_seconds}s presence
                            </td>
                            <td className="py-8 px-4 text-right font-heading text-lg font-black text-gold">৳{parseFloat(or.total_price || '0').toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}

              {activeSubTab === 'bookings' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="overflow-x-auto"
                >
                  {bookings.length === 0 ? (
                    <div className="py-20 text-center space-y-6">
                      <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-xl">
                        <Calendar className="h-8 w-8 text-text-secondary/20" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.3em]">No Banquet Reservations</p>
                        <p className="text-[10px] text-text-secondary/60 max-w-sm mx-auto font-light leading-relaxed">
                          Secure your signature table in our heritage dining hall to see your schedule here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] border-b border-white/5">
                        <tr>
                          <th className="pb-6 px-4">Banquet ID</th>
                          <th className="pb-6 px-4">Identity</th>
                          <th className="pb-6 px-4">Schedule</th>
                          <th className="pb-6 px-4">Hall Capacity</th>
                          <th className="pb-6 px-4 text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bookings.map((bk) => (
                          <tr key={bk.id} className="text-text-primary hover:bg-white/5 transition-colors group">
                            <td className="py-8 px-4 text-[10px] text-gold font-bold tracking-widest">{bk.id}</td>
                            <td className="py-8 px-4">
                              <p className="text-[11px] font-bold tracking-widest uppercase">{bk.user_name}</p>
                              <span className="block text-[9px] text-text-secondary font-bold tracking-[0.2em] mt-1 uppercase">{bk.phone}</span>
                            </td>
                            <td className="py-8 px-4 font-bold text-text-primary text-[11px] uppercase tracking-widest">
                              {bk.booking_date} <span className="text-gold mx-2">@</span> {bk.booking_time}
                            </td>
                            <td className="py-8 px-4 text-[11px] font-black text-text-primary tracking-widest uppercase">{bk.guests} Seats</td>
                            <td className="py-8 px-4 text-right">
                              <span className="inline-block px-4 py-1.5 rounded-sm text-[9px] font-black bg-gold/5 text-gold border border-gold/20 uppercase tracking-[0.3em] shadow-xl">
                                {bk.status || 'Verified'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
