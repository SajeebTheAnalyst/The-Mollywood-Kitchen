import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/mockData.json';
import { MenuItem, OfferItem, ReviewItem, Reservation } from '../types';

// Extend types to include more specific categories and settings for the CMS
export interface AdminReservation extends Reservation {
  id: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export interface HeroSettings {
  restaurantName: string;
  headline: string;
  subheading: string;
  heroImage: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

export interface AboutSettings {
  story: string;
  mission: string;
  vision: string;
  founders: string;
  images: string[];
}

export interface ContactSettings {
  restaurantName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapUrl: string;
  facebook: string;
  instagram: string;
  openingHours: string;
}

export interface WebsiteSettings {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  copyright: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
}

export interface ProfileSettings {
  ownerName: string;
  email: string;
  profilePhoto: string;
}

export type ViewMode = 'client' | 'admin-login' | 'admin-dashboard';

interface StoreContextProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  
  // States
  menuItems: MenuItem[];
  offers: OfferItem[];
  reviews: ReviewItem[];
  galleryItems: GalleryItem[];
  reservations: AdminReservation[];
  heroSettings: HeroSettings;
  aboutSettings: AboutSettings;
  contactSettings: ContactSettings;
  websiteSettings: WebsiteSettings;
  profileSettings: ProfileSettings;
  
  // Menu CRUD
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  editMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  duplicateMenuItem: (id: string) => void;
  
  // Offers CRUD
  addOffer: (offer: Omit<OfferItem, 'id'>) => void;
  editOffer: (offer: OfferItem) => void;
  deleteOffer: (id: string) => void;
  
  // Reviews CRUD
  addReview: (review: Omit<ReviewItem, 'id'>) => void;
  editReview: (review: ReviewItem) => void;
  deleteReview: (id: string) => void;
  
  // Gallery CRUD
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  
  // Reservations CRUD
  addReservation: (res: Omit<Reservation, 'status'>) => void;
  updateReservationStatus: (id: string, status: AdminReservation['status']) => void;
  deleteReservation: (id: string) => void;
  
  // Settings Updates
  updateHeroSettings: (settings: HeroSettings) => void;
  updateAboutSettings: (settings: AboutSettings) => void;
  updateContactSettings: (settings: ContactSettings) => void;
  updateWebsiteSettings: (settings: WebsiteSettings) => void;
  updateProfileSettings: (settings: ProfileSettings) => void;
  
  // Toasts Notification manager
  showToast: (message: string, type: 'success' | 'error') => void;
  toast: { message: string; type: 'success' | 'error' } | null;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setView] = useState<ViewMode>('client');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Core CMS datasets
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(initialData.heroSettings);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(initialData.aboutSettings);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(initialData.contactSettings);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(initialData.websiteSettings);
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(initialData.profileSettings);

  // Initialize and load from localstorage or json
  useEffect(() => {
    // 1. Auth Status check
    const storedAuth = localStorage.getItem('mollywood_isLoggedIn');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
    }

    // 2. Load lists
    const loadState = <T,>(key: string, backup: T): T => {
      const data = localStorage.getItem(key);
      try {
        return data ? JSON.parse(data) : backup;
      } catch {
        return backup;
      }
    };

    setMenuItems(loadState<MenuItem[]>('mollywood_menuItems', initialData.menuItems as MenuItem[]));
    setOffers(loadState<OfferItem[]>('mollywood_offers', initialData.offers as OfferItem[]));
    setReviews(loadState<ReviewItem[]>('mollywood_reviews', initialData.reviews as ReviewItem[]));
    setGalleryItems(loadState<GalleryItem[]>('mollywood_galleryItems', initialData.gallery as GalleryItem[]));
    setReservations(loadState<AdminReservation[]>('mollywood_reservations', initialData.reservations as AdminReservation[]));
    setHeroSettings(loadState<HeroSettings>('mollywood_heroSettings', initialData.heroSettings));
    setAboutSettings(loadState<AboutSettings>('mollywood_aboutSettings', initialData.aboutSettings));
    setContactSettings(loadState<ContactSettings>('mollywood_contactSettings', initialData.contactSettings));
    setWebsiteSettings(loadState<WebsiteSettings>('mollywood_websiteSettings', initialData.websiteSettings));
    setProfileSettings(loadState<ProfileSettings>('mollywood_profileSettings', initialData.profileSettings));

    // Support direct URL hash checking e.g. #admin routing support on layout load
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        const storedAuth = localStorage.getItem('mollywood_isLoggedIn');
        if (storedAuth === 'true') {
          setView('admin-dashboard');
        } else {
          setView('admin-login');
        }
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setView('client');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on startup

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save changes to localStorage on states update
  const persist = (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth Sync
  const handleAuthChange = (status: boolean) => {
    setIsLoggedIn(status);
    localStorage.setItem('mollywood_isLoggedIn', status ? 'true' : 'false');
  };

  // ==================== MENU CRUD INTERFACES ====================
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: 'menu_' + Date.now()
    };
    const next = [newItem, ...menuItems];
    setMenuItems(next);
    persist('mollywood_menuItems', next);
    showToast(`Added "${newItem.name}" to menu successfully!`, 'success');
  };

