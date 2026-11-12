import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const money = (n: number, currency = "USD", opts: { compact?: boolean; sign?: boolean } = {}) => {
  const big = !!opts.compact && Math.abs(n) >= 10000;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: big ? "compact" : "standard",
    minimumFractionDigits: big || (opts.compact && Number.isInteger(n)) ? 0 : undefined,
    maximumFractionDigits: big ? 1 : undefined,
    signDisplay: opts.sign ? "exceptZero" : "auto",
  }).format(n);
};

export const ym = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
export const shiftMonth = (m: string, by: number) => dayjs.utc(`${m}-01`).add(by, "month").format("YYYY-MM");
export const monthLabel = (m: string, short = false) => dayjs.utc(`${m}-01`).format(short ? "MMM" : "MMMM YYYY");
export const fmtDate = (d: string | Date, f = "MMM D, YYYY") => dayjs.utc(d).format(f);
export const isoDay = (d: string | Date) => dayjs.utc(d).format("YYYY-MM-DD");
export const today = () => dayjs().format("YYYY-MM-DD");

export const relativeDay = (d: string) => {
  const t = dayjs.utc(d).startOf("day");
  const n = dayjs().format("YYYY-MM-DD");
  const diff = dayjs.utc(n).diff(t, "day");
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return t.format("ddd, MMM D");
};

export const pctChange = (cur: number, prev: number) => (prev === 0 ? null : Math.round(((cur - prev) / prev) * 100));

export const initials = (f = "", l = "") => `${f[0] || ""}${l[0] || ""}`.toUpperCase();
