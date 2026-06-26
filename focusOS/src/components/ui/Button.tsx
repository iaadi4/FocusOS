import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "link";
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  let baseStyles = "inline-flex items-center justify-center font-semibold tracking-wide uppercase text-xs transition-colors duration-150 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ";

  if (variant === "primary") {
    baseStyles += "bg-[#C9A96E] text-[#0A0A0A] hover:bg-[#D9BA84] rounded-[2px] h-8 px-3 ";
  } else if (variant === "ghost") {
    baseStyles += "bg-transparent border border-[#242424] text-[#8A8A8A] hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-[2px] h-8 px-3 ";
  } else if (variant === "link") {
    baseStyles = "inline-flex items-center justify-center text-xs text-[#C9A96E] underline-offset-2 hover:underline bg-transparent border-none p-0 transition-colors duration-150 cursor-pointer ";
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
