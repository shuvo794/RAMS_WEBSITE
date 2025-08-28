"use client";

import {
  GET_COUNTRIES_WITHOUT_PAGINATION,
  PACKAGE_ADD_CARD_PRICE,
  PACKAGE_ADD_TO,
  PACKAGE_ID,
  PLANSALL,
} from "@/lib/config";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

type Packages = {
  name: string;
  price: number;
};
type PackageSelceted = {
  unit_price: number;
  total_price: number;
  months: number;
};

type Plan = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  serial_number: number;
  name: string;
  period: string;
  features: string[];
};

export default function SupportCheckout() {
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const router = useRouter();
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState<
    { id: number | string; name: string }[]
  >([]);
  const [country1, setCountry1] = useState<string | number | null>(null);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  // const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [rlNumber, setRlNumber] = useState("");
  // const [subCreaptionID, setSubCreaptionID] = useState("");
  const routeParams = useParams();
  const [packages, setPackages] = useState<Packages | null>(null);
  const [packageSelceted, setPackageSelceted] =
    useState<PackageSelceted | null>(null);

  const [billingCycle, setBillingCycle] = useState<string>("");
  const token = localStorage.getItem("token");
  const [, setPlans] = useState<Plan[]>([]);

  // packages.price
  useEffect(() => {
    if (packages?.price) {
      setBillingCycle(`${packages.price.toFixed(2)} BDT Monthly`);
    }
  }, [packages?.price]);

  // billingCycle change হলে API call
  useEffect(() => {
    if (!billingCycle) return;

    // month
    let months = 3;
    if (billingCycle.includes("Three")) months = 3;
    else if (billingCycle.includes("Six")) months = 6;
    else if (billingCycle.includes("Year")) months = 12;

    const payload = {
      package_id: Number(routeParams?.id),
      months: months,
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
        console.log("Price API response:", data);
      } catch (error) {
        console.error("Price API error:", error);
      }
    };

    fetchPrice();
  }, [billingCycle, routeParams?.id, token]);

  // Fetch package data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${PACKAGE_ID}${routeParams?.id}`);
        const json = await res.json();
        setPackages(json || null);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }
    fetchData();
  }, [routeParams?.id]);

  useEffect(() => {
    const fetchServiceSliders = async () => {
      try {
        const response = await fetch(PLANSALL);
        if (!response.ok) {
          throw new Error("Failed to fetch service sliders");
        }
        const data = await response.json();
        if (data && data?.package_types) {
          const sortedSliders = [...data.package_types].sort(
            (a, b) => a.serial_number - b.serial_number
          );
          setPlans(sortedSliders);
        }
      } catch (err) {
        console.error("Error fetching service sliders:", err);
      } finally {
      }
    };

    fetchServiceSliders();
  }, []);

  // Save to localStorage on Continue
  // const handleSaveToLocalStorage = () => {
  //   const formData = {
  //     name,
  //     country1,
  //     country2,
  //     phone,
  //     city,
  //     zip,
  //     rlNumber,
  //     companyName,
  //     address,
  //     billingCycle,
  //     packageId: routeParams?.id,
  //     packageName: packages?.name,
  //     packagePrice: packages?.price,
  //   };

  //   localStorage.setItem("checkoutData", JSON.stringify(formData));
  // };

  //  const fetchPrice = async () => {
  //       try {
  //         const res = await fetch(PACKAGE_ADD_CARD_PRICE, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify(payload),
  //         });
  //         if (!res.ok) throw new Error("Failed to fetch price");
  //         const data = await res.json();
  //         setPackageSelceted(data);
  //         console.log("Price API response:", data);
  //       } catch (error) {
  //         console.error("Price API error:", error);
  //       }
  //     };

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

  const handleContinue = async () => {
    // Extract months from billingCycle string
    let months = 3;
    if (billingCycle.includes("Three")) months = 3;
    else if (billingCycle.includes("Six")) months = 6;
    else if (billingCycle.includes("Year")) months = 12;

    // Prepare payload for API
    const payload = {
      package: Number(routeParams?.id),
      months: months,
      quantity: 1,
      billing_address: {
        name: name,
        country: country1,
        phone: phone,
        city: city,
        zipcode: zip,
        address: address,
        company_name: companyName,
        rl_number: rlNumber,
      },
    };

    try {
      const response = await fetch(PACKAGE_ADD_TO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add package");
      }

      const data = await response.json();

      router.push(`/Checkout/${data.subscription_id}`);

      // Optionally navigate to review page
      // router.push("/Reviwe");
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
          {/* Product Info */}
          <div className="border p-4 rounded shadow-sm bg-gray-50">
            <h2 className="text-lg font-semibold mb-1">{packages?.name}</h2>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Billing Cycle
              </label>
              <select
                className="w-full border rounded px-4 py-2"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                <option value={`${(packages?.price || 0) * 3} BDT Three Month`}>
                  {/* {packageSelceted?.unit_price} BDT */}
                  Three Month
                </option>
                <option value={`${(packages?.price || 0) * 6} BDT Six Month`}>
                  {/* {packageSelceted?.unit_price} BDT */}
                  Six Month
                </option>
                <option value={`${(packages?.price || 0) * 12} BDT One Year`}>
                  {/* {packageSelceted?.unit_price} BDT  */}
                  One Year
                </option>
              </select>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-2">
            {/* <h3 className="text-blue-700 font-semibold text-lg mb-4">
              Additional Information
              <label className="inline-flex items-center space-x-2 ml-2">
                <input
                  type="checkbox"
                  checked={showCompanyInfo}
                  onChange={(e) => setShowCompanyInfo(e.target.checked)}
                />
              </label>
            </h3> */}

            <div className="space-y-4">
              {/* Standard Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Name *</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">Phone *</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Country</label>
                  <Select
                    options={countries.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    value={
                      countries
                        .map((c) => ({ value: c.id, label: c.name }))
                        .find((opt) => opt.value === country1) || null
                    }
                    onChange={(
                      selected: SingleValue<{
                        value: string | number;
                        label: string;
                      }>
                    ) => setCountry1(selected?.value || null)}
                    isSearchable
                    isClearable
                    components={{ IndicatorSeparator: () => null }}
                    placeholder="Select Country"
                    className="w-full "
                  />
                </div>

                <div>
                  <label className="block font-medium">City</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Zip *</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your Zip Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium">Address</label>
                  <input
                    className="w-full border rounded px-4 py-2"
                    placeholder="Enter Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium">Company Name</label>
                    <input
                      className="w-full border rounded px-4 py-2"
                      placeholder="Enter Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-medium">RL Number</label>
                    <input
                      className="w-full border rounded px-4 py-2"
                      placeholder="Enter RL Number"
                      value={rlNumber}
                      onChange={(e) => setRlNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* <div>
                    <label className="block font-medium">Company Logo</label>
                    <input
                      type="file"
                      className="w-full border rounded px-4 py-2"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCompanyLogo(e.target.files[0]);
                        }
                      }}
                    />
                  </div> */}
              </>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded shadow-sm p-4 bg-white h-fit">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>

          <div className="flex justify-between mb-1">
            <span>{packages?.name}</span>
            <span>{packageSelceted?.unit_price} BDT</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Month:</span>
            <span>{packageSelceted?.months} </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total:</span>
            <span>{packageSelceted?.total_price} BDT</span>
          </div>
          <div className="text-xl font-bold text-center border-t pt-3">
            <span>{packageSelceted?.total_price} BDT</span>
          </div>
          {/* <p className="text-center text-sm text-gray-500">Total Due Today</p> */}

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