  const editMenuItem = (item: MenuItem) => {
    const next = menuItems.map(x => x.id === item.id ? item : x);
    setMenuItems(next);
    persist('mollywood_menuItems', next);
    showToast(`Updated "${item.name}" details.`, 'success');
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find(x => x.id === id);
    const next = menuItems.filter(x => x.id !== id);
    setMenuItems(next);
    persist('mollywood_menuItems', next);
    showToast(`Deleted "${item?.name || 'item'}" from menu.`, 'success');
  };

  const duplicateMenuItem = (id: string) => {
    const target = menuItems.find(x => x.id === id);
    if (!target) return;
    const duplicated: MenuItem = {
      ...target,
      id: 'menu_dup_' + Date.now(),
      name: `${target.name} (Copy)`
    };
    const next = [duplicated, ...menuItems];
    setMenuItems(next);
    persist('mollywood_menuItems', next);
    showToast(`Duplicated "${target.name}" successfully!`, 'success');
  };

  // ==================== OFFERS CRUD INTERFACES ====================
  const addOffer = (offer: Omit<OfferItem, 'id'>) => {
    const newOffer: OfferItem = {
      ...offer,
      id: 'offer_' + Date.now()
    };
    const next = [newOffer, ...offers];
    setOffers(next);
    persist('mollywood_offers', next);
    showToast(`Created offer Promo: ${newOffer.title}`, 'success');
  };

  const editOffer = (offer: OfferItem) => {
    const next = offers.map(x => x.id === offer.id ? offer : x);
    setOffers(next);
    persist('mollywood_offers', next);
    showToast(`Updated offer "${offer.title}" successfully.`, 'success');
  };

  const deleteOffer = (id: string) => {
    const target = offers.find(x => x.id === id);
    const next = offers.filter(x => x.id !== id);
    setOffers(next);
    persist('mollywood_offers', next);
    showToast(`Deleted offer "${target?.title || 'promo'}"`, 'success');
  };

  // ==================== REVIEWS CRUD INTERFACES ====================
  const addReview = (review: Omit<ReviewItem, 'id'>) => {
    const newReview: ReviewItem = {
      ...review,
      id: 'review_' + Date.now()
    };
    const next = [newReview, ...reviews];
    setReviews(next);
    persist('mollywood_reviews', next);
    showToast(`Added customer review by "${newReview.name}"!`, 'success');
  };

  const editReview = (review: ReviewItem) => {
    const next = reviews.map(x => x.id === review.id ? review : x);
    setReviews(next);
    persist('mollywood_reviews', next);
    showToast(`Saved review edits.`, 'success');
  };

  const deleteReview = (id: string) => {
    const next = reviews.filter(x => x.id !== id);
    setReviews(next);
    persist('mollywood_reviews', next);
    showToast(`Removed review record.`, 'success');
  };

