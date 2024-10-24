import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Providers from "@/components/Providers";
import NavbarHandler from "@/components/NavbarHandler";
import FetchUserInfo from "@/utils/fetchThunkUserInfo";
import ClientThemeProvider from "@/components/ClientThemeProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Home Page",
  description: "Create Your Daily Expense",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`font-mono antialiased`}
      >
        <ClientThemeProvider>

          <Providers>
            {/* <ThemeProvider theme={theme}>
            <CssBaseline /> */}
            {/* For every refresh call the thunk function and it needs to be wrapped */}
            <FetchUserInfo />
            <NavbarHandler />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              closeOnClick
            />
            {/* </ThemeProvider> */}
          </Providers>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
