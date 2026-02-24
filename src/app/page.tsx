"use client";

import Link from "next/link";
import EnhancedStatCard from "@/components/EnhancedStatCard";
import CashFlowChart from "@/components/CashFlowChart";
import TransactionTable from "@/components/TransactionTable";
import formatCurrency from "@/lib/formatCurrency";
import CategoryChart from "@/components/CategoryChart";
import BudgetBarChart from "@/components/BudgetBarChart";
import EnhancedDashboardFilters from "@/components/EnhancedDashboardFilters";
import { useDashboard } from "@/context/DashboardContext";
import { Wallet, TrendingUp, TrendingDown, Package, PieChart, DollarSign } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import InfoCard from "@/components/InfoCard";
import DecorativeFiller from "@/components/DecorativeFiller";

export default function DashboardPage() {
  const {
    loading,
    selectedCategory,
    setSelectedCategory,
    filters,
    chartData,
    categoryData,
    budgetVsActualData,
    assetDistributionData,
    investmentDistributionData,
    totalBalance,
    incomeThisPeriod,
    expenseThisPeriod,
    totalAssets,
    totalInvestments,
    filteredTransactions,
  } = useDashboard();

  const recentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Dynamic title based on transaction type filter
  const getCategoryChartTitle = () => {
    switch (filters.transactionType) {
      case "income":
        return "📈 Kategori Pemasukan";
      case "expense":
        return "📉 Kategori Pengeluaran";
      default:
        return "🥧 Kategori Transaksi";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-50 animate-pulse" />
            <div className="relative text-6xl mb-6 animate-bounce-subtle">⏳</div>
          </div>
          <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header dengan gradient */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 shadow-2xl">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-28 h-28 sm:w-40 sm:h-40 bg-white/20 rounded-full blur-3xl animate-float-medium" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-4 mb-2">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm">
              <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white neon-glow">
                📊 Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium mt-1 hidden xs:block">
                Ringkasan keuangan Anda dengan filter interaktif
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Filters */}
      <EnhancedDashboardFilters />

      {/* Stats Grid dengan Enhanced Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 auto-rows-fr">
        <EnhancedStatCard
          title="Total Saldo"
          value={totalBalance}
          icon={<Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />}
        />
        <Link href="/transactions?type=income" className="block">
          <EnhancedStatCard
            title="Pemasukan Periode Ini"
            value={incomeThisPeriod}
            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />}
            className="hover:shadow-2xl hover:shadow-green-500/30"
          />
        </Link>
        <Link href="/transactions?type=expense" className="block">
          <EnhancedStatCard
            title="Pengeluaran Periode Ini"
            value={expenseThisPeriod}
            icon={<TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />}
            className="hover:shadow-2xl hover:shadow-red-500/30"
          />
        </Link>
        <EnhancedStatCard
          title="Total Aset"
          value={totalAssets}
          icon={<Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />}
        />
        <EnhancedStatCard
          title="Nilai Investasi"
          value={totalInvestments}
          icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      {/* Charts Section dengan Glass Cards */}
      <div className="space-y-4 sm:space-y-6">
        {/* Row 1: Cash Flow & Transaction Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="glass-card-hover p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                📈 Arus Kas (Interaktif)
              </h3>
            </div>
            <div className="h-56 sm:h-64 md:h-72">
              <CashFlowChart
                data={chartData}
                onLineClick={(type) => {
                  console.log("Line clicked:", type);
                }}
                interactive={true}
              />
            </div>
          </div>

          <div className="glass-card-hover p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {getCategoryChartTitle()}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {filters.transactionType === "all" 
                    ? "Menampilkan pemasukan & pengeluaran" 
                    : `Menampilkan ${filters.transactionType === "income" ? "pemasukan" : "pengeluaran"}`}
                </p>
                {selectedCategory && (
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                    • Filter: {selectedCategory}
                  </p>
                )}
              </div>
            </div>
            <div className="h-56 sm:h-64 md:h-72">
              <CategoryChart
                data={categoryData}
                onCategoryClick={setSelectedCategory}
                selectedCategory={selectedCategory}
                interactive={true}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Asset & Investment Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="glass-card-hover p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                📦 Distribusi Aset
              </h3>
            </div>
            <div className="h-56 sm:h-64 md:h-72">
              <CategoryChart data={assetDistributionData} interactive={false} />
            </div>
          </div>

          <div className="glass-card-hover p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                📈 Portofolio Investasi
              </h3>
            </div>
            <div className="h-56 sm:h-64 md:h-72">
              <CategoryChart data={investmentDistributionData} interactive={false} />
            </div>
          </div>
        </div>

        {/* Row 3: Budget vs Actual */}
        {budgetVsActualData.length > 0 && (
          <div className="glass-card-hover p-4 sm:p-6 rounded-xl sm:rounded-2xl animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  💰 Budget vs Realisasi
                </h3>
                {selectedCategory && (
                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                    • Filter: {selectedCategory}
                  </p>
                )}
              </div>
            </div>
            <div className="h-72 sm:h-80 md:h-96">
              <BudgetBarChart
                data={budgetVsActualData}
                onCategoryClick={setSelectedCategory}
                selectedCategory={selectedCategory}
                interactive={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 ? (
        <TransactionTable transactions={recentTransactions} showViewAll={true} />
      ) : (
        <div className="animate-slide-up">
          <EmptyState
            icon="📋"
            title="Belum Ada Transaksi"
            description="Mulai catat transaksi Anda untuk melihat ringkasan di sini"
            action={
              <Link href="/transactions" className="btn-primary inline-flex items-center gap-2">
                <span>➕</span><span>Tambah Transaksi</span>
              </Link>
            }
          />
          {/* Decorative filler below empty state */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <InfoCard
              type="tip"
              content="Catat pemasukan dan pengeluaran Anda secara rutin untuk mendapatkan gambaran keuangan yang akurat"
            />
            <InfoCard
              type="insight"
              content="Dengan filter kategori, Anda bisa melihat pengeluaran berdasarkan kategori tertentu"
            />
            <InfoCard
              type="goal"
              content="Atur budget untuk mengontrol pengeluaran dan mencapai target keuangan Anda"
            />
          </div>
        </div>
      )}

      {/* Decorative section when there's extra space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <InfoCard
          type="security"
          title="🔒 Data Aman"
          content="Data keuangan Anda disimpan dengan enkripsi dan hanya dapat diakses oleh Anda"
        />
        <InfoCard
          type="quick"
          title="⚡ Akses Cepat"
          content="Gunakan sidebar untuk navigasi cepat ke halaman transaksi, aset, dan investasi"
        />
      </div>

      {/* Decorative filler at bottom */}
      <DecorativeFiller variant="waves" height="sm" />
    </div>
  );
}
