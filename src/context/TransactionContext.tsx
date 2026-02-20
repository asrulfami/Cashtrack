"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { type Transaction } from "@/types";
import * as api from "@/lib/transaction-api";

// Tipe untuk nilai yang akan disediakan oleh Context
interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (data: Omit<Transaction, "id">) => void;
  updateTransaction: (data: Transaction) => void;
  deleteTransaction: (id: number) => void;
  loading: boolean;
}

// Membuat Context dengan nilai default
const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

// Membuat komponen Provider
export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Memuat data awal dari API (localStorage)
  useEffect(() => {
    setLoading(true);
    const data = api.getTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  const handleAddTransaction = (data: Omit<Transaction, "id">) => {
    const newTransaction = api.addTransaction(data);
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleUpdateTransaction = (data: Transaction) => {
    const updatedTransaction = api.updateTransaction(data);
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const handleDeleteTransaction = (id: number) => {
    api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const value = {
    transactions,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    loading,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook untuk menggunakan TransactionContext
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
