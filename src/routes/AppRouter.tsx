// ============================================================
// KOMPONEN : AppRouter
// PERAN   : Navigasi Antarhalaman Aplikasi (Pelanggan)
// ============================================================

import React, { useState } from 'react';
import LoginPage from '../pages/auth/LoginPage';
import HomePage from '../pages/pelanggan/HomePage';
import ProductsPage from '../pages/pelanggan/ProductsPage';
import DetailPage from '../pages/pelanggan/DetailPage';
import CartPage from '../pages/pelanggan/CartPage';
import SuccessPage from '../pages/pelanggan/SuccessPage';

export default function AppRouter() {
  const [user, setUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('etacafe_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return user ? 'home' : 'login';
  });

  const [selectedMenuId, setSelectedMenuId] = useState<number>(1);
  const [lastOrderData, setLastOrderData] = useState<any>(null);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    setCurrentRoute('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('etacafe_token');
    localStorage.removeItem('etacafe_user');
    setUser(null);
    setCurrentRoute('login');
  };

  const handleNavigate = (route: string, params?: any) => {
    if (route === 'detail') {
      if (params) setSelectedMenuId(Number(params));
      setCurrentRoute('detail');
    } else if (route === 'success') {
      if (params) setLastOrderData(params);
      setCurrentRoute('success');
    } else {
      setCurrentRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jika belum login, selalu tampilkan halaman Login
  if (!user || currentRoute === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
      />
    );
  }

  switch (currentRoute) {
    case 'home':
      return (
        <HomePage
          userName={user.name}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case 'products':
      return (
        <ProductsPage
          initialType="coffee"
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case 'products-coffee':
      return (
        <ProductsPage
          initialType="coffee"
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case 'products-pastry':
      return (
        <ProductsPage
          initialType="pastry"
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case 'detail':
      return (
        <DetailPage
          menuId={selectedMenuId}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case 'checkout':
    case 'cart':
      return (
        <CartPage
          userName={user.name}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    case 'success':
      return (
        <SuccessPage
          orderData={lastOrderData}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );

    default:
      return (
        <HomePage
          userName={user.name}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
  }
}
