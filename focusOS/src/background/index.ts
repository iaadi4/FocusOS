import {
  saveTime,
  getSettings,
  incrementVisitCount,
  getLimit,
  getDailyUsage,
  updateNotificationState,
} from "../utils/storage";
import {
  getPomodoroState,
  savePomodoroState,
  clearPomodoroState,
  savePomodoroSession,
  getPomodoroTemplates,
  getPomodoroStats,
} from "../utils/pomodoro-storage";
import { checkAchievements } from "../utils/achievement-checker";
import { getAggregatedData } from "../utils/storage";
import type { PomodoroState } from "../utils/types";
import browser from "webextension-polyfill";


const STORAGE_KEYS = {
  CURRENT_URL: "_currentUrl",
  START_TIME: "_startTime",
  FAVICON: "_favicon",
} as const;

type TrackingState = {
  _currentUrl?: string;
  _startTime?: number;
  _favicon?: string;
};


let _lastVisit = {
  domain: "",
  timestamp: 0,
};

function getDomain(url: string): string | null {
  if (!url) return null;

  const blockedPrefixes = [
    "chrome://",
    "chrome-extension://",
    "about:",
    "edge://",
    "moz-extension://",
  ];

  if (blockedPrefixes.some((prefix) => url.startsWith(prefix))) {
    return null;
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function getFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

async function enforceBlock(domain: string, timeLimit: number): Promise<void> {
  const blockedUrl = browser.runtime.getURL(
    `blocked.html?domain=${domain}&limit=${timeLimit}`,
  );
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url && getDomain(tab.url) === domain) {
      browser.tabs.update(tab.id, { url: blockedUrl });
    }
  }
}

async function scheduleLimitAlarm(domain: string): Promise<void> {
  const limit = await getLimit(domain);
  if (!limit || !limit.blockOnLimit) return;
  const usage = await getDailyUsage(domain);
  const remainingMs = limit.timeLimit - usage.time;
  if (remainingMs <= 0) {
    await enforceBlock(domain, limit.timeLimit);
    return;
  }
  const alarmName = `limit-check-${domain}`;
  await browser.alarms.clear(alarmName);
  browser.alarms.create(alarmName, {
    delayInMinutes: remainingMs / 60000,
  });
}

async function checkLimits(domain: string, timeToAdd = 0): Promise<void> {
  const limit = await getLimit(domain);
  if (!limit) return;
  const usage = await getDailyUsage(domain);
  const totalTime = usage.time + timeToAdd;

  const is80Percent = totalTime >= limit.timeLimit * 0.8;
  const is100Percent = totalTime >= limit.timeLimit;

  if (
    limit.notify80 &&
    is80Percent &&
    !usage.notifications.sent80 &&
    !is100Percent
  ) {
    browser.notifications.create({
      type: "basic",
      iconUrl: "logo.png",
      title: "FocusOS Alert",
      message: `You have used 80% of your daily limit for ${domain}.`,
    });
    await updateNotificationState(domain, { sent80: true });
  }

  if (limit.notify100 && is100Percent && !usage.notifications.sent100) {
    browser.notifications.create({
      type: "basic",
      iconUrl: "logo.png",
      title: "FocusOS Alert",
      message: `You have reached your daily limit for ${domain}.`,
    });
    await updateNotificationState(domain, { sent100: true });
  }

  if (limit.blockOnLimit && is100Percent) {
    await enforceBlock(domain, limit.timeLimit);
  }
}

async function commitTime(): Promise<void> {
  const data = (await browser.storage.local.get(
    Object.values(STORAGE_KEYS),
  )) as TrackingState;

  if (!data._currentUrl || !data._startTime) return;

  const duration = Date.now() - data._startTime;
  const domain = getDomain(data._currentUrl);

  const settings = await getSettings();
  const delayMs = settings.trackingDelaySeconds * 1000;

  if (!domain) return;

  await browser.alarms.clear(`limit-check-${domain}`);

  const usage = await getDailyUsage(domain);
  const hasBeenVisitedBefore = usage.visitCount > 1;

  let timeToSave = duration;

  if (!hasBeenVisitedBefore) {
    if (duration < delayMs) {
      timeToSave = 0;
    } else {
      timeToSave = duration - delayMs;
    }
  }


  if (timeToSave > 0 && duration <= 300000) {
    await saveTime(domain, timeToSave, data._favicon || "");
    await checkLimits(domain);
  }
}

