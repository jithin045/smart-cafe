"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Coffee, Leaf, Sparkles, Utensils, ShoppingBag, ArrowRight } from "lucide-react";

import MenuHeader from "@/components/menu/MenuHeader";
import Loading from "@/components/common/Loading";
import EmptyMenu from "@/components/menu/EmptyMenu";
import MenuGrid from "@/components/menu/MenuGrid";
import CartDrawer from "@/components/cart/CartDrawer";

import { Product } from "@/types/product";
import { getProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";

// --- BASELINE ITEMS ARRAY ---
const DATABASE_ITEMS: Product[] = [
  { _id: "69f9bd3f229700ae2d15527c", name: "Cappuccino", price: 120, category: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", available: true },
  { _id: "69f9bd62229700ae2d15527d", name: "Espresso", price: 100, category: "Coffee", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348", available: true },
  { _id: "69f9bd6c229700ae2d15527e", name: "Latte", price: 140, category: "Coffee", image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e", available: true },
  { _id: "69f9bd7b229700ae2d15527f", name: "Sandwich", price: 80, category: "Snacks", image: "https://plus.unsplash.com/premium_photo-1664472757995-3260cd26e477?fm=jpg&q=60&w=3000&auto=format&fit=crop", available: true },
  { _id: "69f9bd88229700ae2d155280", name: "Burger", price: 150, category: "Snacks", image: "https://images.unsplash.com/photo-1610970878459-a0e464d7592b?fm=jpg&q=60&w=3000&auto=format&fit=crop", available: true },
  { _id: "69fa206dab7639062d7e53d6", name: "Cold Coffee", price: 110, category: "Cold Drinks", image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5", available: true },
  { _id: "69fa208cab7639062d7e53d7", name: "Iced Latte", price: 130, category: "Cold Drinks", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", available: true },
  { _id: "69fa20d3ab7639062d7e53d8", name: "Americano", price: 110, category: "Coffee", image: "https://images.unsplash.com/photo-1587985782608-20062892559d?fm=jpg&q=60&w=3000&auto=format&fit=crop", available: true },
  { _id: "69fa20dcab7639062d7e53d9", name: "Mocha", price: 150, category: "Coffee", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348", available: true },
  { _id: "69fa20f2ab7639062d7e53da", name: "Flat White", price: 140, category: "Coffee", image: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6", available: true },
  { _id: "69fa2101ab7639062d7e53db", name: "Chicken Burger", price: 180, category: "Snacks", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", available: true },
  { _id: "69fa210bab7639062d7e53dc", name: "Veg Sandwich", price: 70, category: "Snacks", image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847", available: true },
  { _id: "69fa211aab7639062d7e53dd", name: "French Fries", price: 90, category: "Snacks", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5", available: true },
  { _id: "69fa2129ab7639062d7e53de", name: "Chocolate Cake", price: 160, category: "Desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", available: true },
  { _id: "69fa2131ab7639062d7e53df", name: "Brownie", price: 120, category: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", available: true },
  { _id: "69fa214bab7639062d7e53e1", name: "Milkshake", price: 140, category: "Cold Drinks", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699", available: true }
];

const SHUTTER_ITEMS = [
  { name: "Cappuccino", tag: "Barista Selected • Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" },
  { name: "Burger", tag: "Flame Grilled • Snacks", image: "https://images.unsplash.com/photo-1610970878459-a0e464d7592b?fm=jpg&q=60&w=3000&auto=format&fit=crop" },
  { name: "Iced Latte", tag: "Chilled Craft • Cold Drinks", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735" },
  { name: "Chocolate Cake", tag: "Fresh Confection • Desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" }
];

export default function MenuPage() {
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(DATABASE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SHUTTER_ITEMS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getProducts();
        if (data?.length > 0) setProducts(data);
      } catch (err) {
        console.warn("API offline fallback state active.");
      }
    };
    fetchMenu();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const finalProducts = useMemo(() => products.filter((p) => (selectedCategory === "All" || p.category === selectedCategory) && p.name.toLowerCase().includes(search.toLowerCase())), [products, selectedCategory, search]);

  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#050505] pb-40 text-foreground overflow-x-hidden">
      
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <MenuHeader search={search} setSearch={setSearch} />
      </div>

      {/* --- SPLITSCREEN PARALLAX SHUTTER HERO --- */}
      <section className="max-w-4xl mx-auto px-6 pt-8 pb-4 relative z-10">
        <div className="relative h-[220px] md:h-[300px] w-full overflow-hidden border border-white/5 rounded-[2.5rem] grid grid-cols-2 shadow-2xl bg-neutral-900/40">
          {/* Left Text Half */}
          <div className="relative overflow-hidden h-full w-full flex items-center p-6 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-1 md:space-y-2"
              >
                <span className="text-[9px] md:text-xs font-black tracking-[0.2em] text-green-500 uppercase">{SHUTTER_ITEMS[index].tag}</span>
                <h2 className="text-xl md:text-4xl font-black text-white uppercase tracking-tight italic">{SHUTTER_ITEMS[index].name}</h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Image Half */}
          <div className="relative overflow-hidden h-full w-full border-l border-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 60, opacity: 0, scale: 1.08 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -60, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full"
              >
                <img src={SHUTTER_ITEMS[index].image} alt={SHUTTER_ITEMS[index].name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CORE INTERFACE */}
      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* PREMIUM CATEGORY NAVIGATION */}
        <nav className="mb-12 md:mb-20 sticky top-[72px] md:top-[80px] z-40 py-4 md:py-8 -mx-6 px-6">
          <div className="max-w-[95vw] md:max-w-fit mx-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-2 md:p-5 rounded-[5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex gap-2 md:gap-8 overflow-x-auto no-scrollbar items-center px-2 md:px-4 snap-x">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative flex items-center gap-3 md:gap-5 px-6 md:px-10 py-3 md:py-5 rounded-full transition-all outline-none group min-w-max snap-center"
                >
                  <AnimatePresence>
                    {selectedCategory === cat && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-green-600 rounded-full z-0 shadow-[0_0_30px_rgba(21,128,61,0.6)] border border-white/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    {cat === "All" && <Sparkles size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />}
                    {cat === "Coffee" && <Coffee size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />}
                    {cat === "Snacks" && <Utensils size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />}
                    {!["All", "Coffee", "Snacks"].includes(cat) && (
                      <Leaf size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />
                    )}
                  </div>

                  <span className={`relative z-10 text-[10px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-colors duration-300 ${selectedCategory === cat ? "text-white" : "text-gray-400"}`}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-green-600 rounded-full" />
            <h2 className="text-3xl font-black tracking-tight italic uppercase">{selectedCategory}</h2>
          </div>
          <span className="text-[10px] font-black text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5 tracking-widest uppercase">
            {finalProducts.length} Options
          </span>
        </div>

        {/* PRODUCTS GRID */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedCategory + search} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {finalProducts.length === 0 ? <EmptyMenu /> : <MenuGrid products={finalProducts} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- RE-ARCHITECTED ADVANCED FLOATING CART BAR --- */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 120, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-6 left-0 right-0 px-4 md:px-6 z-50 pointer-events-none"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="max-w-xl mx-auto bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2.5 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(34,197,94,0.1)] pointer-events-auto group/cart"
            >
              {/* Status Meta Section */}
              <div className="flex items-center gap-4 pl-3">
                <div className="relative">
                  {/* Dynamic Island Capsule */}
                  <motion.div
                    key={totalItems}
                    initial={{ scale: 0.7, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white font-black shadow-[0_8px_20px_rgba(34,197,94,0.3)] relative z-10"
                  >
                    <ShoppingBag size={18} className="stroke-[2.5]" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-white text-green-900 rounded-full flex items-center justify-center text-[10px] font-black border border-green-600 shadow-md">
                      {totalItems}
                    </span>
                  </motion.div>
                  {/* Pulse glow background ring */}
                  <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-md scale-110 animate-pulse pointer-events-none" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] leading-none mb-1">
                    Basket Summary
                  </span>
                  <motion.p 
                    key={totalPrice}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-black text-white tracking-tighter flex items-baseline gap-1"
                  >
                    ₹{totalPrice.toLocaleString()}
                    <span className="text-[10px] font-medium text-neutral-500 tracking-normal font-sans">val</span>
                  </motion.p>
                </div>
              </div>

              {/* High Contrast Action Shutter */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative bg-white hover:bg-neutral-100 text-black px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 shadow-lg group-hover/cart:shadow-green-500/10"
              >
                <span>View Order</span>
                <ArrowRight size={14} className="stroke-[3] transform group-hover/cart:translate-x-1 transition-transform duration-300 text-green-600" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
}