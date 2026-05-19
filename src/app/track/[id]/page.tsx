"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getOrderById } from "@/services/api";
import {
  CheckCircle2,
  ArrowLeft,
  Clock3,
  CreditCard,
  ChefHat,
  PackageCheck,
  Timer,
  Receipt,
  Activity,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/common/Loading";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  tokenNumber: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
};

export default function CustomerTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  // =========================
  // INITIAL ORDER FETCH
  // =========================
  useEffect(() => {
    if (!id || id === "undefined") {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await getOrderById(id);
        const orderData = data.order || data;
        setOrder(orderData);
      } catch (error) {
        console.error("Tracking fetch sequence failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // =========================
  // REAL-TIME SOCKET PIPELINE
  // =========================
  useEffect(() => {
    if (!id) return;

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    socket.on("order-updated", (updatedOrder) => {
      const receivedIdRaw = updatedOrder._id?.$oid || updatedOrder._id;
      
      const cleanUrlId = String(id).trim().toLowerCase();
      const cleanReceivedId = String(receivedIdRaw).trim().toLowerCase();

      if (cleanReceivedId === cleanUrlId) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off("order-updated");
    };
  }, [id]);

  if (loading) {
    return <Loading text="Updating order status..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-black mb-2 tracking-tight text-red-500">ORDER NOT FOUND</h1>
        <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">
          We couldn't find an active order linked to this link.
        </p>
        <Link href="/menu" className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl transition">
          Back to Menu
        </Link>
      </div>
    );
  }

  // ==========================================
  // STEP IDENTIFICATION LOGIC
  // ==========================================
  const steps = ["PENDING", "PREPARING", "READY"];
  const currentStep = steps.indexOf(order.status);

  const statusText = {
    PENDING: "Order Confirmed",
    PREPARING: "Preparing Your Order",
    READY: "Ready for Pickup",
    COMPLETED: "Enjoy Your Order! ☕",
  };

  const statusIcon = {
    PENDING: <Timer size={36} className="animate-pulse text-gray-400" />,
    PREPARING: <ChefHat size={36} className="animate-bounce text-amber-500" />,
    READY: <PackageCheck size={36} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />,
    COMPLETED: <CheckCircle2 size={36} className="text-emerald-500" />,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-4 md:p-8 lg:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* UPPER ROUTING CONSOLE */}
        <header className="flex justify-between items-center border-b border-white/5 pb-6">
          <Link href="/menu" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition">
            <ArrowLeft size={16} /> Return to Menu
          </Link>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-black bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Live Order Tracking Active
          </div>
        </header>

        {/* DOUBLE COLUMN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER: STAGE TRACKERS & STEPS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* TOKEN BLOCK */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Cafe Pickup Ticket</p>
                <h2 className="text-2xl font-black tracking-tight text-gray-200 mt-1">Your Order Token</h2>
              </div>
              <div className="bg-black/50 border border-white/10 px-8 py-4 rounded-2xl text-center shadow-inner min-w-[140px]">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Token No.</p>
                <span className="text-5xl font-black tracking-tighter text-emerald-500 italic">#{order.tokenNumber}</span>
              </div>
            </div>

            {/* LIVE PHASING STAGE STATUS HEADER */}
            <AnimatePresence mode="wait">
              <motion.div
                key={order.status}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  boxShadow: order.status === "READY" ? "0px 0px 50px -10px rgba(16, 185, 129, 0.25)" : "none"
                }}
                exit={{ scale: 0.98, opacity: 0 }}
                className={`border rounded-[32px] p-8 flex items-center gap-6 transition-all duration-500 ${
                  order.status === "READY" ? "bg-emerald-500/[0.04] border-emerald-500" : 
                  order.status === "PREPARING" ? "bg-amber-500/[0.02] border-amber-500/20" :
                  "bg-white/[0.02] border-white/10"
                }`}
              >
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl shrink-0">
                  {statusIcon[order.status as keyof typeof statusIcon] || <ShoppingBag size={36} className="text-emerald-500" />}
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-white uppercase italic">
                    {statusText[order.status as keyof typeof statusText] || "Picked Up"}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1.5 flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 animate-pulse" /> Current Status: {order.status}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* STEP BY STEP CHRONOLOGY PROGRESSION MAP */}
            {order.status !== "COMPLETED" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 space-y-6"
              >
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Clock3 size={14} className="text-emerald-500" /> Preparation Progress
                </p>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 relative">
                  {steps.map((step, index) => {
                    const isPassed = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 flex-1 w-full sm:w-auto">
                        
                        {/* SOLID EMERALD THEME FOR ALL PASSED & ACTIVE NODES */}
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 font-mono font-black text-xs ${
                          isPassed 
                            ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                            : "border-neutral-800 bg-black text-neutral-600"
                        } ${isCurrent ? "scale-110 animate-pulse" : ""}`}>
                          {isPassed ? "✓" : index + 1}
                        </div>

                        {/* Label Text */}
                        <div className="sm:text-center">
                          <p className={`text-xs font-black uppercase tracking-wider transition-colors duration-300 ${
                            isPassed ? "text-emerald-400" : "text-neutral-600"
                          }`}>
                            {step === "PENDING" ? "Accepted" : step === "PREPARING" ? "Preparing" : "Ready"}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                  
                  {/* Background Connector Bar Line */}
                  <div className="hidden sm:block absolute top-[15px] left-6 right-6 h-[2px] bg-neutral-900 -z-0" />
                </div>
              </motion.div>
            )}

          </div>

          {/* RIGHT CONTAINER: TAX RECEIPT BREAKDOWN */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-8 space-y-6 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 border-b border-white/5 pb-4">
                <Receipt size={14} className="text-emerald-500" /> Order Summary
              </p>

              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-gray-200 uppercase tracking-tight italic text-base">{item.name}</p>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-gray-300 text-base">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center bg-black/50 border border-white/5 rounded-2xl p-4 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                    <CreditCard size={14} /> Payment Status
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400">
                    {order.paymentStatus}
                  </p>
                </div>

                <div className="flex justify-between items-end pt-2 px-2">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total Bill</span>
                  <span className="text-4xl font-black tracking-tighter text-emerald-500 italic">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}