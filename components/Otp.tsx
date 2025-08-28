"use client";

import { useForm } from "react-hook-form";
// import { Otp } from "@/lib/config";
// import bcrypt from "bcryptjs";
import Link from "next/link";

type OtpFormInputs = {
  email: string;
  Username: string;
};

export default function OtpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormInputs>();

  const onSubmit = async (data: OtpFormInputs) => {
    localStorage.setItem("hashedUsername", data.Username);

    // try {
    //   const response = await fetch(Otp, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     console.error("API validation errors:", errorData);
    //     return;
    //   }

    //   const result = await response.json();
    //   console.log("resultfhdkfjhdksh", result);

    //   if (result.access) {
    //     localStorage.setItem("token", result.access);
    //   }

    //   if (result.first_name) {
    //     localStorage.setItem(
    //       "userName",
    //       `${result.first_name} ${result.last_name}`
    //     );
    //   }
    //   if (result.email) {
    //     localStorage.setItem("email", result.email);
    //   }
    //   if (result.id) {
    //     localStorage.setItem("id", result.id);
    //   }

    //   Swal.fire({
    //     title: "Otp Successful!",
    //     icon: "success",
    //     showConfirmButton: false,
    //     timer: 2000,
    //   }).then(() => {
    //     // 🔴 Check for previously saved pricingId
    //     const savedPricingId = localStorage.getItem("pricingId");

    //     if (savedPricingId) {
    //       localStorage.removeItem("pricingId"); // cleanup
    //       router.push(`/pricing/${savedPricingId}`);
    //     } else {
    //       router.push("/");
    //     }
    //   });
    // } catch (error) {
    //   console.error("Otp error:", error);
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#2563ea",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        OTP
      </h2>

      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.8rem",
          color: "#666",
        }}
      >
        Username
      </label>

      <input
        type="text"
        {...register("Username", { required: "OTP is required" })}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "4px",
          border: `1px solid ${errors.Username ? "#f00" : "#e2e8f0"}`,
          marginBottom: "0.25rem",
        }}
      />
      {errors.Username && (
        <span style={{ color: "red", fontSize: "0.75rem" }}>
          {errors.Username.message}
        </span>
      )}
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.8rem",
          color: "#666",
        }}
      >
        An OTP has been sent to your phone or email
      </label>

      <input
        type="text"
        {...register("Username", { required: "OTP is required" })}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "4px",
          border: `1px solid ${errors.Username ? "#f00" : "#e2e8f0"}`,
          marginBottom: "0.25rem",
        }}
      />

      {errors.Username && (
        <span style={{ color: "red", fontSize: "0.75rem" }}>
          {errors.Username.message}
        </span>
      )}

      <Link href="">
        <p style={{ fontSize: "0.85rem", margin: "0.75rem 0" }}>
          Didn&apos;t get the OTP?
        </p>
      </Link>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#2563ea",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "0.875rem",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Verify
      </button>
    </form>
  );
}
