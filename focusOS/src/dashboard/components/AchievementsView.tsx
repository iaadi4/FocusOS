import { useEffect, useState } from "react";
import { Award, Lock, Star } from "lucide-react";
import { ACHIEVEMENTS, getXpProgress } from "../../utils/achievements";
import type { AchievementState } from "../../utils/achievements";
import { getAchievementState } from "../../utils/achievement-storage";

export function AchievementsView() {
  const [state, setState] = useState<AchievementState>({
    unlockedIds: [],
    totalXp: 0,
    lastUpdated: 0,
  });

  useEffect(() => {
    getAchievementState().then(setState);
  }, []);

  const { current, next, level } = getXpProgress(state.totalXp);
  const progressPercent = Math.min(100, (current / next) * 100);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Level Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/10 bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-50"></div>

        <div className="relative z-10 flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              Current Level
            </h2>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600">
              {level}
            </div>
          </div>
          <Award className="w-12 h-12 text-yellow-500/80" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between text-xs text-neutral-400 mb-1 font-mono">
            <span>{state.totalXp} XP</span>
            <span>Next: {next - current} XP</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-1">
          <Star className="w-3 h-3 text-yellow-500" />
          Achievements ({state.unlockedIds.length}/{ACHIEVEMENTS.length})
        </h3>

        <div className="grid gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = state.unlockedIds.includes(achievement.id);
            const Icon = achievement.icon;

            return (
              <div
                key={achievement.id}
                className={`
                  relative p-4 rounded-xl border transition-all duration-300
                  ${
                    isUnlocked
                      ? "bg-white/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                      : "bg-white/5 border-white/5 opacity-60 grayscale hover:opacity-80"
                  }
                `}
              >
                <div className="flex gap-4">
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                    ${
                      isUnlocked
                        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 text-yellow-400"
                        : "bg-white/5 text-neutral-500"
                    }
                  `}
                  >
                    {isUnlocked ? (
                      <Icon className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`font-bold text-sm ${isUnlocked ? "text-white" : "text-neutral-400"}`}
                      >
                        {achievement.isSecret && !isUnlocked
                          ? "??? Secret ???"
                          : achievement.title}
                      </h4>
                      {(!achievement.isSecret || isUnlocked) && (
                        <span
                          className={`text-xs font-mono font-bold ${isUnlocked ? "text-yellow-500" : "text-neutral-600"}`}
                        >
                          {achievement.xp} XP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {achievement.isSecret && !isUnlocked
                        ? "Unlock this secret achievement to reveal its details."
                        : achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
