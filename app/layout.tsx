import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PropertyProvider } from "@/core/contexts/PropertyContext";
import { NavBar } from "@/core/ui/NavBar";
import { TopBar } from "@/core/ui/TopBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEON PMS",
  description: "Property Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-neutral-light min-h-screen`}
      >
        <Providers>
          <PropertyProvider>
            <NavBar />
            <div className="md:ml-64 flex flex-col min-h-screen">
              <TopBar />
              <main className="flex-1 p-6 overflow-auto">
                {children}
              </main>
            </div>
          </PropertyProvider>
        </Providers>
      </body>
    </html>
  );
}
