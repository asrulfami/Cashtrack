"use client";
import { useState, useMemo, useCallback, type FormEvent } from "react";
import useSWR from "swr";
import { type Transaction, type TransactionType } from "@/types";
import TransactionList from "@/components/TransactionList";
import TransactionFormModal, {
  initialFormState,
  type FormState,
  type FormErrors,
} from "@/components/TransactionFormModal";
import FilterBar from "@/components/FilterBar";
import { useToast } from "@/hooks/useToast";
import { SkeletonTable } from "@/components/Skeleton";
import formatCurrency from "@/lib/formatCurrency";
import EmptyState from "@/components/EmptyState";
import InfoCard from "@/components/InfoCard";
import DecorativeFiller from "@/components/DecorativeFiller";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Category = { id: string; name: string; type: "income" | "expense" };

export default function TransactionsPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showForm, setShowForm] = useState(false);
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [q, setQ] = useState("");
  const [type, setType] = useState<TransactionType | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast, ToastComponent } = useToast();

  const { data: categoriesData, isLoading: categoriesLoading } = useSWR("/api/categories", fetcher);
  const categories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (range.from) p.set("from", range.from);
    if (range.to) p.set("to", range.to);
    if (q) p.set("q", q);
    if (type) p.set("type", type);
    if (categoryId) p.set("categoryId", categoryId);
    return p.toString();
  }, [range, q, type, categoryId]);

  const { data, mutate, isLoading } = useSWR(`/api/transactions?${qs}`, fetcher);

  const transactions: Transaction[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((r: any) => ({
      id: r.id,
      date: new Date(r.date).toISOString().slice(0, 10),
      description: r.description,
      amount: r.amount,
      type: r.type,
      category: r.category?.name || undefined,
    }));
  }, [data]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!form.date) newErrors.date = "Tanggal wajib diisi.";
    if (!form.description || form.description.trim().length < 3)
      newErrors.description = "Deskripsi minimal 3 karakter.";
    if (!form.amount) newErrors.amount = "Jumlah wajib diisi.";
    else if (isNaN(Number(form.amount)))
      newErrors.amount = "Jumlah harus berupa angka.";
    else if (Number(form.amount) <= 0)
      newErrors.amount = "Jumlah harus lebih dari nol.";
    if (!form.category) newErrors.category = "Kategori wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenForm = (transaction?: Transaction) => {
    if (transaction) {
      setForm({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: String(Math.abs(transaction.amount)),
        type: transaction.type,
        category: transaction.category || "",
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm(initialFormState);
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    const absAmount = Math.abs(Number(form.amount));
    const finalAmount = form.type === "expense" ? -absAmount : absAmount;
    const selectedCategory = categories.find((c) => c.name === form.category && c.type === form.type);
    const payload = {
      date: form.date,
      description: form.description,
      amount: finalAmount,
      type: form.type,
      categoryId: selectedCategory?.id,
    };
    
    try {
      if (form.id) {
        const res = await fetch(`/api/transactions/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Transaksi berhasil diperbarui!", "success");
          mutate();
        } else {
          const error = await res.json();
          showToast(`Error: ${error.error}`, "error");
        }
      } else {
        const res = await fetch(`/api/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Transaksi berhasil ditambahkan!", "success");
          mutate();
        } else {
          const error = await res.json();
          showToast(`Error: ${error.error}`, "error");
        }
      }
    } catch (error) {
      showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
    
    handleCloseForm();
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Transaksi berhasil dihapus!", "success");
        mutate();
      } else {
        showToast("Gagal menghapus transaksi.", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan. Silakan coba lagi.", "error");
    }
  }, [mutate, showToast]);

  const onFilterChange = useCallback((v: { range: { from?: string; to?: string }; q: string; type?: "income" | "expense"; categoryId?: string }) => {
    setRange(v.range || {});
    setQ(v.q || "");
    setType(v.type as TransactionType | undefined);
    setCategoryId(v.categoryId);
  }, []);

  const exportFile = (format: "csv" | "xlsx") => {
    const url = `/api/export/transactions?${qs}&format=${format}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            💳 Transaksi
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola pemasukan dan pengeluaran Anda
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
          <button onClick={() => exportFile("csv")} className="btn-secondary text-xs sm:text-sm px-3 py-2">
            📄 CSV
          </button>
          <button onClick={() => exportFile("xlsx")} className="btn-secondary text-xs sm:text-sm px-3 py-2">
            📊 Excel
          </button>
          <button onClick={() => handleOpenForm()} className="btn-primary text-xs sm:text-sm px-3 py-2 flex items-center gap-1.5 sm:gap-2">
            <span>➕</span><span className="hidden sm:inline">Tambah Transaksi</span><span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onChange={(v) => onFilterChange(v)} showType showCategory categories={categories} />

      {/* Form Modal */}
      <TransactionFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      {/* Transaction List */}
      {isLoading ? (
        <SkeletonTable rows={5} />
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      )}

      {/* Toast */}
      {ToastComponent}
    </div>
  );
}
