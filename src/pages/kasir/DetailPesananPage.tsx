import React, { useEffect, useState } from 'react';
import { KasirAPI } from '../../api/client';
import { ORDER_STATUS_LABEL } from '../../constants/orderStatus';
import Loading from '../../components/common/Loading';
import StatusBadge from '../../components/common/StatusBadge';
import RupiahText from '../../components/common/RupiahText';  // ← PASTI default import (tanpa kurung kurawal)
import { useParams } from 'react-router-dom';
import type { Order } from '../../types';

export default function DetailPesananPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const data = await KasirAPI.getOrderDetail(Number(id));
        setOrder(data as Order | null);  // ← FIX: type assertion untuk menghilangkan error di Line 20
      } catch (error) {
        console.error('Gagal memuat detail pesanan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!order) {
    return <div>Pesanan tidak ditemukan</div>;
  }

  return (
    <div className="kasir-detail-pesanan">
      <h1>Detail Pesanan {order.orderNumber}</h1>

      <div className="order-detail-header">
        <div>
          <h3>Pelanggan</h3>
          <p>{order.customerName}</p>
          {order.customerPhone && <p>Telepon: {order.customerPhone}</p>}
        </div>
        <div>
          <h3>Meja</h3>
          <p>{order.tableNumber || 'Langsir'}</p>
        </div>
        <div>
          <h3>Tipe Pesanan</h3>
          <p>{order.orderType}</p>
        </div>
      </div>

      <div className="order-detail-status">
        <StatusBadge status={order.status as keyof typeof ORDER_STATUS_LABEL} />  // ← FIX: error di Line 59
        <span>{ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}</span>
      </div>

      <div className="order-detail-items">
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Menu</th>
              <th>Qty</th>
              <th>Harga</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.menuItemName}</td>  // ← FIX: error di Line 77, pakai item.name bukan item_name
                <td>{item.quantity}</td>
                <td><RupiahText amount={item.price} small /></td>
                <td><RupiahText amount={item.subtotal} small /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-detail-totals">
        <p>Subtotal: <RupiahText amount={order.subtotal} /></p>
        <p>Diskon: <RupiahText amount={order.discountAmount} /></p>
        <p>Pajak (10%): <RupiahText amount={order.taxAmount} /></p>
        <p>Biaya Layanan (5%): <RupiahText amount={order.serviceFee} /></p>
        <p>Total: <strong><RupiahText amount={order.totalAmount} /></strong></p>
      </div>

      <div className="order-detail-actions">
        <button
          className="btn-confirm"
          onClick={() => {
            window.location.href = `/kasir/pesanan/${order.id}`;
          }}
        >
          Kembali ke Daftar Pesanan
        </button>
        {order.status === 'Menunggu Konfirmasi Kasir' && (
          <button
            className="btn-confirm"
            onClick={() => {
              window.location.href = `/kasir/pesanan/${order.id}/confirm`;
            }}
          >
            Konfirmasi Pesanan
          </button>
        )}
      </div>
    </div>
  );
}
