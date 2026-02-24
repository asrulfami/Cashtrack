// src/types/index.ts
export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category?: string;
  paymentMethod?: string;
};

export type AssetStatus = "active" | "inactive" | "disposed";

export type Asset = {
  id: string;
  name: string;
  acquisitionValue: number;
  acquisitionDate: string;
  depreciation?: number;
  status: AssetStatus;
};

export type InvestmentKind = "stock" | "bond" | "deposit" | "mutual_fund" | "other";

export type Investment = {
  id: string;
  name: string;
  kind: InvestmentKind;
  buyDate: string;
  units: number;
  buyPrice: number;
  currentPrice: number;
};

export type BudgetPeriod = "monthly" | "quarterly" | "yearly";

export type Budget = {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: number;
  period: BudgetPeriod;
  year: number;
  month: number;
  category?: {
    id: string;
    name: string;
    type: TransactionType;
  } | null;
};

export type Frequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export type RecurringTransaction = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string | null;
  frequency: Frequency;
  startDate: string;
  nextDate: string;
  endDate?: string | null;
  isActive: boolean;
  lastExecuted?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
};
