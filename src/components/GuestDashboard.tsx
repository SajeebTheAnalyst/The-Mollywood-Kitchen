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
      <div className="min-h-[70vh] flex items-center justify-center bg-black py-16 px-4">
        <div className="max-w-md w-full bg-zinc-950/60 border border-zinc-900 rounded-3xl p-8 text-center space-y-6 backdrop-blur-xl">
          <div className="h-14 w-14 rounded-full bg-rose-950/30 text-rose-500 border border-rose-900/40 flex items-center justify-center mx-auto animate-pulse">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold tracking-wider text-white">ACCESS NOT GRANTED</h3>
          <p className="text-zinc-400 text-xs leading-relaxed font-sans">
            Please log in or sign up using the website navigation menu to access your high-fidelity personal profile, live orders, and booking records.
          </p>
        </div>
      </div>
    );
  }

  // Generate customized tier based on mock metrics
  const clickCount = metrics?.pageClicks || 0;
  const staySeconds = metrics?.durationSeconds || 0;
  let userTier = 'Silver Ambassador';
  let tierColor = 'text-zinc-400 border-zinc-800 bg-zinc-950/80';
  let badgeColor = 'bg-zinc-500/20';

  if (clickCount > 15 || staySeconds > 120) {
    userTier = 'Grand Imperial Platinum';
    tierColor = 'text-sky-300 border-sky-900/50 bg-sky-950/20';
    badgeColor = 'bg-sky-400';
  } else if (clickCount > 6 || staySeconds > 45) {
    userTier = 'Royal Golden Sovereign';
    tierColor = 'text-gold border-gold/30 bg-gold/5';
    badgeColor = 'bg-gold';
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Ambient High-Tech Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-950/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-950/10 blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10 space-y-8">
        
        {/* Welcome Glassmorphic Banner */}
        <div className="relative rounded-3xl border border-zinc-850 bg-gradient-to-r from-zinc-950 via-zinc-90 w-full p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* High Tech Avatar Badge */}
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-gold via-accent-red to-indigo-600 p-0.5 shadow-lg shadow-gold/10 flex items-center justify-center">
                  <div className="h-full w-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                    <User className="h-7 w-7 text-gold" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center shadow" title="Active live session" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                    Hello, {customerUser.name}!
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest font-extrabold uppercase border ${tierColor}`}>
                    <Star className="h-3 w-3 animate-spin duration-3000" />
                    {userTier}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  SECURE SESSION SYNCED: <span className="text-emerald-400">{customerUser.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchCustomerData}
                disabled={loading}
                className="p-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                title="Synchronize tables state"
              >
                <RefreshCw className={`h-4 w-4 text-gold ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Core</span>
              </button>

              <button
                onClick={logoutCustomer}
                className="px-4 py-3 bg-zinc-950 hover:bg-rose-950/20 border border-zinc-850 hover:border-rose-900/40 rounded-2xl text-zinc-400 hover:text-rose-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Exit Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Real-time Session Duration */}
          <div className="bg-zinc-950/40 border border-zinc-900/60 p-5 rounded-3xl backdrop-blur-lg flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">STAY DURATION</span>
              <span className="block text-lg font-mono font-black text-white mt-0.5">
                {metrics?.durationSeconds || 0}s
              </span>
            </div>
          </div>

          {/* Interactive Click Counter */}
          <div className="bg-zinc-950/40 border border-zinc-900/60 p-5 rounded-3xl backdrop-blur-lg flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MousePointer className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">PAGE INTERACTIONS</span>
              <span className="block text-lg font-mono font-black text-white mt-0.5">
                {metrics?.pageClicks || 0} clicks
              </span>
            </div>
          </div>

          {/* Views visited history */}
          <div className="bg-zinc-950/40 border border-zinc-900/60 p-5 rounded-3xl backdrop-blur-lg flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">ACTIVE PATHWAY</span>
              <span className="block text-xs font-mono text-zinc-200 mt-1 truncate" title={metrics?.viewsHistory}>
                {metrics?.viewsHistory || 'Home Segment'}
              </span>
            </div>
          </div>

          {/* Special Guest Reward */}
          <div className="bg-zinc-950/40 border border-zinc-900/60 p-5 rounded-3xl backdrop-blur-lg flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">ACTIVE GUEST DISCOUNT</span>
              <span className="block text-lg font-mono font-black text-gold mt-0.5">
                {clickCount > 10 ? '20% OFF coupon' : '10% GUEST coupon'}
              </span>
            </div>
          </div>

        </div>

        {/* Tabbed details interface */}
        <div className="bg-zinc-950/20 border border-zinc-900 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Sub Tab Header */}
          <div className="bg-zinc-950/80 border-b border-zinc-900 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveSubTab('analytics')}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'analytics' ? 'bg-gold text-black font-extrabold' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Session Metrics</span>
              </button>
              <button
                onClick={() => setActiveSubTab('orders')}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'orders' ? 'bg-gold text-black font-extrabold' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>My Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveSubTab('bookings')}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'bookings' ? 'bg-gold text-black font-extrabold' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>My reservations ({bookings.length})</span>
              </button>
            </div>

            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">
              ● Connected: RESTful Postgres Supabase Channel
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeSubTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Dynamic User Telemetry</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        As you navigate through lists of dishes and interact with table reservations, the Mollywood kitchen telemetry logs secure metadata logs to evaluate search behaviors, bounce likelihoods, and guest retention times.
                      </p>

                      <div className="bg-black/60 p-4 border border-zinc-900 rounded-2xl space-y-3 font-mono text-[11px] text-zinc-400">
                        <div className="flex justify-between border-b border-zinc-900 pb-2">
                          <span>User Agent Identification:</span>
                          <span className="text-zinc-300 truncate max-w-xs">{metrics?.userAgent}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-900 pb-2">
                          <span>Verified Display Dimension:</span>
                          <span className="text-zinc-300">{metrics?.screenSize}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-900 pb-2">
                          <span>Entrance Page Referrer:</span>
                          <span className="text-zinc-300">{metrics?.referrer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Retention Analytics State:</span>
                          <span className="text-gold font-bold">{metrics?.bounceRateIndicator}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900/80 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Dynamic Rewards Center</h4>
                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                          We reward active explorers! Generate more than 10 clicks during your session to qualify for our Platinum Sovereign bonus.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="bg-gold h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min((clickCount / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase">
                          <span>Interactions: {clickCount} / 10</span>
                          <span>{clickCount >= 10 ? 'UNLOCKED! 💥' : 'Next Reward Locked'}</span>
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
                    <div className="py-12 text-center text-zinc-500 space-y-2">
                      <ShoppingBag className="h-8 w-8 text-zinc-750 mx-auto" />
                      <p className="italic text-xs font-mono">No synchronized checkout receipts retrieved for {customerUser.email}.</p>
                      <p className="text-[10px] text-zinc-650 max-w-sm mx-auto font-sans leading-relaxed">
                        Add recipes to your shopping cart from the Menu menu and complete the safe checkout stream!
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                        <tr>
                          <th className="pb-3">Order Receipt</th>
                          <th className="pb-3">Dishes List</th>
                          <th className="pb-3 font-mono">Session Retention</th>
                          <th className="pb-3 text-right">Sum Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {orders.map((or) => (
                          <tr key={or.id} className="text-zinc-300">
                            <td className="py-3 font-mono text-gold text-[10px]">{or.id}</td>
                            <td className="py-3 font-medium">
                              {or.items && Array.isArray(or.items) ? (
                                <div className="space-y-1">
                                  {or.items.map((it: any, i: number) => (
                                    <span key={i} className="block text-[11px]">
                                      {it.dish} <span className="text-[10px] text-zinc-500 font-mono">({it.quantity}x - {it.spiceLevel})</span>
                                    </span>
                                  ))}
                                </div>
                              ) : 'Dish Item'}
                            </td>
                            <td className="py-3 text-[10px] font-mono text-zinc-400">
                              Spent {or.stay_duration_seconds}s with {or.page_clicks_during_session} clicks
                            </td>
                            <td className="py-3 text-right font-mono font-bold text-gold">৳{parseFloat(or.total_price || '0').toLocaleString()}</td>
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
                    <div className="py-12 text-center text-zinc-500 space-y-2">
                      <Calendar className="h-8 w-8 text-zinc-755 mx-auto" />
                      <p className="italic text-xs font-mono">No online reservations retrieved for {customerUser.email}.</p>
                      <p className="text-[10px] text-zinc-650 max-w-sm mx-auto font-sans leading-relaxed">
                        Scroll down to the reservation segment to book a table seat instantly!
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                        <tr>
                          <th className="pb-3 font-mono">Receipt Token</th>
                          <th className="pb-3">Guest Contact</th>
                          <th className="pb-3 font-mono">Date Schedule</th>
                          <th className="pb-3">Requested Seat Size</th>
                          <th className="pb-3 text-right">Verification Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {bookings.map((bk) => (
                          <tr key={bk.id} className="text-zinc-300">
                            <td className="py-3 font-mono text-zinc-500 text-[10px]">{bk.id}</td>
                            <td className="py-3">
                              {bk.user_name}
                              <span className="block text-[10px] font-mono text-zinc-500">{bk.phone}</span>
                            </td>
                            <td className="py-3 font-mono text-gold text-[11px]">{bk.booking_date} @ {bk.booking_time}</td>
                            <td className="py-3 font-mono font-bold text-zinc-300">{bk.guests} Seats</td>
                            <td className="py-3 text-right">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                                {bk.status || 'Pending Verification'}
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
