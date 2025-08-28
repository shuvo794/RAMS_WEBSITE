"use client";

import { Check } from "lucide-react";
import React from "react";

export default function PaymentSuccess() {
  const handleFinish = () => {
    // redirect to dashboard or home page
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Icon */}
      <div className="mb-6">
        <Check size={80} className="text-green-500 font-bold px-4" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2 text-gray-900">
        Payment Successful!
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 mb-6 text-center">
        Your payment has been completed.
      </p>

      {/* Finish Button */}
      <button
        onClick={handleFinish}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition"
      >
        Finish
      </button>
    </div>
  );
}
