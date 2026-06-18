import React, { useState, useEffect } from 'react';
import { supabase, SUPABASE_SETUP_SQL, getSessionMetrics } from '../lib/supabase';
import { Database, CheckCircle2, Copy, Check, Terminal, Play, HelpCircle, Activity, Users, ShoppingBag, Calendar, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SupabaseSettingsView() {
  const { showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'bookings'>('users');
  const [loadingStats, setLoadingStats] = useState(false);

  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://yylepyhpzctlzojholzf.supabase.co';

  useEffect(() => {
    checkConnectionAndFetch();
  }, []);

  const checkConnectionAndFetch = async () => {
    setConnectionStatus('checking');
    try {
      // Try to read custom table or test overall client ping
      const { data, error } = await supabase.from('mollywood_users').select('id, name, email').limit(5);
      
      if (error) {
        console.warn('Database error (tables might not be created yes):', error.message);
        setConnectionStatus('error');
      } else {
        setConnectionStatus('connected');
        setRecentUsers(data || []);
      }
    } catch (e) {
      setConnectionStatus('error');
    }

    // Attempt fetching remaining tables for direct visual feedback
    try {
      const { data: oData } = await supabase.from('mollywood_orders').select('*').order('created_at', { ascending: false }).limit(5);
      if (oData) setRecentOrders(oData);
    } catch(e) {}

    try {
      const { data: bData } = await supabase.from('mollywood_bookings').select('*').order('created_at', { ascending: false }).limit(5);
      if (bData) setRecentBookings(bData);
    } catch(e) {}
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    showToast('SQL Setup Code Copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe JSON extraction helper
  const renderJSON = (obj: any) => {
    if (!obj) return 'None';
    try {
      return typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    } catch (e) {
      return 'Data';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-zinc-100">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-gold text-xs font-mono font-bold tracking-widest uppercase mb-1">
            <Database className="h-4 w-4 text-gold animate-bounce" />
            <span>EXTERNAL CLOUD INTEGRATION SYSTEM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest leading-none">
            SUPABASE DATABASE
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Synchronize customer registers, checkout dishes, and dining reservations in real-time.
          </p>
        </div>

        <button
          onClick={checkConnectionAndFetch}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Activity className="h-3.5 w-3.5 text-gold" />
          <span>Refresh DB Stream</span>
        </button>
      </div>

      {/* Connection & Key Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Status Card */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
          <p className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-500">
            CONNECTION METRICS
          </p>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-500 shadow-emerald-500/50 shadow-lg' :
              connectionStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500 animate-pulse'
            }`} />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {connectionStatus === 'connected' ? 'Live Connected' :
               connectionStatus === 'checking' ? 'Testing Connection...' : 'Tables Awaiting SQL Setup'}
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {connectionStatus === 'connected' 
              ? 'Your Mollywood client is live communicating with your Supabase schema!' 
              : 'The client is configured, but your Supabase databases tables like mollywood_users are awaiting the Initial SQL Script setup below.'}
          </p>
        </div>

        {/* Credentials Preview */}
        <div className="lg:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
          <p className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-500">
            ACTIVE DATABASE PROFILE KEYS
          </p>
          <div className="space-y-3">
            <div>
              <span className="block text-[9px] font-mono font-semibold text-gold uppercase">SUPABASE ENDPOINT URL</span>
              <span className="block text-xs font-mono text-zinc-300 break-all select-all pt-0.5 bg-black/40 px-2 py-1.5 rounded border border-zinc-900 mt-1">
                {supabaseUrl}
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-mono font-semibold text-gold uppercase">ANON CLIENT PUBLIC JWT</span>
              <span className="block text-xs font-mono text-zinc-500 truncate select-all pt-0.5 bg-black/40 px-2 py-1.5 rounded border border-zinc-900 mt-1">
                {(import.meta as any).env.VITE_SUPABASE_ANON_KEY ? '●●●●●● (Loaded from Environment Variables)' : 'Loaded from direct code fallback credentials.'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* SQL Setup Instruction Card */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-zinc-900/40 border-b border-zinc-900/80 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-gold" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                Initial Supabase SQL Setup Queries
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                EXECUTE THIS CODE TO AUTOMATICALLY PROVISION ALL 3 USER, ORDER, AND RESERVATION TABLES
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCopySql}
            className="px-4 py-1.5 bg-gold text-black hover:bg-gold-dark text-xs font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <div className="p-5 font-sans space-y-4">
          <div className="bg-slate-900/10 border-l-4 border-gold/40 p-4 bg-zinc-950/60 rounded-r-lg">
            <h4 className="text-xs font-bold text-gold flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              How do I deploy this setup?
            </h4>
            <ol className="list-decimal list-inside text-xs text-zinc-400 mt-2 space-y-1.5 leading-relaxed pl-1">
              <li>Open your project dashboard on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-white">supabase.com</a>.</li>
              <li>Navigate to the **SQL Editor** catalog using the left-hand menu.</li>
              <li>Click **"New query"** to create a fresh query tab worksheet.</li>
              <li>Click **"Copy SQL Schema"** above, paste the code into the query editor, and click **"Run"**.</li>
              <li>You are done! All registration, orders and table booking tables will instantly become live!</li>
            </ol>
          </div>

          <div className="relative">
            <pre className="text-[10px] font-mono text-zinc-400 bg-black/60 p-4 rounded-xl max-h-72 overflow-y-auto border border-zinc-900 select-all leading-normal">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        </div>
      </div>

      {/* Live Database Tables Explorer tabs */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-gold animate-pulse" />
              Live Database Tables Explorer
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
              EXPLORE ACTIVE CUSTOMER RECORDS GENERATED FROM GUEST VISITS & ORDERING CYCLES
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-1.5 bg-black/50 p-1 rounded-lg border border-zinc-850 self-start">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'users' ? 'bg-gold text-black font-extrabold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Users ({recentUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'orders' ? 'bg-gold text-black font-extrabold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Orders ({recentOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'bookings' ? 'bg-gold text-black font-extrabold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Bookings ({recentBookings.length})</span>
            </button>
          </div>
        </div>

        {/* Records Display lists */}
        <div className="overflow-x-auto">
          {activeTab === 'users' && (
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-500 border-b border-zinc-900">
                <tr>
                  <th className="pb-3 pl-2">User UUID</th>
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Gmail handle</th>
                  <th className="pb-3 text-right pr-2">Bounce Analytics & Duration info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 font-sans">
                {recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500 italic font-mono text-[11px]">
                      No recorded user synchronized yet. Sign Up from the top navbar to automatically trigger a register packet!
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/2 bg-transparent transition-colors">
                      <td className="py-3 pl-2 font-mono text-[10px] text-zinc-400 text-gold">{user.id}</td>
                      <td className="py-3 font-semibold text-zinc-100">{user.name}</td>
                      <td className="py-3 font-mono text-zinc-300">{user.email}</td>
                      <td className="py-3 text-right pr-2 font-mono text-[9px] text-zinc-400 max-w-xs truncate" title={renderJSON(user.bounce_info)}>
                        {renderJSON(user.bounce_info)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'orders' && (
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-500 border-b border-zinc-900">
                <tr>
                  <th className="pb-3 pl-2">Order UUID</th>
                  <th className="pb-3">Client Email</th>
                  <th className="pb-3">Selected Dishes</th>
                  <th className="pb-3 font-mono text-[10px]">Session Stats</th>
                  <th className="pb-3 text-right pr-2">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 font-sans">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 italic font-mono text-[11px]">
                      No active orders synced to Supabase (Ensure table mollywood_orders exists).
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/2 bg-transparent transition-colors">
                      <td className="py-3 pl-2 font-mono text-[10px] text-zinc-500">{ord.id}</td>
                      <td className="py-3 font-semibold text-zinc-100">{ord.user_email}</td>
                      <td className="py-3 text-zinc-400 max-w-xs truncate" title={renderJSON(ord.items)}>
                        {renderJSON(ord.items)}
                      </td>
                      <td className="py-3 font-mono text-[9px] text-zinc-400">
                        Stay: {ord.stay_duration_seconds}s | Clicks: {ord.page_clicks_during_session} | Path: {ord.views_history || '/'}
                      </td>
                      <td className="py-3 text-right pr-2 font-mono text-xs font-bold text-gold">৳{parseFloat(ord.total_price || '0').toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'bookings' && (
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="text-[10px] font-mono tracking-wider font-bold uppercase text-zinc-500 border-b border-zinc-900">
                <tr>
                  <th className="pb-3 pl-2">Booking UUID</th>
                  <th className="pb-3">Guest info</th>
                  <th className="pb-3 font-mono">Date & Time Target</th>
                  <th className="pb-3">Guests</th>
                  <th className="pb-3 text-right pr-2">Special Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 font-sans">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 italic font-mono text-[11px]">
                      No online reservations retrieved from Supabase (Ensure table mollywood_bookings exists).
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-white/2 bg-transparent transition-colors">
                      <td className="py-3 pl-2 font-mono text-[10px] text-zinc-500">{bk.id}</td>
                      <td className="py-3 font-semibold text-zinc-100">
                        {bk.user_name}
                        <span className="block text-[10px] font-mono text-zinc-500">{bk.phone}</span>
                      </td>
                      <td className="py-3 font-mono text-[11px] text-gold">{bk.booking_date} @ {bk.booking_time}</td>
                      <td className="py-3 font-bold font-mono text-zinc-300">{bk.guests} seats</td>
                      <td className="py-3 text-right pr-2 text-[10px] text-zinc-400 italic max-w-xs truncate">{bk.special_requests || 'None'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
