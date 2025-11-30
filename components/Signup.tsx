"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CHECK_EMAIL, CHECK_PRIMARY_PHONE, SIGNUP } from "@/lib/config";
import Swal from "sweetalert2";
import CountryCodeSelect from "./CountryCodeSelect";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type SignUpFormInputs = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  primary_phone: string;
  country_code1: string;
  rl_no: string;
  logo: FileList;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #e2e8f0",
  marginBottom: "1rem",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#2563ea",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  marginBottom: "1rem",
  cursor: "pointer",
};

export default function CreatPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const methods = useForm<SignUpFormInputs>({
    defaultValues: {
      country_code1: "+880",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: SignUpFormInputs) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("primary_phone", data.primary_phone);
    formData.append("country_code1", data.country_code1);
    formData.append("rl_no", data.rl_no);
    formData.append("role", "client");

    if (data.logo && data.logo.length > 0) {
      formData.append("logo", data.logo[0]);
    }

    try {
      const response = await fetch(SIGNUP, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) return;

      const result = await response.json();

      if (result) {
        localStorage.setItem(
          "userName",
          `${result.first_name} ${result.last_name}`
        );
      }
      if (result) {
        localStorage.setItem("email", result.email);
      }

      Swal.fire({
        title: "Sign Up Successful!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        router.push("/otp-send");
      });
    } catch {
      Swal.fire("Error", "sign-up failed. Please try again.", "error");
    }
  };

  const handleCheckPhone = async () => {
    const formattedPhoneNumber = `${watch("country_code1")}${watch(
      "primary_phone"
    )}`;
    try {
      const response = await fetch(
        `${CHECK_PRIMARY_PHONE}?primary_phone=${formattedPhoneNumber}`
      );

      const result = await response.json();

      if (result?.primary_phone_exists) {
        setError("primary_phone", {
          type: "manual",
          message: "Phone number already exists",
        });
      } else {
        clearErrors("primary_phone");
      }
    } catch (error) {
      console.error("Error checking phone number:", error);
      // Handle errors if needed
    }
  };

  const handleCheckEmail = async () => {
    const formattedPhoneNumber = `${watch("email")}`;
    if (!formattedPhoneNumber.trim()) {
      // Optionally clear the email error if it's empty
      setError("email", {
        type: "manual",
        message: "Email cannot be empty",
      });
      return;
    }

    try {
      const response = await fetch(
        `${CHECK_EMAIL}?email=${formattedPhoneNumber}`
      );
      const result = await response.json();

      if (result?.email_exists) {
        setError("email", {
          type: "manual",
          message: "Email Already Exists",
        });
      } else {
        clearErrors("email");
      }
    } catch (error) {
      // Handle error, possibly log it or show a user-friendly message
      console.error("Error checking email:", error);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768); // <768px hole mobile
    };

    checkSize(); // initial check
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "800",
          color: "#2563ea",
          textAlign: "center",
          // marginBottom: "1.5rem",
        }}
      >
        SIGN UP
      </h2>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: "100%",
            maxWidth: "400px",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          {/* logo Upload */}
          <label style={{ marginBottom: "0.5rem", display: "block" }}>
            Upload logo
          </label>
          <input type="file" {...register("logo")} style={inputStyle} />

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              flexDirection: isMobile ? "column" : "row", // mobile -> column, desktop -> row
            }}
          >
            <input
              type="text"
              placeholder="Enter First Name"
              {...register("first_name", { required: true })}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              type="text"
              placeholder="Enter Last Name"
              {...register("last_name", { required: true })}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            {...register("email", {
              required: "email number is required",
              onChange: () => {
                handleCheckEmail();
              },
            })}
            style={inputStyle}
          />

          {errors.email && (
            <p
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginTop: "10px",
                marginBottom: "5px",
              }}
            >
              {errors.email.message}
            </p>
          )}

          {/* Country & Phone */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              alignItems: "center", // center-align vertically
            }}
          >
            {/* Country Dropdown */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.8rem",
                  color: "#666",
                }}
              >
                Country
              </label>
              <div
                style={{
                  height: "40px",
                }}
              >
                <CountryCodeSelect />
              </div>
            </div>

            {/* Phone Input */}
            <div style={{ flex: 2 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.8rem",
                  color: "#666",
                }}
              >
                Phone
              </label>
              <input
                type="tel"
                placeholder="Enter Phone"
                {...register("primary_phone", {
                  required: "Phone number is required",
                  onChange: () => {
                    handleCheckPhone();
                  },
                })}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {errors.primary_phone && (
            <p
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginTop: "10px",
                marginBottom: "5px",
              }}
            >
              {errors.primary_phone.message}
            </p>
          )}
          {/* RL Number */}
          <input
            type="text"
            placeholder="Enter RL Number"
            {...register("rl_no")}
            style={inputStyle}
          />

          {/* Password */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              style={inputStyle}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "30%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
            {errors.password && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                minLength: {
                  value: 6,
                  message: "Confirm password must be at least 6 characters",
                },
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              style={inputStyle}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "30%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showConfirmPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
            {errors.confirmPassword && (
              <p style={{ color: "red", fontSize: "14px" }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity:
                errors.confirmPassword ||
                errors.password ||
                errors.email ||
                errors.primary_phone
                  ? 0.5
                  : 1,
              cursor:
                errors.confirmPassword ||
                errors.password ||
                errors.email ||
                errors.primary_phone
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={
              !!(
                errors.confirmPassword ||
                errors.password ||
                errors.email ||
                errors.primary_phone
              )
            }
          >
            SIGN UP
          </button>

          {/* Sign In Redirect */}
          <button
            type="button"
            onClick={() => router.push("/")}
            style={buttonStyle}
          >
            SIGN IN
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
