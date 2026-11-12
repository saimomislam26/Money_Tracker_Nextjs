export type TxType = "expense" | "income";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string | null;
  currency: string;
}

export interface Category {
  _id: string;
  name: string;
  type: TxType;
  color: string;
  icon: string;
}

export interface Transaction {
  _id: string;
  type: TxType;
  amount: number;
  category: Pick<Category, "_id" | "name" | "color" | "icon" | "type">;
  note: string;
  date: string;
  recurring?: string;
}

export interface TransactionPage {
  items: Transaction[];
  total: number;
  page: number;
  pages: number;
  totals: { income: number; expense: number };
}

export interface BudgetStatus {
  _id: string;
  category: Pick<Category, "_id" | "name" | "color" | "icon">;
  amount: number;
  spent: number;
  remaining: number;
  percent: number;
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string | null;
  color: string;
  contributions: { amount: number; note: string; date: string }[];
}

export interface Recurring {
  _id: string;
  type: TxType;
  amount: number;
  category: Pick<Category, "_id" | "name" | "color" | "icon" | "type">;
  note: string;
  frequency: "weekly" | "monthly" | "yearly";
  startDate: string;
  nextDate: string;
  active: boolean;
}

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  count: number;
}

export interface Totals {
  income: number;
  expense: number;
  balance: number;
  count: number;
  savingsRate?: number | null;
}

export interface Dashboard {
  month: string;
  totals: Totals;
  previous: Totals;
  insights: { avgDailySpend: number; projectedExpense: number; topCategory: CategoryTotal | null; isCurrentMonth: boolean };
  categories: CategoryTotal[];
  daily: { day: number; income: number; expense: number }[];
  trend: { month: string; income: number; expense: number }[];
  budgets: BudgetStatus[];
  recent: Transaction[];
  upcoming: Recurring[];
}

export interface Yearly {
  year: number;
  totals: Totals;
  months: { month: string; income: number; expense: number; net: number }[];
  expenseCategories: CategoryTotal[];
  incomeCategories: CategoryTotal[];
}
