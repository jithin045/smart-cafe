"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  Package, 
  Settings, 
  TrendingUp, 
  LogOut 
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/unauthorized");
    }
  }, [router]);

  const stats = [
    { label: "Total Revenue", value: "₹42,500", icon: <TrendingUp size={16} />, color: "text-green-500" },
    { label: "Staff Active", value: "12", icon: <Users size={16} />, color: "text-blue-500" },
    { label: "Inventory Alert", value: "03", icon: <Package size={16} />, color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      
      {/* 📟 Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Smart <span className="text-green-600">Café</span>
          </h1>
          <p className="text-[8px] text-gray-600 uppercase tracking-[0.6em] mt-1">Admin Terminal</p>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
            { id: "inventory", label: "Inventory", icon: <Package size={18} /> },
            { id: "staff", label: "Staff Management", icon: <Users size={18} /> },
            { id: "settings", label: "Settings", icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? "bg-green-600 text-black shadow-lg shadow-green-900/20" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/50 transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* 🛡️ Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.5em] mb-1">System Management</h2>
            <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Core Engine: Online</span>
          </div>
        </header>

        {/* 📊 Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {stat.icon}
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* 📋 Data Section (Conditional based on activeTab) */}
        <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Recent System Activity</h3>
            <button className="text-[9px] font-bold text-green-500 hover:underline tracking-widest uppercase">Export Report</button>
          </div>
          
          <div className="space-y-4">
            {/* Example List Item */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center text-green-500">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Transaction #40{item}</p>
                    <p className="text-[10px] text-gray-500 font-medium">Processed via Terminal-A</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black">₹450.00</p>
                  <p className="text-[9px] text-green-500 font-bold uppercase">Success</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  );
}