"use client";

import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function Wrapper({ children, className = "" }: WrapperProps) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}
