"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";

interface LottieWrapperProps {
  src: string;
  className?: string;
}

export default function LottieWrapper({
  src,
  className = "",
}: LottieWrapperProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null; // Return nothing if there's an error
  }

  return (
    <div className={className}>
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
