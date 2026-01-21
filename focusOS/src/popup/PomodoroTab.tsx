import { Timer, Play, Pause, Square, Music } from "lucide-react";
import { formatDuration } from "../utils/format";
import type { PomodoroTemplate, PomodoroState } from "../utils/types";

interface PomodoroTabProps {
  templates: PomodoroTemplate[];
  activeTimer: PomodoroState | null;
  onStartTimer: (templateId: string) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onStopTimer: () => void;
  onDeleteTemplate: (id: string) => void;
}

export function PomodoroTab({
  templates,
  activeTimer,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onStopTimer,

  onDeleteTemplate,
}: PomodoroTabProps) {
  if (activeTimer && activeTimer.isActive) {
    // Active timer display
    const progress =
      activeTimer.currentPhase === "work"
        ? ((templates.find((t) => t.id === activeTimer.currentTemplateId)
            ?.workMinutes || 25) *
            60 *
            1000 -
            activeTimer.remainingMs) /
          ((templates.find((t) => t.id === activeTimer.currentTemplateId)
            ?.workMinutes || 25) *
            60 *
            1000)
        : ((templates.find((t) => t.id === activeTimer.currentTemplateId)
            ?.breakMinutes || 5) *
            60 *
            1000 -
            activeTimer.remainingMs) /
          ((templates.find((t) => t.id === activeTimer.currentTemplateId)
            ?.breakMinutes || 5) *
            60 *
            1000);

    const template = templates.find(
      (t) => t.id === activeTimer.currentTemplateId,
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Timer Display */}
        <div
          className={`p-5 rounded-2xl text-center relative overflow-hidden ${
            activeTimer.currentPhase === "work"
              ? "bg-primary/10 border border-primary/20"
              : "bg-emerald-500/10 border border-emerald-500/20"
          }`}
        >
          {/* Circular Progress */}
          <div className="relative w-36 h-36 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="66"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-white/5"
              />
              <circle
                cx="72"
                cy="72"
                r="66"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 66}`}
                strokeDashoffset={`${2 * Math.PI * 66 * (1 - progress)}`}
                className={
                  activeTimer.currentPhase === "work"
                    ? "text-primary"
                    : "text-emerald-500"
                }
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="mb-3">
            <div className="text-4xl font-black text-white font-mono">
              {formatDuration(activeTimer.remainingMs)}
            </div>
            <div
              className={`text-xs font-bold mt-2 ${
                activeTimer.currentPhase === "work"
                  ? "text-primary"
                  : "text-emerald-400"
              }`}
            >
              {activeTimer.currentPhase === "work"
                ? "FOCUS TIME"
                : "BREAK TIME ☕"}
            </div>
          </div>

          {/* Template Info */}
          <div className="text-sm text-neutral-400 mb-4">
            <div className="font-medium text-white">{template?.name}</div>
            <div className="text-xs mt-1">
              Cycle {activeTimer.cyclesCompleted + 1}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {activeTimer.isPaused ? (
              <button
                onClick={onResumeTimer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold transition-colors"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                Resume
              </button>
            ) : (
              <button
                onClick={onPauseTimer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold transition-colors"
              >
                <Pause className="w-4 h-4" fill="currentColor" />
                Pause
              </button>
            )}
            <button
              onClick={onStopTimer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-bold transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Template selection
  const presetTemplates = templates.filter((t) => !t.isCustom);
  const customTemplates = templates.filter((t) => t.isCustom);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Preset Templates */}
      <div>
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Timer className="w-3 h-3" />
          Preset Templates
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {presetTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onStartTimer(template.id)}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all text-left group"
            >
              <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                {template.name}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {template.workMinutes}m + {template.breakMinutes}m
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Templates */}
      {customTemplates.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
            Your Templates
          </h3>
          <div className="space-y-2">
            {customTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <button
                  onClick={() => onStartTimer(template.id)}
                  className="flex-1 text-left hover:text-primary transition-colors"
                >
                  <div className="text-sm font-medium text-white">
                    {template.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {template.workMinutes}m + {template.breakMinutes}m
                  </div>
                </button>
                <button
                  onClick={() => onDeleteTemplate(template.id)}
                  className="text-xs text-neutral-500 hover:text-red-400 transition-colors px-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lofi Music */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <Music className="w-3 h-3" />
            Lofi Music
          </h3>
          <button
            onClick={() => {
              chrome.tabs.create({
                url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
                active: false,
              });
            }}
            className="px-3 py-1 rounded-lg text-xs font-bold transition-colors bg-primary/20 text-primary hover:bg-primary/30"
          >
            Open Player
          </button>
        </div>
        <p className="text-xs text-neutral-500">
          Opens 24/7 Lofi Hip Hop Radio in a new tab
        </p>
      </div>
    </div>
  );
}
