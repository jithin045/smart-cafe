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
      <body className={`${geist.className} bg-[#050505] text-white antialiased`}>
        <CartProvider>
          {/* 
              flex-col and min-h-screen ensures the footer 
              always stays at the bottom 
          */}
          <div className="flex flex-col min-h-screen">
            
            <main className="flex-grow">
              {children}
            </main>

            <footer className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-white/5 flex justify-center">
              <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.6em] text-center">
                Smart Café © 2026 / System Active
              </p>
            </footer>

          </div>
        </CartProvider>
      </body>
    </html>
  );
}