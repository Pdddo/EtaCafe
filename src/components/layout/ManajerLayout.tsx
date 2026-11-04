// KOMPONEN : ManajerLayout
// PERAN    : Layout untuk halaman role Manajer dengan navigasi sub-nav pill Figma

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import './ManajerLayout.css';

interface ManajerLayoutProps {
  children: React.ReactNode;
  activeNav?: 'dashboard' | 'menu' | 'pengguna' | 'laporan' | 'kategori' | 'promo';
}

export default function ManajerLayout({
  children,
  activeNav = 'dashboard',
}: ManajerLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="manajer-wrapper">
      <Navbar role="manajer" />

      {/* SUB-NAV PILLS KHUSUS MANAJER (Dashboard | Laporan | Kelola Menu | Pengguna | Kategori | Promo) */}
      <div className="manajer-subnav">
        <button
          type="button"
          className={`manajer-subnav-pill ${activeNav === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/manajer/dashboard')}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={`manajer-subnav-pill ${activeNav === 'laporan' ? 'active' : ''}`}
          onClick={() => navigate('/manajer/laporan')}
        >
          Laporan Penjualan
        </button>

        <button
          type="button"
          className={`manajer-subnav-pill ${activeNav === 'menu' ? 'active' : ''}`}
          onClick={() => navigate('/manajer/menu')}
        >
          Kelola Menu
        </button>

        <button
          type="button"
          className={`manajer-subnav-pill ${activeNav === 'pengguna' ? 'active' : ''}`}
          onClick={() => navigate('/manajer/pengguna')}
        >
          User Management
        </button>

        <button
          type="button"
          className={`manajer-subnav-pill ${activeNav === 'kategori' ? 'active' : ''}`}
          onClick={() => navigate('/manajer/kategori')}
        >
          Kategori
        </button>

        <button
          type="button"
          className={`manajer-subnav-pill ${activeNav === 'promo' ? 'active' : ''}`}
          onClick={() => navigate('/manajer/promo')}
        >
          Promo
        </button>
      </div>

      <main className="manajer-container">{children}</main>
    </div>
  );
}
