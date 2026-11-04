// API kasir : Kumpulan fungsi pemanggil endpoint backend /api/v1/kasir
// Sistem Manajemen Pesanan Restoran/Kafe - EtaCafe

import { request } from './client';
import type { Order } from '../types';

export interface KasirReceiptItem {
  nama_menu: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  catatan?: string | null;
}

export interface KasirReceipt {
  restoran: string;
  alamat: string;
  no_pesanan: string;
  tipe_pesanan: string;
  meja: string;
  pelanggan: string;
  waktu_pesan: string;
  waktu_konfirmasi?: string | null;
  items: KasirReceiptItem[];
  subtotal: number;
  diskon: number;
  kode_promo?: string | null;
  pajak_10_persen: number;
  biaya_layanan_5_persen: number;
  total_bayar: number;
  metode_pembayaran: string;
  status_pembayaran: string;
  status_pesanan: string;
}

export async function getPendingOrders(): Promise<Order[]> {
  return request<Order[]>('/kasir/orders/queue');
}

export async function getOrderDetail(orderId: number | string): Promise<Order> {
  return request<Order>(`/kasir/orders/${orderId}`);
}

export async function confirmOrder(orderId: number | string): Promise<Order> {
  return request<Order>(`/kasir/orders/${orderId}/confirm`, {
    method: 'POST',
  });
}

export async function getReceipt(orderId: number | string): Promise<KasirReceipt> {
  return request<KasirReceipt>(`/kasir/orders/${orderId}/receipt`);
}

export const KasirAPI = {
  getPendingOrders,
  getOrderDetail,
  confirmOrder,
  getReceipt,
};

export default KasirAPI;
