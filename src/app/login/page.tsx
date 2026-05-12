"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/staff/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#050505] text-white overflow-hidden relative font-sans">
      
      {/* 🌌 Background Aesthetic: Soft Radial Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-800/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm px-8 py-12 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl"
      >
        {/* Branding */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black tracking-tighter uppercase italic"
          >
            Smart <span className="text-green-500">Café</span>
          </motion.h1>
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.6em] mt-2">Authentication Required</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 group-focus-within:text-green-500 transition-colors">
              Email
            </label>
            <input
              type="email"
              placeholder="name@email.com"
              className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-green-500/50 focus:bg-white/[0.06] focus:outline-none transition-all placeholder:text-gray-700 text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1 group-focus-within:text-green-500 transition-colors">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:border-green-500/50 focus:bg-white/[0.06] focus:outline-none transition-all placeholder:text-gray-700 text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#16a34a" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 p-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] mt-6 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Sign In"}
          </motion.button>
        </div>

        {/* Aesthetic Footer Detail */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="w-8 h-[1px] bg-white/10" />
          <p className="text-[8px] font-medium text-gray-600 uppercase tracking-[0.5em] text-center leading-loose">
            Smart Café Ordering System <br />
            <span className="text-gray-800">Secure Protocol v2.0</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}