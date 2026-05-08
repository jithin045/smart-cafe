"use client";

import { Coffee, Search, SlidersHorizontal } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function MenuHeader({ search, setSearch }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100 mb-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="bg-green-700 p-2.5 rounded-2xl shadow-lg shadow-green-900/20">
            <Coffee className="text-white" size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">
              SMART CAFÉ
            </h1>

            <p className="text-[10px] font-bold text-green-700 uppercase tracking-[0.3em]">
              Menu Kiosk
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 w-64">
            <Search size={18} className="text-gray-400 mr-2" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Find your drink..."
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>

          <button className="p-3 bg-gray-100 rounded-2xl text-gray-600 hover:bg-gray-200 transition-colors">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}