  // ==================== GALLERY CRUD INTERFACES ====================
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal_' + Date.now()
    };
    const next = [newItem, ...galleryItems];
    setGalleryItems(next);
    persist('mollywood_galleryItems', next);
    showToast(`New image uploaded to ${newItem.category} gallery!`, 'success');
  };

  const deleteGalleryItem = (id: string) => {
    const next = galleryItems.filter(x => x.id !== id);
    setGalleryItems(next);
    persist('mollywood_galleryItems', next);
    showToast(`Removed gallery image.`, 'success');
  };

  // ==================== RESERVATIONS CRUD INTERFACES ====================
  const addReservation = (res: Omit<Reservation, 'status'>) => {
    const newRes: AdminReservation = {
      ...res,
      id: 'res_' + Date.now(),
      status: 'Pending'
    };
    const next = [newRes, ...reservations];
    setReservations(next);
    persist('mollywood_reservations', next);
    showToast(`Table reserved successfully for ${newRes.name}!`, 'success');
  };

  const updateReservationStatus = (id: string, status: AdminReservation['status']) => {
    const next = reservations.map(x => x.id === id ? { ...x, status } : x);
    setReservations(next);
    persist('mollywood_reservations', next);
    showToast(`Reservation status updated to: ${status}`, 'success');
  };

  const deleteReservation = (id: string) => {
    const next = reservations.filter(x => x.id !== id);
    setReservations(next);
    persist('mollywood_reservations', next);
    showToast(`Removed reservation ticket.`, 'success');
  };

  // ==================== STATIC SETTINGS WRITERS ====================
  const updateHeroSettings = (settings: HeroSettings) => {
    setHeroSettings(settings);
    persist('mollywood_heroSettings', settings);
    showToast('Hero section parameters updated instantly!', 'success');
  };

  const updateAboutSettings = (settings: AboutSettings) => {
    setAboutSettings(settings);
    persist('mollywood_aboutSettings', settings);
    showToast('About section parameters saved.', 'success');
  };

  const updateContactSettings = (settings: ContactSettings) => {
    setContactSettings(settings);
    persist('mollywood_contactSettings', settings);
    showToast('Contact info & hours updated.', 'success');
  };

  const updateWebsiteSettings = (settings: WebsiteSettings) => {
    setWebsiteSettings(settings);
    persist('mollywood_websiteSettings', settings);
    showToast('Website colors, favicon, logo and SEO updated.', 'success');
  };

  const updateProfileSettings = (settings: ProfileSettings) => {
    setProfileSettings(settings);
    persist('mollywood_profileSettings', settings);
    localStorage.setItem('mollywood_admin_email', settings.email);
    showToast('Owner profile details updated successfully.', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setView,
        isLoggedIn,
        setIsLoggedIn: handleAuthChange,
        
        menuItems,
        offers,
        reviews,
        galleryItems,
        reservations,
        heroSettings,
        aboutSettings,
        contactSettings,
        websiteSettings,
        profileSettings,
        
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        duplicateMenuItem,
        
        addOffer,
        editOffer,
        deleteOffer,
        
        addReview,
        editReview,
        deleteReview,
        
        addGalleryItem,
        deleteGalleryItem,
        
        addReservation,
        updateReservationStatus,
        deleteReservation,
        
        updateHeroSettings,
        updateAboutSettings,
        updateContactSettings,
        updateWebsiteSettings,
        updateProfileSettings,
        
        showToast,
        toast
      }}
    >
      {children}
      
      {/* Toast Notification HUD */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 backdrop-blur-md rounded-xl p-4 border shadow-2xl transition-all duration-300 max-w-sm border-gold-glow animate-scaleUp bg-zinc-950/95 border-gold">
          <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
            <span className="text-sm font-bold">●</span>
          </div>
          <div>
            <p className="text-xs font-mono text-zinc-400 tracking-wider">SYSTEM ALERT</p>
            <p className="text-sm font-sans font-medium text-zinc-100">{toast.message}</p>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
