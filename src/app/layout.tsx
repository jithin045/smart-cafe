import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Café",
  description: "Smart Café Ordering System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}