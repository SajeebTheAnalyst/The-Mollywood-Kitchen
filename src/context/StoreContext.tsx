import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/mockData.json';
import { MenuItem, OfferItem, ReviewItem, Reservation } from '../types';
import { supabase, getSessionMetrics } from '../lib/supabase';

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
  googleRating?: number;
  ratingCount?: number;
  yearsOfHeritage?: number;
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
  twitter: string;
  youtube: string;
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
  adminEmail: string | null;
  
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

  // Customer Visitor Account System
  customerUser: { email: string; name: string } | null;
  signUpCustomer: (name: string, email: string) => void;
  logInCustomer: (name: string, email: string) => void;
  logoutCustomer: () => void;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setView] = useState<ViewMode>('client');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [customerUser, setCustomerUser] = useState<{ email: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Core CMS datasets
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('mollywood_menu');
    return saved ? JSON.parse(saved) : initialData.menuItems as MenuItem[];
  });
  const [offers, setOffers] = useState<OfferItem[]>(() => {
    const saved = localStorage.getItem('mollywood_offers');
    return saved ? JSON.parse(saved) : initialData.offers as OfferItem[];
  });
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('mollywood_reviews');
    return saved ? JSON.parse(saved) : initialData.reviews as ReviewItem[];
  });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('mollywood_gallery');
    return saved ? JSON.parse(saved) : initialData.gallery as GalleryItem[];
  });
  const [reservations, setReservations] = useState<AdminReservation[]>(() => {
    const saved = localStorage.getItem('mollywood_reservations');
    return saved ? JSON.parse(saved) : initialData.reservations as AdminReservation[];
  });
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(() => {
    const saved = localStorage.getItem('mollywood_hero');
    return saved ? JSON.parse(saved) : initialData.heroSettings;
  });
  const [aboutSettings, setAboutSettings] = useState<AboutSettings>(() => {
    const saved = localStorage.getItem('mollywood_about');
    return saved ? JSON.parse(saved) : initialData.aboutSettings;
  });
  const [contactSettings, setContactSettings] = useState<ContactSettings>(() => {
    const saved = localStorage.getItem('mollywood_contact');
    return saved ? JSON.parse(saved) : initialData.contactSettings;
  });
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('mollywood_website');
    return saved ? JSON.parse(saved) : initialData.websiteSettings;
  });
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(() => {
    const saved = localStorage.getItem('mollywood_profile');
    return saved ? JSON.parse(saved) : initialData.profileSettings;
  });

  const fetchSupabaseContent = async () => {
    try {
      const { data, error } = await supabase.from('mollywood_cms_content').select('*');
      if (error) {
        console.warn('Supabase fetch failed (Normal if tables are empty/missing). Error:', error.message);
        return;
      }
      
      if (data && data.length > 0) {
        data.forEach(item => {
          // Only update if content exists and isn't empty
          if (!item.content) return;

          switch (item.id) {
            case 'menu': setMenuItems(item.content); persist('mollywood_menu', item.content); break;
            case 'offers': setOffers(item.content); persist('mollywood_offers', item.content); break;
            case 'reviews': setReviews(item.content); persist('mollywood_reviews', item.content); break;
            case 'gallery': setGalleryItems(item.content); persist('mollywood_gallery', item.content); break;
            case 'hero': setHeroSettings(item.content); persist('mollywood_hero', item.content); break;
            case 'about': setAboutSettings(item.content); persist('mollywood_about', item.content); break;
            case 'contact': setContactSettings(item.content); persist('mollywood_contact', item.content); break;
            case 'website': setWebsiteSettings(item.content); persist('mollywood_website', item.content); break;
            case 'profile': setProfileSettings(item.content); persist('mollywood_profile', item.content); break;
          }
        });
      }
    } catch (err) {
      console.warn('Supabase connectivity warning:', err);
    }
  };

  const syncToSupabase = async (id: string, content: any) => {
    // 1. Instantly update local cache as THE primary source of truth
    persist(`mollywood_${id}`, content);
    
    // 2. Perform background cloud sync
    try {
      const { error } = await supabase
        .from('mollywood_cms_content')
        .upsert([{ id, content, updated_at: new Date().toISOString() }], { onConflict: 'id' });
        
      if (error) {
        console.warn(`Supabase Cloud Sync failed for ${id} (Connection/URL issue). Data is safely stored in your browser local storage though.`);
      }
    } catch (err) {
      console.warn(`Database unreachable. ${id} saved to your browser local storage instead.`);
    }
  };

  // Initialize and load
  useEffect(() => {
    // 1. Auth Status check - use Supabase session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAdminEmail(session.user.email || null);
        if (session.user.email === 'iamsojib582@gmail.com') {
          setIsLoggedIn(true);
        }
      }
      fetchSupabaseContent();
    };

    checkSession();

    // Support direct URL hash checking e.g. #admin routing support on layout load
    const handleHashChange = async () => {
      if (window.location.hash === '#admin') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user.email === 'iamsojib582@gmail.com') {
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAdminEmail(session.user.email || null);
        if (session.user.email === 'iamsojib582@gmail.com') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setAdminEmail(null);
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Guarantee clean and defaulted signature selection database on load
  useEffect(() => {
    let changed = false;
    let next = [...menuItems];

    // Self-healing check: filter out any duplicate IDs or duplicate names from cache
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const uniqueItems: MenuItem[] = [];
    next.forEach(item => {
      const nameLower = item.name.toLowerCase();
      if (!seenIds.has(item.id) && !seenNames.has(nameLower)) {
        seenIds.add(item.id);
        seenNames.add(nameLower);
        uniqueItems.push(item);
      } else {
        changed = true;
      }
    });
    next = uniqueItems;

    // 1. Purge "Tea", "Cappuccino", "Espresso", "Coffee" from signature special status
    next = next.map(item => {
      const nameLower = item.name.toLowerCase();
      if ((nameLower.includes('tea') || nameLower.includes('cappuccino') || nameLower.includes('espresso') || nameLower.includes('coffee')) && item.is_special) {
        changed = true;
        return { ...item, is_special: false };
      }
      return item;
    });

    // 2. Ensure we have 4-5 premium authentic signature items: Kacchi Biryani, Beef Kala Bhuna, Tandoori Chicken Platter, Mutton Rezala
    const requiredSpecials = [
      {
        id: "sig1",
        name: "Premium Kacchi Biryani",
        price: 350,
        description: "Slow-cooked fragrant basmati rice with tender marinated mutton pieces, potatoes, and exotic spices.",
        is_special: true,
        category: "indian",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600",
        rating: 5.0,
        popular: true,
        ingredients: ["Basmati Rice", "Mutton", "Potatoes", "Saffron"],
        spiceLevel: 2,
        specialty: "Our legendary signature dish cooked in traditional dum."
      },
      {
        id: "sig_beef_kala_bhuna",
        name: "Beef Kala Bhuna",
        price: 380,
        description: "Traditional slow-cooked dark beef caramelized to perfection with special Radhuni spices.",
        is_special: true,
        category: "bengali",
        image: "https://images.unsplash.com/photo-1603360946369-fa9902792685?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        popular: true,
        ingredients: ["Beef", "Kala Bhuna Masala", "Onions", "Mustard Oil"],
        spiceLevel: 3,
        specialty: "Legendary dark roast slow beef classic."
      },
      {
        id: "sig_tandoori_chicken",
        name: "Tandoori Chicken Platter",
        price: 320,
        description: "Juicy tandoori chicken cooked in clay oven, served with mint chutney and fresh lachha onion.",
        is_special: true,
        category: "indian",
        image: "https://images.unsplash.com/photo-1598103442097-8b743e2b95c6?auto=format&fit=crop&q=80&w=600",
        rating: 4.8,
        popular: true,
        ingredients: ["Chicken", "Yogurt", "Tandoori Spices"],
        spiceLevel: 2,
        specialty: "Incredibly tender, melt-in-the-mouth grilled classic."
      },
      {
        id: "sig_mutton_rezala",
        name: "Mutton Rezala",
        price: 360,
        description: "Rich, aromatic mutton curry in a smooth yogurt, cashew nut paste, and fragrant spice gravy.",
        is_special: true,
        category: "bengali",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600",
        rating: 4.9,
        popular: true,
        ingredients: ["Mutton", "Yogurt", "Cashew Paste", "Spices"],
        spiceLevel: 1,
        specialty: "Royal aromatic curry."
      }
    ];

    // Reset non-required specials to false to purge other items like tea, tehari, etc. from signature
    const requiredNames = requiredSpecials.map(r => r.name.toLowerCase());
    next = next.map(item => {
      const isRequired = requiredNames.includes(item.name.toLowerCase());
      if (item.is_special && !isRequired) {
        changed = true;
        return { ...item, is_special: false };
      }
      return item;
    });

    requiredSpecials.forEach(reqItem => {
      const existingIdx = next.findIndex(item => item.name.toLowerCase() === reqItem.name.toLowerCase());
      if (existingIdx > -1) {
        if (!next[existingIdx].is_special) {
          next[existingIdx] = { ...next[existingIdx], is_special: true };
          changed = true;
        }
      } else {
        next.push(reqItem);
        changed = true;
      }
    });

    if (changed) {
      setMenuItems(next);
      localStorage.setItem('mollywood_menu', JSON.stringify(next));
      syncToSupabase('menu', next);
    }
  }, []);

  // Passive Client-Side Analytics (Bounce status & Duration)
  useEffect(() => {
    // Dynamically sync SEO metadata from store to document
    if (websiteSettings) {
      document.title = websiteSettings.seoTitle || 'Mollywood Kitchen | Authentic Bengali Restaurant';
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', websiteSettings.seoDescription || 'Experience authentic Bengali cuisine.');
      }
      
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink && websiteSettings.favicon) {
        faviconLink.setAttribute('href', websiteSettings.favicon);
      }
    }

    if (!localStorage.getItem('mollywood_session_start_time')) {
      localStorage.setItem('mollywood_session_start_time', Date.now().toString());
    }
    
    const handleGlobalClick = () => {
      const clicks = parseInt(localStorage.getItem('mollywood_interaction_clicks') || '0', 10);
      localStorage.setItem('mollywood_interaction_clicks', (clicks + 1).toString());
    };
    
    window.addEventListener('click', handleGlobalClick);
    
    const visited = JSON.parse(localStorage.getItem('mollywood_visited_views') || '[]');
    if (visited.length === 0) {
      visited.push('home');
      localStorage.setItem('mollywood_visited_views', JSON.stringify(visited));
    }

    return () => window.removeEventListener('click', handleGlobalClick);
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

  const signUpCustomer = async (name: string, email: string) => {
    const user = { name, email };
    setCustomerUser(user);
    localStorage.setItem('mollywood_customerUser', JSON.stringify(user));

    const metrics = getSessionMetrics();
    try {
      const { error } = await supabase.from('mollywood_users').insert([{
        name,
        email,
        bounce_info: metrics
      }]);
      if (error) {
        console.warn('Supabase users save error (Make sure SQL script is executed):', error.message);
        showToast(`Welcome, ${name}! Logged in successfully (awaiting Supabase tables).`, 'success');
      } else {
        showToast(`Welcome, ${name}! Your account is securely synchronized with Supabase database.`, 'success');
      }
    } catch (e: any) {
      console.warn('Supabase connectivity warning:', e);
      showToast(`Welcome, ${name}! Logged in successfully (awaiting Supabase tables).`, 'success');
    }
  };

  const logInCustomer = async (name: string, email: string) => {
    const user = { name, email };
    setCustomerUser(user);
    localStorage.setItem('mollywood_customerUser', JSON.stringify(user));

    const metrics = getSessionMetrics();
    try {
      await supabase.from('mollywood_users').insert([{
        name,
        email,
        bounce_info: metrics
      }]);
    } catch (e) {
      // Graceful fallback
    }
    showToast(`Welcome back, ${name}! Ready to order.`, 'success');
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    localStorage.removeItem('mollywood_customerUser');
    showToast('Logged out of user account successfully.', 'success');
  };

  // ==================== MENU CRUD INTERFACES ====================
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: 'menu_' + Date.now()
    };
    const next = [newItem, ...menuItems];
    setMenuItems(next);
    syncToSupabase('menu', next);
    showToast(`Added "${newItem.name}" to menu successfully!`, 'success');
  };

  const editMenuItem = (item: MenuItem) => {
    const next = menuItems.map(x => x.id === item.id ? item : x);
    setMenuItems(next);
    syncToSupabase('menu', next);
    showToast(`Updated "${item.name}" details.`, 'success');
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find(x => x.id === id);
    const next = menuItems.filter(x => x.id !== id);
    setMenuItems(next);
    syncToSupabase('menu', next);
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
    syncToSupabase('menu', next);
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
    syncToSupabase('offers', next);
    showToast(`Created offer Promo: ${newOffer.title}`, 'success');
  };

  const editOffer = (offer: OfferItem) => {
    const next = offers.map(x => x.id === offer.id ? offer : x);
    setOffers(next);
    syncToSupabase('offers', next);
    showToast(`Updated offer "${offer.title}" successfully.`, 'success');
  };

  const deleteOffer = (id: string) => {
    const target = offers.find(x => x.id === id);
    const next = offers.filter(x => x.id !== id);
    setOffers(next);
    syncToSupabase('offers', next);
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
    syncToSupabase('reviews', next);
    showToast(`Added customer review by "${newReview.name}"!`, 'success');
  };

  const editReview = (review: ReviewItem) => {
    const next = reviews.map(x => x.id === review.id ? review : x);
    setReviews(next);
    syncToSupabase('reviews', next);
    showToast(`Saved review edits.`, 'success');
  };

  const deleteReview = (id: string) => {
    const next = reviews.filter(x => x.id !== id);
    setReviews(next);
    syncToSupabase('reviews', next);
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
    syncToSupabase('gallery', next);
    showToast(`New image uploaded to ${newItem.category} gallery!`, 'success');
  };

  const deleteGalleryItem = (id: string) => {
    const next = galleryItems.filter(x => x.id !== id);
    setGalleryItems(next);
    syncToSupabase('gallery', next);
    showToast(`Removed gallery image.`, 'success');
  };

  // ==================== RESERVATIONS CRUD INTERFACES ====================
  const addReservation = async (res: Omit<Reservation, 'status'>) => {
    const newRes: AdminReservation = {
      ...res,
      id: 'res_' + Date.now(),
      status: 'Pending'
    };
    const next = [newRes, ...reservations];
    setReservations(next);
    persist('mollywood_reservations', next);

    // Save Table Booking to Supabase Cloud Database!
    try {
      const { error } = await supabase.from('mollywood_bookings').insert([{
        user_email: res.email,
        user_name: res.name,
        phone: res.phone,
        booking_date: res.date,
        booking_time: res.time,
        guests: res.guests,
        special_requests: res.specialRequest || '',
        status: 'Pending'
      }]);
      if (error) {
        console.warn('Supabase booking insert error:', error.message);
        showToast(`Table reserved successfully for ${res.name} (saved locally)!`, 'success');
      } else {
        showToast(`Table reserved successfully and synchronized to Supabase!`, 'success');
      }
    } catch (e) {
      console.warn('Supabase reservation warning:', e);
      showToast(`Table reserved successfully for ${res.name}!`, 'success');
    }
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
    syncToSupabase('hero', settings);
    showToast('Hero section parameters updated instantly!', 'success');
  };

  const updateAboutSettings = (settings: AboutSettings) => {
    setAboutSettings(settings);
    syncToSupabase('about', settings);
    showToast('About section parameters saved.', 'success');
  };

  const updateContactSettings = (settings: ContactSettings) => {
    setContactSettings(settings);
    syncToSupabase('contact', settings);
    showToast('Contact info & hours updated.', 'success');
  };

  const updateWebsiteSettings = (settings: WebsiteSettings) => {
    setWebsiteSettings(settings);
    syncToSupabase('website', settings);
    showToast('Website colors, favicon, logo and SEO updated.', 'success');
  };

  const updateProfileSettings = (settings: ProfileSettings) => {
    setProfileSettings(settings);
    syncToSupabase('profile', settings);
    showToast('Owner profile details updated successfully.', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setView,
        isLoggedIn,
        setIsLoggedIn: handleAuthChange,
        adminEmail,
        
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
        toast,
        
        // Customer Visitor Account System
        customerUser,
        signUpCustomer,
        logInCustomer,
        logoutCustomer
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
