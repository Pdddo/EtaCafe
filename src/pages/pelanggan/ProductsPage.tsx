// ============================================================
// HALAMAN : ProductsPage
// PERAN   : pelanggan
// ROUTE   : /produk
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import PelangganLayout from '../../components/layout/PelangganLayout';
import { PelangganAPI, MenuItemData, CategoryData } from '../../api/pelanggan';
import { useCart, formatRupiah } from '../../context/CartContext';
import './ProductsPage.css';

interface ProductsPageProps {
  onNavigate?: (page: string, params?: any) => void;
  onLogout?: () => void;
  initialType?: 'coffee' | 'pastry';
}

// Fallback kategori sesuai database tabel 'categories'
const FALLBACK_CATEGORIES: CategoryData[] = [
  { id: 1, name: 'Kopi & Minuman', slug: 'kopi-minuman' },
  { id: 2, name: 'Makanan Utama', slug: 'makanan-utama' },
  { id: 3, name: 'Camilan & Snack', slug: 'camilan-snack' },
  { id: 4, name: 'Dessert & Penutup', slug: 'dessert-penutup' },
];

// Fallback menu lengkap sesuai database tabel 'menu_items'
const FALLBACK_MENU_ITEMS: MenuItemData[] = [
  {
    id: 1,
    name: 'Eta Signature Kopi Aren',
    category_id: 1,
    price: 18000,
    description: 'Espresso double shot dipadukan susu segar creamy dan gula aren organik khas EtaCafe.',
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600',
    is_available: true,
  },
  {
    id: 2,
    name: 'Vanilla Caramel Macchiato',
    category_id: 1,
    price: 24000,
    description: 'Sirup vanila lembut, steamed milk, shot espresso pekat dengan saus karamel manis.',
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600',
    is_available: true,
  },
  {
    id: 3,
    name: 'Matcha Green Tea Latte',
    category_id: 1,
    price: 22000,
    description: 'Matcha Uji Jepang premium dipadukan susu hangat atau dingin menyegarkan.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600',
    is_available: true,
  },
  {
    id: 4,
    name: 'Nasi Goreng Spesial EtaCafe',
    category_id: 2,
    price: 28000,
    description: 'Nasi goreng harum rempah nusantara dengan suwiran ayam, bakso, telur mata sapi, acar, dan kerupuk.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600',
    is_available: true,
  },
  {
    id: 5,
    name: 'Ayam Geprek Sambal Korek',
    category_id: 2,
    price: 25000,
    description: 'Ayam krispi gurih digeprek sambal korek pedas segar dengan nasi putih pulen.',
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600',
    is_available: true,
  },
  {
    id: 6,
    name: 'Spaghetti Carbonara Creamy',
    category_id: 2,
    price: 35000,
    description: 'Pasta spaghetti al dente saus keju parmesan creamy, beef bacon renyah, dan taburan oregano.',
    image_url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600',
    is_available: true,
  },
  {
    id: 7,
    name: 'Sop Iga Sapi Kuah Gurih',
    category_id: 2,
    price: 48000,
    description: 'Iga sapi empuk kuah rempah bening gurih bertabur daun seledri dan emping.',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
    is_available: false, // Menu habis / tidak tersedia (BR-07)
  },
  {
    id: 8,
    name: 'Tahu Lada Garam Crispy',
    category_id: 3,
    price: 16000,
    description: 'Tahu sutra dipotong dadu digoreng garing dengan tumisan bawang putih dan irisan cabe rawit.',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    is_available: true,
  },
  {
    id: 9,
    name: 'French Fries Truffle Herb',
    category_id: 3,
    price: 20000,
    description: 'Kentang goreng renyah bumbu truffle aromatik dan taburan keju parmesan.',
    image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600',
    is_available: true,
  },
  {
    id: 10,
    name: 'Croffle Choco Almond',
    category_id: 4,
    price: 22000,
    description: 'Croissant waffle renyah berlapis saus dark cokelat Belgia dan kacang almond panggang.',
    image_url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600',
    is_available: true,
  },
];

