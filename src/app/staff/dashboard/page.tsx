"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  CheckCircle2,
  Flame,
  Clock,
  ChefHat,
  User,
  Loader2,
  CheckCircle,
  LayoutGrid,
  Zap,
  PackageCheck
} from "lucide-react";

import { getOrders, updateOrderStatus } from "@/services/api";

type OrderStatus = "ALL" | "PENDING" | "PREPARING" | "READY";

export default function StaffDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [filterTab, setFilterTab] = useState<OrderStatus>("ALL");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);
  }, []);

  const loadOrders = async (authToken: string) => {
    try {
      const res = await getOrders(authToken);
      setOrders(
        res.orders.filter(
          (o: any) => o.status === "PENDING" || o.status === "PREPARING" || o.status === "READY"
        )
      );
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    if (token) loadOrders(token);
  }, [token]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;
    socket.on("connect", () => socket.emit("join-kitchen"));

    socket.on("new-order", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("order-updated", (updatedOrder) => {
      setOrders((prev) => {
        if (updatedOrder.status === "COMPLETED") {
          return prev.filter((o) => o._id !== updatedOrder._id);
        }
        return prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
      });
    });

    return () => {
      socket.off("new-order");
      socket.off("order-updated");
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    setIsUpdating(id);
    try {
      await updateOrderStatus(id, status, token);
      await loadOrders(token);
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  // 🔥 FILTER LOGIC
  const filteredOrders = useMemo(() => {
    if (filterTab === "ALL") return orders;
    return orders.filter((o) => o.status === filterTab);
  }, [orders, filterTab]);

  const getCount = (status: OrderStatus) => {
    if (status === "ALL") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="p-4 md:p-8 bg-[#050505] text-gray-100 min-h-screen font-sans selection:bg-emerald-500/30">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 italic">
            <div className="bg-emerald-500 p-2 rounded-lg">
               <Flame className="text-black" size={28} />
            </div>
            KITCHEN<span className="text-emerald-500">TERMINAL</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2 text-sm uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Real-time Sync Active
          </p>
        </div>

        {/* 🔥 STATUS FILTER TABS */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 self-stretch md:self-auto">
          {[
            { id: "ALL", label: "Queue", icon: LayoutGrid },
            { id: "PENDING", label: "Pending", icon: Timer },
            { id: "PREPARING", label: "Cooking", icon: Zap },
            { id: "READY", label: "Ready", icon: PackageCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as OrderStatus)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all duration-300 ${
                filterTab === tab.id ? "text-black" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {filterTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-emerald-500 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon size={14} />
                {tab.label}
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                  filterTab === tab.id ? "bg-black/20" : "bg-white/5"
                }`}>
                  {getCount(tab.id as OrderStatus)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* ORDERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-500 ${
                order.status === "READY" 
                ? "bg-emerald-500/[0.05] border-emerald-500/30 shadow-[0_0_40px_-15px_rgba(16,185,129,0.1)]" 
                : order.status === "PREPARING"
                ? "bg-yellow-500/[0.03] border-yellow-500/20"
                : "bg-white/[0.02] border-white/10"
              }`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${
                order.status === "READY" ? "bg-emerald-500 animate-pulse" : 
                order.status === "PREPARING" ? "bg-yellow-500" : "bg-white/20"
              }`} />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className={`text-4xl font-black italic tracking-tighter ${
                    order.status === "READY" ? "text-emerald-500" : 
                    order.status === "PREPARING" ? "text-yellow-500" : "text-gray-400"
                  }`}>
                    #{order.tokenNumber}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <User size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                      {order.customerName}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <Clock size={18} className="text-gray-500" />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        order.status === "READY" ? "bg-emerald-500" : "bg-emerald-500/40"
                      }`} />
                      <span className="text-sm font-semibold text-gray-300 uppercase italic truncate max-w-[150px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/5">
                      X{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {order.status === "PENDING" ? (
                  <button
                    disabled={isUpdating === order._id}
                    onClick={() => updateStatus(order._id, "PREPARING")}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
                  >
                    {isUpdating === order._id ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <ChefHat size={20} className="group-hover:rotate-12 transition-transform" />
                        START PREPARATION
                      </>
                    )}
                  </button>
                ) : order.status === "PREPARING" ? (
                  <button
                    disabled={isUpdating === order._id}
                    onClick={() => updateStatus(order._id, "READY")}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    {isUpdating === order._id ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <CheckCircle2 size={18} />
                        MARK AS READY
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled={isUpdating === order._id}
                    onClick={() => updateStatus(order._id, "COMPLETED")}
                    className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/10"
                  >
                    {isUpdating === order._id ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <CheckCircle size={18} className="text-emerald-500" />
                        ORDER SERVED (DONE)
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* EMPTY STATE */}
      {filteredOrders.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[50vh] border-2 border-dashed border-white/5 rounded-[40px] mt-4"
        >
          <div className="bg-white/5 p-8 rounded-full mb-6">
            <LayoutGrid className="text-gray-700" size={60} strokeWidth={1} />
          </div>
          <p className="text-gray-500 font-black italic tracking-widest text-xl uppercase">
            No orders in this category
          </p>
        </motion.div>
      )}
    </div>
  );
}