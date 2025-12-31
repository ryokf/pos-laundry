import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MockDataInitializer from "@/components/MockDataInitializer";

export const metadata: Metadata = {
  title: "POS Laundry - Sistem Kasir Modern",
  description: "Aplikasi Point of Sale untuk bisnis laundry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <MockDataInitializer />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 bg-gray-50 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
