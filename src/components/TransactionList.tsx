// src/components/TransactionList.tsx
"use client";

import Link from "next/link";
import { type Transaction } from "@/types";
import formatCurrency from "@/lib/formatCurrency";
import EmptyState from "./EmptyState";
import InfoCard from "./InfoCard";
import DecorativeFiller from "./DecorativeFiller";

const categoryColors: { [key: string]: string } = {
  // Expense
  Makanan: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Transportasi:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  Tagihan: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  Hiburan:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  Belanja: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  "Kebutuhan":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  Kesehatan:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  Pendidikan:
    "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  // Income
  Gaji: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  Freelance:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
  Hadiah:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  Investasi:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  Penjualan:
    "bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300",
  // General
  "Lainnya": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  "Lain-lain":
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return <span className="text-gray-400">-</span>;
  const colorClass =
    categoryColors[category] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}
    >
      {category}
    </span>
  );
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const hasTransactions = transactions.length > 0;

  return (
    <div className="table-container">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          📋 Daftar Transaksi
        </h2>
      </div>
      {hasTransactions ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[450px] sm:min-w-[600px]">
            <thead>
              <tr className="table-header">
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm">Tanggal</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm">Deskripsi</th>
                <th className="py-3 px-3 sm:px-4 text-left text-xs sm:text-sm hidden sm:table-cell">Kategori</th>
                <th className="py-3 px-3 sm:px-4 text-right text-xs sm:text-sm">Jumlah</th>
                <th className="py-3 px-3 sm:px-4 text-center text-xs sm:text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="table-row"
                >
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-gray-800 dark:text-gray-200 max-w-[100px] sm:max-w-none truncate sm:whitespace-normal text-xs sm:text-sm">
                    {t.description}
                  </td>
                  <td className="py-3 px-3 sm:px-4 hidden sm:table-cell">
                    <CategoryBadge category={t.category} />
                  </td>
                  <td
                    className={`py-3 px-3 sm:px-4 font-semibold text-right text-xs sm:text-sm whitespace-nowrap ${
                      t.amount < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex gap-1.5 sm:gap-2 justify-center">
                      <button
                        onClick={() => onEdit(t)}
                        className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors whitespace-nowrap"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors whitespace-nowrap"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="animate-slide-up space-y-6">
          <EmptyState
            icon="📋"
            title="Tidak Ada Transaksi"
            description="Tidak ada transaksi yang cocok dengan filter Anda atau belum ada transaksi."
            action={
              <Link href="/transactions" className="btn-primary inline-flex items-center gap-2">
                <span>➕</span><span>Tambah Transaksi</span>
              </Link>
            }
          />
          
          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              type="tip"
              title="💡 Tips"
              content="Catat setiap transaksi segera untuk menghindari lupa"
            />
            <InfoCard
              type="info"
              title="📊 Kategori"
              content="Gunakan kategori untuk memisahkan pemasukan dan pengeluaran"
            />
            <InfoCard
              type="insight"
              title="📈 Filter"
              content="Gunakan filter untuk melihat transaksi berdasarkan periode atau kategori"
            />
          </div>
          
          {/* Decorative filler */}
          <DecorativeFiller variant="dots" height="sm" />
        </div>
      )}
    </div>
  );
}
