"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function CountingNumber({ 
  value, 
  prefix = "", 
  suffix = "", 
  className = "" 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  className?: string; 
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      }
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
