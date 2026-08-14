import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESSMA OS | Enterprise Power Infrastructure Operating System",
  description: "Operating system for ESSMA UPS power infrastructure, field engineering, quotations, inventory, and finance.",
};

import { Toaster } from 'sonner';
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#0f1115] text-[#f3f4f6]">
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" richColors theme="dark" />
        </QueryProvider>
      </body>
    </html>
  );
}