async function startTracking(url: string, trackVisit = false): Promise<void> {
  const domain = getDomain(url);

  if (domain) {
    const limit = await getLimit(domain);
    if (limit && limit.blockOnLimit) {
      const usage = await getDailyUsage(domain);
      if (usage.time >= limit.timeLimit) {
        await enforceBlock(domain, limit.timeLimit);
        return;
      }
    }

    if (trackVisit) {
      const now = Date.now();
      const isDuplicate =
        domain === _lastVisit.domain && now - _lastVisit.timestamp < 5000;

      if (!isDuplicate) {
        await incrementVisitCount(domain, getFavicon(url));
        _lastVisit = { domain, timestamp: now };
      }
    }

    await browser.storage.local.set({
      [STORAGE_KEYS.CURRENT_URL]: url,
      [STORAGE_KEYS.START_TIME]: Date.now(),
      [STORAGE_KEYS.FAVICON]: getFavicon(url),
    });

    await scheduleLimitAlarm(domain);
  } else {
    await stopTracking();
  }
}

async function stopTracking(): Promise<void> {
  await browser.storage.local.remove([
    STORAGE_KEYS.CURRENT_URL,
    STORAGE_KEYS.START_TIME,
    STORAGE_KEYS.FAVICON,
  ]);
}




browser.tabs.onActivated.addListener(async (activeInfo) => {
  await commitTime();

  try {
    const tab = await browser.tabs.get(activeInfo.tabId);
    if (tab.url) {
      await startTracking(tab.url, true);
    }
  } catch {}
});


browser.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && tab.url) {
    await commitTime();
    await startTracking(tab.url, true);
  }
});


browser.webNavigation?.onHistoryStateUpdated?.addListener(async (details) => {
  if (details.frameId === 0) {
    try {
      const tab = await browser.tabs.get(details.tabId);
      if (tab.active) {
        await commitTime();
        await startTracking(details.url, true);
      }
    } catch {
    }
  }
});


browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE) {
    await commitTime();
    await browser.storage.local.remove([STORAGE_KEYS.START_TIME]);
  } else {
    const [tab] = await browser.tabs.query({ active: true, windowId });
    if (tab?.url) {
      await startTracking(tab.url);
    }
  }
});


browser.idle.onStateChanged.addListener(async (newState) => {
  if (newState === "idle" || newState === "locked") {
    await commitTime();
    await browser.storage.local.remove([STORAGE_KEYS.START_TIME]);
  } else if (newState === "active") {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab?.url) {
      await startTracking(tab.url);
    }
  }
});


browser.alarms.create("time-tracker-save", { periodInMinutes: 1 });

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "time-tracker-save") {
    await commitTime();


    const todayData = await getAggregatedData("today");
    await checkAchievements("time-tracked", {
      totalMinutes: Math.floor(todayData.totalTime / 60000),
    });


    const data = (await browser.storage.local.get([
      STORAGE_KEYS.CURRENT_URL,
      STORAGE_KEYS.FAVICON,
    ])) as TrackingState;

    if (data._currentUrl) {
      const domain = getDomain(data._currentUrl);
      if (domain) {
        await checkLimits(domain);
        await scheduleLimitAlarm(domain);
      }

      await browser.storage.local.set({
        [STORAGE_KEYS.START_TIME]: Date.now(),
      });
    }
  }

  if (alarm.name.startsWith("limit-check-")) {
    const domain = alarm.name.replace("limit-check-", "");
    await commitTime();
    const limit = await getLimit(domain);
    if (limit && limit.blockOnLimit) {
      const usage = await getDailyUsage(domain);
      if (usage.time >= limit.timeLimit) {
        await enforceBlock(domain, limit.timeLimit);
      } else {
        await scheduleLimitAlarm(domain);
      }
    }
  }
});


browser.runtime.onStartup.addListener(async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab?.url) {
    await startTracking(tab.url);
  }
});


browser.runtime.onInstalled.addListener(async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab?.url) {
    await startTracking(tab.url);
  }
  await resumePomodoroTimer();
});



let pomodoroInterval: NodeJS.Timeout | null = null;

async function resumePomodoroTimer() {
  const state = await getPomodoroState();
  if (state && state.isActive && !state.isPaused) {
    startPomodoroTick();
  }
}

function startPomodoroTick() {
  if (pomodoroInterval) {
    clearInterval(pomodoroInterval);
  }

  pomodoroInterval = setInterval(async () => {
    await tickPomodoro();
  }, 1000);
}

function stopPomodoroTick() {
  if (pomodoroInterval) {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
  }
}

