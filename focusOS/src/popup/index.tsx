import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { getAggregatedData } from "../utils/storage";
import {
  getPomodoroTemplates,
  getPomodoroState,
} from "../utils/pomodoro-storage";
import { PopupShell, type PopupTab } from "../components/layout/PopupShell";
import { StatsTab, PomodoroTab } from "../components/popup";
import type { PomodoroTemplate, PomodoroState } from "../utils/types";
import "../index.css";

export function PopupApp() {
  const [activeTab, setActiveTab] = useState<PopupTab>("stats");
  const [totalTime, setTotalTime] = useState(0);
  const [topSites, setTopSites] = useState<
    { domain: string; time: number; favicon: string }[]
  >([]);

  const [templates, setTemplates] = useState<PomodoroTemplate[]>([]);
  const [activeTimer, setActiveTimer] = useState<PomodoroState | null>(null);

  const fetchPomodoroData = async () => {
    const [templatesData, stateData] = await Promise.all([
      getPomodoroTemplates(),
      getPomodoroState(),
    ]);
    setTemplates(templatesData);
    setActiveTimer(stateData);
  };

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getAggregatedData("today");
      setTotalTime(data.totalTime);
      setTopSites(data.byDomain.slice(0, 3));
    };

    fetchStats();
    fetchPomodoroData();

    const interval = setInterval(async () => {
      fetchStats();
      fetchPomodoroData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenDashboard = () => {
    browser.tabs.create({ url: "dashboard.html" });
  };

  const handleOpenMusic = () => {
    browser.tabs.create({
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      active: true,
    });
  };

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

  return (
    <PopupShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isActive={activeTimer ? activeTimer.isActive : false}
    >
      {activeTab === "stats" ? (
        <StatsTab
          totalTime={totalTime}
          topSites={topSites}
          onOpenDashboard={handleOpenDashboard}
        />
      ) : (
        <PomodoroTab
          templates={templates}
          activeTimer={activeTimer}
          onStartTimer={handleStartTimer}
          onPauseTimer={handlePauseTimer}
          onResumeTimer={handleResumeTimer}
          onStopTimer={handleStopTimer}
          onOpenDashboard={handleOpenDashboard}
          onOpenMusic={handleOpenMusic}
        />
      )}
    </PopupShell>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <PopupApp />
    </React.StrictMode>
  );
}
