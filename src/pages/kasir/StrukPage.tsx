import React, { useEffect, useState } from 'react';
import { KasirAPI } from '../../api/client';
import { ORDER_STATUS_LABEL } from '../../constants/orderStatus';
import RupiahText from '../../components/common/RupiahText';
import { useParams } from 'react-router-dom';
import type { Order } from '../../types';

export default function StrukPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const data = await KasirAPI.getReceipt(Number(id));
        setOrder(data);
      } catch (error) {
        console.error('Gagal memuat struk:', error);
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

  // Pastikan struk hanya bisa dicetak setelah konfirmasi
  if (order.status !== 'DIKONFIRMASI' && order.status !== 'SEDANG_DIPROSES') {
    return (
      <div className="kasir-struk">
        <h1>Struk Transaksi</h1>
        <p>Pesanan {order.orderNumber} belum dapat dicetak struk.</p>
        <p>Struk hanya dapat dicetak setelah pesanan dikonfirmasi oleh Kasir.</p>
        <button
          className="btn-confirm"
          onClick={() => {
            window.location.href = `/kasir/pesanan/${order.id}`;
          }}
        >
          Kembali ke Daftar Pesanan
        </button>
      </div>
    );
  }

  return (
    <div className="kasir-struk">
      <h1>Struk Transaksi</h1>

      <div className="receipt-header">
        <div>
          <h3>RestoFlow Restoran & Kafe</h3>
          <p>Jl. Perintis Kemerdekaan KM. 10 Tamalanrea, Makassar</p>
        </div>
        <div>
          <p>No. Pesanan: {order.orderNumber}</p>
          <p>Tanggal: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : '-'}</p>
        </div>
      </div>

      <div className="receipt-customer-info">
        <p>Pelanggan: {order.customerName}</p>
        {order.customerPhone && <p>Telepon: {order.customerPhone}</p>}
        <p>Meja: {order.tableNumber || 'Langsir Kasir'}</p>
      </div>

      <div className="receipt-items">
        <h3>Item</h3>
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
            {order.items.map((it) => (
              <tr key={it.id}>
                <td>{it.item_name}</td>
                <td>{it.quantity}</td>
                <td><RupiahText amount={it.price} small /></td>
                <td><RupiahText amount={it.subtotal} small /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="receipt-totals">
        <p>Subtotal: <RupiahText amount={order.subtotal} /></p>
        <p>Diskon: <RupiahText amount={order.discountAmount} /></p>
        <p>Pajak (10%): <RupiahText amount={order.taxAmount} /></p>
        <p>Biaya Layanan (5%): <RupiahText amount={order.serviceFee} /></p>
        <hr />
        <p>Total Bayar: <strong><RupiahText amount={order.totalAmount} /></strong></p>
      </div>

      <div className="receipt-payment">
        <p>Metode Pembayaran: {order.payment_method}</p>
        <p>Status Pembayaran: {order.payment_status}</p>
      </div>

      <div className="receipt-status">
        <p>Status Pesanan: <StatusBadge status={order.status} /></p>
        <p>Waktu Konfirmasi: {order.confirmedAt ? new Date(order.confirmedAt).toLocaleString('id-ID') : 'Belum dikonfirmasi'}</p>
      </div>

      <div className="receipt-actions">
        <button
          className="btn-confirm"
          onClick={() => {
            window.print();
          }}
        >
          Cetak Struk
        </button>
        <button
          className="btn-confirm"
          onClick={() => {
            window.location.href = `/kasir/pesanan/${order.id}`;
          }}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
