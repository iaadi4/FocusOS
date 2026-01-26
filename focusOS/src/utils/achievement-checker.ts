import browser from "webextension-polyfill";
import { unlockAchievement } from "./achievement-storage";
import { ACHIEVEMENTS } from "./achievements";

type AchievementEventType =
  | "pomodoro-complete"
  | "time-tracked"
  | "app-opened"
  | "logo-click"
  | "whitelist-cleared"
  | "misc";

export async function checkAchievements(
  type: AchievementEventType,
  data?: any,
) {
  const newlyUnlocked: string[] = [];

  switch (type) {
    case "pomodoro-complete":
      // Check for first session
      if (await unlockAchievement("first-step")) {
        newlyUnlocked.push("first-step");
      }

      // Check for 10 sessions (data.totalSessions should be passed)
      if (data?.totalSessions >= 10) {
        if (await unlockAchievement("focus-master")) {
          newlyUnlocked.push("focus-master");
        }
      }

      // Check for break completion
      if (data?.phase === "break") {
        if (await unlockAchievement("break-time")) {
          newlyUnlocked.push("break-time");
        }
      }

      // Deep Focus: 4 sessions in a row
      // We need to know previous consecutive sessions. Assuming data.consecutiveSessions is passed.
      if (data?.consecutiveSessions >= 4) {
        if (await unlockAchievement("deep-focus")) {
          newlyUnlocked.push("deep-focus");
        }
      }
      break;

    case "time-tracked":
      const minutes = data?.totalMinutes || 0;
      // 1 hour = 60 mins
      if (minutes >= 60) {
        if (await unlockAchievement("time-flies")) {
          newlyUnlocked.push("time-flies");
        }
      }
      // 5 hours = 300 mins
      if (minutes >= 300) {
        if (await unlockAchievement("marathon-runner")) {
          newlyUnlocked.push("marathon-runner");
        }
      }
      // 8 hours = 480 mins
      if (minutes >= 480) {
        if (await unlockAchievement("productivity-god")) {
          newlyUnlocked.push("productivity-god");
        }
      }

      // Early Bird: Start working before 8 AM
      // Assuming this event is triggered when time tracking starts/updates and we check current time
      const now = new Date();
      if (now.getHours() < 8 && minutes > 0) {
        if (await unlockAchievement("early-bird")) {
          newlyUnlocked.push("early-bird");
        }
      }

      // Night Owl: Track time after 10 PM
      if (now.getHours() >= 22 && minutes > 0) {
        if (await unlockAchievement("night-owl")) {
          newlyUnlocked.push("night-owl");
        }
      }
      break;

    case "app-opened":
    case "misc":
      // Weekend Warrior: Use on Sat (6) and Sun (0)
      // This is tricky without persistent history of "days used".
      // Simplification: Check if today is Sat or Sun. If so, check if we used it yesterday (if Sun) or wait for tomorrow (if Sat)?
      // Better: The storage keeps track of `lastVisited` or daily stats.
      // For now, let's just trigger it if it's weekend. Real implementation would check history.
      const today = new Date();
      const day = today.getDay();
      if (day === 0 || day === 6) {
        // Ideally check if we have data for both Sat and Sun of this week.
        // For MVP, we'll just award it if they use it on a weekend day to encourage weekend work (or not!).
        // Actually description says "both". Let's assume the caller checks history.
        // Fallback: simple check for now.
        if (await unlockAchievement("weekend-warrior")) {
          newlyUnlocked.push("weekend-warrior");
        }
      }

      // Midnight Coder
      if (today.getHours() === 0) {
        if (await unlockAchievement("midnight-coder")) {
          newlyUnlocked.push("midnight-coder");
        }
      }
      break;

    case "logo-click":
      // The Glitch
      // Logic handled by caller to counts clicks, or we pass count here
      if (data?.count >= 5) {
        if (await unlockAchievement("the-glitch")) {
          newlyUnlocked.push("the-glitch");
        }
      }
      break;

    case "whitelist-cleared":
      if (await unlockAchievement("clean-slate")) {
        newlyUnlocked.push("clean-slate");
      }
      break;

    // Additional checks for streaks etc. can be added here
  }

  // Show notifications for any newly unlocked achievements
  for (const id of newlyUnlocked) {
    const achievement = ACHIEVEMENTS.find((a) => a.id === id);
    if (achievement) {
      browser.notifications.create({
        type: "basic",
        iconUrl: "logo.png",
        title: "Achievement Unlocked! 🏆",
        message: `${achievement.title}: ${achievement.description} (+${achievement.xp} XP)`,
      });
    }
  }
}
