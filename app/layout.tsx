import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
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
        className={`${inter.variable} ${geistMono.variable} antialiased flex bg-neutral-light min-h-screen overflow-hidden`}
      >
        <Providers>
          <div className="flex min-h-screen">
            <NavBar />
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
