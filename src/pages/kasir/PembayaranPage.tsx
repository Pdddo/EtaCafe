import React, { useEffect, useState } from 'react'
import { KasirAPI } from '../../api/client'
import { ORDER_STATUS_LABEL } from '../../constants/orderStatus'
import Loading from '../../components/common/Loading'
import RupiahText from '../../components/common/RupiahText'
import { useParams } from 'react-router-dom'
import type { Order } from '../../types'

export default function PembayaranPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Kartu' | 'Tunai'>('QRIS')
  const [paymentStatus, setPaymentStatus] = useState<string>('')

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      try {
        const { data } = await KasirAPI.getOrderDetail(Number(id)) as unknown as { data: Order | null }
        // Cast data to Order to satisfy strict TypeScript
        const orderData = data as Order | null
        
        if (orderData) {
          setOrder(orderData)
          setPaymentStatus(orderData.paymentStatus || '')
        }
      } catch (error) {
        console.error('Gagal memuat pesanan:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  if (loading) {
    return <Loading />
  }

  if (!order) {
    return <div>Pesanan tidak ditemukan</div>
  }

  return (
    <div className="kasir-pembayaran">
      <h1>Pembayaran Pesanan {order.orderNumber}</h1>

      <div className="payment-methods">
        <div className="payment-method">
          <input
            type="radio"
            id="qris"
            name="paymentMethod"
            value="QRIS"
            checked={paymentMethod === 'QRIS'}
            onChange={() => setPaymentMethod('QRIS')}
          />
          <label htmlFor="qris">
            <span>QRIS</span>
            <span>— No fee</span>
          </label>
        </div>

        <div className="payment-method">
          <input
            type="radio"
            id="kartu"
            name="paymentMethod"
            value="Kartu"
            checked={paymentMethod === 'Kartu'}
            onChange={() => setPaymentMethod('Kartu')}
          />
          <label htmlFor="kartu">
            <span>Kartu Debit/Kredit</span>
            <span>— 5% biaya</span>
          </label>
        </div>

        <div className="payment-method">
          <input
            type="radio"
            id="tunai"
            name="paymentMethod"
            value="Tunai"
            checked={paymentMethod === 'Tunai'}
            onChange={() => setPaymentMethod('Tunai')}
          />
          <label htmlFor="tunai">
            <span>Tunai</span>
            <span>— Tanpa biaya</span>
          </label>
        </div>
      </div>

      <div className="payment-summary">
        <p>Total Bayar: <strong><RupiahText amount={order.totalAmount} /></strong></p>
        <p>Metode Pembayaran: {paymentMethod}</p>
        <p>Status: {order.status}</p>
      </div>

      <div className="payment-actions">
        <button
          className="btn-confirm"
          onClick={() => {
            // Simulate payment
            setPaymentStatus('Berhasil (Simulasi)')
            // In a real app, this would call API to confirm
            window.location.href = `/kasir/pesanan/${order.id}/struk`
          }}
        >
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  )
}
