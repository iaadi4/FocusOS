import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`bg-[#141414] border border-[#242424] text-[#F5F5F5] placeholder-[#4A4A4A] focus:border-[#C9A96E] focus:outline-none rounded-[4px] px-3 py-2 text-sm transition-colors duration-150 ${className}`}
      {...props}
    />
  );
}
