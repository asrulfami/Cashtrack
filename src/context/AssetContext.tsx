"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Asset } from "@/types";

type AssetContextType = {
  assets: Asset[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: React.ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assets");
      if (res.ok) {
        const data = await res.json();
        setAssets(data.map((a: any) => ({
          id: a.id,
          name: a.name,
          acquisitionValue: a.acquisitionValue,
          acquisitionDate: new Date(a.acquisitionDate).toISOString().slice(0, 10),
          depreciation: a.depreciation ?? undefined,
          status: a.status,
        })));
      }
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <AssetContext.Provider value={{ assets, loading, refresh: loadAssets }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error("useAssets must be used within an AssetProvider");
  return ctx;
};
