import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, themeScript } from "@/context/ThemeContext";

const geist = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist", weight: "100 900" });

export const metadata: Metadata = {
  title: { default: "Moneywise", template: "%s · Moneywise" },
  description: "Track spending, set budgets and reach your savings goals.",
};
export const viewport: Viewport = { themeColor: "#6366f1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`${geist.variable} min-h-dvh`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton toastOptions={{ className: "!rounded-xl" }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
