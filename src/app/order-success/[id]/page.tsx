"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/api";
import {
  CheckCircle2,
  ArrowLeft,
  Clock3,
  CreditCard,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
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

export default function OrderPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const confettiTriggered = useRef(false);

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

        // 🎉 CONFETTI ONLY ONCE
        if (!confettiTriggered.current) {
          confettiTriggered.current = true;

          const duration = 4000;
          const animationEnd = Date.now() + duration;

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              clearInterval(interval);
              return;
            }

            confetti({
              particleCount: 35,
              spread: 80,
              origin: {
                x: Math.random(),
                y: Math.random() - 0.2,
              },
            });
          }, 250);
        }

      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <Loading text="Confirming your order..." />;
  }

  // =========================
  // ORDER NOT FOUND
  // =========================
  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-black mb-2 tracking-tight">Order Not Found</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">
          We couldn't find this order in our system.
        </p>
        <Link
          href="/menu"
          className="bg-emerald-700 hover:bg-emerald-600 px-6 py-3 rounded-2xl font-bold transition"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  // =========================
  // SUCCESS PAGE
  // =========================
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-10 font-sans selection:bg-emerald-500/30">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl"
      >
        {/* SUCCESS ICON */}
        <div className="text-center">
          <CheckCircle2
            className="text-emerald-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            size={65}
          />
          <p className="text-emerald-500 uppercase tracking-[0.3em] text-xs font-bold">
            Order Confirmed
          </p>
          <h1 className="text-3xl font-black mt-2 tracking-tight">Thank You ☕</h1>
        </div>

        {/* TOKEN */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Your Token Number
          </p>
          <p className="text-5xl font-black text-emerald-500 tracking-tighter italic">
            #{order.tokenNumber}
          </p>
        </div>

        {/* STATUS BRIEF */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
              <Clock3 size={14} /> Status
            </div>
            <p className="mt-2 font-black text-emerald-500 uppercase tracking-wide">
              {order.status === "PENDING" ? "Accepted" : order.status === "PREPARING" ? "Preparing" : order.status === "READY" ? "Ready" : "Served"}
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
              <CreditCard size={14} /> Payment
            </div>
            <p className="mt-2 font-black text-emerald-500 uppercase tracking-wide">
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Your Order
          </p>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-white/5 pb-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-gray-200">{item.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-300">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-lg font-bold text-gray-400">Total Bill</span>
          <span className="text-2xl font-black text-emerald-500">
            ₹{order.totalAmount}
          </span>
        </div>

        {/* INTERACTIVE NAVIGATION PORTS */}
        <div className="space-y-3 pt-2">
          <Link
            href={`/track/${order._id}`}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-[0.99]"
          >
            <Activity size={18} className="animate-pulse" />
            TRACK YOUR ORDER
          </Link>

          <Link
            href="/menu"
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition py-4 rounded-2xl font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Back to Menu
          </Link>
        </div>
      </motion.div>
    </div>
  );
}