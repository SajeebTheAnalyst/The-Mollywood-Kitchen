import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useStore } from '../context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { showToast, signUpCustomer, logInCustomer } = useStore();
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authTab === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: { data: { full_name: authName } },
        });
        if (error) throw error;
        signUpCustomer(authName || authEmail.split('@')[0], authEmail);
        showToast('Successfully signed up! Please verify your email.', 'success');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        logInCustomer(authEmail.split('@')[0], authEmail);
        showToast('Successfully logged in!', 'success');
      }
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Authentication failed', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    try {
      setAuthLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          skipBrowserRedirect: !!window.location.ancestorOrigins?.length || window.self !== window.top,
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank', 'width=500,height=600');
      }
      
    } catch (error: any) {
      showToast(`OAuth Error: ${error.message}`, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backdropFilter: 'blur(16px)',
              background: 'rgba(11, 11, 11, 0.75)',
              zIndex: 9998
            }}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 1.05, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 1.05, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 9999
            }}
            className="w-[90vw] max-w-md overflow-hidden rounded-3xl border border-gold/15 bg-[#111111]/70 p-8 shadow-2xl backdrop-blur-[16px] saturate-[180%]"
          >
            {/* Ambient Glowing Aura */}
            <motion.div
              animate={{
                opacity: [0.4, 0.7, 0.4],
                background: [
                  'linear-gradient(to bottom right, rgba(153, 27, 27, 0.25), rgba(212, 175, 55, 0.15))',
                  'linear-gradient(to bottom right, rgba(212, 175, 55, 0.25), rgba(153, 27, 27, 0.15))',
                  'linear-gradient(to bottom right, rgba(153, 27, 27, 0.25), rgba(212, 175, 55, 0.15))'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 blur-3xl pointer-events-none"
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-20"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6 relative z-10">
              <div className="flex justify-center p-1 rounded-lg bg-white/5 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthTab('signup')}
                  className={`flex-1 text-center py-2 text-xs font-bold tracking-wide rounded-md transition-all uppercase ${
                    authTab === 'signup' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 text-center py-2 text-xs font-bold tracking-wide rounded-md transition-all uppercase ${
                    authTab === 'login' ? 'bg-gold text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{authTab === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-zinc-400">Join our Mollywood community today.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
              {authTab === 'signup' && (
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 transition-colors group-hover:text-gold/80" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold/50 hover:-translate-y-[3px] hover:shadow-[0_0_12px_1px_rgba(212,175,55,0.4)] transition-all duration-300 ease-out"
                  />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 transition-colors group-hover:text-gold/80" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold/50 hover:-translate-y-[3px] hover:shadow-[0_0_12px_1px_rgba(212,175,55,0.4)] transition-all duration-300 ease-out"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 transition-colors group-hover:text-gold/80" />
                <input
                  type="password"
                  placeholder="Secret Password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold/50 hover:-translate-y-[3px] hover:shadow-[0_0_12px_1px_rgba(212,175,55,0.4)] transition-all duration-300 ease-out"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:-translate-y-[3px] hover:shadow-[0_0_12px_1px_rgba(212,175,55,0.4)] transition-all duration-300 ease-out"
              >
                {authLoading ? 'Loading...' : authTab === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-6 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative z-10 px-3 bg-[#111111] text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                or continue with
              </span>
            </div>

            <div className="space-y-3 relative z-10">
              <button onClick={() => handleOAuth('google')} type="button" className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold hover:-translate-y-[3px] hover:shadow-[0_0_12px_1px_rgba(212,175,55,0.4)] hover:border-gold/30 transition-all duration-300 ease-out">Continue with Google</button>
              <button onClick={() => handleOAuth('facebook')} type="button" className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold hover:-translate-y-[3px] hover:shadow-[0_0_12px_1px_rgba(212,175,55,0.4)] hover:border-gold/30 transition-all duration-300 ease-out">Continue with Facebook</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
