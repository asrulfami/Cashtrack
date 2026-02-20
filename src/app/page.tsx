"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import SummaryCard from "@/components/SummaryCard";
import CashFlowChart, { type ChartData } from "@/components/CashFlowChart";
import TransactionTable from "@/components/TransactionTable";
import { type Transaction } from "@/types";
import formatCurrency from "@/lib/formatCurrency";
import { transactions as dummyTransactions } from "@/data/transactions";
import AddTransactionModal from "@/components/AddTransactionModal";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(dummyTransactions);
      setLoading(false);
    }, 1000); // Simulate 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const {
    totalBalance,
    incomeThisMonth,
    expenseThisMonth,
    chartData,
    recentTransactions,
  } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let balance = 0;
    let income = 0;
    let expense = 0;
    const monthlyData: { [key: string]: ChartData } = {};

    transactions.forEach((t) => {
      balance += t.amount;
      const tDate = new Date(t.date);
      
      if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        if (t.amount > 0) income += t.amount;
        else expense += Math.abs(t.amount);
      }

      const monthKey = tDate.toLocaleString("id-ID", { month: 'short', year: 'numeric' });
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }
      if (t.amount > 0) monthlyData[monthKey].income += t.amount;
      else monthlyData[monthKey].expense += Math.abs(t.amount);
    });

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      totalBalance: balance,
      incomeThisMonth: income,
      expenseThisMonth: expense,
      chartData: Object.values(monthlyData),
      recentTransactions: sortedTransactions.slice(0, 5),
    };
  }, [transactions]);

  const handleAddTransaction = (
    newTransactionData: Omit<Transaction, "id">
  ) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      ...newTransactionData,
    };
    setTransactions([...transactions, newTransaction]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 grid gap-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </div>
        {/* Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Saldo"
            value={formatCurrency(totalBalance)}
          />
          <Link href="/transactions?type=income">
            <SummaryCard
              title="Pemasukan Bulan Ini"
              value={formatCurrency(incomeThisMonth)}
              className="cursor-pointer transition-transform hover:scale-105"
            />
          </Link>
          <Link href="/transactions?type=expense">
            <SummaryCard
              title="Pengeluaran Bulan Ini"
              value={formatCurrency(expenseThisMonth)}
              className="cursor-pointer transition-transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Grafik */}
        <CashFlowChart data={chartData} />

        {/* Tabel Transaksi */}
        <TransactionTable transactions={recentTransactions} showViewAll={true} />
      </main>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </>
  );
}
