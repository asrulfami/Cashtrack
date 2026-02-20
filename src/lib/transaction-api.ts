import { type Transaction } from "@/types";

const STORAGE_KEY = "cashtrack_transactions";

/**
 * Menyimpan array transaksi ke localStorage.
 * @param {Transaction[]} transactions - Array transaksi yang akan disimpan.
 */
const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const rawData = JSON.stringify(transactions);
    window.localStorage.setItem(STORAGE_KEY, rawData);
  } catch (error) {
    console.error("Gagal menyimpan transaksi ke localStorage:", error);
  }
};

/**
 * Mengambil semua transaksi dari localStorage.
 * @returns {Transaction[]} Array transaksi.
 */
export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // Jika tidak ada data, inisialisasi dengan data dummy untuk pengalaman pertama
      const initialTransactions = [
        { id: 1, date: "2026-02-01", description: "Gaji Bulanan", amount: 7500000 },
        { id: 2, date: "2026-02-03", description: "Belanja Bulanan", amount: -1250000 },
      ];
      saveTransactions(initialTransactions);
      return initialTransactions;
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Gagal mengambil transaksi dari localStorage:", error);
    return [];
  }
};

/**
 * Menambahkan transaksi baru.
 * @param {Omit<Transaction, "id">} newTransactionData - Data transaksi baru tanpa ID.
 * @returns {Transaction} Transaksi baru yang telah ditambahkan.
 */
export const addTransaction = (
  newTransactionData: Omit<Transaction, "id">
): Transaction => {
  const transactions = getTransactions();
  const newId =
    transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
  const newTransaction: Transaction = {
    id: newId,
    ...newTransactionData,
  };
  const updatedTransactions = [...transactions, newTransaction];
  saveTransactions(updatedTransactions);
  return newTransaction;
};

/**
 * Memperbarui transaksi yang ada.
 * @param {Transaction} updatedTransaction - Data transaksi yang sudah diperbarui.
 * @returns {Transaction} Transaksi yang telah diperbarui.
 */
export const updateTransaction = (
  updatedTransaction: Transaction
): Transaction => {
  let transactions = getTransactions();
  transactions = transactions.map((t) =>
    t.id === updatedTransaction.id ? updatedTransaction : t
  );
  saveTransactions(transactions);
  return updatedTransaction;
};

/**
 * Menghapus transaksi berdasarkan ID.
 * @param {number} id - ID transaksi yang akan dihapus.
 */
export const deleteTransaction = (id: number): void => {
  let transactions = getTransactions();
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions(transactions);
};
