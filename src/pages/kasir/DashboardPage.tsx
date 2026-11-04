import React, { useEffect, useState } from 'react'
import { KasirAPI } from '../../api/client'
import Loading from '../../components/common/Loading'
import RupiahText from '../../components/common/RupiahText'
import type { Order } from '../../types'

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        const data = await KasirAPI.getPendingOrders()

        // Pastikan data berupa array
        if (Array.isArray(data)) {
          setOrders(data)
        }
      } catch (error) {
        console.error('Gagal memuat antrean pesanan:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  return (
    <div className="kasir-dashboard">
      <h1>Dashboard Kasir</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Antrean Pesanan</h3>
          <p>{orders.length} menunggu konfirmasi</p>
        </div>
      </div>

      <div className="orders-list">
        <h3>Daftar Pesanan Menunggu Konfirmasi</h3>

        {loading ? (
          <p>Memuat...</p>
        ) : orders.length === 0 ? (
          <p>Tidak ada pesanan menunggu konfirmasi</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <div>
                  <strong>No. Pesanan:</strong> {order.orderNumber}
                </div>
                <div>
                  <strong>Pelanggan:</strong> {order.customerName}
                </div>
                <div>
                  <strong>Meja:</strong> {order.tableNumber || 'Langsir'}
                </div>
                <div>
                  <strong>Total:</strong> <RupiahText amount={order.totalAmount} />
                </div>
                <div>
                  <strong>Status:</strong> {order.status}
                </div>
                <button
                  className="btn-confirm"
                  onClick={() => {
                    window.location.href = `/kasir/pesanan/${order.id}`
                  }}
                >
                  Lihat Detail
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
