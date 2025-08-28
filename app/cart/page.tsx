"use client";

import {
  GET_COUNTRIES_WITHOUT_PAGINATION,
  PACKAGE_ADD_CARD_PRICE,
  PACKAGE_ADD_TO,
  PACKAGE_ID,
  PLANSALL,
  USER_ME,
} from "@/lib/config";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
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
  //   id: number | string;
  //   name: string;
};

// interface Plans {
//   id: number | string;
//   name: string;
//   // add more fields if needed
// }

export default function SupportCheckout() {
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const router = useRouter();
  const [city, setCity] = useState("");

  const [userData, setUserData] = useState<UserMe | null>(null);
  const [userToken, setToken] = useState<string | null>(null);
  const [countries, setCountries] = useState<
    { id: number | string; name: string }[]
  >([]);
  const [country1, setCountry1] = useState<{
    id: string | number;
    name: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    country?: string;
    city?: string;
    zip?: string;
    address?: string;
    companyName?: string;
    rlNumber?: string;
  }>({});

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [rlNumber, setRlNumber] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);

  const [packages, setPackages] = useState<Packages | null>(null);
  const [packageSelceted, setPackageSelceted] =
    useState<PackageSelceted | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<string>("");

  const [packageData, setPackageData] = useState<string | number | undefined>();
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    setToken(token);

    setUserId(id);
  }, []);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${PACKAGE_ID}${id}`);
        const json = await res.json();
        setPackages(json || null);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [id]);

  // packages.price
  useEffect(() => {
    if (packages?.price) {
      setBillingCycle(`${packages.price.toFixed(2)} BDT Monthly`);
    }
  }, [packages?.price]);

  useEffect(() => {
    // month
    let months = 3;
    if (billingCycle.includes("Three")) months = 3;
    else if (billingCycle.includes("Six")) months = 6;
    else if (billingCycle.includes("Year")) months = 12;

    const payload = {
      packages: [
        {
          package_id: Number(packageData) || id,
          months: months,
          quantity: 1,
        },
      ],
    };

    // API call
    const fetchPrice = async () => {
      try {
        const res = await fetch(PACKAGE_ADD_CARD_PRICE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
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
  }, [billingCycle, packageData, packages?.id, id, userToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_COUNTRIES_WITHOUT_PAGINATION, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
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
  }, [userToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(PLANSALL);
        const json = await res.json();
        setPlans(json?.package_types || null);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
    fetchData();
  }, []);

  // then use it instead of `any`
  useEffect(() => {
    if (packageSelceted?.packages?.[0]?.package_name) {
      const defaultPack = plans?.find(
        (pack: Plan) => pack.name === packageSelceted.packages[0].package_name
      );
      if (defaultPack) {
        setPackageData(defaultPack.id);
      }
    }
  }, [plans, packageSelceted]);

  const handleContinue = async () => {
    const newErrors: {
      country?: string;
      city?: string;
      zip?: string;
      address?: string;
      companyName?: string;
    } = {};

    if (!country1) newErrors.country = "Country is required";
    if (!city || city.trim() === "") newErrors.city = "City is required";
    if (!zip || zip.trim() === "") newErrors.zip = "Zip is required";
    if (!companyName || companyName.trim() === "")
      newErrors.companyName = "Company Name is required";
    if (!address || address.trim() === "")
      newErrors.address = "Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop save
    }
    let months = 3;
    if (billingCycle.includes("Three")) months = 3;
    else if (billingCycle.includes("Six")) months = 6;
    else if (billingCycle.includes("Year")) months = 12;

    // Prepare payload for API
    const payload = {
      packages: [
        {
          package: packages?.id || packageData, // package id
          months: months,
          quantity: 1, // or dynamic quantity
        },
        // you can push more objects here if multiple packages are selected
      ],
      billing_address: {
        name: name || `${userData?.first_name} ${userData?.last_name}`,
        country: country1?.id || userData?.country_code1,
        phone: phone || userData?.primary_phone,
        city: city || userData?.city,
        zipcode: zip || userData?.postal_code,
        street_address_one: address || userData?.street_address_one,
        company_name: companyName || userData?.company_name,
        rl_number: rlNumber || userData?.rl_no,
      },
    };

    try {
      const response = await fetch(PACKAGE_ADD_TO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Status:", response.status);

      const data = await response.json(); // 👈 this gets { success: false, message: "..." }
      console.log("API Response:", data);
      if (!data.success) {
        setErrorMessage(data.message);
        setErrorModalOpen(true);
        return;
      } else {
        router.push(`/checkout/${data.subscription_id}`);
      }

      router.push(`/checkout/${data.subscription_id}`);
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-24 font-sans">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>
      {errorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            </div>

            {/* Message */}
            <p className="text-gray-700 mb-6">{errorMessage}</p>

            {/* Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setErrorModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Product Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4 relative">
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Plan Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    package Select
                  </label>
                  <select
                    className="w-full border rounded px-4 py-2"
                    value={packageData}
                    onChange={(e) => {
                      setPackageData(e.target.value);
                    }}
                  >
                    {plans?.map((pack) => (
                      <option key={pack.id} value={pack.id}>
                        {pack.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month Select
                  </label>
                  <select
                    className="w-full border rounded px-4 py-2"
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                  >
                    <option
                      value={`${(packages?.price || 0) * 3} BDT Three Month`}
                    >
                      Three Month
                    </option>
                    <option
                      value={`${(packages?.price || 0) * 6} BDT Six Month`}
                    >
                      Six Month
                    </option>
                    <option
                      value={`${(packages?.price || 0) * 12} BDT One Year`}
                    >
                      One Year
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="space-y-4">
              {/* Standard Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Name *</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your Name"
                    value={
                      name
                        ? name
                        : userData
                        ? `${userData.first_name} ${userData.last_name}`
                        : ""
                    }
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">Phone *</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your Phone Number"
                    value={
                      phone ||
                      `${userData?.country_code1} ${userData?.primary_phone}` ||
                      ""
                    }
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div>
                    <label className="block font-medium">Country *</label>
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
                      onChange={(selected) => {
                        if (selected) {
                          setCountry1({
                            id: selected.value,
                            name: selected.label,
                          });
                          setErrors((prev) => ({
                            ...prev,
                            country: undefined,
                          })); // remove error
                        } else {
                          setCountry1(null);
                        }
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium">City</label>
                  <input
                    className={`w-full border rounded px-4 py-2 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter Your City"
                    value={city || userData?.city || ""}
                    onChange={(e) => {
                      setCity(e.target.value);

                      // jodi value thake tahole error clear hoye jabe
                      if (e.target.value.trim() !== "") {
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
                    value={zip || userData?.postal_code || ""}
                    onChange={(e) => {
                      setZip(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, zip: undefined }));
                      }
                    }}
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>

                <div>
                  <div>
                    <label className="block font-medium">Address</label>
                    <input
                      className={`w-full border rounded px-4 py-2 ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter Your Address"
                      value={address || userData?.street_address_one || ""}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        // Remove error immediately if user types something
                        if (e.target.value.trim() !== "") {
                          setErrors((prev) => ({
                            ...prev,
                            address: undefined,
                          }));
                        }
                      }}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">Company Name</label>
                    <input
                      className={`w-full border rounded px-4 py-2 ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Company Name"
                      value={companyName || userData?.company_name}
                      // onChange={(e) => setCompanyName(e.target.value)}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        // Remove error immediately if user types something
                        if (e.target.value.trim() !== "") {
                          setErrors((prev) => ({
                            ...prev,
                            companyName: undefined,
                          }));
                        }
                      }}
                    />

                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">RL Number</label>
                    <input
                      className="w-full border rounded px-4 py-2"
                      placeholder="Enter RL Number"
                      value={rlNumber || userData?.rl_no || ""}
                      onChange={(e) => setRlNumber(e.target.value)}
                    />
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>

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

              <div className="text-xl font-bold text-center border-t pt-3">
                <span>{packageSelceted?.packages[0]?.total_price} BDT</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">No package selected</p>
          )}

          <button
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded flex justify-center items-center gap-2"
            onClick={handleContinue}
          >
            Continue <span>➜</span>
          </button>
        </div>
      </div>
    </div>
  );
}
