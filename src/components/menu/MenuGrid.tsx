"use client";

import { motion } from "framer-motion";
import MenuCard from "./MenuCard";
import { Product } from "@/types/product";

type Props = {
  products: Product[];
};

export default function MenuGrid({ products }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      {products.map((item) => (
        <MenuCard key={item._id} item={item} />
      ))}
    </motion.div>
  );
}