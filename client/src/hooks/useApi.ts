"use client";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/api";

export function useApi<T>(url: string | null) {
  return useSWR<T>(url, fetcher, { keepPreviousData: true, revalidateOnFocus: false });
}

// After any write, refresh every cached query (dashboard, lists, budgets all depend on transactions).
export const refreshAll = () => mutate(() => true);
