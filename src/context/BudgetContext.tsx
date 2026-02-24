"use client";

import React, { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import { type Budget } from "@/types";

interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  refresh: () => Promise<void>;
  addBudget: (budget: Partial<Budget>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const res = await fetch(`/api/budgets?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
      if (res.ok) {
        const data = await res.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error("Failed to load budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const addBudget = async (budget: Partial<Budget>) => {
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (res.ok) {
        await loadBudgets();
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error("Failed to add budget:", error);
      throw error;
    }
  };

  const updateBudget = async (id: string, budget: Partial<Budget>) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (res.ok) {
        await loadBudgets();
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadBudgets();
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw error;
    }
  };

  const value = {
    budgets,
    loading,
    refresh: loadBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
};
