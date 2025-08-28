"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  PACKAGE_ADD_CARD,
  PACKAGE_ADD_CARD_DELATED,
  PAYEMENT_INTREGATE,
} from "@/lib/config";

type UserMe = {
  data: {
    items: {
      package_id: string;
      package_name: string;
      quantity: number;
      total_price: number;
      months: number;
      billingCycle?: string;
    }[];
    billing_address: {
      city: string;
      company_name: string;
      country: string;
      name: string;
      phone: string;
      rl_number: string;
      street_address_one: string;
      zipcode: string;
    };
    total_amount: number;
  };
};

export default function CheckoutPage() {
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [, setBillingCycle] = useState<string>("");
  // const [packageData, setPackageData] = useState<string | number>("");

  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split("/").pop();

  const [loadingUser, setLoadingUser] = useState(true);

  console.log("ksdkhfkdfhkdhf", userData?.data.items[0]?.package_id);

  // Get token from localStorage
  useEffect(() => {
    const tokenPass = localStorage.getItem("token");
    setToken(tokenPass);
  }, []);

  // Fetch user data
  useEffect(() => {
    if (!id || !token) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${PACKAGE_ADD_CARD}?subscription_id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);

        // Pre-select billing cycle based on months
        const months = data?.data?.items?.[0]?.months;
        const price = data?.data?.items?.[0]?.total_price || 0;
        if (months === 3) setBillingCycle(`${price * 3} BDT Three Month`);
        else if (months === 6) setBillingCycle(`${price * 6} BDT Six Month`);
        else if (months === 12) setBillingCycle(`${price * 12} BDT One Year`);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [id, token]);

  // Handle empty cart
  const handleEmptyCart = async (): Promise<void> => {
    try {
      const response = await fetch(`${PACKAGE_ADD_CARD_DELATED}${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to empty cart");
      }

      await response.json();
      setUserData(null);
    } catch (error) {
      console.error("Error while emptying cart:", error);
    }
  };

  // Promo code validation

  // const handleCheckout = (): void => {
  //   console.log("Proceeding to checkout");
  // };

  const handleCheckout = async () => {
    // Prepare payload for API
    // const payload = {
    //   packages: [
    //     {
    //       package: userData?.data.items[0]?.package_id,
    //       months: userData?.data.items[0]?.months,
    //       quantity: 1, // or dynamic quantity
    //     },
    //     // you can push more objects here if multiple packages are selected
    //   ],
    //   billing_address: {
    //     name: `${userData?.data?.billing_address?.name}`,
    //     country: userData?.data?.billing_address?.country,
    //     phone: userData?.data?.billing_address?.phone,
    //     city: userData?.data?.billing_address?.city,
    //     zipcode: userData?.data?.billing_address?.zipcode,
    //     street_address_one: userData?.data?.billing_address?.street_address_one,
    //     company_name: userData?.data?.billing_address?.company_name,
    //     rl_number: userData?.data?.billing_address?.rl_number,
    //   },
    // };

    try {
      const response = await fetch(`${PAYEMENT_INTREGATE}${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add package");
      }

      const data = await response.json();

      router.push(`${data?.payment_url}`);
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  const handleGoBack = (): void => {
    router.push(`/edit/${id}`);
  };

  if (loadingUser) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen mt-24 bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">
          Review & Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {userData?.data ? (
            <>
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {userData.data.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="bg-blue-700 text-white px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="font-semibold">Package</div>
                        <div className="font-semibold text-right">Price</div>
                      </div>
                    </div>

                    <div className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">
                              {item.package_name}
                            </h3>
                            <button
                              onClick={handleGoBack}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <span className="ml-1 text-sm">Edit</span>
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            Support-Billing
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-lg font-semibold text-gray-800">
                              {item.total_price} BDT
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Months: {item.months}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t bg-gray-50">
                      <button
                        onClick={handleEmptyCart}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart size={16} />
                        Empty Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-600 text-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="border-t border-gray-500 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {userData.data.total_amount} BDT
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Checkout
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              <h3> Subscription not found.</h3>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Back To Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
