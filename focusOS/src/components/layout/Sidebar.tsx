import React from "react";
import {
  LayoutTemplate,
  Radar,
  Layers,
  Hourglass,
  Trophy,
  Crosshair,
  SlidersHorizontal,
  ArrowLeftRight,
} from "lucide-react";
import { SectionLabel } from "../ui/SectionLabel";

export type DashboardView =
  | "dashboard"
  | "site-details"
  | "site-categories"
  | "pomodoro"
  | "achievements"
  | "limits"
  | "settings"
  | "site-analysis";

export interface SidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  activeView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const navItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutTemplate },
    { id: "site-details", label: "Site Details", icon: Radar },
    { id: "site-categories", label: "Site Categories", icon: Layers },
    { id: "pomodoro", label: "Pomodoro", icon: Hourglass },
    { id: "achievements", label: "Awards", icon: Trophy },
  ];

  const configItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
    { id: "limits", label: "Daily Limits", icon: Crosshair },
    { id: "settings", label: "Settings", icon: SlidersHorizontal },
  ];

  const width = isCollapsed ? "w-[56px]" : "w-[200px]";

  const renderNavItem = (item: { id: DashboardView; label: string; icon: React.ElementType }) => {
    const Icon = item.icon;
    const isActive = activeView === item.id || (item.id === "dashboard" && activeView === "site-analysis");

    if (isActive) {
      return (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 border-l-2 border-[#C9A96E] bg-[#111111] transition-colors duration-150 text-left focus:outline-none ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
          title={isCollapsed ? item.label : ""}
        >
          <Icon size={14} className="text-[#C9A96E] shrink-0" />
          {!isCollapsed && (
            <span className="text-[13px] text-[#C9A96E] font-medium truncate">
              {item.label}
            </span>
          )}
        </button>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => onViewChange(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 border-l-2 border-transparent hover:bg-[#111111] transition-colors duration-150 text-left focus:outline-none ${
          isCollapsed ? "justify-center px-0" : ""
        }`}
        title={isCollapsed ? item.label : ""}
      >
        <Icon size={14} className="text-[#4A4A4A] shrink-0 group-hover:text-[#8A8A8A]" />
        {!isCollapsed && (
          <span className="text-[13px] text-[#8A8A8A] hover:text-[#F5F5F5] truncate">
            {item.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`${width} h-screen sticky top-0 left-0 bg-[#0A0A0A] border-r border-[#242424] flex flex-col shrink-0 select-none transition-all duration-150 ease-out z-20`}
    >
      <div className="h-[48px] px-4 border-b border-[#1C1C1C] flex items-center gap-2.5 shrink-0 overflow-hidden">
        <div className="w-5 h-5 bg-[#1A1A1A] border border-[#242424] rounded-[2px] flex items-center justify-center shrink-0">
          <Hourglass size={12} className="text-[#C9A96E]" />
        </div>
        {!isCollapsed && (
          <span className="text-[13px] uppercase tracking-[0.12em] text-[#F5F5F5] font-semibold truncate">
            FOCUSOS
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 min-h-0">
        <div className="flex flex-col gap-1">
          {!isCollapsed && <SectionLabel className="px-4 mb-1">NAVIGATION</SectionLabel>}
          {navItems.map(renderNavItem)}
        </div>

        <div className="flex flex-col gap-1">
          {!isCollapsed && <SectionLabel className="px-4 mb-1">CONFIGURATION</SectionLabel>}
          {configItems.map(renderNavItem)}
        </div>
      </div>

      <div className="p-2 border-t border-[#1C1C1C] shrink-0">
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-3 px-2 py-2 border border-transparent hover:border-[#242424] hover:bg-[#111111] rounded-[2px] text-[#4A4A4A] hover:text-[#8A8A8A] transition-colors duration-150 focus:outline-none ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ArrowLeftRight size={14} className="shrink-0" />
          {!isCollapsed && (
            <span className="text-xs uppercase tracking-wider font-medium">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  );
}
