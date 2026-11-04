import React, { useEffect, useState } from 'react';
import { KasirAPI } from '../../api/client';
import { ORDER_STATUS_LABEL } from '../../constants/orderStatus';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import RupiahText from '../../components/common/RupiahText';
import type { Order } from '../../types';

export default function DaftarPesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await KasirAPI.getPendingOrders();
        setOrders(data as Order[]);  // Sudah benar dari sebelumnya
      } catch (error) {
        console.error('Gagal memuat daftar pesanan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="kasir-daftar-pesanan">
      <h1>Daftar Pesanan Masuk</h1>

      {orders.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Tidak ada pesanan masuk
        </p>
      )}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Meja</th>
              <th>Pelanggan</th>
              <th>Status</th>
              <th>Total</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.tableNumber || 'Langsir'}</td>
                <td>{order.customerName}</td>
                <td>
                  <StatusBadge status={order.status as keyof typeof ORDER_STATUS_LABEL} small />
                  <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                    {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}
                  </span>
                </td>
                <td>
                  <RupiahText amount={order.totalAmount} />
                </td>
                <td>
                  <button
                    className="btn-small"
                    onClick={() => {
                      window.location.href = `/kasir/pesanan/${order.id}`;
                    }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
