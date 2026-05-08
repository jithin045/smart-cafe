"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();

  // State for Customer Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); // Required for India Export Regs
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // 1. Validation
    if (!name || !phone || !address) {
      alert("Please provide Name, Phone, and Billing Address (Required for Regulations)");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: name,
        phone,
        address, // Sent to backend for Stripe Customer creation
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalAmount: total,
      };

      // 2. Save temporary order to Local Storage
      localStorage.setItem("pendingOrder", JSON.stringify(payload));

      // 3. Create Stripe Session
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Stripe session failed");
      if (!data.url) throw new Error("Stripe URL missing");

      // 4. Redirect to Stripe
      window.location.href = data.url;

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong during payment initialization");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <p className="text-2xl font-black italic uppercase tracking-tighter mb-6">Your cart is empty</p>
        <Link href="/menu" className="bg-green-600 text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-10 text-xs font-black uppercase tracking-widest">
          <ChevronLeft size={16} /> Back to Menu
        </Link>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none">
                Secure <br /> <span className="text-green-500">Checkout.</span>
              </h1>
              <p className="text-gray-500 mt-4 font-medium italic">Powered by Stripe Encryption</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={18} />
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-5 py-5 focus:border-green-500/50 outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={18} />
                <input
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-5 py-5 focus:border-green-500/50 outline-none transition-all placeholder:text-gray-700"
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-5 top-5 text-gray-600 group-focus-within:text-green-500 transition-colors" size={18} />
                <textarea
                  placeholder="Billing Address (Required for International Cards/RBI)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-5 py-5 focus:border-green-500/50 outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-3xl flex items-center gap-4">
               <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                  <CreditCard size={20} />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-green-500">Card Payment Only</p>
                  <p className="text-sm text-gray-400">Debit, Credit, and Prepaid cards accepted.</p>
               </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 sticky top-32">
              <h2 className="text-xl font-black mb-8 uppercase tracking-tight italic">Order Summary</h2>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center group">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-xs text-gray-400">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-end pt-4">
                  <span className="text-xl font-black tracking-tighter uppercase italic">Total</span>
                  <span className="text-4xl font-black text-green-500 tracking-tighter">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-black py-5 rounded-2xl font-black mt-10 uppercase text-xs tracking-[0.2em] transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(34,197,94,0.2)]"
              >
                {loading ? "Processing..." : "Pay with Card"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}