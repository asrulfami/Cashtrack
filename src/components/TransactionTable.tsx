import { type Transaction } from "@/types";
import formatCurrency from "@/lib/formatCurrency";
import Link from "next/link";

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
    <div className="table-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 px-4 pt-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
          📋 {title}
        </h3>
        {showViewAll && (
          <Link
            href="/transactions"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap"
          >
            Lihat Semua →
          </Link>
        )}
      </div>
      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] sm:min-w-[600px]">
            <thead>
              <tr className="table-header">
                <th className="py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm whitespace-nowrap">Tanggal</th>
                <th className="py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm min-w-[120px] sm:min-w-[200px]">Deskripsi</th>
                <th className="py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm whitespace-nowrap">Kategori</th>
                <th className="py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-right whitespace-nowrap">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="table-row">
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 max-w-[150px] sm:max-w-none truncate sm:whitespace-normal">
                    {t.description}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {t.category && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {t.category}
                      </span>
                    )}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Tidak ada transaksi untuk ditampilkan.
          </p>
        </div>
      )}
    </div>
  );
}
