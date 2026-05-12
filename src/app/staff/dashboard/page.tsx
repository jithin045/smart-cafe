"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, Clock, Coffee, LogOut, User } from "lucide-react";

export default function StaffDashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [currentTime, setCurrentTime] = useState(new Date());

  const orders = [
    { id: "1024", items: ["2x Cappuccino", "1x Croissant"], time: "4m ago", status: "Preparing", note: "Extra Hot" },
    { id: "1025", items: ["1x Iced Latte", "1x Blueberry Muffin"], time: "2m ago", status: "Queued", note: "" },
    { id: "1026", items: ["3x Espresso"], time: "1m ago", status: "Preparing", note: "Double shot" },
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) router.push("/login");
    if (role !== "staff" && role !== "admin") router.push("/unauthorized");
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-green-900/5 rounded-full blur-[120px]" />
      </div>

      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black uppercase italic tracking-tighter">
              Smart <span className="text-green-500">Café</span>
            </h1>
            
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === "card" ? "bg-green-600 text-black" : "text-gray-400 hover:text-white"}`}
              >
                <LayoutGrid size={14} /> Cards
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === "list" ? "bg-green-600 text-black" : "text-gray-400 hover:text-white"}`}
              >
                <List size={14} /> List
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden lg:block">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Kitchen Node</p>
              <p className="text-xs font-mono text-green-500">{currentTime.toLocaleTimeString()}</p>
            </div>

            {/* Logout Section */}
            <div className="flex items-center gap-2 pl-6 border-l border-white/10">
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/50 rounded-xl transition-all duration-300"
              >
                <LogOut size={14} className="text-red-500 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {viewMode === "card" ? (
            <motion.div 
              key="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {orders.map((order) => (
                <div key={order.id} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-green-500/30 transition-colors">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">#{order.id}</span>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold">{order.time}</span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <Coffee size={14} className="text-gray-600" />
                        <span className="font-medium text-gray-200">{item}</span>
                      </div>
                    ))}
                    {order.note && (
                      <p className="text-[10px] text-yellow-500/80 italic mt-4 bg-yellow-500/5 p-2 rounded-lg border border-yellow-500/10">
                        Note: {order.note}
                      </p>
                    )}
                  </div>
                  <button className="w-full p-4 bg-green-600 hover:bg-green-500 text-black font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                    Complete Order
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Order ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Items</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Time</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-mono text-green-500 text-sm font-bold">#{order.id}</td>
                      <td className="p-4">
                        <p className="text-sm text-gray-300">{order.items.join(", ")}</p>
                        {order.note && <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">{order.note}</span>}
                      </td>
                      <td className="p-4 text-xs text-gray-500 font-bold">{order.time}</td>
                      <td className="p-4 text-right">
                        <button className="px-4 py-2 bg-white/5 hover:bg-green-600 hover:text-black border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                          Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}