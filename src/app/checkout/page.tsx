"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!name || !phone) {
      alert("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: name,
        phone,
        tableNumber,
        paymentMethod,

        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),

        totalAmount: total,
      };

      // =========================================
      // CASH / UPI ORDER FLOW
      // =========================================
      if (
        paymentMethod === "Cash" ||
        paymentMethod === "UPI"
      ) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Order creation failed"
          );
        }

        clearCart();

        window.location.href = data.url;

        return;
      }

      // =========================================
      // CARD / STRIPE PAYMENT FLOW
      // =========================================

      // SAVE TEMP ORDER
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify(payload)
      );

      const stripeRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: payload.items,
            customerName: payload.customerName,
            phone: payload.phone,
          }),
        }
      );

      const stripeData = await stripeRes.json();

      if (!stripeRes.ok) {
        throw new Error(
          stripeData.message ||
          "Stripe checkout failed"
        );
      }

      if (!stripeData.url) {
        throw new Error("Stripe URL missing");
      }

      // REDIRECT TO STRIPE
      window.location.href = stripeData.url;

    } catch (error: any) {
      console.error(error);

      alert(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl font-bold">
          Your cart is empty
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="space-y-6">

          <div>
            <p className="text-green-500 uppercase text-xs tracking-[0.3em] font-bold">
              Checkout
            </p>

            <h1 className="text-4xl font-black mt-2">
              Complete Your Order
            </h1>
          </div>

          {/* FORM */}
          <div className="space-y-4">

            <input
              placeholder="Customer Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />

            <input
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(e.target.value)
              }
              className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-4 outline-none"
            />

            {/* PAYMENT */}
            <div className="space-y-3">

              <p className="font-bold">
                Payment Method
              </p>

              <div className="grid grid-cols-3 gap-3">
                {["Cash", "UPI", "Card"].map(
                  (method) => (
                    <button
                      key={method}
                      onClick={() =>
                        setPaymentMethod(method)
                      }
                      className={`py-3 rounded-2xl font-bold border transition ${paymentMethod === method
                        ? "bg-green-700 border-green-700"
                        : "bg-[#111] border-white/10"
                        }`}
                    >
                      {method}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 h-fit">

          <h2 className="text-2xl font-black mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b border-white/5 pb-3"
              >
                <div>
                  <p className="font-bold">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-bold">
                  ₹
                  {item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between mt-6 text-lg font-bold">
            <span>Total</span>

            <span className="text-green-500">
              ₹{total.toFixed(2)}
            </span>
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 transition py-4 rounded-2xl font-black mt-6"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "Card"
                ? "Pay with Card"
                : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}