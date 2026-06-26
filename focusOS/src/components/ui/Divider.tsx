import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Divider({ className = "", ...props }: DividerProps) {
  return <div className={`border-t border-[#1C1C1C] ${className}`} {...props} />;
}
