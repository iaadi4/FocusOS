import browser from "webextension-polyfill";
import { ACHIEVEMENTS } from "./achievements";
import type { AchievementState } from "./achievements";

const STORAGE_KEY = "achievement_state";

const DEFAULT_STATE: AchievementState = {
  unlockedIds: [],
  totalXp: 0,
  lastUpdated: Date.now(),
};

export async function getAchievementState(): Promise<AchievementState> {
  const data = await browser.storage.local.get(STORAGE_KEY);
  return (data[STORAGE_KEY] as AchievementState) || DEFAULT_STATE;
}

export async function saveAchievementState(
  state: AchievementState,
): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEY]: state });
}

export async function unlockAchievement(id: string): Promise<boolean> {
  const state = await getAchievementState();

  if (state.unlockedIds.includes(id)) {
    return false; // Already unlocked
  }

  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
  if (!achievement) return false;

  const newState: AchievementState = {
    ...state,
    unlockedIds: [...state.unlockedIds, id],
    totalXp: state.totalXp + achievement.xp,
    lastUpdated: Date.now(),
  };

  await saveAchievementState(newState);
  return true; // Newly unlocked
}
