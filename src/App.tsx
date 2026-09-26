import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import AdminLayout from './admin/AdminLayout';
import LoginView from './admin/LoginView';
import LightSite from './components/LightSite';

function AppContent() {
  const { currentView, isLoggedIn, setView } = useStore();

  useEffect(() => {
    if (currentView === 'admin-dashboard' && !isLoggedIn) setView('admin-login');
  }, [currentView, isLoggedIn, setView]);

  if (currentView === 'admin-login') return <LoginView />;
  if (currentView === 'admin-dashboard') return isLoggedIn ? <AdminLayout /> : <LoginView />;
  return <LightSite />;
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
