"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Investment } from "@/types";

type InvestmentContextType = {
  investments: Investment[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const InvestmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvestments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/investments");
      if (res.ok) {
        const data = await res.json();
        setInvestments(data.map((i: any) => ({
          id: i.id,
          name: i.name,
          kind: i.kind,
          buyDate: new Date(i.buyDate).toISOString().slice(0, 10),
          units: i.units,
          buyPrice: i.buyPrice,
          currentPrice: i.currentPrice,
        })));
      }
    } catch (error) {
      console.error("Failed to load investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  return (
    <InvestmentContext.Provider value={{ investments, loading, refresh: loadInvestments }}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestments = () => {
  const ctx = useContext(InvestmentContext);
  if (!ctx) throw new Error("useInvestments must be used within an InvestmentProvider");
  return ctx;
};
