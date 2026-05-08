"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, Loader2 } from "lucide-react";

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const pendingOrder = localStorage.getItem("pendingOrder");

        if (!pendingOrder) {
          // Instead of a native alert, you could route to an error page
          router.push("/menu");
          return;
        }

        const orderData = JSON.parse(pendingOrder);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderData,
            paymentStatus: "PAID",
            stripeSessionId: sessionId,
          }),
        });

        const data = await res.json();
        localStorage.removeItem("pendingOrder");

        const orderId = data.order?._id || data._id;
        
        // Small delay to let the animation breathe before redirecting
        setTimeout(() => {
          router.push(`/order-success/${orderId}`);
        }, 1500);

      } catch (error) {
        console.error("Payment Success Error:", error);
      }
    };

    createOrderAfterPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-600/5 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Modern Loader Design */}
        <div className="relative mb-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-t-2 border-r-2 border-green-600 border-l-2 border-l-transparent border-b-2 border-b-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <Coffee size={32} className="text-green-500" />
          </div>
        </div>

        {/* Status Text */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">
            Authenticating <span className="text-green-600">Payment</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
             <div className="h-1 w-1 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
             <div className="h-1 w-1 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
             <div className="h-1 w-1 bg-green-600 rounded-full animate-bounce" />
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] pt-4">
            Securing your order...
          </p>
        </motion.div>

      </div>

      {/* Bottom Visual Detail */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <Loader2 size={10} className="animate-spin" /> encrypted transaction
            </p>
        </div>
      </div>
    </div>
  );
}