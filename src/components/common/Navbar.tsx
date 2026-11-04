// KOMPONEN : Navbar
// PERAN    : Navigasi utama terpadu bertema EtaCafe (Etalase Cafe)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/index';
import './Navbar.css';

interface NavbarProps {
  role?: Role;
  className?: string;
}

export default function Navbar({ role: roleProp, className }: NavbarProps) {
  const { user, logout: onLogout, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  const role = (roleProp ?? user?.role ?? 'pelanggan') as Role;
  const isPelanggan = hasAnyRole(['pelanggan']);
  const isKasir = hasAnyRole(['kasir']);
  const isDapur = hasAnyRole(['dapur']);
  const isManajer = hasAnyRole(['manajer']);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className={`etacafe-navbar ${className ?? ''}`}>
      <Link to="/" className="etacafe-navbar-brand">
        <span className="etacafe-navbar-logo-script">EtaCafe</span>
        <span className="etacafe-navbar-tagline">Etalase Cafe</span>
      </Link>

      <div className="etacafe-navbar-right">
        {user && (
          <div className="etacafe-navbar-user-info">
            <span className="etacafe-navbar-user-name">{user.name}</span>
            <span className={`etacafe-navbar-role-pill etacafe-navbar-role-pill--${role}`}>
              {role}
            </span>
          </div>
        )}

        <div className="etacafe-navbar-links">
          {isPelanggan && (
            <>
              <Link to="/pelanggan/home" className="etacafe-navbar-link">
                Home
              </Link>
              <Link to="/pelanggan/products" className="etacafe-navbar-link">
                Menu
              </Link>
              <Link to="/pelanggan/cart" className="etacafe-navbar-link">
                Keranjang
              </Link>
            </>
          )}
          {isKasir && (
            <>
              <Link to="/kasir/dashboard" className="etacafe-navbar-link">
                Dashboard
              </Link>
              <Link to="/kasir/orders" className="etacafe-navbar-link">
                Pesanan
              </Link>
            </>
          )}
          {isDapur && (
            <Link to="/dapur/antrian" className="etacafe-navbar-link">
              Antrean Dapur
            </Link>
          )}
          {isManajer && (
            <>
              <Link to="/manajer/dashboard" className="etacafe-navbar-link">
                Dashboard
              </Link>
              <Link to="/manajer/menu" className="etacafe-navbar-link">
                Kelola Menu
              </Link>
              <Link to="/manajer/pengguna" className="etacafe-navbar-link">
                Pengguna
              </Link>
              <Link to="/manajer/laporan" className="etacafe-navbar-link">
                Laporan
              </Link>
            </>
          )}

          {user ? (
            <button
              type="button"
              className="etacafe-navbar-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="etacafe-navbar-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
