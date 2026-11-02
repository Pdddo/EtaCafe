// ============================================================
// HALAMAN : LoginPage
// PERAN   : semua
// ROUTE   : /login
// PIC     : (isi nama pengerjanya)
//
// ATURAN (baca sebelum mengerjakan, juga jika memakai AI):
// 1. Panggil backend HANYA lewat fungsi di src/api/*.ts, jangan fetch langsung di sini.
// 2. Gunakan tipe dari src/types/index.ts, jangan buat tipe ganda.
// 3. Pakai komponen di src/components/common sebelum membuat komponen baru.
// 4. Jangan membuat folder atau file di luar struktur ini tanpa persetujuan tim.
// 5. Hanya React + TypeScript, tanpa HTML/JS terpisah.
// ============================================================

import React, { useState } from 'react';
import { login, register } from '../../api/auth';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess?: (user: any) => void;
  onNavigate?: (page: string) => void;
}

export default function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleTabChange = (newTab: 'login' | 'signup') => {
    setError('');
    setTab(newTab);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(loginEmail.trim(), loginPassword);
      localStorage.setItem('etacafe_token', data.access_token);
      localStorage.setItem('etacafe_user', JSON.stringify(data.user));

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        alert(`Login berhasil! Selamat datang, ${data.user.name} (${data.user.role})`);
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(regName.trim(), regEmail.trim(), regPassword);
      // Auto-login after registration
      const data = await login(regEmail.trim(), regPassword);
      localStorage.setItem('etacafe_token', data.access_token);
      localStorage.setItem('etacafe_user', JSON.stringify(data.user));

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        alert(`Registrasi berhasil! Selamat datang, ${data.user.name}`);
      }
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className="auth-navbar">
        <span className="auth-navbar-logo">Coffee Shop</span>
      </nav>
      <div className="auth-nav-divider"></div>

      {/* ═══════════════════ MAIN ═══════════════════ */}
      <main className="auth-main-content">
        <div className="auth-page-container">
          {/* Background hero photo */}
          <div className="auth-hero-bg">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80"
              alt="Coffee shop background"
            />

            {/* Floating auth card */}
            <div className="auth-card">
              {/* Tabs: Login / Sign Up */}
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabChange('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                  onClick={() => handleTabChange('signup')}
                >
                  Sign Up
                </button>
              </div>

              {/* Error message */}
              {error && <div className="auth-error">{error}</div>}

              {/* ─── LOGIN FORM ─── */}
              {tab === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="login-email">
                      Username or email
                    </label>
                    <input
                      className="auth-input"
                      type="text"
                      id="login-email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder=""
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="login-password">
                      Password
                    </label>
                    <div className="auth-input-row">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        id="login-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder=""
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="toggle-eye"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>

                  <div className="auth-forgot">Forgot password?</div>

                  <button className="btn-auth" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                  </button>
                </form>
              )}

              {/* ─── REGISTER FORM ─── */}
              {tab === 'signup' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="reg-name">
                      Full Name
                    </label>
                    <input
                      className="auth-input"
                      type="text"
                      id="reg-name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="reg-email">
                      Email or Phone
                    </label>
                    <input
                      className="auth-input"
                      type="text"
                      id="reg-email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label" htmlFor="reg-password">
                      Password
                    </label>
                    <div className="auth-input-row">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        id="reg-password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="toggle-eye"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        {showRegPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>

                  <button className="btn-auth" type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="auth-footer">
        <div className="auth-footer-brand">
          <span className="auth-footer-brand-logo">Coffee Shop</span>
          <span className="auth-footer-brand-tagline">one Stop | one Heart | one Cup</span>
        </div>
        <div className="auth-footer-links">
          <button
            type="button"
            className="auth-footer-pill"
            onClick={() => onNavigate?.('home')}
          >
            our Company
          </button>
          <button
            type="button"
            className="auth-footer-pill"
            onClick={() => onNavigate?.('products-coffee')}
          >
            our Coffee
          </button>
          <button
            type="button"
            className="auth-footer-pill"
            onClick={() => onNavigate?.('products-pastry')}
          >
            our Pastry
          </button>
        </div>
        <div className="auth-footer-copy">@ 2023 All Rights Reserved</div>
      </footer>
    </div>
  );
}
