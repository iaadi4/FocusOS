import { useState } from "react";
import { Sidebar, type DashboardView } from "./Sidebar";

export interface DashboardShellProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  children: React.ReactNode;
}

export function DashboardShell({
  activeView,
  onViewChange,
  children,
}: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen min-w-[900px] w-full bg-[#0A0A0A] text-[#F5F5F5] font-sans flex items-start relative">
      <Sidebar
        activeView={activeView}
        onViewChange={onViewChange}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <main className="flex-1 flex flex-col min-w-[700px]">
        <div className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