async function tickPomodoro() {
  const state = await getPomodoroState();
  if (!state || !state.isActive || state.isPaused) {
    stopPomodoroTick();
    return;
  }

  const now = Date.now();
  const elapsed = now - state.lastUpdateTime;
  const newRemaining = Math.max(0, state.remainingMs - elapsed);

  if (newRemaining <= 0) {
    await handlePhaseComplete(state);
  } else {
    await savePomodoroState({
      ...state,
      remainingMs: newRemaining,
      lastUpdateTime: now,
    });
  }
}

async function handlePhaseComplete(state: PomodoroState) {
  const templates = await getPomodoroTemplates();
  const template = templates.find((t) => t.id === state.currentTemplateId);

  if (!template) {
    await stopPomodoro(true);
    return;
  }

  if (state.currentPhase === "work") {
    const newCyclesCompleted = state.cyclesCompleted + 1;

    browser.notifications.create({
      type: "basic",
      iconUrl: "logo.png",
      title: "Work Complete! 🎉",
      message: `Great job! Time for a ${template.breakMinutes} minute break.`,
    });

    await savePomodoroState({
      ...state,
      currentPhase: "break",
      remainingMs: template.breakMinutes * 60 * 1000,
      cyclesCompleted: newCyclesCompleted,
      lastUpdateTime: Date.now(),
    });


    await checkAchievements("pomodoro-complete", { phase: "work" });
  } else {
    browser.notifications.create({
      type: "basic",
      iconUrl: "logo.png",
      title: "Break Over! 💪",
      message: `Ready for another ${template.workMinutes} minutes of focus?`,
    });

    await savePomodoroState({
      ...state,
      currentPhase: "work",
      remainingMs: template.workMinutes * 60 * 1000,
      lastUpdateTime: Date.now(),
    });


    await checkAchievements("pomodoro-complete", { phase: "break" });
  }
}


type PomodoroMessage =
  | { type: "pomodoroStart"; templateId: string }
  | { type: "pomodoroPause" }
  | { type: "pomodoroResume" }
  | { type: "pomodoroStop" };

browser.runtime.onMessage.addListener(async (message: unknown) => {
  if (
    !message ||
    typeof message !== "object" ||
    !("type" in message) ||
    typeof (message as { type: unknown }).type !== "string"
  ) {
    return;
  }

  const msg = message as PomodoroMessage;

  if (msg.type === "pomodoroStart") {
    await startPomodoro((msg as { type: "pomodoroStart"; templateId: string }).templateId);
    return { success: true };
  }

  if (msg.type === "pomodoroPause") {
    await pausePomodoro();
    return { success: true };
  }

  if (msg.type === "pomodoroResume") {
    await resumePomodoro();
    return { success: true };
  }

  if (msg.type === "pomodoroStop") {
    await stopPomodoro(true);
    return { success: true };
  }
});

async function startPomodoro(templateId: string) {
  const templates = await getPomodoroTemplates();
  const template = templates.find((t) => t.id === templateId);

  if (!template) return;

  const state: PomodoroState = {
    isActive: true,
    isPaused: false,
    currentPhase: "work",
    currentTemplateId: templateId,
    currentSessionId: `session-${Date.now()}`,
    remainingMs: template.workMinutes * 60 * 1000,
    cyclesCompleted: 0,
    lastUpdateTime: Date.now(),
    sessionStartTime: Date.now(),
  };

  await savePomodoroState(state);
  startPomodoroTick();
}

async function pausePomodoro() {
  const state = await getPomodoroState();
  if (!state) return;

  await savePomodoroState({
    ...state,
    isPaused: true,
  });

  stopPomodoroTick();
}

async function resumePomodoro() {
  const state = await getPomodoroState();
  if (!state) return;

  await savePomodoroState({
    ...state,
    isPaused: false,
    lastUpdateTime: Date.now(),
  });

  startPomodoroTick();
}

async function stopPomodoro(interrupted: boolean) {
  const state = await getPomodoroState();
  if (!state) return;

  const templates = await getPomodoroTemplates();
  const template = templates.find((t) => t.id === state.currentTemplateId);

  if (template) {
    await savePomodoroSession({
      id: state.currentSessionId,
      templateId: state.currentTemplateId,
      templateName: template.name,
      workMinutes: template.workMinutes,
      breakMinutes: template.breakMinutes,
      startTime: state.sessionStartTime || Date.now(),
      endTime: Date.now(),
      completedCycles: state.cyclesCompleted,
      interrupted,
    });


    const stats = await getPomodoroStats();
    await checkAchievements("pomodoro-complete", {
      totalSessions: stats.totalSessions,
    });
  }

  await clearPomodoroState();
  stopPomodoroTick();
}


resumePomodoroTimer();
