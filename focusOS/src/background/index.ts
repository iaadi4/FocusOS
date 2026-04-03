/**
 * FocusOS - Background Service Worker
 *
 * This service worker tracks time spent on websites using Chrome's event-driven
 * architecture. It persists all state in chrome.storage.local to survive restarts.
 *
 * Key Events:
 * - chrome.tabs.onActivated: User switched tabs
 * - chrome.tabs.onUpdated: Page navigation completed
 * - chrome.windows.onFocusChanged: Window gained/lost focus
 * - chrome.idle.onStateChanged: User went idle or returned
 * - chrome.alarms: Periodic save every 1 minute
 * - Pomodoro timer: Tick every second when active
 */

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

// Storage keys for tracking state (prefixed with _ to avoid conflicts)
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

// Visit debouncing state
let _lastVisit = {
  domain: "",
  timestamp: 0,
};

/**
 * Extracts the hostname from a URL, filtering out browser-internal pages.
 */
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

/**
 * Gets the Google favicon URL for a domain.
 */
function getFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

/**
 * Redirects ALL open tabs matching the given domain to the blocked page.
 */
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

/**
 * Schedules a one-shot alarm to fire exactly when the domain's daily limit
 * will be reached, so the block happens in real-time without waiting for the
 * next periodic 1-minute save alarm.
 */
async function scheduleLimitAlarm(domain: string): Promise<void> {
  const limit = await getLimit(domain);
  if (!limit || !limit.blockOnLimit) return;
  const usage = await getDailyUsage(domain);
  const remainingMs = limit.timeLimit - usage.time;
  if (remainingMs <= 0) {
    // Already at or past the limit — enforce immediately
    await enforceBlock(domain, limit.timeLimit);
    return;
  }
  const alarmName = `limit-check-${domain}`;
  // Cancel any existing alarm for this domain before creating a new one
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

  // Get configurable minimum delay from settings
  const settings = await getSettings();
  const delayMs = settings.trackingDelaySeconds * 1000;

  if (!domain) return;

  // Cancel any pending limit alarm for the domain we're committing time for,
  // since we'll reschedule it below with updated usage.
  await browser.alarms.clear(`limit-check-${domain}`);

  // Check how many times we've visited this domain today
  const usage = await getDailyUsage(domain);

  // Check if this domain has been visited before today
  // visitCount is already incremented before commitTime, so:
  // - visitCount === 1: This is the FIRST navigation to this domain today -> Apply delay
  // - visitCount > 1: This domain was visited earlier today -> NO delay
  const hasBeenVisitedBefore = usage.visitCount > 1;

  let timeToSave = duration;

  // Only apply delay if this is the first time visiting this domain today
  if (!hasBeenVisitedBefore) {
    if (duration < delayMs) {
      timeToSave = 0; // Didn't stay long enough
    } else {
      timeToSave = duration - delayMs; // Subtract the delay "cost"
    }
  }
  // For subsequent visits (hasBeenVisitedBefore === true), track immediately

  // Only save if there is time to save (and less than 5 minutes per event to prevent huge spikes from bugs)
  if (timeToSave > 0 && duration <= 300000) {
    await saveTime(domain, timeToSave, data._favicon || "");
    await checkLimits(domain);
  }
} // End commitTime

/**
 * Starts tracking a new URL. Stores the URL and current timestamp.
 */
