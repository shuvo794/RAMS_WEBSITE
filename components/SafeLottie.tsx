"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState, useEffect } from "react";

interface SafeLottieProps {
  src: string;
  className?: string;
}

export default function SafeLottie({ src, className = "" }: SafeLottieProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Verify the animation file exists
    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error("Animation not found");
        setIsLoaded(true);
      })
      .catch(() => setHasError(true));
  }, [src]);

  if (hasError || !isLoaded) {
    return null;
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
