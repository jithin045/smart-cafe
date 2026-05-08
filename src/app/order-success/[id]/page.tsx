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

          const animationEnd =
            Date.now() + duration;

          const interval = setInterval(() => {
            const timeLeft =
              animationEnd - Date.now();

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
        console.error(
          "Failed to fetch order:",
          error
        );
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
    return (
      <Loading text="Verifying Order..." />
    );
  }

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

        <h1 className="text-2xl font-black mb-2">
          Order Not Found
        </h1>

        <p className="text-gray-500 text-sm mb-6 text-center">
          The order you are looking for does not exist.
        </p>

        <Link
          href="/menu"
          className="bg-green-700 hover:bg-green-600 px-6 py-3 rounded-2xl font-bold transition"
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          w-full
          max-w-md
          bg-[#111]
          border
          border-white/10
          rounded-3xl
          p-8
          space-y-6
        "
      >

        {/* SUCCESS ICON */}
        <div className="text-center">
          <CheckCircle2
            className="text-green-500 mx-auto mb-4"
            size={65}
          />

          <p className="text-green-500 uppercase tracking-[0.3em] text-xs font-bold">
            Order Confirmed
          </p>

          <h1 className="text-3xl font-black mt-2">
            Thank You ☕
          </h1>
        </div>

        {/* TOKEN */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center">

          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Token Number
          </p>

          <p className="text-4xl font-black text-green-500">
            #{order.tokenNumber}
          </p>
        </div>

        {/* STATUS */}
        <div className="grid grid-cols-2 gap-3">

          <div className="bg-black/30 border border-white/10 rounded-2xl p-4">

            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
              <Clock3 size={14} />
              Status
            </div>

            <p className="mt-2 font-black text-green-500">
              {order.status}
            </p>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-4">

            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
              <CreditCard size={14} />
              Payment
            </div>

            <p className="mt-2 font-black text-green-500">
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-3">

          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Ordered Items
          </p>

          {order.items.map((item, index) => (
            <div
              key={index}
              className="
                flex
                justify-between
                items-center
                border-b
                border-white/5
                pb-3
                text-sm
              "
            >
              <div>
                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-gray-500 text-xs">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="font-bold">
                ₹
                {item.price *
                  item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">

          <span className="text-lg font-bold">
            Total
          </span>

          <span className="text-2xl font-black text-green-500">
            ₹{order.totalAmount}
          </span>
        </div>

        {/* ACTION BUTTON */}
        <Link
          href="/menu"
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-green-700
            hover:bg-green-600
            transition
            py-4
            rounded-2xl
            font-bold
          "
        >
          <ArrowLeft size={18} />
          Back to Menu
        </Link>

      </motion.div>
    </div>
  );
}