import type { PomodoroStats, PomodoroSession, PomodoroTemplate } from "../../utils/types";
import { formatDuration } from "../../utils/format";
import { SectionLabel } from "../ui/SectionLabel";
import { Badge } from "../ui/Badge";
import { Play } from "lucide-react";

export interface PomodoroViewProps {
  stats: PomodoroStats;
  sessions: PomodoroSession[];
  templates: PomodoroTemplate[];
}

export function PomodoroView({
  stats,
  sessions,
}: PomodoroViewProps) {
  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      <div className="border-b border-[#1C1C1C] pb-6">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
          Pomodoro Timer
        </h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">
          Track your focus sessions and productivity patterns.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#242424] border-l-4 !border-l-[#C9A96E] p-4 rounded-[4px] flex items-center gap-3">
        <Play size={14} className="text-[#C9A96E] fill-[#C9A96E] shrink-0" />
        <span className="text-sm font-medium text-[#F5F5F5]">
          {stats.sessionsToday} session{stats.sessionsToday === 1 ? "" : "s"} today — Keep up the great work!
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>TOTAL SESSIONS</SectionLabel>
          <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono">
            {stats.totalSessions}
          </div>
        </div>
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>TOTAL FOCUS TIME</SectionLabel>
          <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono">
            {formatDuration(stats.totalFocusTime)}
          </div>
        </div>
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>AVG SESSION</SectionLabel>
          <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono">
            {formatDuration(stats.averageSessionLength * 60 * 1000)}
          </div>
        </div>
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>MOST USED TEMPLATE</SectionLabel>
          <div className="text-xl font-normal text-[#C9A96E] mt-3 truncate">
            {stats.mostUsedTemplate || "None"}
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col overflow-x-auto">
        <SectionLabel className="mb-4">SESSION HISTORY</SectionLabel>
        <table className="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-[#242424] h-10">
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">DATE</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">TEMPLATE</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-center">CYCLES</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">DURATION</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((sess) => {
              const dateStr = new Date(sess.startTime).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const durMs = sess.workMinutes * 60 * 1000;

              return (
                <tr key={sess.id} className="border-b border-[#1C1C1C] h-[48px] hover:bg-[#1A1A1A] transition-colors">
                  <td className="text-[13px] text-[#F5F5F5] font-mono pr-4 whitespace-nowrap">{dateStr}</td>
                  <td className="pr-4">
                    <span className="bg-[#1A1A1A] border border-[#242424] text-[#8A8A8A] text-xs px-2 py-0.5 rounded-[2px] font-mono whitespace-nowrap">
                      {sess.templateName}
                    </span>
                  </td>
                  <td className="text-[13px] text-[#8A8A8A] font-mono text-center pr-4">{sess.completedCycles}</td>
                  <td className="text-[13px] text-[#F5F5F5] font-mono pr-4 whitespace-nowrap">{formatDuration(durMs)}</td>
                  <td className="text-right whitespace-nowrap">
                    {sess.interrupted ? (
                      <Badge variant="danger">INTERRUPTED</Badge>
                    ) : (
                      <Badge variant="success">COMPLETED</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-[#4A4A4A]">
                  No focus sessions recorded yet. Start a Pomodoro timer from the extension popup!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
