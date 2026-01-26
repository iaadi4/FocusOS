import {
  Trophy,
  Clock,
  Zap,
  Target,
  Flame,
  Calendar,
  MousePointer,
  Shield,
  Coffee,
  Star,
} from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: any; // Lucide icon component
  category: "time" | "pomodoro" | "streak" | "misc";
  isSecret?: boolean;
}

export interface AchievementState {
  unlockedIds: string[];
  totalXp: number;
  lastUpdated: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    title: "First Step",
    description: "Complete your first Pomodoro session.",
    xp: 50,
    icon: Target,
    category: "pomodoro",
  },
  {
    id: "focus-master",
    title: "Focus Master",
    description: "Complete 10 Pomodoro sessions.",
    xp: 200,
    icon: Trophy,
    category: "pomodoro",
  },
  {
    id: "time-flies",
    title: "Time Flies",
    description: "Track 1 hour of activity in a single day.",
    xp: 100,
    icon: Clock,
    category: "time",
  },
  {
    id: "marathon-runner",
    title: "Marathon Runner",
    description: "Track 5 hours of activity in a single day.",
    xp: 300,
    icon: Zap,
    category: "time",
  },
  {
    id: "streak-starter",
    title: "Streak Starter",
    description: "Use FocusOS for 3 consecutive days.",
    xp: 150,
    icon: Flame,
    category: "streak",
  },
  {
    id: "daily-habit",
    title: "Daily Habit",
    description: "Use FocusOS for 7 consecutive days.",
    xp: 400,
    icon: Calendar,
    category: "streak",
  },
  {
    id: "click-master",
    title: "Click Master",
    description: "Visit 50 different websites in a day.",
    xp: 100,
    icon: MousePointer,
    category: "misc",
  },
  {
    id: "guardian",
    title: "Guardian",
    description: "Hit a daily limit on a blocked site.",
    xp: 75,
    icon: Shield,
    category: "misc",
  },
  {
    id: "break-time",
    title: "Break Time",
    description: "Complete a Pomodoro break fully.",
    xp: 50,
    icon: Coffee,
    category: "pomodoro",
  },
  {
    id: "super-user",
    title: "Super User",
    description: "Reach 1000 Total XP.",
    xp: 500,
    icon: Star,
    category: "misc",
  },
  {
    id: "deep-focus",
    title: "Deep Focus",
    description: "Complete 4 Pomodoro sessions in a row.",
    xp: 100,
    icon: Target,
    category: "pomodoro",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Start working before 8 AM.",
    xp: 50,
    icon: Zap,
    category: "time",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Track time after 10 PM.",
    xp: 50,
    icon: Clock,
    category: "time",
  },
  {
    id: "weekend-warrior",
    title: "Weekend Warrior",
    description: "Use FocusOS on both Saturday and Sunday.",
    xp: 150,
    icon: Flame,
    category: "streak",
  },
  {
    id: "productivity-god",
    title: "Productivity God",
    description: "Track 8+ hours in a single day.",
    xp: 500,
    icon: Trophy,
    category: "time",
  },
  // Secret Achievements
  {
    id: "the-glitch",
    title: "The Glitch",
    description: "You found a glitch in the system!",
    xp: 1000,
    icon: Zap,
    category: "misc",
    isSecret: true,
  },
  {
    id: "midnight-coder",
    title: "Midnight Coder",
    description: "Checked stats between 12 AM and 1 AM.",
    xp: 200,
    icon: Clock,
    category: "misc",
    isSecret: true,
  },
  {
    id: "clean-slate",
    title: "Clean Slate",
    description: "Cleared all whitelist entries.",
    xp: 100,
    icon: Shield,
    category: "misc",
    isSecret: true,
  },
];

export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500,
];

export function getLevel(xp: number): number {
  return LEVEL_THRESHOLDS.findIndex((threshold) => xp < threshold) === -1
    ? LEVEL_THRESHOLDS.length
    : LEVEL_THRESHOLDS.findIndex((threshold) => xp < threshold);
}

export function getXpProgress(xp: number): {
  current: number;
  next: number;
  level: number;
} {
  const level = getLevel(xp);
  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXp =
    LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  return {
    current: xp - currentLevelXp,
    next: nextLevelXp - currentLevelXp,
    level,
  };
}
