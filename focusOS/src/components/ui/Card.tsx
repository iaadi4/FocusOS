import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({
  elevated = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const bg = elevated ? "bg-[#1A1A1A]" : "bg-[#111111]";
  return (
    <div
      className={`${bg} border border-[#242424] rounded-[4px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