async function startTracking(url: string, trackVisit = false): Promise<void> {
  const domain = getDomain(url);

  if (domain) {
    // Check limits immediately upon navigation
    const limit = await getLimit(domain);
    if (limit && limit.blockOnLimit) {
      const usage = await getDailyUsage(domain);
      if (usage.time >= limit.timeLimit) {
        await enforceBlock(domain, limit.timeLimit);
        return; // Do not start tracking if blocked
      }
    }

    // If this is a navigation to a new domain, increment visit count
    if (trackVisit) {
      const now = Date.now();
      // Debounce visits: Ignore if same domain within 5 seconds
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

    // Schedule a precise alarm to fire exactly when the limit will be hit
    await scheduleLimitAlarm(domain);
  } else {
    await stopTracking();
  }
}

/**
 * Stops tracking by removing the start time (but keeps URL for reference).
 */
async function stopTracking(): Promise<void> {
  await browser.storage.local.remove([
    STORAGE_KEYS.CURRENT_URL,
    STORAGE_KEYS.START_TIME,
    STORAGE_KEYS.FAVICON,
  ]);
}

// --- Event Listeners ---

// User switched to a different tab
browser.tabs.onActivated.addListener(async (activeInfo) => {
  await commitTime();

  try {
    const tab = await browser.tabs.get(activeInfo.tabId);
    if (tab.url) {
      await startTracking(tab.url, true); // Track visit on tab switch
    }
  } catch {
    // Tab may have been closed
  }
});

// Page finished loading (navigation within same tab)
browser.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active && tab.url) {
    await commitTime();
    await startTracking(tab.url, true); // Track visit on navigation
  }
});

// SPA Navigation (History API)
browser.webNavigation?.onHistoryStateUpdated?.addListener(async (details) => {
  if (details.frameId === 0) {
    try {
      const tab = await browser.tabs.get(details.tabId);
      if (tab.active) {
        await commitTime();
        await startTracking(details.url, true);
      }
    } catch {
      // Tab may have been closed
    }
  }
});

// Window gained or lost focus
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

// User went idle or returned
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

// Periodic save (every 1 minute) to capture long sessions
browser.alarms.create("time-tracker-save", { periodInMinutes: 1 });

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "time-tracker-save") {
    await commitTime();

    // Check time tracking achievements
    const todayData = await getAggregatedData("today");
    await checkAchievements("time-tracked", {
      totalMinutes: Math.floor(todayData.totalTime / 60000),
    });

    // Restart the timer for ongoing tracking
    const data = (await browser.storage.local.get([
      STORAGE_KEYS.CURRENT_URL,
      STORAGE_KEYS.FAVICON,
    ])) as TrackingState;

    if (data._currentUrl) {
      const domain = getDomain(data._currentUrl);
      if (domain) {
        // Time is already saved by commitTime(), just check limits with current usage
        await checkLimits(domain);
        // Re-schedule the limit alarm with updated usage after the save
        await scheduleLimitAlarm(domain);
      }

      await browser.storage.local.set({
        [STORAGE_KEYS.START_TIME]: Date.now(),
      });
    }
  }

  // Precise limit-check alarm: fires exactly when a domain's limit is hit
  if (alarm.name.startsWith("limit-check-")) {
    const domain = alarm.name.replace("limit-check-", "");
    // Commit any accumulated time first so usage is up-to-date
    await commitTime();
    const limit = await getLimit(domain);
    if (limit && limit.blockOnLimit) {
      const usage = await getDailyUsage(domain);
      if (usage.time >= limit.timeLimit) {
        await enforceBlock(domain, limit.timeLimit);
      } else {
        // Limit not yet reached (e.g. page was left early) — reschedule
        await scheduleLimitAlarm(domain);
      }
    }
  }
});

// Browser startup - register for tracking
browser.runtime.onStartup.addListener(async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab?.url) {
    await startTracking(tab.url);
  }
});

// Extension installed or updated
browser.runtime.onInstalled.addListener(async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tab?.url) {
    await startTracking(tab.url);
  }

  // Resume Pomodoro timer if one was active
  await resumePomodoroTimer();
});

// --- Pomodoro Timer Logic ---

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
    // Phase complete!
    await handlePhaseComplete(state);
  } else {
    // Update state
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
    // Work complete, start break
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

    // Check Work achievements (First Step)
    await checkAchievements("pomodoro-complete", { phase: "work" });
  } else {
    // Break complete, start work
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

    // Check Break achievements
    await checkAchievements("pomodoro-complete", { phase: "break" });
  }
}

// Message handler for Pomodoro commands from popup
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

    // Check Session Count achievements
    const stats = await getPomodoroStats();
    await checkAchievements("pomodoro-complete", {
      totalSessions: stats.totalSessions,
    });
  }

  await clearPomodoroState();
  stopPomodoroTick();
}

// Resume timer on startup
resumePomodoroTimer();
