"use client";

import { useState, useMemo, useRef } from "react";
import useSWR from "swr";
import { useToast } from "@/hooks/useToast";
import { useBudgets } from "@/context/BudgetContext";
import { useTransactions } from "@/context/TransactionContext";
import BudgetFormModal, { type BudgetFormState, initialBudgetFormState } from "@/components/BudgetFormModal";
import BudgetProgress from "@/components/BudgetProgress";
import formatCurrency from "@/lib/formatCurrency";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type CategoryType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
};

export default function SettingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("expense");
  const [importing, setImporting] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState<BudgetFormState>(initialBudgetFormState);
  const [isBudgetSubmitting, setIsBudgetSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastComponent } = useToast();
  const { budgets, addBudget, updateBudget, deleteBudget, refresh: refreshBudgets } = useBudgets();
  const { transactions } = useTransactions();

  const { data, mutate } = useSWR("/api/categories", fetcher);
  const categories: Category[] = Array.isArray(data) ? data : [];

  // Calculate actual spending per category for current month
  const actualSpendingByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const spending: Record<string, number> = {};
    let totalExpense = 0;
    
    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        if (t.amount < 0) { // Expense
          const amount = Math.abs(t.amount);
          totalExpense += amount;
          if (t.category) {
            spending[t.category] = (spending[t.category] || 0) + amount;
          }
        }
      }
    });
    
    spending["_total"] = totalExpense;
    return spending;
  }, [transactions]);

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "income"),
    [categories]
  );
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense"),
    [categories]
  );

  const openForm = (row?: Category) => {
    if (row) {
      setEditing(row);
      setName(row.name);
      setType(row.type);
    } else {
      setEditing(null);
      setName("");
      setType("expense");
    }
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, type };
    if (editing) {
      const res = await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        mutate();
        showToast("Kategori berhasil diperbarui!", "success");
      } else {
        showToast("Gagal memperbarui kategori.", "error");
      }
    } else {
      const res = await fetch(`/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        mutate();
        showToast("Kategori berhasil ditambahkan!", "success");
      } else {
        showToast("Gagal menambahkan kategori.", "error");
      }
    }
    setShowForm(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini? Transaksi yang menggunakan kategori ini akan tetap ada.")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      mutate();
      showToast("Kategori berhasil dihapus!", "success");
    } else {
      showToast("Gagal menghapus kategori.", "error");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      showToast("File harus berformat CSV", "error");
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import/transactions", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        showToast(`Berhasil mengimpor ${result.imported} transaksi!`, "success");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        showToast(`Error: ${result.error}`, "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan saat mengimpor data.", "error");
    } finally {
      setImporting(false);
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBudgetSubmitting(true);
    
    try {
      const payload = {
        categoryId: budgetForm.categoryId || null,
        amount: parseInt(budgetForm.amount),
        period: budgetForm.period,
      };

      if (budgetForm.id) {
        await updateBudget(budgetForm.id, payload);
        showToast("Budget berhasil diperbarui!", "success");
      } else {
        await addBudget(payload);
        showToast("Budget berhasil ditambahkan!", "success");
      }
      
      setShowBudgetForm(false);
      setBudgetForm(initialBudgetFormState);
    } catch (error: any) {
      showToast(error.message || "Gagal menyimpan budget", "error");
    } finally {
      setIsBudgetSubmitting(false);
    }
  };

  const handleEditBudget = (budget: any) => {
    setBudgetForm({
      id: budget.id,
      categoryId: budget.categoryId || "",
      amount: String(budget.amount),
      period: budget.period,
    });
    setShowBudgetForm(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm("Hapus budget ini?")) return;
    try {
      await deleteBudget(id);
      showToast("Budget berhasil dihapus!", "success");
    } catch (error) {
      showToast("Gagal menghapus budget", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          ⚙️ Pengaturan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola kategori dan pengaturan aplikasi
        </p>
      </div>

      {/* Toast */}
      {ToastComponent}

      {/* Import Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">📥 Impor Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Impor transaksi dari file CSV
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportFile}
              disabled={importing}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className={`btn-secondary flex items-center gap-2 cursor-pointer ${importing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {importing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mengimpor...
                </>
              ) : (
                <>
                  <span>📁</span>
                  <span>Pilih File CSV</span>
                </>
              )}
            </label>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Format CSV yang didukung:</strong>
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
            <li>• Kolom wajib: <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">Tanggal</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">Deskripsi</code>, <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">Jumlah</code></li>
            <li>• Kolom opsional: <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">Tipe</code> (income/expense), <code className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">Kategori</code></li>
            <li>• Format tanggal: YYYY-MM-DD atau DD/MM/YYYY</li>
          </ul>
        </div>
      </div>

      {/* Budget Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">💰 Budget</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kelola anggaran pengeluaran bulanan
            </p>
          </div>
          <button
            onClick={() => {
              setBudgetForm(initialBudgetFormState);
              setShowBudgetForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span><span className="hidden sm:inline">Tambah Budget</span>
          </button>
        </div>

        {/* Budget Progress List */}
        <div className="space-y-3 mb-6">
          {budgets.length > 0 ? (
            budgets.map((budget) => {
              const actualAmount = budget.categoryId 
                ? (actualSpendingByCategory[budget.category?.name || ""] || 0)
                : (actualSpendingByCategory["_total"] || 0);
              
              return (
                <div key={budget.id} className="relative">
                  <BudgetProgress
                    category={budget.category?.name}
                    budgetAmount={budget.amount}
                    actualAmount={actualAmount}
                    period={`${budget.period === 'monthly' ? 'Bulanan' : budget.period === 'quarterly' ? 'Triwulan' : 'Tahunan'}`}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEditBudget(budget)}
                      className="p-1.5 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                      aria-label="Edit budget"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      aria-label="Delete budget"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>📭 Belum ada budget. Tambahkan budget pertama Anda!</p>
            </div>
          )}
        </div>

        {/* Budget Info */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            💡 <strong>Tip:</strong> Budget membantu Anda mengontrol pengeluaran. 
            Sistem akan memberikan notifikasi jika pengeluaran mendekati atau melebihi budget.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">📁 Kategori</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kelola kategori pemasukan dan pengeluaran
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span><span className="hidden sm:inline">Tambah Kategori</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div>
            <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <span>💵</span> Pemasukan
            </h3>
            <div className="space-y-2">
              {incomeCategories.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(c)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {incomeCategories.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                  Belum ada kategori pemasukan.
                </p>
              )}
            </div>
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <span>💸</span> Pengeluaran
            </h3>
            <div className="space-y-2">
              {expenseCategories.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{c.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openForm(c)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {expenseCategories.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center">
                  Belum ada kategori pengeluaran.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {editing ? "✏️ Edit Kategori" : "➕ Tambah Kategori"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nama Kategori
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Contoh: Gaji, Makanan, dll"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Tipe
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CategoryType)}
                  className="input-field"
                >
                  <option value="income">💵 Pemasukan</option>
                  <option value="expense">💸 Pengeluaran</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <BudgetFormModal
          isOpen={showBudgetForm}
          onClose={() => {
            setShowBudgetForm(false);
            setBudgetForm(initialBudgetFormState);
          }}
          onSubmit={handleBudgetSubmit}
          form={budgetForm}
          setForm={setBudgetForm}
          categories={categories}
          isSubmitting={isBudgetSubmitting}
        />
      )}

      {/* User Profile Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span>👤</span> Profil Pengguna
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            D
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Demo User</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">demo@cashtrack.local</p>
          </div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Mode Demo:</strong> Profil pengguna saat ini dikelola secara otomatis. 
            Fitur edit profil akan tersedia di versi selanjutnya.
          </p>
        </div>
      </div>

      {/* App Info Section */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span>ℹ️</span> Tentang Aplikasi
        </h2>
        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">CashTrack</strong> adalah aplikasi
            pelacakan keuangan pribadi yang membantu Anda mengelola:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Transaksi pemasukan dan pengeluaran
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Aset dan depresiasi
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Portofolio investasi
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Laporan keuangan dan grafik
            </li>
          </ul>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Versi: <strong className="text-gray-700 dark:text-gray-300">0.1.0</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
