
"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedNumber({
  value,
  suffix = "",
  duration = 1800,
}: AnimatedNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [value, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}
