import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Skill Saarthi - Professional Home Services",
  description: "Your trusted platform for home services and skilled professionals.",
  icons: {
    icon: '/logo.png', // /public path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
