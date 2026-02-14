import SummaryCard from "@/components/SummaryCard";
import CashFlowChart from "@/components/CashFlowChart";
import TransactionTable from "@/components/TransactionTable";

export default function DashboardPage() {
  return (
    <main className="p-4 sm:p-6 grid gap-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Saldo" value="Rp 10.000.000" />
        <SummaryCard title="Pemasukan Bulan Ini" value="Rp 5.000.000" />
        <SummaryCard title="Pengeluaran Bulan Ini" value="Rp 2.000.000" />
      </div>

      {/* Grafik */}
      <CashFlowChart />

      {/* Tabel Transaksi */}
      <TransactionTable />
    </main>
  );
}
