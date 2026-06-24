import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Tag, 
  CalendarDays, 
  Image as ImageIcon, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  MapPin, 
  Globe, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  Home,
  Database,
  Star
} from 'lucide-react';

// Import all subviews dynamically
import DashboardView from './DashboardView';
import MenuManagementView from './MenuManagementView';
import OffersManagementView from './OffersManagementView';
import ReservationManagementView from './ReservationManagementView';
import GalleryManagementView from './GalleryManagementView';
import HeroSectionView from './HeroSectionView';
import AboutSectionView from './AboutSectionView';
import TestimonialsView from './TestimonialsView';
import ContactInfoView from './ContactInfoView';
import WebsiteSettingsView from './WebsiteSettingsView';
import ProfileView from './ProfileView';
import SupabaseSettingsView from './SupabaseSettingsView';
import SignatureManagementView from './SignatureManagementView';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onSetActiveSection: (section: string) => void } | any>;
}

export default function AdminLayout() {
  const { setView, setIsLoggedIn, showToast, profileSettings } = useStore();
  
  // Navigation states
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Unified items list
  const navigationItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, component: DashboardView },
    { id: 'signature', label: 'Signature Selection', icon: Star, component: SignatureManagementView },
    { id: 'supabase', label: 'Supabase Database', icon: Database, component: SupabaseSettingsView },
    { id: 'menu', label: 'Recipes Catalog', icon: UtensilsCrossed, component: MenuManagementView },
    { id: 'offers', label: 'Specials & Coupons', icon: Tag, component: OffersManagementView },
    { id: 'reservations', label: 'Table Bookings', icon: CalendarDays, component: ReservationManagementView },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, component: GalleryManagementView },
    { id: 'hero', label: 'Landing Editor', icon: Sparkles, component: HeroSectionView },
    { id: 'about', label: 'About Origin story', icon: BookOpen, component: AboutSectionView },
    { id: 'testimonials', label: 'Guest Feedback', icon: MessageSquare, component: TestimonialsView },
    { id: 'contact', label: 'Address & Coordinates', icon: MapPin, component: ContactInfoView },
    { id: 'settings', label: 'SEO & Global Theme', icon: Globe, component: WebsiteSettingsView },
    { id: 'profile', label: 'Account Profile', icon: User, component: ProfileView }
  ];

  const currentActive = navigationItems.find(item => item.id === activeSection) || navigationItems[0];
  const ActiveComponent = currentActive.component;

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('client');
    window.location.hash = '';
    showToast('Logged out of system administrator context.', 'success');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex relative overflow-hidden font-sans">
      {/* Visual background spotlights matching website */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-red/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ==================== SIDEBAR COMPONENT (Desktop) ==================== */}
      <aside 
        className={`hidden md:flex flex-col justify-between border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-xl h-screen sticky top-0 transition-all duration-350 ease-in-out z-30 ${
          isSidebarCollapsed ? 'w-[75px]' : 'w-[260px]'
        }`}
      >
        <div>
          {/* Logo brand block */}
          <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40 h-[70px]">
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 border border-gold/40 text-gold text-xs">
                  ★
                </div>
                <div>
                  <h2 className="font-heading text-xs font-bold tracking-widest text-white leading-none">MOLLYWOOD</h2>
                  <span className="text-[8px] font-mono tracking-wider text-gold/80 block mt-0.5 uppercase">CMS Console</span>
                </div>
              </motion.div>
            )}

            {isSidebarCollapsed && (
              <div className="h-7 w-7 rounded-full bg-zinc-900 border border-gold/30 text-gold text-xs flex items-center justify-center font-bold mx-auto">
                M
              </div>
            )}

            {/* Collapse toggle trigger button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-550 hover:text-white transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Navigation link blocks scrolling directories */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)] mt-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all font-mono text-[11px] tracking-wide uppercase group cursor-pointer border relative border-transparent ${
                    isActive 
                      ? 'bg-gold/10 border-gold/25 text-gold font-bold font-mono' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40 hover:border-zinc-850/60'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-gold' : 'text-zinc-500 group-hover:text-zinc-350'}`} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {isActive && !isSidebarCollapsed && (
                    <div className="absolute right-3.5 h-1.5 w-1.5 rounded-full bg-gold" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-zinc-900/60 bg-black/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-mono text-rose-400 hover:text-white hover:bg-rose-950/20 border border-transparent hover:border-rose-950/40 transition-all uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-500 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Exit Console</span>}
          </button>
        </div>
      </aside>

      {/* ==================== THE MOBILE DRAWER MENU ==================== */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-zinc-950/95 border-r border-zinc-900 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center text-xs">★</span>
                    <h2 className="font-heading text-sm font-bold text-white tracking-widest uppercase">Molly Cms</h2>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded border border-zinc-900 text-zinc-505">
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <nav className="space-y-1 overflow-y-auto max-h-[75vh]">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeSection;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide border ${
                          isActive 
                            ? 'bg-gold/15 border-gold/20 text-gold font-bold' 
                            : 'border-transparent text-zinc-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-zinc-900 pt-4 flex gap-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-rose-950/20 hover:bg-rose-950 text-rose-400 hover:text-white border border-rose-900/30 font-mono text-xs font-bold uppercase tracking-widest rounded-xl"
                >
                  Terminate System
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== WORKSPACE INNER WRAPPER ==================== */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* Workspace global quick navbar layout */}
        <header className="h-[70px] border-b border-zinc-900 bg-zinc-950/30 backdrop-blur flex justify-between items-center px-4 md:px-8 shrink-0 z-20">
          
          {/* Hamburger toggle trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-white cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Back to website button link shortcut */}
            <button
              onClick={() => {
                window.location.hash = '';
                setView('client');
              }}
              className="text-zinc-550 hover:text-gold font-mono text-[10px] uppercase font-bold tracking-widest hidden sm:flex items-center gap-1.5 transition-all transition-transform duration-300"
            >
              <Home className="h-3.5 w-3.5 text-zinc-500 shrink-0 select-none" />
              <span>Back to Dining Website</span>
            </button>
          </div>

          {/* User status capsule */}
          <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-900 p-1.5 pr-3 rounded-full hover:border-gold/30 transition-all select-none">
            <img 
              src={profileSettings?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
              alt="Avatar Profile" 
              className="h-7 w-7 rounded-full object-cover shrink-0 bg-zinc-900 border border-zinc-800" 
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black text-zinc-200 leading-none truncate max-w-[120px]">{profileSettings?.ownerName || 'Lead Owner'}</span>
              <span className="text-[8px] font-mono text-gold font-bold tracking-wider uppercase mt-1">Lead Owner</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 border border-black shadow" title="Session authorized" />
          </div>

        </header>

        {/* Viewport content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-6xl w-full"
            >
              <ActiveComponent onSetActiveSection={setActiveSection} />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
}
