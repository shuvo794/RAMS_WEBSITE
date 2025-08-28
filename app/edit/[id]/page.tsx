"use client";

import {
  GET_COUNTRIES_WITHOUT_PAGINATION,
  PACKAGE_ADD_CARD,
  PACKAGE_ADD_CARD_PRICE,
  PACKAGE_ADD_CARD_UPDATE,
  PLANSALL,
  USER_ME,
} from "@/lib/config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

type Packages = {
  id: number | string;
  name: string;
  price: number;
  total_price: number;
  unit_price: number;
  months: number;
};

type PackageSelceted = {
  packages: {
    package_id: number | string;
    months: number;
    quantity: number;
    package_name: string;
    unit_price: number;
    total_price: number;
  }[];
};

type UserMe = {
  first_name: string;
  last_name: string;
  email: string;
  country_code1: number;
  primary_phone: number;
  logo: string;
  rl_no: number;
  city?: string;
  postal_code?: string;
  company_name: string;
  street_address_one: string;
};

type Plan = {
  id?: number | string;
  name: string;
  unit_price?: number;
  total_price?: number;
  months?: number;
};

type Subscription = {
  data: {
    items: {
      package_id: number;
      subscription_item_id: number;
      months: number;
    }[];
    billing_address: {
      city: string;
      company_name: string;
      country: string;
      phone: string;
      street_address_one: string;
      rl_number: string;
      zipcode: string;
      name: string;
    };
    subscription_id: number;
  };
};

