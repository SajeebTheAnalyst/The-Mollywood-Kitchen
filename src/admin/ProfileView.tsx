import React, { useState, useEffect } from 'react';
import { useStore, ProfileSettings } from '../context/StoreContext';
import { Save, User, Key, Eye, EyeOff, ShieldAlert, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function ProfileView() {
  const { profileSettings, updateProfileSettings, showToast } = useStore();

  const [localSettings, setLocalSettings] = useState<ProfileSettings>({
    ownerName: '',
    email: '',
    profilePhoto: ''
  });

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Authorization Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [showAuthPwd, setShowAuthPwd] = useState(false);
  const [pendingAction, setPendingAction] = useState<'profile' | 'password' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (profileSettings) {
      setLocalSettings(profileSettings);
    }
  }, [profileSettings]);

  // Intercept general identity/email update
  const handleSaveProfileAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings.email.trim() || !localSettings.email.includes('@')) {
      showToast('Please provide a valid administrator email handle.', 'error');
      return;
    }
    
    // Open verification dialogue
    setPendingAction('profile');
    setAuthPasswordInput('');
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  // Intercept passkey modification
  const handlePasswordChangeAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 5) {
      showToast('New passkey must be at least 5 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passkey confirmation mismatch.', 'error');
      return;
    }

    // Open verification dialogue
    setPendingAction('password');
    setAuthPasswordInput('');
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  // Explicit verification handler
  const handleAuthorizeAndExecute = async () => {
    // verification dialogue handler using real Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      showToast('No active session found. Please re-login.', 'error');
      return;
    }

    try {
      // Re-authenticate to ensure user still has access
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: session.user.email!,
        password: authPasswordInput
      });

      if (authError) {
        setAuthError('Incorrect master password. Verification credentials rejected.');
        showToast('Authorization Mismatch - Changes discarded.', 'error');
        return;
      }

      // Passkey approved -> apply the appropriate action
      if (pendingAction === 'profile') {
        updateProfileSettings(localSettings);
        
        // Update Supabase Auth email if it changed (Note: usually requires confirmation)
        if (localSettings.email !== session.user.email) {
          const { error: emailError } = await supabase.auth.updateUser({ email: localSettings.email });
          if (emailError) throw emailError;
        }
        
        showToast('Identity parameters and root email successfully synchronized!', 'success');
      } else if (pendingAction === 'password') {
        const { error: passError } = await supabase.auth.updateUser({ password: newPassword });
        if (passError) throw passError;
        
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Master admin password updated successfully!', 'success');
      }

      // Clean states and close
      setIsAuthModalOpen(false);
      setAuthPasswordInput('');
      setPendingAction(null);
      setAuthError(null);
    } catch (err: any) {
      showToast(`Error updating credentials: ${err.message}`, 'error');
    }
  };

  const avatarChoices = [
    { gender: 'Owner / Male', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { gender: 'Owner / Alternate', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
  ];

  return (
    <div className="space-y-6 relative">
      
      {/* 1. Header with details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">Owner Profile Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">Update display identity, owner avatars, email handles or change administrative key credentials securely.</p>
        </div>
      </div>

      {/* 2. Double column forms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: General Identity info form (7 cols) */}
        <form onSubmit={handleSaveProfileAttempt} className="lg:col-span-7 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-5">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-gold border-b border-zinc-900 pb-3 flex items-center gap-1.5 animate-pulse">
            <User className="h-4 w-4 text-gold leading-none" />
            <span>ADMINISTRATOR IDENTITY ACCESS</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
            <img
              src={localSettings.profilePhoto || avatarChoices[0].url}
              alt="Owner Avatar"
              className="h-16 w-16 rounded-full object-cover border border-gold/40 shadow-lg bg-zinc-900"
            />
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold text-gold uppercase bg-gold/10 px-2 py-0.5 rounded border border-gold/20">Executive Lead Owner</span>
              <h4 className="text-sm font-bold text-zinc-100">{localSettings.ownerName || 'S. S. Shuvo'}</h4>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">{localSettings.email || 'owner@mollywoodkitchen.com'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-450 text-zinc-400 block">Owner Fullname</label>
            <input
              type="text"
              required
              value={localSettings.ownerName}
              onChange={(e) => setLocalSettings({ ...localSettings, ownerName: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-450 text-zinc-400 block">Account Login Email (Requires Authorization)</label>
            <input
              type="email"
              required
              value={localSettings.email}
              onChange={(e) => setLocalSettings({ ...localSettings, email: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:text-gold outline-none font-mono"
            />
            <p className="text-[9px] text-zinc-500 font-mono">Modifying this value will change the username used to log in.</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-450 text-zinc-400 block">Display Avatar URL</label>
            <input
              type="url"
              required
              value={localSettings.profilePhoto}
              onChange={(e) => setLocalSettings({ ...localSettings, profilePhoto: e.target.value })}
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
            />
          </div>

          {/* Quick choices shortcuts */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 block">Quick Profile Avatar Presets</span>
            <div className="flex gap-2">
              {avatarChoices.map(avatar => (
                <button
                  type="button"
                  key={avatar.gender}
                  onClick={() => setLocalSettings({ ...localSettings, profilePhoto: avatar.url })}
                  className={`px-3 py-1.5 border border-zinc-900 bg-zinc-950 rounded-lg text-center cursor-pointer text-[10px] select-none ${
                    localSettings.profilePhoto === avatar.url 
                      ? 'border-gold text-gold font-bold font-mono' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {avatar.gender}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold-light text-black font-sans text-xs font-bold py-2.5 rounded-xl uppercase tracking-widest hover:shadow hover:shadow-gold/10 transition-all cursor-pointer flex justify-center items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Update Identity Parameters</span>
          </button>
        </form>

        {/* Right: Change secret passkey (5 cols) */}
        <form onSubmit={handlePasswordChangeAttempt} className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-gold border-b border-zinc-900 pb-3 flex items-center gap-1.5">
            <Key className="h-4 w-4 text-gold leading-none" />
            <span>Secure Password Encryption</span>
          </h3>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Newly Specified Passkey</label>
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="e.g. min 5 chars"
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-250 text-zinc-200 outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">Confirm Newly Specified Passkey</label>
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Verify newly specified key"
              className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 pb-1">
            <input
              id="showPwd"
              type="checkbox"
              checked={showPwd}
              onChange={(e) => setShowPwd(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-zinc-800 bg-black text-gold focus:ring-0"
            />
            <label htmlFor="showPwd" className="text-[10px] font-mono text-zinc-400 select-none cursor-pointer uppercase">Reveal Password Characters</label>
          </div>

          <button
            type="submit"
            className="w-full border border-gold/35 hover:border-gold text-gold hover:bg-gold/5 font-sans text-xs font-bold py-2.5 rounded-xl uppercase tracking-widest transition-all cursor-pointer flex justify-center items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Update Master Password</span>
          </button>
          
          <div className="text-[9px] text-zinc-550 font-mono flex items-center gap-1.5 leading-snug pt-2">
            <ShieldAlert className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="uppercase text-zinc-500">CHANGING CREDENTIALS REQUIRES VALID VERIFICATION LOCKKEYS.</span>
          </div>
        </form>

      </div>

      {/* 3. High-Fidelity Explicit Confirmation Modal Dialogue */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Dark glass backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal dialog card frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="relative w-full max-w-md rounded-2xl border border-gold/20 bg-zinc-950 p-6 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Top luxury subtle golden glow */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/45 to-transparent" />

              <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
                <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold tracking-wider text-zinc-100 uppercase">System Authorization</h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Action validation layer</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  You are about to modify a critical security setting <span className="font-mono text-gold font-bold">({pendingAction === 'profile' ? 'Login Handle/Email' : 'Master Password'})</span>. This action can permanently affect your console access keys.
                </p>

                <p className="text-xs text-gold/90 font-sans font-medium bg-gold/5 border border-gold/10 rounded-xl p-3 flex items-start gap-2">
                  <span className="font-mono pt-0.5">⚠️</span>
                  <span>Enter your <strong className="uppercase">current secret password</strong> to authorize this transaction and prevent lockouts.</span>
                </p>

                {authError && (
                  <p className="text-[11px] font-mono text-rose-450 bg-rose-950/20 border border-rose-900/40 text-rose-400 rounded-lg p-2.5 text-center">
                    {authError}
                  </p>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase font-bold text-zinc-400 tracking-wider">Current Master Password</label>
                  <div className="relative">
                    <input
                      type={showAuthPwd ? 'text' : 'password'}
                      required
                      value={authPasswordInput}
                      onChange={(e) => setAuthPasswordInput(e.target.value)}
                      placeholder="Write current password"
                      className="w-full bg-black border border-zinc-900 focus:border-gold/40 rounded-xl px-4 py-2.5 text-xs text-zinc-100 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPwd(!showAuthPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showAuthPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setPendingAction(null);
                    }}
                    className="flex-1 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white border border-zinc-900 rounded-xl py-2.5 text-xs font-bold text-zinc-400 uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAuthorizeAndExecute}
                    className="flex-1 bg-gradient-to-r from-gold via-gold/95 to-gold-dark text-black hover:brightness-110 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold/10 transition-transform cursor-pointer text-center flex justify-center items-center gap-1"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Authorize & Save</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
