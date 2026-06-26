
import type {
  PomodoroTemplate,
  PomodoroSession,
  PomodoroState,
  PomodoroStats,
  StorageData,
} from "./types";
import { getStorageData, setStorageData, getTodayKey } from "./storage";
import browser from "webextension-polyfill";

const POMODORO_TEMPLATES_KEY = "pomodoroTemplates";
const POMODORO_STATE_KEY = "pomodoroState";
const POMODORO_SESSIONS_KEY = "pomodoroSessions";


const PRESET_TEMPLATES: PomodoroTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    workMinutes: 25,
    breakMinutes: 5,
    isCustom: false,
  },
  {
    id: "extended",
    name: "Extended",
    workMinutes: 45,
    breakMinutes: 15,
    isCustom: false,
  },
  {
    id: "long",
    name: "Long",
    workMinutes: 50,
    breakMinutes: 10,
    isCustom: false,
  },
  {
    id: "short",
    name: "Short",
    workMinutes: 15,
    breakMinutes: 5,
    isCustom: false,
  },
];


export const getPomodoroTemplates = async (): Promise<PomodoroTemplate[]> => {
  const data = await getStorageData(POMODORO_TEMPLATES_KEY);
  const customTemplates =
    (data[POMODORO_TEMPLATES_KEY] as unknown as PomodoroTemplate[]) || [];
  return [...PRESET_TEMPLATES, ...customTemplates];
};


export const savePomodoroTemplate = async (
  template: Omit<PomodoroTemplate, "id" | "isCustom">,
): Promise<void> => {
  const data = await getStorageData(POMODORO_TEMPLATES_KEY);
  const customTemplates =
    (data[POMODORO_TEMPLATES_KEY] as unknown as PomodoroTemplate[]) || [];

  const newTemplate: PomodoroTemplate = {
    ...template,
    id: `custom-${Date.now()}`,
    isCustom: true,
  };

  customTemplates.push(newTemplate);
  await setStorageData({ [POMODORO_TEMPLATES_KEY]: customTemplates } as unknown as Partial<StorageData>);
};


export const deletePomodoroTemplate = async (id: string): Promise<void> => {
  const data = await getStorageData(POMODORO_TEMPLATES_KEY);
  const customTemplates =
    (data[POMODORO_TEMPLATES_KEY] as unknown as PomodoroTemplate[]) || [];

  const filtered = customTemplates.filter((t) => t.id !== id);
  await setStorageData({ [POMODORO_TEMPLATES_KEY]: filtered } as unknown as Partial<StorageData>);
};


export const getPomodoroState = async (): Promise<PomodoroState | null> => {
  const data = await getStorageData(POMODORO_STATE_KEY);
  return (data[POMODORO_STATE_KEY] as unknown as PomodoroState) || null;
};


export const savePomodoroState = async (
  state: PomodoroState,
): Promise<void> => {
  await setStorageData({ [POMODORO_STATE_KEY]: state } as unknown as Partial<StorageData>);
};


export const clearPomodoroState = async (): Promise<void> => {
  await browser.storage.local.remove(POMODORO_STATE_KEY);
};


export const savePomodoroSession = async (
  session: PomodoroSession,
): Promise<void> => {
  const todayKey = `${POMODORO_SESSIONS_KEY}-${getTodayKey()}`;
  const data = await getStorageData(todayKey);
  const sessions = (data[todayKey] as unknown as PomodoroSession[]) || [];

  sessions.push(session);
  await setStorageData({ [todayKey]: sessions } as unknown as Partial<StorageData>);
};


export const getPomodoroSessions = async (
  startDate?: string,
  endDate?: string,
): Promise<PomodoroSession[]> => {
  const allData = await getStorageData(null);
  const sessions: PomodoroSession[] = [];

  Object.keys(allData).forEach((key) => {
    if (key.startsWith(POMODORO_SESSIONS_KEY)) {
      const dateStr = key.replace(`${POMODORO_SESSIONS_KEY}-`, "");
      if (startDate && dateStr < startDate) return;
      if (endDate && dateStr > endDate) return;

      const daySessions = allData[key] as unknown as PomodoroSession[];
      sessions.push(...daySessions);
    }
  });

  return sessions.sort((a, b) => b.startTime - a.startTime);
};


export const getPomodoroStats = async (): Promise<PomodoroStats> => {
  const allSessions = await getPomodoroSessions();
  const today = getTodayKey();
  const todayData = await getStorageData(`${POMODORO_SESSIONS_KEY}-${today}`);
  const sessionsToday = (
    (todayData[
      `${POMODORO_SESSIONS_KEY}-${today}`
    ] as unknown as PomodoroSession[]) || []
  ).length;

  let totalFocusTime = 0;
  let totalBreakTime = 0;
  const templateCounts: { [id: string]: number } = {};

  allSessions.forEach((session) => {
    if (!session.interrupted) {
      totalFocusTime +=
        session.workMinutes * session.completedCycles * 60 * 1000;
      totalBreakTime +=
        session.breakMinutes * session.completedCycles * 60 * 1000;
    }

    templateCounts[session.templateId] =
      (templateCounts[session.templateId] || 0) + 1;
  });

  const mostUsedTemplateId = Object.keys(templateCounts).reduce(
    (a, b) => (templateCounts[a] > templateCounts[b] ? a : b),
    "",
  );

  const templates = await getPomodoroTemplates();
  const mostUsedTemplate =
    templates.find((t) => t.id === mostUsedTemplateId)?.name || "None";

  return {
    totalSessions: allSessions.length,
    totalFocusTime,
    totalBreakTime,
    averageSessionLength:
      allSessions.length > 0
        ? (totalFocusTime + totalBreakTime) / allSessions.length
        : 0,
    mostUsedTemplate,
    sessionsToday,
  };
};
