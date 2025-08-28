"use client";
import OtpPage from "@/components/Otp";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const page = () => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen p-8 md:p-[9rem] relative"
      style={{
        backgroundImage: 'url("/bg-6.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Back Button */}
        {/* <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded"
        >
          ← Back
        </button> */}

        {/* Left Section: Hidden on mobile */}
        <Card
          className="hidden md:flex flex-col flex-1 items-center justify-center border-0 rounded-none p-12"
          style={{
            background:
              "linear-gradient(45deg, #488fed 0%, #291fbc 51%, #0f0786 100%)",
          }}
        >
          <CardContent className="flex flex-col items-center justify-center w-full max-w-md">
            <div
              style={{
                color: "white",
                animation: "fadeIn 1s ease-in-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <Image
                src="/RAMSNew.png"
                alt="Logo"
                width={214}
                height={114}
                className="object-cover rounded"
              />
              <h1
                style={{
                  fontSize: "2.4rem",
                  fontWeight: "600",
                  marginTop: "1.5rem",
                  marginBottom: "1rem",
                  lineHeight: "1.2",
                }}
              >
                Welcome to <span style={{ fontWeight: "400" }}>Rams</span>
              </h1>
              <p
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.6",
                  marginBottom: "2rem",
                  opacity: "0.9",
                  maxWidth: "500px",
                }}
              >
                Join our community of passionate developers. Learn, build, and
                share your coding journey with like-minded peers around the
                globe.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Section: Full width on mobile */}
        <div className="w-full md:flex-1 flex items-center justify-center p-6 md:p-12 border-t md:border-t-0 md:border-l border-gray-200 bg-white">
          <OtpPage />
        </div>
      </div>
    </div>
  );
};

export default page;
