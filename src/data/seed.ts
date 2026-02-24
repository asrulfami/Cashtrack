import { type Transaction } from "@/types";

/**
 * Data transaksi contoh untuk "menyemai" aplikasi.
 * Ini akan dimuat jika tidak ada data di localStorage.
 */
export const seedTransactions: Omit<Transaction, "id">[] = [
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 2, 5)).toISOString().split("T")[0],
    description: "Gaji Bulan Lalu",
    category: "Gaji",
    amount: 7500000,
    type: "income",
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 2, 10)).toISOString().split("T")[0],
    description: "Belanja Kebutuhan Pokok",
    category: "Kebutuhan",
    amount: -1800000,
    type: "expense",
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 1, 5)).toISOString().split("T")[0],
    description: "Gaji Bulan Ini",
    category: "Gaji",
    amount: 7500000,
    type: "income",
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 1, 8)).toISOString().split("T")[0],
    description: "Tagihan Internet & Listrik",
    category: "Tagihan",
    amount: -850000,
    type: "expense",
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth() - 1, 15)).toISOString().split("T")[0],
    description: "Makan di Luar",
    category: "Makanan",
    amount: -300000,
    type: "expense",
  },
  {
    date: new Date(new Date().setMonth(new Date().getMonth(), 1)).toISOString().split("T")[0],
    description: "Penjualan Barang Bekas",
    category: "Lain-lain",
    amount: 450000,
    type: "income",
  },
    {
    date: new Date(new Date().setMonth(new Date().getMonth(), 2)).toISOString().split("T")[0],
    description: "Beli Kado Ulang Tahun",
    category: "Hadiah",
    amount: -500000,
    type: "expense",
  },
];
