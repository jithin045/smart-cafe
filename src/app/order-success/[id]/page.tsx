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

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const socketRef =
    useRef<Socket | null>(null);

  const readyConfettiTriggered =
    useRef(false);

  // =========================
  // LOAD ORDER
  // =========================
  useEffect(() => {
    if (!id || id === "undefined") {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const data =
          await getOrderById(id);

        const orderData =
          data.order || data;

        setOrder(orderData);
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
  // REALTIME SOCKET
  // =========================
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(
        process.env
          .NEXT_PUBLIC_API_URL!,
        {
          transports: ["websocket"],
        }
      );
    }

    const socket = socketRef.current;

    socket.on(
      "order-updated",
      (updatedOrder) => {
        if (
          updatedOrder._id === id
        ) {
          setOrder(updatedOrder);

          // 🎉 Confetti when READY
          if (
            updatedOrder.status ===
              "READY" &&
            !readyConfettiTriggered.current
          ) {
            readyConfettiTriggered.current =
              true;

            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.6 },
            });
          }
        }
      }
    );

    return () => {
      socket.off("order-updated");
    };
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <Loading text="Tracking Order..." />
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
  // STATUS CONFIG
  // =========================
  const steps = [
    "PENDING",
    "PREPARING",
    "READY",
    "COMPLETED",
  ];

  const currentStep =
    steps.indexOf(order.status);

  const statusText = {
    PENDING: "Order Received",
    PREPARING:
      "Preparing Your Food",
    READY: "Ready for Pickup",
    COMPLETED:
      "Order Completed",
  };

  const statusIcon = {
    PENDING: <Timer size={24} />,
    PREPARING: (
      <ChefHat size={24} />
    ),
    READY: (
      <PackageCheck size={24} />
    ),
    COMPLETED: (
      <CheckCircle2 size={24} />
    ),
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          w-full
          max-w-md
          bg-[#111]
          border
          border-white/10
          rounded-3xl
          p-8
          space-y-8
        "
      >

        {/* TOKEN */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Live Tracking
          </p>

          <h1 className="text-5xl font-black text-green-500 mt-3">
            #{order.tokenNumber}
          </h1>

          <p className="mt-3 text-gray-400">
            Your order is being tracked live
          </p>
        </div>

        {/* STATUS CARD */}
        <motion.div
          key={order.status}
          initial={{
            scale: 0.95,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="
            bg-green-500/10
            border
            border-green-500/20
            rounded-3xl
            p-6
            text-center
          "
        >
          <div className="flex justify-center text-green-500 mb-4">
            {statusIcon[
              order.status as keyof typeof statusIcon
            ]}
          </div>

          <h2 className="text-2xl font-black text-green-500">
            {
              statusText[
                order.status as keyof typeof statusText
              ]
            }
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Current Status:
            {" "}
            {order.status}
          </p>
        </motion.div>

        {/* PROGRESS BAR */}
        <div className="space-y-4">

          {steps.map(
            (step, index) => (
              <div
                key={step}
                className="flex items-center gap-4"
              >
                <div
                  className={`
                    w-5 h-5 rounded-full border-2
                    ${
                      index <=
                      currentStep
                        ? "bg-green-500 border-green-500"
                        : "border-gray-600"
                    }
                  `}
                />

                <div>
                  <p
                    className={`
                      text-sm font-bold
                      ${
                        index <=
                        currentStep
                          ? "text-white"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {step}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* ITEMS */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Items
          </p>

          {order.items.map(
            (item, index) => (
              <div
                key={index}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  border-white/5
                  pb-3
                "
              >
                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Qty:
                    {" "}
                    {item.quantity}
                  </p>
                </div>

                <p className="font-bold">
                  ₹
                  {item.price *
                    item.quantity}
                </p>
              </div>
            )
          )}
        </div>

        {/* PAYMENT */}
        <div className="flex justify-between items-center bg-black/40 border border-white/10 rounded-2xl p-4">

          <div className="flex items-center gap-2 text-gray-400">
            <CreditCard size={16} />
            Payment
          </div>

          <p className="font-black text-green-500">
            {order.paymentStatus}
          </p>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center border-t border-white/10 pt-5">

          <span className="text-lg font-bold">
            Total
          </span>

          <span className="text-3xl font-black text-green-500">
            ₹{order.totalAmount}
          </span>
        </div>

        {/* BACK */}
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
            py-4
            rounded-2xl
            font-bold
            transition
          "
        >
          <ArrowLeft size={18} />
          Back to Menu
        </Link>

      </motion.div>
    </div>
  );
}