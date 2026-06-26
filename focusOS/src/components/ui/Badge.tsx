import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "success" | "danger";
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  let styles = "inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] uppercase tracking-widest font-medium border ";

  if (variant === "default") {
    styles += "bg-[#1A1A1A] border-[#242424] text-[#8A8A8A] ";
  } else if (variant === "gold") {
    styles += "bg-[#1A1A1A] border-[#C9A96E] text-[#C9A96E] ";
  } else if (variant === "success") {
    styles += "bg-[#1A1A1A] border-[#6A9E6A] text-[#6A9E6A] ";
  } else if (variant === "danger") {
    styles += "bg-[#1A1A1A] border-[#9E5A5A] text-[#9E5A5A] ";
  }

  return (
    <span className={`${styles} ${className}`} {...props}>
      {children}
    </span>
  );
}
