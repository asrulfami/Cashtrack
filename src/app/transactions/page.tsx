"use client";
import { useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-02-01", description: "Gaji", amount: 5000 },
    { id: 2, date: "2026-02-03", description: "Belanja", amount: -1200 },
  ]);

  const [form, setForm] = useState({
    id: null,
    date: "",
    description: "",
    amount: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.date) {
      newErrors.date = "Tanggal wajib diisi.";
    }
    if (!form.description || form.description.trim().length < 3) {
      newErrors.description = "Deskripsi minimal 3 karakter.";
    }
    if (!form.amount) {
      newErrors.amount = "Jumlah wajib diisi.";
    } else if (Number(form.amount) === 0) {
      newErrors.amount = "Jumlah tidak boleh nol.";
    } else if (isNaN(Number(form.amount))) {
      newErrors.amount = "Jumlah harus berupa angka.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (form.id) {
      // Edit transaksi
      setTransactions(
        transactions.map((t) =>
          t.id === form.id
            ? {
                ...t,
                date: form.date,
                description: form.description,
                amount: Number(form.amount),
              }
            : t,
        ),
      );
    } else {
      // Tambah transaksi baru
      const newTransaction = {
        id: transactions.length + 1,
        date: form.date,
        description: form.description,
        amount: Number(form.amount),
      };
      setTransactions([...transactions, newTransaction]);
    }
    setForm({ id: null, date: "", description: "", amount: "" });
    setErrors({});
  };

  const handleEdit = (t: any) => {
    setForm({
      id: t.id,
      date: t.date,
      description: t.description,
      amount: String(t.amount),
    });
    setErrors({});
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <main className="p-4 sm:p-6 grid gap-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Transaksi</h1>

      {/* Form tambah/edit transaksi */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700 grid gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tanggal
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Deskripsi
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Jumlah
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="mt-1 w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount}</p>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
        >
          {form.id ? "Simpan Perubahan" : "Tambah Transaksi"}
        </button>
      </form>

      {/* Tabel transaksi */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Daftar Transaksi
        </h3>
        <table className="w-full min-w-[400px] text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
                Tanggal
              </th>
              <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
                Deskripsi
              </th>
              <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
                Jumlah
              </th>
              <th className="py-2 text-gray-700 dark:text-gray-200 font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-2 text-gray-700 dark:text-gray-200">
                  {t.date}
                </td>
                <td className="py-2 text-gray-700 dark:text-gray-200">
                  {t.description}
                </td>
                <td
                  className={`py-2 font-semibold ${
                    t.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  Rp {t.amount.toLocaleString("id-ID")}
                </td>
                <td className="py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
