"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SEND_EMAIL, SEND_EMAIL_VERIFY } from "@/lib/config";
import Swal from "sweetalert2";

type OtpFormInputs = {
  email: string;
  code: string;
};

export default function OtpPage2() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormInputs>();

  useEffect(() => {
    const getEmail = localStorage.getItem("email");

    setEmail(getEmail);
  }, [router]);

  useEffect(() => {
    if (!email) return; // Only run if email is not null

    async function fetchData() {
      try {
        const res = await fetch(SEND_EMAIL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        console.log("API response:", data);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [email]);

  // Timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: OtpFormInputs) => {
    const formData = new FormData();
    formData.append("email", email ?? "");
    formData.append("code", data.code);

    try {
      const response = await fetch(SEND_EMAIL_VERIFY, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.access) {
        localStorage.setItem("token", result.access);
      }

      Swal.fire({
        title: "Verify Successful!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        router.push("/sign-in");
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleResend = async (data: OtpFormInputs) => {
    if (resendDisabled) return;
    const formData = new FormData();
    formData.append("email", email ?? "");
    formData.append("code", data.code);
    setResendDisabled(true);
    setCountdown(50);

    try {
      const res = await fetch(SEND_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to resend email");
      }

      const result = await res.json();
      console.log("Resend result:", result);
    } catch (error) {
      console.error("API fetch error:", error);
    }
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
        An OTP has been sent to your phone or email
      </label>

      <input
        type="text"
        {...register("code", { required: "OTP is required" })}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "4px",
          border: `1px solid ${errors.code ? "#f00" : "#e2e8f0"}`,
          marginBottom: "0.25rem",
        }}
      />
      {errors.code && (
        <span style={{ color: "red", fontSize: "0.75rem" }}>
          {errors.code.message}
        </span>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          Didn&apos;t get the OTP?
        </p>

        <span
          onClick={async () => {
            await handleResend({ email: email ?? "", code: "" });
          }}
          style={{
            fontSize: "0.85rem",
            color: resendDisabled ? "#aaa" : "#2563ea",
            cursor: resendDisabled ? "not-allowed" : "pointer",
            textDecoration: resendDisabled ? "none" : "underline",
          }}
        >
          {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
        </span>
      </div>

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
