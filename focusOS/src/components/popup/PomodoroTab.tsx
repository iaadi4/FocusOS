import { formatDuration } from "../../utils/format";
import type { PomodoroTemplate, PomodoroState } from "../../utils/types";
import { SectionLabel } from "../ui/SectionLabel";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";
import { Divider } from "../ui/Divider";
import { Pause, Play, Square } from "lucide-react";

export interface PomodoroTabProps {
  templates: PomodoroTemplate[];
  activeTimer: PomodoroState | null;
  onStartTimer: (templateId: string) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onStopTimer: () => void;
  onOpenDashboard: () => void;
  onOpenMusic: () => void;
}

export function PomodoroTab({
  templates,
  activeTimer,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,
  onOpenDashboard,
  onOpenMusic,
}: PomodoroTabProps) {

  const currentTemplate = templates.find(
    (t) => t.id === activeTimer?.currentTemplateId
  );
  const totalPhaseMinutes =
    activeTimer?.currentPhase === "work"
      ? currentTemplate?.workMinutes || 25
      : currentTemplate?.breakMinutes || 5;
  const totalPhaseMs = totalPhaseMinutes * 60 * 1000;
  const elapsedMs = Math.max(totalPhaseMs - (activeTimer?.remainingMs || 0), 0);
  const progressRatio = totalPhaseMs > 0 ? elapsedMs / totalPhaseMs : 0;
  const progressPercent = Math.round(progressRatio * 100);

  const totalCyclesTarget = 4;
  const completedCount = activeTimer?.cyclesCompleted || 0;

  return (
    <div className="flex-1 flex flex-col justify-between h-full min-h-0">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1">
        {activeTimer ? (
          <div className="flex flex-col gap-6 py-2">
            <div className="flex items-center justify-between">
              <SectionLabel className="!text-[#C9A96E]">
                {activeTimer.currentPhase === "work" ? "WORK PHASE" : "BREAK PHASE"} ·{" "}
                {currentTemplate?.name || "CUSTOM"}
              </SectionLabel>
            </div>

            <div className="text-[52px] font-light font-mono leading-[60px] text-[#C9A96E] text-center my-4">
              {formatDuration(activeTimer.remainingMs)}
            </div>

            <div className="flex flex-col gap-1.5">
              <ProgressBar value={progressRatio} max={1} />
              <div className="text-[10px] font-mono text-[#4A4A4A] text-right">
                {progressPercent}%
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#111111] border border-[#242424] px-4 py-3 rounded-[4px]">
              <span className="text-xs text-[#8A8A8A]">Cycles:</span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalCyclesTarget }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs leading-none ${
                      i < completedCount ? "text-[#C9A96E]" : "text-[#242424]"
                    }`}
                  >
                    ●
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-[#4A4A4A]">
                {completedCount} of {totalCyclesTarget} complete
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {activeTimer.isPaused ? (
                <Button variant="ghost" onClick={onResumeTimer} className="w-full gap-2">
                  <Play size={12} /> RESUME
                </Button>
              ) : (
                <Button variant="ghost" onClick={onPauseTimer} className="w-full gap-2">
                  <Pause size={12} /> PAUSE
                </Button>
              )}
              <Button variant="ghost" onClick={onStopTimer} className="w-full gap-2 !border-[#9E5A5A] !text-[#9E5A5A] hover:!bg-[#1A1A1A]">
                <Square size={12} /> STOP
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <SectionLabel className="mb-3">PRESET TEMPLATES</SectionLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => onStartTimer(tpl.id)}
                    className="p-3.5 bg-[#111111] border border-[#242424] hover:border-[#C9A96E] hover:bg-[#1A1A1A] rounded-[4px] text-left transition-colors duration-150 group flex flex-col justify-between h-[68px] focus:outline-none relative"
                  >
                    <span className="text-[13px] font-medium text-[#F5F5F5] group-hover:text-[#C9A96E] transition-colors">
                      {tpl.name}
                    </span>
                    <span className="text-xs font-mono uppercase text-[#4A4A4A]">
                      {tpl.workMinutes}M + {tpl.breakMinutes}M
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Divider className="my-0" />

            <div className="flex items-center justify-between bg-[#111111] border border-[#242424] p-4 rounded-[4px]">
              <div className="flex flex-col gap-0.5">
                <SectionLabel className="!text-[#F5F5F5]">LOFI MUSIC</SectionLabel>
                <span className="text-[11px] text-[#8A8A8A]">
                  Opens 24/7 Lofi Hip Hop Radio
                </span>
              </div>
              <Button variant="ghost" onClick={onOpenMusic} className="h-7 text-[10px]">
                OPEN →
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <Divider className="my-4" />
        <Button
          variant="primary"
          onClick={onOpenDashboard}
          className="w-full text-xs"
        >
          FULL DASHBOARD →
        </Button>
      </div>
    </div>
  );
}
