/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import MenuDetailModal from './components/MenuDetailModal';
import ChefsSpecialAndAbout from './components/ChefsSpecialAndAbout';
import OffersSection from './components/OffersSection';
import GallerySection from './components/GallerySection';
import ContactAndReservation from './components/ContactAndReservation';
import Footer from './components/Footer';
import { MenuItem, CartItem } from './types';

// CRM Store Context imports
import { StoreProvider, useStore } from './context/StoreContext';
import LoginView from './admin/LoginView';
import AdminLayout from './admin/AdminLayout';

function AppContent() {
  const { currentView } = useStore();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Smooth scroll tracking to highlight active navigation tab automatically
  useEffect(() => {
    if (currentView !== 'client') return; // Only track scroll on client visitor side

    const handleScroll = () => {
      const sections = ['home', 'menu', 'offers', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Cart operations managers
  const handleAddToCart = (item: MenuItem, spiceLevel: number, qty: number) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.menuItem.id === item.id && ci.spiceLevel === spiceLevel
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      } else {
        return [...prev, { menuItem: item, quantity: qty, spiceLevel }];
      }
    });
  };

  const handleRemoveFromCart = (itemId: string, spiceLevel: number) => {
    setCart((prev) => prev.filter((ci) => !(ci.menuItem.id === itemId && ci.spiceLevel === spiceLevel)));
  };

  const handleUpdateCartQty = (itemId: string, spiceLevel: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(itemId, spiceLevel);
      return;
    }
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId && ci.spiceLevel === spiceLevel
          ? { ...ci, quantity: qty }
          : ci
      )
    );
  };

  // Nav scroll helpers
  const handleScrollToSegment = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Switch display grids depending on logged context
  if (currentView === 'admin-login') {
    return <LoginView />;
  }

  if (currentView === 'admin-dashboard') {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black antialiased relative">
      
      {/* 1. STICKY NAVBAR - Cart lists, badges, and smooth scroll triggers */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleScrollToSegment}
        cart={cart}
        removeFromCart={handleRemoveFromCart}
        updateCartQty={handleUpdateCartQty}
      />

      {/* 2. PREMIUM HERO SECTION - Slogans, floating leaf graphics, and spotlight sliders */}
      <div id="home" className="scroll-mt-20">
        <Hero
          onExploreMenu={() => handleScrollToSegment('menu')}
          onBookTable={() => handleScrollToSegment('contact')}
          onSelectMenuItem={(item) => setSelectedItem(item)}
        />
      </div>

      {/* 3. CATEGORIZED INTERACTIVE MENU - Filters, searches, and quick selectors */}
      <MenuSection
        onSelectMenuItem={(item) => setSelectedItem(item)}
        onQuickAddToCart={(item, spice, qty) => handleAddToCart(item, spice, qty)}
      />

      {/* 4. CHEF'S SIGNATURE SPECIALS - Stories and review sliders */}
      <ChefsSpecialAndAbout 
        onSelectMenuItem={(item) => setSelectedItem(item)} 
      />

      {/* 5. SPECIAL OFFERS - Promo coupon passes */}
      <OffersSection />

      {/* 6. PHOTO GALLERY - Bento modular grids */}
      <GallerySection />

      {/* 7. RESERVATIONS & BOOKINGS - Address listings, operating times, reservation validation */}
      <ContactAndReservation />

      {/* 8. RESTAURANT FOOTER */}
      <Footer setActiveTab={handleScrollToSegment} />

      {/* 9. FOOD SPECIFICATION CONFIGOVER MODAL */}
      {selectedItem && (
        <MenuDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
