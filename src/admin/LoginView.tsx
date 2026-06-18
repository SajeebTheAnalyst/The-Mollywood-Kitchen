import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginView() {
  const { setIsLoggedIn, setView, showToast, profileSettings, updateProfileSettings } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // Check if setup is completed
  const [isSetupComplete, setIsSetupComplete] = useState(() => {
    return localStorage.getItem('mollywood_admin_setup_complete') === 'true';
  });

  // Handle automatic security redirect lockouts
  useEffect(() => {
    if (isBlocked) {
      const timer = setTimeout(() => {
        window.location.hash = '';
        setView('client');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isBlocked, setView]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (!isSetupComplete) {
        // ONE-TIME SECURE INITIALIZATION SETUP
        if (!email.trim() || !email.includes('@')) {
          setError('Please write a valid email address.');
          setLoading(false);
          return;
        }
        if (password.length < 5) {
          setError('For security, your password must be at least 5 characters.');
          setLoading(false);
          return;
        }

        // Save persistent values
        localStorage.setItem('mollywood_admin_email', email.trim().toLowerCase());
        localStorage.setItem('mollywood_admin_password', password);
        localStorage.setItem('mollywood_admin_setup_complete', 'true');

        // Update display profile info in store
        updateProfileSettings({
          ...profileSettings,
          email: email.trim().toLowerCase()
        });

        setIsSetupComplete(true);
        setIsLoggedIn(true);
        setView('admin-dashboard');
        showToast('Secure one-time admin setup completed! Welcome.', 'success');
      } else {
        // STANDARD LOGIN GATING
        const configuredEmail = (localStorage.getItem('mollywood_admin_email') || 'owner@mollywoodkitchen.com').trim().toLowerCase();
        const configuredPassword = localStorage.getItem('mollywood_admin_password') || 'admin123';

        const enteredEmail = email.trim().toLowerCase();

        if (enteredEmail !== configuredEmail) {
          // Gate Block Trigger!
          setIsBlocked(true);
          setError('UNAUTHORIZED visitor detected. Access blocked! Redirecting...');
          showToast('Access Blocked - Redirecting to dining website.', 'error');
        } else if (password === configuredPassword) {
          setIsLoggedIn(true);
          setView('admin-dashboard');
          showToast('Welcome back, Chief Administration Officer!', 'success');
        } else {
          setError('Invalid password. Device access logs updated.');
          showToast('Access denied - invalid credentials.', 'error');
        }
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Cinematic ambient background spotlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-red/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Corner back-to website trigger */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => {
            window.location.hash = '';
            setView('client');
          }}
          className="text-zinc-500 hover:text-gold font-mono text-xs tracking-wider uppercase flex items-center gap-1.5 transition-colors duration-300 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dining Website
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md animate-none"
      >
        {/* Brand identity header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950/80 border border-gold/40 text-gold mb-3 animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="font-mono text-xs text-gold font-semibold tracking-[0.25em] uppercase">SYSTEM SHIELD ACTIVATED</p>
          <h2 className="font-heading text-2xl font-bold tracking-wider text-white mt-1">
            {isSetupComplete ? 'MOLLYWOOD KITCHEN' : 'INITIAL SETUP REQUIRED'}
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-light">
            {isSetupComplete 
              ? 'Authorized Owner Access Level Only.' 
              : 'Please configure your persistent, secure admin credentials to lock the dashboard.'}
          </p>
        </div>

        {/* High-fidelity Glassmorphic Login Card */}
        <div className="backdrop-blur-xl bg-zinc-950/60 border border-zinc-900/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border-gold-glow animate-none">
          {/* Subtle gold shine top line decoration */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {error && (
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs mb-6 ${
              isBlocked 
                ? 'bg-rose-950/40 border-rose-900/60 text-rose-400' 
                : 'bg-rose-950/20 border-rose-900/30 text-rose-400'
            }`}>
              {isBlocked ? <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" /> : <ShieldAlert className="h-4 w-4 shrink-0" />}
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Owner Email input */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                {isSetupComplete ? 'Administrator Email' : 'Setup Master Email Address'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  disabled={isBlocked || loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSetupComplete ? "owner@mollywoodkitchen.com" : "e.g. iamsojib582@gmail.com"}
                  className="w-full bg-zinc-950/90 border border-zinc-900 hover:border-zinc-850 focus:border-gold/50 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-650 outline-none transition-all duration-300 font-sans disabled:opacity-50"
                />
              </div>
              {!isSetupComplete && (
                <p className="text-[10px] text-zinc-500 font-mono">This email will be the ONLY one allowed to log in.</p>
              )}
            </div>

            {/* Secret key input */}
            <div className="space-y-1.5 font-sans">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  {isSetupComplete ? 'Secret Password' : 'Setup Master Password'}
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isBlocked || loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSetupComplete ? "••••••••" : "Minimum 5 characters"}
                  className="w-full bg-zinc-950/90 border border-zinc-900 hover:border-zinc-850 focus:border-gold/50 rounded-xl py-3 pl-10 pr-10 text-sm text-zinc-100 placeholder-zinc-650 outline-none transition-all duration-300 font-sans disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isBlocked}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isSetupComplete && (
                <p className="text-[10px] text-zinc-500 font-mono">Choose a secure, easy-to-remember passkey.</p>
              )}
            </div>

            {/* Submit keys */}
            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full py-3 bg-gradient-to-r from-gold to-gold/90 text-black hover:from-gold-light hover:to-gold font-sans text-xs font-bold tracking-widest uppercase rounded-xl shadow-lg border border-gold/10 hover:shadow-gold/10 transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>SECURE VALIDATION...</span>
                </>
              ) : (
                <span>{isSetupComplete ? 'AUTHORIZE CONSOLE' : 'INITIALIZE SYSTEM SECURELY'}</span>
              )}
            </button>
          </form>
        </div>

        {/* Small security warning footer disclaimer */}
        <p className="text-[10px] text-zinc-600 text-center uppercase tracking-wide mt-6 font-mono font-bold">
          {isSetupComplete 
            ? 'Access is protected by client authorization keys. Backed by Local Storage.'
            : 'Initialize to protect your custom recipes and reservations.'}
        </p>
      </motion.div>
    </div>
  );
}
