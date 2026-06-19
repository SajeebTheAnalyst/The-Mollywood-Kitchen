import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const authorizedEmail = 'iamsojib582@gmail.com';

    if (email.trim().toLowerCase() !== authorizedEmail) {
      setError('You are not authorized to access the admin panel.');
      setIsBlocked(true);
      setLoading(false);
      showToast('Unauthorized access attempt.', 'error');
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (authError) {
        // If login fails, check if this is the authorized email and try to sign up (provision)
        if (authError.message === 'Invalid login credentials' && email.trim().toLowerCase() === authorizedEmail) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                role: 'owner',
                full_name: 'Owner Shuvo'
              }
            }
          });

          if (signUpError) {
            setError(signUpError.message);
            showToast('Setup failed. Please check Supabase dashboard.', 'error');
          } else if (signUpData.user) {
            // Check if email confirmation is required
            if (signUpData.session) {
              setIsLoggedIn(true);
              setView('admin-dashboard');
              showToast('Admin account created and logged in!', 'success');
            } else {
              setError('Account created! Please check your email inbox to confirm and activate your access.');
              showToast('Confirmation email sent.', 'success');
            }
          }
        } else {
          setError(authError.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Access denied.' 
            : authError.message);
          showToast('Login failed.', 'error');
        }
      } else if (data.user) {
        setIsLoggedIn(true);
        setView('admin-dashboard');
        showToast('Welcome back, Owner Shuvo!', 'success');
      }
    } catch (err: any) {
      setError('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter your authorized email first.', 'error');
      return;
    }
    
    if (email.trim().toLowerCase() !== 'iamsojib582@gmail.com') {
      showToast('Password reset is only available for the authorized owner.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/#admin-reset`,
      });
      
      if (resetError) {
        showToast(resetError.message, 'error');
      } else {
        showToast('Reset email sent! Please check your inbox.', 'success');
      }
    } catch (err) {
      showToast('Failed to send reset email.', 'error');
    } finally {
      setLoading(false);
    }
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
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-[9px] font-mono text-gold hover:text-white uppercase tracking-tighter"
                >
                  Forgot Key?
                </button>
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
