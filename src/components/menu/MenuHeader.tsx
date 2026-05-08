"use client";

import { Coffee, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function MenuHeader({ search, setSearch }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            {/* Ambient Glow behind logo */}
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full group-hover:bg-green-500/40 transition-all duration-500" />
            
            <div className="relative bg-green-600 p-3 rounded-2xl shadow-2xl shadow-green-900/40 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <Coffee className="text-black" size={24} strokeWidth={3} />
            </div>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-white tracking-tighter italic leading-none uppercase">
              Smart <span className="text-green-500">Café</span>
            </h1>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">
              Premium Kiosk
            </p>
          </div>
        </div>

        {/* SEARCH & ACTIONS */}
        <div className="flex items-center gap-3">
          <div className="relative group flex items-center">
            <Search 
              size={16} 
              className="absolute left-4 text-gray-500 group-focus-within:text-green-500 transition-colors" 
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search flavors..."
              className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-green-500/50 focus:bg-white/[0.06] transition-all w-40 md:w-72 placeholder:text-gray-700 font-medium"
            />
          </div>

          <button className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-gray-400 hover:text-green-500 hover:border-green-500/30 hover:bg-green-500/5 transition-all">
            <SlidersHorizontal size={18} />
          </button>
        </div>

      </div>

      {/* SUBTLE TOP PROGRESS BAR (Decorative) */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-30" />
    </header>
  );
}