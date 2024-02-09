import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "jotai";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Door Step",
  description:
    "A Web Application Offering Efficient Solutions for Your Daily Requirements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <html lang="en" className="h-full">
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <body
          className={cn(
            "relative h-full font-sans antialiased",
            inter.className
          )}
        >
          {/* This flex and min-h-screen props put the footer at the end with 100vh default size , flex-1 makes the free space occupies */}
          <main className="relative flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex-1">{children}</div>
          </main>{" "}
        </body>
      </html>
    </Provider>
  );
}
