export interface DailyData {
  [domain: string]: {
    time: number;
    favicon: string;
    lastVisited: number;
    visitCount: number;
    notifications?: NotificationState;
  };
}

export interface NotificationState {
  sent80: boolean;
  sent100: boolean;
}

export interface Limit {
  timeLimit: number;
  notify80: boolean;
  notify100: boolean;
  blockOnLimit: boolean;
}

export interface Settings {
  trackingDelaySeconds: number;
  theme: string;
}

export interface StorageData {
  whitelist?: string[];
  pinnedSites?: string[];
  settings?: Settings;
  limits?: { [domain: string]: Limit };
  siteCategories?: SiteCategoryMap;
  [dateKey: string]:
    | DailyData
    | string[]
    | Settings
    | { [domain: string]: Limit }
    | SiteCategoryMap
    | undefined;
}

export interface AggregatedData {
  totalTime: number;
  byDomain: {
    domain: string;
    time: number;
    favicon: string;
    visitCount: number;
    lastVisited: number;
  }[];
}

export type TimeRange = "today" | "week" | "month" | "year" | "all-time";

export interface Insights {
  mostActiveDay: {
    date: string;
    time: number;
  } | null;
  dailyAverage: number;
}

export interface SiteAnalysisData {
  domain: string;
  favicon: string;
  totalTime: number;
  totalVisits: number;
  totalActiveDays: number;
  firstUsed: string;
  lastUsed: number;

  dailyData: {
    date: string;
    time: number;
    visits: number;
  }[];

  heatMapData: {
    date: string;
    time: number;
    intensity: number;
  }[];
}

export interface TrendMetrics {
  activeDays: number;
  totalDays: number;
  maxDailyTime: number;
  avgDailyTime: number;
  maxDailyVisits: number;
  avgDailyVisits: number;
  totalTime: number;
  totalVisits: number;
  timeChange: number;
  visitsChange: number;
}
export interface PomodoroTemplate {
  id: string;
  name: string;
  workMinutes: number;
  breakMinutes: number;
  isCustom: boolean;
}

export interface PomodoroSession {
  id: string;
  templateId: string;
  templateName: string;
  workMinutes: number;
  breakMinutes: number;
  startTime: number;
  endTime?: number;
  completedCycles: number;
  interrupted: boolean;
}

export interface PomodoroState {
  isActive: boolean;
  isPaused: boolean;
  currentPhase: "work" | "break";
  currentTemplateId: string;
  currentSessionId: string;
  remainingMs: number;
  cyclesCompleted: number;
  lastUpdateTime: number;
  sessionStartTime: number;
}

export interface PomodoroStats {
  totalSessions: number;
  totalFocusTime: number;
  totalBreakTime: number;
  averageSessionLength: number;
  mostUsedTemplate: string;
  sessionsToday: number;
}

export type SiteCategory = "productive" | "distraction" | "neutral" | "others";

export interface SiteCategoryMap {
  [domain: string]: SiteCategory;
}

export interface FocusScore {
  score: number;
  productiveTime: number;
  distractionTime: number;
  neutralTime: number;
  othersTime: number;
  totalTime: number;
}
