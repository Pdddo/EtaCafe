import React from 'react';
import { useCart } from '../../context/CartContext';
import './PelangganLayout.css';

interface PelangganLayoutProps {
  children: React.ReactNode;
  activeNav?: 'home' | 'products' | 'checkout' | 'track' | 'none';
  activeFooterPill?: 'company' | 'coffee' | 'pastry';
  onNavigate?: (route: string) => void;
  onLogout?: () => void;
  fullHeightContent?: boolean;
}

export default function PelangganLayout({
  children,
  activeNav = 'none',
  activeFooterPill,
  onNavigate,
  onLogout,
  fullHeightContent = false,
}: PelangganLayoutProps) {
  const { cartCount } = useCart();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('etacafe_token');
      localStorage.removeItem('etacafe_user');
      window.location.reload();
    }
  };

  return (
    <div className="pelanggan-wrapper">
      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className="pelanggan-navbar">
        <button
          type="button"
          className="pelanggan-navbar-logo"
          onClick={() => onNavigate?.('home')}
        >
          Coffee Shop
        </button>

        <div className="pelanggan-navbar-links">
          <button
            type="button"
            className={`pelanggan-nav-link ${activeNav === 'products' ? 'active' : ''}`}
            onClick={() => onNavigate?.('products')}
          >
            Products
          </button>

          <button
            type="button"
            className={`pelanggan-nav-link pelanggan-cart-badge ${
              activeNav === 'checkout' ? 'active' : ''
            }`}
            onClick={() => onNavigate?.('checkout')}
          >
            Checkout
            {cartCount > 0 && <span className="pelanggan-badge">{cartCount}</span>}
          </button>

          <button
            type="button"
            className="pelanggan-nav-link"
            style={{ opacity: 0.6, fontSize: '13px' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="pelanggan-nav-divider"></div>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <main
        className="pelanggan-main"
        style={fullHeightContent ? { overflow: 'hidden', padding: 0 } : undefined}
      >
        {children}
      </main>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="pelanggan-footer">
        <div className="pelanggan-footer-brand">
          <span className="pelanggan-footer-brand-logo">Coffee Shop</span>
          <span className="pelanggan-footer-brand-tagline">
            one Stop | one Heart | one Cup
          </span>
        </div>

        <div className="pelanggan-footer-links">
          <button
            type="button"
            className={`pelanggan-footer-pill ${
              activeFooterPill === 'company' ? 'active' : ''
            }`}
            onClick={() => onNavigate?.('home')}
          >
            our Company
          </button>

          <button
            type="button"
            className={`pelanggan-footer-pill ${
              activeFooterPill === 'coffee' ? 'active' : ''
            }`}
            onClick={() => onNavigate?.('products-coffee')}
          >
            our Coffee
          </button>

          <button
            type="button"
            className={`pelanggan-footer-pill ${
              activeFooterPill === 'pastry' ? 'active' : ''
            }`}
            onClick={() => onNavigate?.('products-pastry')}
          >
            our Pastry
          </button>
        </div>

        <div className="pelanggan-footer-copy">@ 2023 All Rights Reserved</div>
      </footer>
    </div>
  );
}
