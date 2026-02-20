"use client";
import { useState, useMemo } from "react";
import type { FormEvent } from "react";

// Tipe untuk data transaksi
type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
};

// Tipe untuk state form
type FormState = {
  id: number | null;
  date: string;
  description: string;
  amount: string;
};

// Tipe untuk error form
type FormErrors = {
  date?: string;
  description?: string;
  amount?: string;
};

const initialFormState: FormState = {
  id: null,
  date: "",
  description: "",
  amount: "",
};

// Komponen untuk menampilkan daftar transaksi
function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 overflow-x-auto border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">📋 Daftar Transaksi</h2>
      <table className="w-full min-w-[400px] text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
            <th className="py-2 px-3">Tanggal</th>
            <th className="py-2 px-3">Deskripsi</th>
            <th className="py-2 px-3">Jumlah</th>
            <th className="py-2 px-3">Aksi</th>
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
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(t.amount)}
              </td>
              <td className="py-3 px-3 flex gap-2">
                <button
                  onClick={() => onEdit(t)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors text-sm font-medium"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Komponen untuk modal form
function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  errors,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  form: FormState;
  setForm: (form: FormState) => void;
  errors: FormErrors;
}) {
  if (!isOpen) return null;

  const title = form.id ? "✏️ Edit Transaksi" : "➕ Tambah Transaksi";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        <form onSubmit={onSubmit} className="grid gap-5">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tanggal
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Deskripsi
            </label>
            <input
              id="description"
              type="text"
              placeholder="Contoh: Bayar tagihan listrik"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Jumlah (Rp)
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Gunakan - (minus) untuk pengeluaran"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors font-semibold"
            >
              {form.id ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2026-02-01", description: "Gaji Bulanan", amount: 7500000 },
    {
      id: 2,
      date: "2026-02-03",
      description: "Belanja Bulanan",
      amount: -1250000,
    },
  ]);

  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fungsi untuk memvalidasi form
  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!form.date) newErrors.date = "Tanggal wajib diisi.";
    if (!form.description || form.description.trim().length < 3) {
      newErrors.description = "Deskripsi minimal 3 karakter.";
    }
    if (!form.amount) {
      newErrors.amount = "Jumlah wajib diisi.";
    } else if (isNaN(Number(form.amount))) {
      newErrors.amount = "Jumlah harus berupa angka.";
    } else if (Number(form.amount) === 0) {
      newErrors.amount = "Jumlah tidak boleh nol.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenForm = (transaction?: Transaction) => {
    if (transaction) {
      setForm({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: String(transaction.amount),
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const amount = Number(form.amount);

    if (form.id !== null) {
      // Edit transaksi
      setTransactions(
        transactions.map((t) =>
          t.id === form.id
            ? { ...t, date: form.date, description: form.description, amount }
            : t,
        ),
      );
      setSuccessMessage("Transaksi berhasil diperbarui!");
    } else {
      // Tambah transaksi baru
      const newId =
        transactions.length > 0
          ? Math.max(...transactions.map((t) => t.id)) + 1
          : 1;
      const newTransaction: Transaction = {
        id: newId,
        date: form.date,
        description: form.description,
        amount,
      };
      setTransactions([...transactions, newTransaction]);
      setSuccessMessage("Transaksi berhasil ditambahkan!");
    }

    handleCloseForm();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setSuccessMessage("Transaksi berhasil dihapus!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <main className="p-4 sm:p-6 grid gap-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">💰 Transaksi</h1>
        <button
          onClick={() => handleOpenForm()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold flex items-center gap-2"
        >
          <span>➕</span>
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {successMessage && (
        <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow animate-fade-in">
          {successMessage}
        </div>
      )}

      <TransactionFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
      />

      <TransactionList
        transactions={transactions}
        onEdit={(t) => handleOpenForm(t)}
        onDelete={handleDelete}
      />
    </main>
  );
}
