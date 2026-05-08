"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Coffee, Leaf, Sparkles, Utensils } from "lucide-react";

import MenuHeader from "@/components/menu/MenuHeader";
import Loading from "@/components/common/Loading";
import EmptyMenu from "@/components/menu/EmptyMenu";
import MenuGrid from "@/components/menu/MenuGrid";
import CartDrawer from "@/components/cart/CartDrawer";

import { Product } from "@/types/product";
import { getProducts } from "@/services/api";
import { useCart } from "@/context/CartContext";

// --- CATEGORY CONFIGURATION ---
const categoryIcons: Record<string, string> = {
  All: "https://cdn-icons-png.flaticon.com/512/706/706164.png",
  Coffee: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
  Snacks: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png",
  "Cold Drinks": "https://cdn-ilcgllj.nitrocdn.com/yYgHYEMfpGEmQQQFcGgNyRDCCGnwRprk/assets/images/optimized/rev-084016f/rareblends.in/wp-content/uploads/2024/04/Juices-and-Soft-Drinks.png",
  Desserts: "https://kidscodecs.com/wp-content/uploads/2025/03/dessert-stomach-cupcakes-MikeMeeks-unsplash.png",
};

// --- BACKGROUND DECOR COMPONENT (Fills empty areas) ---
const BackgroundDecor = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 45]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
      {/* Top Left Floating Bean */}
      <motion.div style={{ y: y1, rotate }} className="absolute -top-10 -left-10 text-green-600">
        <Coffee size={300} strokeWidth={0.5} />
      </motion.div>

      {/* Middle Right Leaf */}
      <motion.div style={{ y: y2, rotate: -rotate }} className="absolute top-1/2 -right-20 text-green-800">
        <Leaf size={250} strokeWidth={0.5} />
      </motion.div>

      {/* Bottom Left Utensils */}
      <motion.div style={{ y: y1 }} className="absolute bottom-20 left-[10%] text-green-700">
        <Utensils size={150} strokeWidth={0.5} />
      </motion.div>

      {/* Sparkling Particles */}
      <motion.div
        animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[20%] right-[30%] text-yellow-500/30"
      >
        <Sparkles size={40} />
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function MenuPage() {
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 200], [1, 0.9]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  const finalProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);
  const totalPrice = cart.reduce((a, b) => a + b.price * b.quantity, 0);

  if (loading) return <Loading text="Brewing Excellence..." />;

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-4">
        <p className="text-red-500 font-bold text-xl">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-green-800 text-white rounded-full font-bold">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#050505] pb-40 text-foreground overflow-x-hidden">

      {/* 1. INTERACTIVE BACKGROUND ELEMENTS */}
      <BackgroundDecor />

      {/* Ambient Moving Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-green-600 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 -left-20 w-[50%] h-[50%] bg-green-900 rounded-full blur-[150px]"
        />
      </div>

      {/* 2. STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <MenuHeader search={search} setSearch={setSearch} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6">

        {/* 3. HERO SECTION */}
        <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="py-20">
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-green-600" />
            <span className="text-green-500 text-sm font-black uppercase tracking-[0.3em]">Smart Café</span>
          </motion.div>
          <motion.h1 initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Always <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-700">Fresh.</span>
          </motion.h1>
        </motion.section>

        {/* 4. MOBILE-FRIENDLY HIGH-GLOW NAV */}
        <nav className="mb-12 md:mb-20 sticky top-[72px] md:top-[80px] z-40 py-4 md:py-8 -mx-6 px-6">
          {/* Container: Responsive width and padding */}
          <div className="max-w-[95vw] md:max-w-fit mx-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-2 md:p-5 rounded-[5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">

            {/* Scrollable Area: snap-x ensures items stop perfectly when scrolling on mobile */}
            <div className="flex gap-2 md:gap-8 overflow-x-auto no-scrollbar items-center px-2 md:px-4 snap-x">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedCategory(cat)}
                  className="relative flex items-center gap-3 md:gap-5 px-6 md:px-10 py-3 md:py-5 rounded-full transition-all outline-none group min-w-max snap-center"
                >
                  {/* THE GLOW: Responsive shadow spread */}
                  <AnimatePresence>
                    {selectedCategory === cat && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-green-600 rounded-full z-0 
                           shadow-[0_0_20px_rgba(21,128,61,0.5)] md:shadow-[0_0_30px_rgba(21,128,61,0.6),0_20px_40px_rgba(0,0,0,0.4)]
                           border border-white/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon: Scaled down slightly for mobile */}
                  <div className="relative z-10">
                    {cat === "All" && <Sparkles size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />}
                    {cat === "Coffee" && <Coffee size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />}
                    {cat === "Snacks" && <Utensils size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />}
                    {!["All", "Coffee", "Snacks"].includes(cat) && (
                      <Leaf size={18} className={`md:w-[22px] md:h-[22px] ${selectedCategory === cat ? "text-white" : "text-gray-600"}`} />
                    )}
                  </div>

                  {/* Label: Fluid text sizing */}
                  <span className={`relative z-10 text-[10px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-colors duration-300 ${selectedCategory === cat ? "text-white" : "text-gray-600"
                    }`}>
                    {cat}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </nav>

        {/* 5. MENU GRID */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <motion.div layoutId="cat-indicator" className="h-8 w-1.5 bg-green-600 rounded-full" />
              <h2 className="text-3xl font-black tracking-tight italic uppercase">{selectedCategory}</h2>
            </div>
            <span className="text-[10px] font-black text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5 tracking-widest uppercase">
              {finalProducts.length} Results
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + search}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {finalProducts.length === 0 ? <EmptyMenu /> : <MenuGrid products={finalProducts} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 6. INTERACTIVE FLOATING CART BAR */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 px-4 z-50"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="max-w-xl mx-auto bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-5 pl-4">
                <motion.div
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-900/40"
                >
                  {totalItems}
                </motion.div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">To Pay</p>
                  <p className="text-xl font-black text-white tracking-tighter">₹{totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="bg-green-700 hover:bg-green-600 text-white px-10 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl"
              >
                Review Cart <span>→</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
}