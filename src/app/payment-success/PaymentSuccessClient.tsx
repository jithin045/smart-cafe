"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        console.log("✅ Stripe Session:", sessionId);

        const pendingOrder = localStorage.getItem("pendingOrder");

        if (!pendingOrder) {
          alert("No pending order found");
          return;
        }

        const orderData = JSON.parse(pendingOrder);

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...orderData,
            paymentStatus: "PAID",
            stripeSessionId: sessionId,
          }),
        });

        const data = await res.json();

        console.log("✅ Order Created:", data);

        localStorage.removeItem("pendingOrder");

        const orderId = data.order?._id || data._id;

        router.push(`/order-success/${orderId}`);
      } catch (error) {
        console.error("Payment Success Error:", error);
        alert("Failed to create order");
      }
    };

    createOrderAfterPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Processing Payment...
    </div>
  );
}