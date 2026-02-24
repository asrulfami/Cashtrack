'use client';

import useSWR from 'swr';
import StatCard from '@/components/StatCard';
import CashFlowChart, { type ChartData } from '@/components/CashFlowChart';
import CategoryChart from '@/components/CategoryChart';
import formatCurrency from '@/lib/formatCurrency';
import FilterBar from '@/components/FilterBar';
import { useMemo, useState } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReportsPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [q, setQ] = useState('');
  const [type, setType] = useState<'income' | 'expense' | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (range.from) p.set('from', range.from);
    if (range.to) p.set('to', range.to);
    if (q) p.set('q', q);
    if (type) p.set('type', type);
    if (categoryId) p.set('categoryId', categoryId);
    return p.toString();
  }, [range, q, type, categoryId]);

  const { data } = useSWR(`/api/transactions?${qs}`, fetcher);
  const transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category?: { id: string; name: string } | null;
  }> = Array.isArray(data) ? data : [];

  const { totalIncome, totalExpense, netIncome, cashflow, categories } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const monthly: Record<string, ChartData> = {};
    const byCategory: Record<string, number> = {};
    for (const t of transactions) {
      if (t.amount > 0) income += t.amount;
      else expense += Math.abs(t.amount);
      const d = new Date(t.date);
      const key = d.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      if (!monthly[key]) monthly[key] = { month: key, income: 0, expense: 0 };
      if (t.amount > 0) monthly[key].income += t.amount;
      else monthly[key].expense += Math.abs(t.amount);
      if (t.amount < 0) {
        const name = t.category?.name || 'Lainnya';
        byCategory[name] = (byCategory[name] || 0) + Math.abs(t.amount);
      }
    }
    const cashflowArr = Object.values(monthly).sort((a, b) => {
      const [am, ay] = a.month.split(' ');
      const [bm, by] = b.month.split(' ');
      const ai = new Date(`${am} 1, ${ay}`).getTime();
      const bi = new Date(`${bm} 1, ${by}`).getTime();
      return ai - bi;
    });
    const categoryArr = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    return {
      totalIncome: income,
      totalExpense: expense,
      netIncome: income - expense,
      cashflow: cashflowArr,
      categories: categoryArr,
    };
  }, [transactions]);

  const onFilterChange = (v: { range: { from?: string; to?: string }; q: string; type?: 'income' | 'expense'; categoryId?: string }) => {
    setRange(v.range || {});
    setQ(v.q || '');
    setType(v.type);
    setCategoryId(v.categoryId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            📊 Laporan Keuangan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Analisis pemasukan dan pengeluaran Anda
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onChange={onFilterChange} showType showCategory />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard title="Total Pemasukan" value={formatCurrency(totalIncome)} />
        <StatCard title="Total Pengeluaran" value={formatCurrency(totalExpense)} />
        <StatCard
          title="Pendapatan Bersih"
          value={formatCurrency(netIncome)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            📈 Arus Kas Bulanan
          </h3>
          <CashFlowChart data={cashflow} />
        </div>
        <div className="lg:col-span-2 card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            🥧 Distribusi Pengeluaran
          </h3>
          <CategoryChart data={categories} />
        </div>
      </div>
    </div>
  );
}
