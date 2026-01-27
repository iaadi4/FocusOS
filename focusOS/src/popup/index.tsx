/**
 * Popup - Toolbar widget with Stats and Pomodoro tabs
 *
 * Shows today's browsing stats and Pomodoro timer management.
 */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { getAggregatedData } from "../utils/storage";
import {
  getPomodoroTemplates,
  getPomodoroState,
  deletePomodoroTemplate,
} from "../utils/pomodoro-storage";
import { formatDuration } from "../utils/format";
import { Maximize2, Activity, BarChart3, Timer } from "lucide-react";
import { PomodoroTab } from "./PomodoroTab";
import type { PomodoroTemplate, PomodoroState } from "../utils/types";
import "../index.css";

type Tab = "stats" | "pomodoro";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [totalTime, setTotalTime] = useState(0);
  const [topSites, setTopSites] = useState<
    { domain: string; time: number; favicon: string }[]
  >([]);

  // Pomodoro state
  const [templates, setTemplates] = useState<PomodoroTemplate[]>([]);
  const [activeTimer, setActiveTimer] = useState<PomodoroState | null>(null);

  const applyTheme = (themeId: string) => {
    import("../utils/themes").then(({ THEMES }) => {
      const theme = THEMES.find((t) => t.id === themeId);
      if (theme) {
        const root = document.documentElement;
        root.style.setProperty("--primary", theme.primary);
        root.style.setProperty("--ring", theme.ring);
      }
    });
  };

  // Fetch Pomodoro data
  const fetchPomodoroData = async () => {
    const [templatesData, stateData] = await Promise.all([
      getPomodoroTemplates(),
      getPomodoroState(),
    ]);
    setTemplates(templatesData);
    setActiveTimer(stateData);
  };

  useEffect(() => {
    const fetchSettingsAndData = async () => {
      const settingsData = await import("../utils/storage").then((m) =>
        m.getSettings(),
      );
      if (settingsData.theme) {
        applyTheme(settingsData.theme);
      }

      const data = await getAggregatedData("today");
      setTotalTime(data.totalTime);
      setTopSites(data.byDomain.slice(0, 3));
    };

    fetchSettingsAndData();
    fetchPomodoroData();

    const interval = setInterval(async () => {
      const data = await getAggregatedData("today");
      setTotalTime(data.totalTime);
      setTopSites(data.byDomain.slice(0, 3));

      // Update Pomodoro timer
      await fetchPomodoroData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const openDashboard = () => {
    browser.tabs.create({ url: "dashboard.html" });
  };

  // Pomodoro handlers
  const handleStartTimer = async (templateId: string) => {
    await browser.runtime.sendMessage({ type: "pomodoroStart", templateId });
    setTimeout(fetchPomodoroData, 100);
  };

  const handlePauseTimer = async () => {
    await browser.runtime.sendMessage({ type: "pomodoroPause" });
    setTimeout(fetchPomodoroData, 100);
  };

  const handleResumeTimer = async () => {
    await browser.runtime.sendMessage({ type: "pomodoroResume" });
    setTimeout(fetchPomodoroData, 100);
  };

  const handleStopTimer = async () => {
    await browser.runtime.sendMessage({ type: "pomodoroStop" });
    setTimeout(fetchPomodoroData, 100);
  };

  const handleDeleteTemplate = async (id: string) => {
    await deletePomodoroTemplate(id);
    await fetchPomodoroData();
  };

  return (
    <div className="w-[400px] h-[600px] p-0 bg-black text-white flex flex-col font-sans selection:bg-primary/30 overflow-hidden relative animate-scale-in">
      <div className="px-6 py-4 flex-1 flex flex-col relative z-10 min-h-0">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <img src="/logo.png" className="w-8 h-8 rounded-lg" alt="Logo" />
            <span>FocusOS</span>
          </h1>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ boxShadow: `0 0 10px hsl(var(--primary) / 0.5)` }}
          ></div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              activeTab === "stats"
                ? "bg-primary text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Stats
          </button>
          <button
            onClick={() => setActiveTab("pomodoro")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              activeTab === "pomodoro"
                ? "bg-primary text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Timer className="w-4 h-4" />
            Pomodoro
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === "stats" ? (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-panel p-6 rounded-2xl text-center shadow-lg border-white/10 bg-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3 relative z-10">
                  Today's Browsing
                </h2>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 relative z-10 animate-slide-up [animation-delay:100ms]">
                  {formatDuration(totalTime)}
                </div>
                <p className="text-xs text-neutral-500 mt-2 relative z-10">
                  Total active time today
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary" />
                    Top Sites
                  </h3>
                </div>

                <div className="space-y-2">
                  {topSites.map((site, idx) => (
                    <div
                      key={site.domain}
                      className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/5 animate-slide-in-right"
                      style={{
                        animationDelay: `${idx * 100 + 200}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-xs font-mono text-neutral-600 w-3">
                          {idx + 1}
                        </span>
                        <img
                          src={
                            site.favicon ||
                            `https://www.google.com/s2/favicons?domain=${site.domain}`
                          }
                          className="w-4 h-4 rounded-sm opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all"
                          alt=""
                        />
                        <span className="truncate font-medium text-sm text-neutral-300 group-hover:text-white transition-colors">
                          {site.domain}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-medium text-primary/80 group-hover:text-primary">
                        {formatDuration(site.time)}
                      </span>
                    </div>
                  ))}
                  {topSites.length === 0 && (
                    <div className="text-center text-neutral-600 py-6 text-sm italic">
                      Start browsing to track stats.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <PomodoroTab
                templates={templates}
                activeTimer={activeTimer}
                onStartTimer={handleStartTimer}
                onPauseTimer={handlePauseTimer}
                onResumeTimer={handleResumeTimer}
                onStopTimer={handleStopTimer}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </div>
          )}
        </div>

        <div className="border-t border-white/10 mt-auto pt-4">
          <button
            onClick={openDashboard}
            className="w-full py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Full Dashboard</span>
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sidebar />
  </React.StrictMode>,
);
