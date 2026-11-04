import React, { useState } from 'react';
import { KasirAPI } from '../../api/client';
import RupiahText from '../../components/common/RupiahText';
import type { MenuItem, OrderItem } from '../../types';

export default function PesananBaruPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);

  // Load categories and menu items
  useEffect(() => {
    const loadData = async () => {
      try {
        const catData = await KasirAPI.getCategories();
        setCategories(catData.map((c: any) => c.name));

        const menuData = await KasirAPI.getMenu();
        setMenuItems(menuData);
      } catch (error) {
        console.error('Gagal memuat data menu:', error);
      }
    };
    loadData();
  }, []);

  const handleAddToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItemId === menuItem.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: Math.random().toString(36).substr(2, 9),
          menuItemId: menuItem.id,
          menuItemName: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          notes: menuItem.custom_notes || '',
          subtotal: menuItem.price,
        },
      ]);
    }

    const newTotal = cart.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    setTotal(newTotal);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.menuItemId !== itemId));
    setTotal(
      cart.reduce((sum, item) => sum + item.subtotal, 0)
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const payload = {
      customer_name: 'Kasir',
      customer_phone: undefined,
      order_type: 'langsung',
      payment_method: 'QRIS',
      promo_code: undefined,
      items: cart.map((item) => ({
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        custom_notes: item.notes,
      })),
    };

    // Simulasi checkout (dalam proyek nyata ini akan memanggil API backend)
    alert('Pesanan Baru Berhasil Dibuat!');
    // Tutup halaman ini atau navikasi ke struk
    // window.location.href = `/kasir/pembayaran/${orderId}`;
  };

  return (
    <div className="kasir-pesanan-baru">
      <h1>Pesanan Baru</h1>

      {cart.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Belum ada item dalam keranjang
        </p>
      )}

      <div className="menu-categories">
        <h3>Kategori</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <div
              key={category}
              style={{
                padding: '6px 12px',
                background: '#f0f0f0',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '4px',
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="menu-items">
        <h3>Menu</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                background: 'white',
                transition: 'transform 0.2s',
              }}
              onMouseOver={{ style: { transform: 'translateY(-4px)' }}}
              onMouseOut={{ style: { transform: 'translateY(0)' }}}
            >
              <h4 style={{ fontSize: '14px', margin: '8px 0', color: '#333' }}>
                {item.name}
              </h4>
              <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>
                Rp {item.price}
              </p>
              <button
                style={{
                  margin: '8px auto 0',
                  padding: '4px 8px',
                  background: '#007aff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
                onClick={() => handleAddToCart(item)}
              >
                Tambah
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-summary">
        <h3>Keranjang Belanja</h3>
        {cart.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Menu</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Qty</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Harga</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} style={{ textAlign: 'left' }}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {item.menuItemName}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'red',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      -
                    </button>{' '}
                    {item.quantity}
                    <button
                      onClick={() => handleAddToCart(item as MenuItem)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'green',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginLeft: '4px',
                      }}
                    >
                      +
                    </button>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <RupiahText amount={item.price} small />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <RupiahText amount={item.subtotal} small />
                  </td>
                </tr>
              ))
            </tbody>
          </table>
        ) : (
          <p>Keranjang kosong</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <span>Total</span>
          <strong>
            <RupiahText amount={total} />
          </strong>
        </div>
      </div>

      <div className="checkout-actions" style={{ marginTop: '24px' }}>
        <button
          className="btn-confirm"
          style={{
            width: '100%',
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
