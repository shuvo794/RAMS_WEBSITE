"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/lib/config";
import Swal from "sweetalert2";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    // Optional: store hashed password if needed
    localStorage.setItem("hashedPassword", data.password);

    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API validation errors:", errorData);
        return;
      }

      const result = await response.json();

      // Store data in localStorage
      if (result.access) {
        localStorage.setItem("token", result.access);
      }
      if (result.first_name) {
        localStorage.setItem(
          "userName",
          `${result.first_name} ${result.last_name}`
        );
      }
      if (result.email) {
        localStorage.setItem("email", result.email);
      }
      if (result.id) {
        localStorage.setItem("id", result.id);
      }

      // Show success message
      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        // Check if user came from pricing page
        const stored = localStorage.getItem("cartPackages");

        // Parse it back to array
        const cartPackages = stored ? JSON.parse(stored) : [];

        // Get IDs only
        const ids = cartPackages.map((item: { id: number }) => item.id);
        console.log("Cart Package IDs:", ids.length);

        if (ids.length) {
          router.push(`/cart?id=${ids}`);
          localStorage.removeItem("cartPackages");
        } else {
          router.push("/");
        }

        setTimeout(() => {
          window.location.reload();
        }, 500); // Small delay to allow router.push to complete
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "#2563ea",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <input
          type="email"
          placeholder="Enter Email/Username"
          {...register("email", { required: true })}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            marginBottom: "1rem",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          {...register("password", { required: true })}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            marginBottom: "1rem",
          }}
        />

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
          SIGN IN
        </button>

        <button
          type="button"
          onClick={() => router.push("/sign-up")}
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
          }}
        >
          SIGN UP
        </button>
      </form>
    </div>
  );
}
