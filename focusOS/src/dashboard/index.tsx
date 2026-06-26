import { useState, useEffect, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  getAggregatedData,
  getInsights,
  getFocusScore,
  getSiteCategories,
  setSiteCategory,
  getSettings,
  setSettings as saveSettings,
  getStorageData,
  addToWhitelist,
  removeFromWhitelist,
  getSiteAnalysisData,
  getTrendMetrics,
  saveLimit,
} from "../utils/storage";
import {
  getPomodoroStats,
  getPomodoroSessions,
  getPomodoroTemplates,
} from "../utils/pomodoro-storage";
import { getAchievementState } from "../utils/achievement-storage";
import { DashboardShell, type DashboardView } from "../components/layout";
import {
  OverviewView,
  SiteAnalysisView,
  SiteCategoriesView,
  PomodoroView,
  AwardsView,
  SettingsView,
  SiteDetailsView,
  DailyLimitsView,
} from "../components/dashboard";
import type {
  AggregatedData,
  TimeRange,
  Insights,
  FocusScore,
  SiteCategoryMap,
  Settings,
  Limit,
  PomodoroStats,
  PomodoroSession,
  PomodoroTemplate,
  SiteAnalysisData,
  TrendMetrics,
} from "../utils/types";
import type { AchievementState } from "../utils/achievements";
import "../index.css";

export function DashboardApp() {
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [range, setRange] = useState<TimeRange>("today");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const [data, setData] = useState<AggregatedData>({ totalTime: 0, byDomain: [] });
  const [insights, setInsights] = useState<Insights>({ mostActiveDay: null, dailyAverage: 0 });
  const [focusScore, setFocusScore] = useState<FocusScore>({
    score: 50,
    productiveTime: 0,
    distractionTime: 0,
    neutralTime: 0,
    othersTime: 0,
    totalTime: 0,
  });
  const [categories, setCategories] = useState<SiteCategoryMap>({});
  const [settings, setSettingsState] = useState<Settings>({ trackingDelaySeconds: 15, theme: "blue-500" });
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [limits, setLimits] = useState<{ [domain: string]: Limit }>({});

  const [pomStats, setPomStats] = useState<PomodoroStats>({
    sessionsToday: 0,
    totalSessions: 0,
    totalFocusTime: 0,
    totalBreakTime: 0,
    averageSessionLength: 0,
    mostUsedTemplate: "Classic",
  });
  const [pomSessions, setPomSessions] = useState<PomodoroSession[]>([]);
  const [pomTemplates, setPomTemplates] = useState<PomodoroTemplate[]>([]);

  const [achState, setAchState] = useState<AchievementState>({
    unlockedIds: [],
    totalXp: 0,
    lastUpdated: Date.now(),
  });

  const [analysisData, setAnalysisData] = useState<SiteAnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendMetrics | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchMainData = async () => {
    const [agg, ins, foc, cats, sets, rawStore, pomSt, pomSess, pomTpl, achSt] = await Promise.all([
      getAggregatedData(range),
      getInsights(range),
      getFocusScore(range),
      getSiteCategories(),
      getSettings(),
      getStorageData(["whitelist", "limits"]),
      getPomodoroStats(),
      getPomodoroSessions(),
      getPomodoroTemplates(),
      getAchievementState(),
    ]);

    setData(agg);
    setInsights(ins);
    setFocusScore(foc);
    setCategories(cats);
    setSettingsState(sets);
    setWhitelist(rawStore.whitelist || []);
    setLimits(rawStore.limits || {});
    setPomStats(pomSt);
    setPomSessions(pomSess);
    setPomTemplates(pomTpl);
    setAchState(achSt);
  };

  useEffect(() => {
    fetchMainData();
    const timer = setInterval(fetchMainData, 2000);
    return () => clearInterval(timer);
  }, [range]);

  useEffect(() => {
    if (selectedDomain && activeView === "site-analysis") {
      const fetchAnalysis = async () => {
        const ad = await getSiteAnalysisData(selectedDomain);
        setAnalysisData(ad);
        if (ad && ad.firstUsed) {
          const todayStr = new Date().toISOString().split("T")[0];
          const tr = await getTrendMetrics(selectedDomain, ad.firstUsed, todayStr);
          setTrendData(tr);
        }
      };
      fetchAnalysis();
    }
  }, [selectedDomain, activeView]);

  const handleSelectDomain = (dom: string) => {
    setSelectedDomain(dom);
    setActiveView("site-analysis");
  };

  const handleUpdateCategory = async (dom: string, cat: import("../utils/types").SiteCategory) => {
    await setSiteCategory(dom, cat);
    fetchMainData();
  };

  const handleSaveSettings = async (newSets: Partial<Settings>) => {
    await saveSettings(newSets);
    fetchMainData();
  };

  const handleAddWhitelist = async (dom: string) => {
    await addToWhitelist(dom);
    fetchMainData();
  };

  const handleRemoveWhitelist = async (dom: string) => {
    await removeFromWhitelist(dom);
    fetchMainData();
  };

  const handleSaveLimit = async (dom: string, lim: Limit) => {
    await saveLimit(dom, lim);
    fetchMainData();
  };

  const handleRemoveLimit = async (dom: string) => {
    await saveLimit(dom, null);
    fetchMainData();
  };

  const handleExport = async (type: "csv" | "pdf", category: "daily" | "summary" | "pomodoro") => {
    setIsExporting(true);
    try {
      const content = `Exporting ${category} as ${type.toUpperCase()} from FocusOS\nGenerated: ${new Date().toISOString()}`;
      const blob = new Blob([content], { type: type === "csv" ? "text/csv" : "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `focusos_${category}_export.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardShell activeView={activeView} onViewChange={setActiveView}>
      {activeView === "dashboard" && (
        <OverviewView
          range={range}
          onRangeChange={setRange}
          data={data}
          insights={insights}
          focusScore={focusScore}
          onSelectDomain={handleSelectDomain}
        />
      )}
      {activeView === "site-analysis" && (
        <SiteAnalysisView
          data={analysisData}
          trends={trendData}
          onBack={() => setActiveView("dashboard")}
        />
      )}
      {activeView === "site-categories" && (
        <SiteCategoriesView
          categories={categories}
          onUpdateCategory={handleUpdateCategory}
          data={data}
        />
      )}
      {activeView === "pomodoro" && (
        <PomodoroView
          stats={pomStats}
          sessions={pomSessions}
          templates={pomTemplates}
        />
      )}
      {activeView === "achievements" && (
        <AwardsView achievementState={achState} />
      )}
      {activeView === "settings" && (
        <SettingsView
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onExport={handleExport}
          isExporting={isExporting}
          whitelist={whitelist}
          onAddWhitelist={handleAddWhitelist}
          onRemoveWhitelist={handleRemoveWhitelist}
        />
      )}
      {activeView === "site-details" && (
        <SiteDetailsView data={data} onSelectDomain={handleSelectDomain} />
      )}
      {activeView === "limits" && (
        <DailyLimitsView
          limits={limits}
          onSaveLimit={handleSaveLimit}
          onRemoveLimit={handleRemoveLimit}
        />
      )}
    </DashboardShell>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <DashboardApp />
    </StrictMode>
  );
}
