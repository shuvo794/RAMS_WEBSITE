"use client";

import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PaymentCancelled() {
  const router = useRouter();

  const handleFinish = () => {
    // redirect to dashboard or home page
    // window.location.href = "/";
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Icon */}
      <div className="mb-6">
        <CircleX size={130} className="text-red-500 font-bold px-4" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2 text-gray-900">
        Your payment has been cancelled.
      </h1>

      <button
        onClick={handleFinish}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        Go To Home
      </button>
    </div>
  );
}
