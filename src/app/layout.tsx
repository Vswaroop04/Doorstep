"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "jotai";
import Navbar from "@/components/Navbar";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import Footer from "@/components/Footer";
import ToastProvider from "@/providers/Toaster";
import GlobalLoading from "@/components/GlobalLoading";
import AuthInit from "@/providers/AuthInit";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Door Step",
  description:
    "A Web Application Offering Efficient Solutions for Your Daily Requirements",
};
const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <html lang="en" className="h-full">
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <AuthInit />
          <body
            className={cn(
              "relative h-full font-sans antialiased",
              inter.className
            )}
          >
            {/* This flex and min-h-screen props put the footer at the end with 100vh default size , flex-1 makes the free space occupies */}
            <main className="relative flex flex-col min-h-screen">
              <GlobalLoading />
              <Navbar />
              <div className="flex-grow flex-1">
                {" "}
                <ToastProvider> {children}</ToastProvider>
              </div>
              <Footer />
            </main>{" "}
          </body>
        </html>
      </QueryClientProvider>
    </Provider>
  );
}
