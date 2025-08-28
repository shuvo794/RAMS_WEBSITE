"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PaymentFailed() {
  const router = useRouter();

  const handleFinish = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <div className="flex flex-col items-center text-center">
        {/* Red Circle with Icon */}
        <div className="w-28 h-28 flex items-center justify-center rounded-full bg-red-600 mb-6">
          <AlertCircle size={60} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900">Payment Failed</h1>

        {/* Subtitle */}
        <p className="text-gray-600 mt-1 mb-6">Please Try Again</p>

        {/* Button */}
        <button
          onClick={handleFinish}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Go To Home
        </button>
      </div>
    </div>
  );
}