export default function SupportCheckout() {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [userToken, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userData, setUserData] = useState<UserMe | null>(null);

  const [countries, setCountries] = useState<
    { id: number | string; name: string }[]
  >([]);
  const [country1, setCountry1] = useState<{
    id: string | number;
    name: string;
  } | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [packages] = useState<Packages | null>(null);
  const [packageSelceted, setPackageSelceted] =
    useState<PackageSelceted | null>(null);
  const [packageData, setPackageData] = useState<string | number | undefined>();
  const [billingCycle, setBillingCycle] = useState<
    "Three" | "Six" | "Year" | ""
  >("");

  // --- Form State ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [rlNumber, setRlNumber] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    country?: string;
    city?: string;
    zip?: string;

    address?: string;
    companyName?: string;
    rlNumber?: string;
  }>({});

  const subscription_item_id = subscription?.data?.subscription_id;
  const token = localStorage.getItem("token");

  // --- Load userId & token from localStorage ---
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    setToken(token);
    setUserId(id);
  }, []);

  // --- Fetch subscription details ---
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
        if (!response.ok) throw new Error("Failed to fetch subscription");
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };
    fetchUserData();
  }, [id, token]);

  // --- Fetch user info ---
  useEffect(() => {
    if (!userId || !userToken) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${USER_ME}${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId, userToken]);

  // --- Initialize form state when subscription loads ---
  useEffect(() => {
    if (subscription?.data?.billing_address) {
      const billing = subscription.data.billing_address;
      setName(billing.name || "");
      setPhone(billing.phone || "");
      setAddress(billing.street_address_one || "");
      setCompanyName(billing.company_name || "");
      setRlNumber(billing.rl_number || "");
      setCity(billing.city || "");
      setZip(billing.zipcode || "");
    }
  }, [subscription]);

  // --- Fetch countries ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_COUNTRIES_WITHOUT_PAGINATION, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch countries");
        const json = await res.json();
        setCountries(json?.countries || []);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
    fetchData();
  }, [token]);

  // --- Fetch Plans ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(PLANSALL);
        const json = await res.json();
        setPlans(json?.package_types || []);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
    fetchData();
  }, []);

  // --- Set country from subscription ---
  useEffect(() => {
    if (subscription?.data?.billing_address?.country) {
      const countryId = subscription.data.billing_address.country;
      const match = countries.find((c) => c.id === countryId);
      if (match) setCountry1({ id: match.id, name: match.name });
    }
  }, [subscription, countries]);

  // --- Handle package price ---
  useEffect(() => {
    let months = 3;
    if (billingCycle.includes("Three")) months = 3;
    else if (billingCycle.includes("Six")) months = 6;
    else if (billingCycle.includes("Year")) months = 12;

    const payload = {
      packages: [
        {
          package_id:
            Number(packageData) || subscription?.data.items[0].package_id,
          months: months || Number(subscription?.data.items[0].months),
          quantity: 1,
        },
      ],
    };

    const fetchPrice = async () => {
      try {
        const res = await fetch(PACKAGE_ADD_CARD_PRICE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to fetch price");
        const data = await res.json();
        setPackageSelceted(data);
      } catch (error) {
        console.error("Price API error:", error);
      }
    };
    fetchPrice();
  }, [billingCycle, packageData, subscription?.data.items, token]);

  useEffect(() => {
    if (subscription?.data.items[0]?.months) {
      const months = subscription.data.items[0].months;
      if (months === 3) setBillingCycle("Three");
      else if (months === 6) setBillingCycle("Six");
      else if (months === 12) setBillingCycle("Year");
    }
  }, [subscription]);

  // --- Handle default package selection ---
  useEffect(() => {
    if (packageSelceted?.packages?.[0]?.package_name) {
      const defaultPack = plans?.find(
        (pack: Plan) => pack.name === packageSelceted.packages[0].package_name
      );
      if (defaultPack) setPackageData(defaultPack.id);
    }
  }, [plans, packageSelceted]);

  // --- Handle Continue ---
  const handleContinue = async () => {
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Name is required";
    if (!phone) newErrors.phone = "Phone is required";
    if (!country1) newErrors.country = "Country is required";
    if (!city) newErrors.city = "city is required";
    if (!zip) newErrors.zip = "Zip code is required";
    if (!address) newErrors.address = "Address is required";
    if (!companyName) newErrors.companyName = "Company Name is required";
    if (!rlNumber) newErrors.rlNumber = "RL Number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let months = 3;
    if (billingCycle.includes("Three")) months = 3;
    else if (billingCycle.includes("Six")) months = 6;
    else if (billingCycle.includes("Year")) months = 12;

    const payload = {
      packages: [
        {
          package: packages?.id || packageData,
          months: months,
          quantity: 1,
        },
      ],
      billing_address: {
        name,
        country: country1?.id || userData?.country_code1,
        phone,
        city,
        zipcode: zip,
        street_address_one: address,
        company_name: companyName,
        rl_number: rlNumber,
      },
    };

    try {
      const response = await fetch(
        `${PACKAGE_ADD_CARD_UPDATE}${subscription_item_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to update package");
      const data = await response.json();
      router.push(`/checkout/${data.subscription_id}`);
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-24 font-sans">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 relative">
            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Plan Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Select
                </label>
                <select
                  className="w-full border rounded px-4 py-2"
                  value={packageData}
                  onChange={(e) => setPackageData(e.target.value)}
                >
                  {plans?.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Billing Cycle */}
              {/* Billing Cycle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month Select
                </label>
                <select
                  className="w-full border rounded px-4 py-2"
                  value={billingCycle}
                  onChange={(e) =>
                    setBillingCycle(e.target.value as "Three" | "Six" | "Year")
                  }
                >
                  <option value="Three">Three Month</option>
                  <option value="Six">Six Month</option>
                  <option value="Year">One Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Name *</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    // Remove error when user types
                    if (errors.name && e.target.value) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Phone *</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Your Phone Number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone && e.target.value)
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Country *</label>
                <Select
                  options={countries.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={
                    country1
                      ? { value: country1.id, label: country1.name }
                      : null
                  }
                  // Country (Select)
                  onChange={(selected) => {
                    setCountry1(
                      selected
                        ? { id: selected.value, name: selected.label }
                        : null
                    );
                    if (errors.country && selected)
                      setErrors((prev) => ({ ...prev, country: undefined }));
                  }}
                  isSearchable
                  isClearable
                  components={{ IndicatorSeparator: () => null }}
                  placeholder="Select Country"
                  className={`w-full border rounded ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">City</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Your City"
                  value={city}
                  // onChange={(e) => setCity(e.target.value)}

                  onChange={(e) => {
                    setCity(e.target.value);
                    // Remove error when user types
                    if (errors.city && e.target.value) {
                      setErrors((prev) => ({ ...prev, city: undefined }));
                    }
                  }}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Zip *</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.zip ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Your Zip Code"
                  value={zip}
                  onChange={(e) => {
                    setZip(e.target.value);
                    if (errors.zip && e.target.value)
                      setErrors((prev) => ({ ...prev, zip: undefined }));
                  }}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Address *</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Your Address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address && e.target.value)
                      setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Company Name *</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.companyName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Company Name"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName && e.target.value)
                      setErrors((prev) => ({
                        ...prev,
                        companyName: undefined,
                      }));
                  }}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium">RL Number *</label>
                <input
                  className={`w-full border rounded px-4 py-2 ${
                    errors.rlNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter RL Number"
                  value={rlNumber}
                  onChange={(e) => {
                    setRlNumber(e.target.value);
                    if (errors.rlNumber && e.target.value)
                      setErrors((prev) => ({ ...prev, rlNumber: undefined }));
                  }}
                />
                {errors.rlNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.rlNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded shadow-sm p-4 bg-white h-fit">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>

          {packageSelceted || packages ? (
            <>
              <div className="flex justify-between mb-1">
                <span>{packageSelceted?.packages[0]?.package_name}</span>
                <span>{packageSelceted?.packages[0]?.unit_price} BDT</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Month:</span>
                <span>{packageSelceted?.packages[0]?.months}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Total:</span>
                <span>{packageSelceted?.packages[0]?.total_price} BDT</span>
              </div>

              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white w-full py-2 px-4 rounded hover:bg-blue-700"
              >
                Continue
              </button>
            </>
          ) : (
            <p>Loading summary...</p>
          )}
        </div>
      </div>
    </div>
  );
}
