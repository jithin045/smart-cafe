"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "@/context/CartContext";

import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function CartDrawer({
  open,
  setOpen,
}: Props) {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="
              fixed
              right-0
              top-0
              z-[70]
              h-screen
              w-full
              max-w-md
              bg-[#101010]
              border-l
              border-white/10
              shadow-2xl
              flex
              flex-col
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={20}
                  className="text-green-500"
                />

                <h2 className="text-lg font-bold">
                  Your Cart
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="
                  p-2
                  rounded-full
                  hover:bg-white/5
                  transition
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <ShoppingBag
                    size={50}
                    strokeWidth={1.5}
                    className="mb-4"
                  />

                  <p className="font-semibold">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      bg-white/[0.03]
                      border
                      border-white/[0.05]
                      rounded-2xl
                      p-3
                    "
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          item.image?.trim()
                            ? item.image
                            : "https://via.placeholder.com/100"
                        }
                        alt={item.name}
                        loading="lazy"
                        className="
                          w-14
                          h-14
                          rounded-xl
                          object-cover
                          flex-shrink-0
                        "
                      />

                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">
                          {item.name}
                        </h3>

                        <p className="text-sm text-green-500 font-bold">
                          ₹{item.price}
                        </p>

                        <p className="text-xs text-gray-500">
                          ₹
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-end gap-2">
                      {/* QUANTITY */}
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          bg-black/40
                          border
                          border-white/10
                          rounded-xl
                          px-2
                          py-1
                        "
                      >
                        <button
                          onClick={() =>
                            decreaseQuantity(item._id)
                          }
                          className="
                            p-1
                            rounded-md
                            hover:bg-white/10
                            transition
                          "
                        >
                          <Minus size={14} />
                        </button>

                        <span className="text-sm font-bold w-5 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            addToCart(item)
                          }
                          className="
                            p-1
                            rounded-md
                            hover:bg-white/10
                            transition
                          "
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-gray-500
                          hover:text-red-400
                          transition
                        "
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-white/10 p-5 space-y-4 bg-[#151515]">
              {/* TOTAL */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>

                  <span>
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    Total
                  </span>

                  <span className="text-2xl font-black text-green-500">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CHECKOUT */}
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
              >
                <button
                  disabled={cart.length === 0}
                  className="
                    w-full
                    bg-green-700
                    hover:bg-green-600
                    transition
                    py-3
                    rounded-2xl
                    font-bold
                    active:scale-[0.98]
                    disabled:opacity-50
                    disabled:active:scale-100
                  "
                >
                  Proceed to Checkout
                </button>
              </Link>

              {/* CLEAR CART */}
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-xs
                    text-gray-500
                    hover:text-red-400
                    transition
                  "
                >
                  <Trash2 size={12} />
                  Clear Cart
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}