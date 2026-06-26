import React from "react";

export interface SectionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({
  children,
  className = "",
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={`text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
