"use client";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type Props = {
  item: Product;
};

export default function MenuCard({ item }: Props) {
  const { addToCart } = useCart();

  return (
    <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 shadow-xl hover:shadow-green-900/10 transition-all duration-500 group">
      
      {/* 🖼️ IMAGE SECTION */}
      <div className="h-52 overflow-hidden relative">
        <img
          src={
            item.image && item.image.trim() !== ""
              ? item.image
              : "https://via.placeholder.com/400x300?text=Coffee"
          }
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Subtle overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
      </div>

      {/* 📝 CONTENT SECTION */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {item.name}
            </h2>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
              {item.category}
            </p>
          </div>

          <span className="text-xl font-black text-green-500 tracking-tighter">
            ₹{item.price}
          </span>
        </div>

        {/* 🛒 ADD TO CART BUTTON */}
        <button 
          onClick={() => addToCart(item)}
          className="w-full mt-4 bg-green-800 text-white py-3 rounded-2xl font-bold text-sm hover:bg-green-700 active:scale-95 transition-all duration-300 shadow-lg shadow-green-900/20"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}