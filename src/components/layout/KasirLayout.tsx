// KOMPONEN : KasirLayout
// PERAN    : Layout untuk halaman role Kasir dengan Navbar dan tab navigasi status Figma

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import './KasirLayout.css';

interface KasirLayoutProps {
  children: React.ReactNode;
  activeTab?: 'menunggu' | 'dikonfirmasi' | 'selesai' | 'dashboard';
  title?: string;
}

export default function KasirLayout({
  children,
  activeTab = 'menunggu',
}: KasirLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="kasir-wrapper">
      <Navbar role="kasir" />

      <main className="kasir-container">{children}</main>

      {/* FOOTER STATUS TABS (FIGMA DESIGN: Menunggu Konfirmasi | Dikonfirmasi | Selesai) */}
      <footer className="kasir-footer-nav">
        <button
          type="button"
          className={`kasir-footer-pill ${activeTab === 'menunggu' ? 'active' : ''}`}
          onClick={() => navigate('/kasir/orders')}
        >
          Menunggu Konfirmasi
        </button>

        <button
          type="button"
          className={`kasir-footer-pill ${activeTab === 'dikonfirmasi' ? 'active' : ''}`}
          onClick={() => navigate('/kasir/daftar-pesanan')}
        >
          Dikonfirmasi
        </button>

        <button
          type="button"
          className={`kasir-footer-pill ${activeTab === 'selesai' ? 'active' : ''}`}
          onClick={() => navigate('/kasir/dashboard')}
        >
          Selesai
        </button>
      </footer>
    </div>
  );
}
