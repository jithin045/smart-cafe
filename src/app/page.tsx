"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, ArrowRight, Clock, Sparkles, Zap } from "lucide-react";

const appVisuals = [
  {
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    label: "Precision Roasting",
  },
  {
    url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop",
    label: "Digital Interface",
  },
  {
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    label: "Modern Hub",
  }
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % appVisuals.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30 font-sans antialiased">
      
      {/* MINIMALIST NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Coffee size={18} className="text-white" />
            </div>
            <span>Smart Café</span>
          </div>
          
          <Link 
            href="/menu" 
            className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 transition-all"
          >
            Enter Menu
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* CONTENT SECTION */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest"
              >
                <Sparkles size={12} />
                The Future of Coffee
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-8xl font-bold tracking-tight leading-[0.85]"
              >
                Pure <br />
                <span className="text-gray-500 font-medium">Intent.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg max-w-sm leading-relaxed font-medium"
              >
                Automated preparation. Zero wait times. Exceptional beans. Experience the next generation of brewing technology.
              </motion.p>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
            >
              <Link
                href="/menu"
                className="inline-flex items-center gap-4 bg-green-600 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-green-500 transition-all group shadow-2xl shadow-green-900/20"
              >
                Start Your Order
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* DYNAMIC IMAGE SECTION */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square md:aspect-video w-full overflow-hidden rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl">
              
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img 
                    src={appVisuals[index].url} 
                    alt={appVisuals[index].label}
                    className="w-full h-full object-cover brightness-75 grayscale-[0.2]"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-10 left-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-green-500 mb-2">Automated Experience</p>
                    <h2 className="text-3xl font-bold tracking-tight">{appVisuals[index].label}</h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Minimal Progress Dots */}
              <div className="absolute top-10 right-10 z-30 flex gap-2">
                {appVisuals.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === index ? "w-10 bg-green-500" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Bento Links */}
            <div className="grid grid-cols-2 gap-6 mt-6">
               <div className="p-8 bg-[#0a0a0a] rounded-3xl border border-white/5 flex flex-col gap-4 group hover:border-green-500/30 transition-all">
                  <Clock size={24} className="text-green-500" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">No Queues</h4>
                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">Ready on arrival</p>
                  </div>
               </div>
               <div className="p-8 bg-[#0a0a0a] rounded-3xl border border-white/5 flex flex-col gap-4 group hover:border-green-500/30 transition-all">
                  <Zap size={24} className="text-green-500" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">Precision</h4>
                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">Consistent extraction</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.6em]">Smart Café © 2026 / System Active</p>
      </footer>
    </div>
  );
}