export default function ProductsPage({
  onNavigate,
  onLogout,
  initialType = 'coffee',
}: ProductsPageProps) {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<CategoryData[]>(FALLBACK_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set initial category filter jika ada query type
  useEffect(() => {
    if (initialType === 'pastry') {
      setSelectedCategoryId(4); // Dessert & Penutup
    } else if (initialType === 'coffee') {
      setSelectedCategoryId(1); // Kopi & Minuman
    } else {
      setSelectedCategoryId('all');
    }
  }, [initialType]);

  // Load Kategori & Menu dari Database Backend
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        // 1. Ambil Kategori dari tabel 'categories'
        const cats = await PelangganAPI.getCategories();
        if (isMounted && cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (err) {
        console.warn('Menggunakan fallback data kategori:', err);
      }

      try {
        // 2. Ambil Menu dari tabel 'menu_items'
        const menus = await PelangganAPI.getMenu();
        if (isMounted && menus && menus.length > 0) {
          setMenuItems(menus);
        } else if (isMounted) {
          setMenuItems(FALLBACK_MENU_ITEMS);
        }
      } catch (err) {
        console.warn('Gagal load menu dari backend, menggunakan data tabel menu_items default:', err);
        if (isMounted) {
          setMenuItems(FALLBACK_MENU_ITEMS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Map nama kategori berdasarkan id
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  // Filter menu berdasarkan kategori aktif & kata kunci pencarian
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Filter Kategori
      const matchesCategory =
        selectedCategoryId === 'all' || item.category_id === selectedCategoryId;

      // Filter Pencarian
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategoryId, searchQuery]);

  const handleAddToCart = (e: React.MouseEvent, item: MenuItemData) => {
    e.stopPropagation();
    addToCart(item);
    setToastMessage(`✓ ${item.name} berhasil ditambahkan ke keranjang`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  return (
    <PelangganLayout
      activeNav="products"
      activeFooterPill={
        selectedCategoryId === 1
          ? 'coffee'
          : selectedCategoryId === 4 || selectedCategoryId === 3
          ? 'pastry'
          : undefined
      }
      onNavigate={(route) => {
        if (route === 'products-coffee') {
          setSelectedCategoryId(1);
        } else if (route === 'products-pastry') {
          setSelectedCategoryId(4);
        } else {
          onNavigate?.(route);
        }
      }}
      onLogout={onLogout}
    >
      <div className="products-page-container">
        {/* ─── TAB FILTER KATEGORI (Dari Database Tabel 'categories') ─── */}
        <div className="category-tabs-wrapper">
          <div className="category-tabs">
            <button
              type="button"
              className={`category-tab-btn ${selectedCategoryId === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategoryId('all')}
            >
              Semua Menu
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-tab-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ─── BAR PENCARIAN & JUMLAH MENU ─── */}
        <div className="search-bar-row">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Cari menu kopi atau makanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="menu-count-text">
            Menampilkan <strong>{filteredItems.length}</strong> menu
          </span>
        </div>

        {/* ─── DAFTAR KARTU MENU (Dari Database Tabel 'menu_items') ─── */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            Mengambil menu dari database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            Tidak ada menu yang sesuai dengan kategori atau pencarian.
          </div>
        ) : (
          <div className="products-menu-list">
            {filteredItems.map((item) => {
              const catName =
                item.category?.name || categoryMap[item.category_id] || 'Menu';

              return (
                <div
                  key={item.id}
                  className="menu-card"
                  onClick={() => onNavigate?.('detail', item.id)}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="menu-card-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600';
                    }}
                  />
                  <div className="menu-card-body">
                    <div>
                      <span className="menu-card-cat-badge">{catName}</span>
                      <h3 className="menu-card-name">{item.name}</h3>
                      <p className="menu-card-desc">{item.description}</p>
                    </div>
                    <div className="menu-card-footer">
                      <span className="menu-card-price">{formatRupiah(item.price)}</span>
                      {item.is_available ? (
                        <button
                          type="button"
                          className="btn-add-cart"
                          onClick={(e) => handleAddToCart(e, item)}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <span className="unavailable-tag">Habis / Tidak Tersedia</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toastMessage && <div className="products-toast">{toastMessage}</div>}
    </PelangganLayout>
  );
}
