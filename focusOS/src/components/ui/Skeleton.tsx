import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`bg-[#1A1A1A] animate-pulse rounded-[2px] ${className}`}
      {...props}
    />
  );
}
