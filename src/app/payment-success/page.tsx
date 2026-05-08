import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <div className="w-16 h-16 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Verifying Transaction</p>
      </div>
    }>
      <PaymentSuccessClient />
    </Suspense>
  );
}