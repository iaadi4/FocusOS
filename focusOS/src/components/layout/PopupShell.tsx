import React from "react";
import { Hourglass } from "lucide-react";

export type PopupTab = "stats" | "pomodoro";

export interface PopupShellProps {
  activeTab: PopupTab;
  onTabChange: (tab: PopupTab) => void;
  isActive?: boolean;
  children: React.ReactNode;
}

export function PopupShell({
  activeTab,
  onTabChange,
  isActive = true,
  children,
}: PopupShellProps) {
  return (
    <div className="w-[380px] h-[580px] bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col overflow-hidden select-none">
      <header className="h-[44px] px-4 border-b border-[#1C1C1C] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Hourglass size={14} className="text-[#C9A96E]" />
          <span className="text-[13px] uppercase tracking-[0.12em] text-[#F5F5F5] font-semibold">
            FOCUSOS
          </span>
        </div>
        <div
          className={`w-[8px] h-[8px] rounded-full transition-colors duration-150 ${
            isActive ? "bg-[#C9A96E]" : "bg-[#4A4A4A]"
          }`}
          title={isActive ? "Active" : "Idle"}
        />
      </header>

      <div className="flex border-b border-[#1C1C1C] shrink-0">
        <button
          onClick={() => onTabChange("stats")}
          className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors duration-150 focus:outline-none ${
            activeTab === "stats"
              ? "border-b-2 border-[#C9A96E] text-[#C9A96E] bg-[#111111]"
              : "border-b-2 border-transparent text-[#8A8A8A] hover:text-[#F5F5F5]"
          }`}
        >
          STATS
        </button>
        <button
          onClick={() => onTabChange("pomodoro")}
          className={`flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors duration-150 focus:outline-none ${
            activeTab === "pomodoro"
              ? "border-b-2 border-[#C9A96E] text-[#C9A96E] bg-[#111111]"
              : "border-b-2 border-transparent text-[#8A8A8A] hover:text-[#F5F5F5]"
          }`}
        >
          POMODORO
        </button>
      </div>

      <div className="flex-1 px-4 py-[14px] overflow-y-auto min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
