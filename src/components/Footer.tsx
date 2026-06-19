import React, { useState } from 'react';
import { Utensils, Facebook, Instagram, Youtube, Send, Check, Heart, Shield, ArrowUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [emailSubbed, setEmailSubbed] = useState(false);
  const [email, setEmail] = useState('');
  const { setView, websiteSettings, contactSettings } = useStore();

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubbed(true);
      setEmail('');
      setTimeout(() => setEmailSubbed(false), 2000);
    }
  };

  const handleLinkClick = (tabId: string) => {
    setActiveTab(tabId);
    document.getElementById(tabId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    const isSetupComplete = localStorage.getItem('mollywood_admin_setup_complete') === 'true';
    const storedAuth = localStorage.getItem('mollywood_isLoggedIn') === 'true';
    if (storedAuth && isSetupComplete) {
      setView('admin-dashboard');
      window.location.hash = '#admin';
    } else {
      setView('admin-login');
      window.location.hash = '#admin';
    }
  };

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: contactSettings.facebook || 'https://facebook.com', label: 'Facebook' },
    { icon: <Instagram className="h-4 w-4" />, href: contactSettings.instagram || 'https://instagram.com', label: 'Instagram' },
    { icon: <Youtube className="h-4 w-4" />, href: 'https://youtube.com', label: 'YouTube' },
    { icon: <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, href: 'https://x.com', label: 'X' },
  ];

  return (
    <footer className="bg-black text-white border-t border-zinc-900 pt-16 pb-8 z-10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand Wordmark and Newsletter registration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-zinc-900 pb-12 items-center">
          
          {/* Logo brand */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
                {websiteSettings.logo ? (
                  <img src={websiteSettings.logo} alt="Mollywood Kitchen Logo" className="h-full w-full object-contain" />
                ) : (
                  <div className="h-10 w-10 border border-gold rounded-full flex items-center justify-center">
                    <Utensils className="h-4.5 w-4.5 text-gold" />
                  </div>
                )}
              </div>
              <div className="flex flex-col border-l border-white/10 pl-3">
                <span className="font-heading text-xl font-bold tracking-[.2em] text-gold leading-none uppercase">
                  Mollywood
                </span>
                <span className="font-sans text-[9px] font-bold tracking-[.5em] text-text-secondary leading-none uppercase mt-1">
                  Kitchen
                </span>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 font-light max-w-xs leading-relaxed">
              {websiteSettings.seoDescription || "Empowering Pirganj, Rangpur with authentic recipes. Experience premium Bengali, Indian, Chinese and fast food specialties cooked with pure deshi ghee."}
            </p>
          </div>


          <div className="lg:col-span-1" />

          {/* Newsletter Box */}
          <div className="lg:col-span-6 w-full text-left space-y-3">
            <h4 className="text-xs font-bold text-text-secondary tracking-wider uppercase font-mono">
              SUBSCRIBE TO OUR NEWSLETTER
            </h4>
            <p className="text-[11px] text-text-secondary font-light">
              Get recipes specials, family weekend fest announcements, and special promo discounts straight to your inbox.
            </p>

            <form onSubmit={handleSub} className="flex max-w-md gap-2 pt-1.5">
              <input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-zinc-950 text-white border border-zinc-850 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gold placeholder:text-zinc-600 transition-colors"
              />
              <button
                type="submit"
                className={`px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center border cursor-pointer ${
                  emailSubbed 
                    ? 'bg-emerald-950 border-emerald-800 text-emerald-400' 
                    : 'bg-gold border-gold hover:bg-gold-dark hover:border-gold-dark text-black'
                }`}
              >
                {emailSubbed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>

        </div>

        {/* Medium Segment: Quick links with rolling credits look */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-left text-xs">
          
          {/* Quick Nav */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-gold tracking-widest text-[11px] uppercase">NAVIGATION</h4>
            <div className="flex flex-col space-y-2 text-zinc-400 font-medium">
              <button onClick={() => handleLinkClick('home')} className="hover:text-gold text-left font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Home</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Explore Menu</button>
              <button onClick={() => handleLinkClick('offers')} className="hover:text-gold text-left font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Special Offers</button>
              <button onClick={() => handleLinkClick('contact')} className="hover:text-gold text-left font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Reservations</button>
              <button onClick={handleAdminClick} className="hover:text-gold text-left font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Admin Panel</button>
            </div>
          </div>

          {/* Quick Food links */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-gold tracking-widest text-[11px] uppercase">OUR SPECIALTIES</h4>
            <div className="flex flex-col space-y-2 text-zinc-400">
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Hilsa Bhuna</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Beef Kala Bhuna</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Mutton Kacchi</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Bogra Sweet Yogurt</button>
            </div>
          </div>

          {/* International favorites links */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-gold tracking-widest text-[11px] uppercase">WORLD CLASSICS</h4>
            <div className="flex flex-col space-y-2 text-zinc-400">
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Butter Chicken</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Chicken Fried Rice</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Gourmet Beef Burger</button>
              <button onClick={() => handleLinkClick('menu')} className="hover:text-gold text-left text-zinc-400 font-sans transition-colors w-fit bg-transparent border-0 cursor-pointer">Mango Lassi</button>
            </div>
          </div>

          {/* Studio Credentials */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-gold tracking-widest text-[11px] uppercase">ABOUT US</h4>
            <div className="space-y-3.5 text-zinc-400 font-light">
              <p className="leading-relaxed">
                A premier dining landmark in Pirganj, Rangpur. All of our menu recipes are cooked fresh daily with pure deshi ghee and fresh spices.
              </p>
              
              {/* Social Channels icons */}
              <div className="flex items-center space-x-3.5 pt-1">
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-900 bg-zinc-950 text-zinc-450 hover:border-gold hover:text-gold transition-colors"
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section - Copyright & Back to top */}
        <div className="border-t border-zinc-950 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left font-mono text-[10px] text-zinc-500">
          
          <div className="flex flex-wrap items-center gap-1">
            <span>&copy; {new Date().getFullYear()} MOLLYWOOD KITCHEN. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center text-zinc-650 gap-1">
              SERVED WITH <Heart className="h-3 w-3 text-accent-red fill-current" /> IN PIRGANJ, RANGPUR
            </span>
          </div>

          <div className="flex space-x-4">
            <a href="#home" onClick={() => handleLinkClick('home')} className="hover:text-gold flex items-center space-x-1 uppercase">
              <span>BACK TO TOP</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
