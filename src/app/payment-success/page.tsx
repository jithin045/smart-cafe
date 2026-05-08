"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      try {
        const sessionId =
          searchParams.get("session_id");

        console.log("✅ Stripe Session:", sessionId);

        // GET PENDING ORDER
        const pendingOrder =
          localStorage.getItem("pendingOrder");

        if (!pendingOrder) {
          alert("No pending order found");
          return;
        }

        const orderData = JSON.parse(pendingOrder);

        console.log("📦 Pending Order:", orderData);

        // SAVE ORDER IN DATABASE
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...orderData,
              paymentStatus: "PAID",
              stripeSessionId: sessionId,
            }),
          }
        );
        const data = await res.json();

        console.log("✅ Order Created:", data);

        // CLEAR CART STORAGE
        localStorage.removeItem(
          "pendingOrder"
        );

        // IMPORTANT
        const orderId =
          data.order?._id || data._id;

        // REDIRECT TO SUCCESS PAGE
        router.push(
          `/order-success/${orderId}`
        );

      } catch (error) {
        console.log(error);
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