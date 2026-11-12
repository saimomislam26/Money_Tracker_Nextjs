import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const TOKEN_KEY = "mt_token";
export const COOKIE_KEY = "mt_session"; // distinct from the legacy "token" cookie so stale sessions are ignored

export const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api` });

export const getToken = () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY));
export const setToken = (t: string) => {
  localStorage.setItem(TOKEN_KEY, t);
  Cookies.set(COOKIE_KEY, t, { expires: 7, sameSite: "lax" }); // read by Next middleware for route protection
};
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(COOKIE_KEY);
  Cookies.remove("token"); // legacy cookie from the previous version
};

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const isAuthCall = err.config?.url?.startsWith("/auth/login") || err.config?.url?.startsWith("/auth/register");
    if (err.response?.status === 401 && !isAuthCall && typeof window !== "undefined") {
      clearToken();
      if (!location.pathname.startsWith("/login")) location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e: unknown) => {
  const ax = e as AxiosError<{ message?: string }>;
  if (ax.response?.data?.message) return ax.response.data.message;
  if (ax.code === "ERR_NETWORK") return "Can't reach the server. Is the API running?";
  return (e as Error)?.message || "Something went wrong";
};

export const fetcher = <T,>(url: string) => api.get<T>(url).then((r) => r.data);
