import { type Transaction } from "@/types";
import formatCurrency from "@/lib/formatCurrency";
import Link from "next/link";

// Definisikan tipe untuk props yang diterima komponen
type TransactionTableProps = {
  transactions: Transaction[];
  title?: string;
  showViewAll?: boolean;
};

export default function TransactionTable({
  transactions,
  title = "Transaksi Terbaru",
  showViewAll = false,
}: TransactionTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 overflow-x-auto border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        {showViewAll && (
          <Link
            href="/transactions"
            className="text-sm text-blue-500 hover:underline"
          >
            View All
          </Link>
        )}
      </div>
      <table className="w-full min-w-[400px] text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
            <th className="py-2 px-3 font-semibold">Tanggal</th>
            <th className="py-2 px-3 font-semibold">Deskripsi</th>
            <th className="py-2 px-3 font-semibold">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="py-3 px-3">{t.date}</td>
              <td className="py-3 px-3">{t.description}</td>
              <td
                className={`py-3 px-3 font-semibold ${
                  t.amount < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {formatCurrency(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
