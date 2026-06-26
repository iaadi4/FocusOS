import React, { useState } from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-3 py-1.5 bg-[#111111] border border-[#242424] rounded-[4px] text-xs text-[#F5F5F5] shadow-none pointer-events-none whitespace-nowrap ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
