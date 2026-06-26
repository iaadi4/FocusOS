import { ACHIEVEMENTS, getXpProgress } from "../../utils/achievements";
import type { AchievementState } from "../../utils/achievements";
import { SectionLabel } from "../ui/SectionLabel";
import { ProgressBar } from "../ui/ProgressBar";

export interface AwardsViewProps {
  achievementState: AchievementState;
}

export function AwardsView({ achievementState }: AwardsViewProps) {
  const { current, next, level } = getXpProgress(achievementState.totalXp);
  const totalTarget = current + next;
  const progressRatio = totalTarget > 0 ? current / totalTarget : 1;

  const unlockedCount = achievementState.unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      <div className="border-b border-[#1C1C1C] pb-6">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
          Awards & Achievements
        </h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">
          Track your progress, earn XP, and unlock achievements.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <SectionLabel>CURRENT LEVEL</SectionLabel>
            <div className="text-[36px] font-light font-mono text-[#C9A96E] leading-none mt-2">
              {level}
            </div>
          </div>
          <div className="text-xs font-mono text-[#F5F5F5]">
            {current} / {totalTarget} XP
          </div>
        </div>

        <ProgressBar value={progressRatio} max={1} />

        <div className="text-[11px] font-mono text-[#8A8A8A] text-right">
          Next: {next} XP
        </div>
      </div>

      <div className="flex flex-col">
        <SectionLabel className="mb-3">
          ACHIEVEMENTS ({unlockedCount}/{totalCount})
        </SectionLabel>
        <div className="border-t border-[#1C1C1C]">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = achievementState.unlockedIds.includes(ach.id);
            const Icon = ach.icon;

            const rowBg = isUnlocked
              ? "bg-[#111111]"
              : "bg-[#0A0A0A] opacity-50";

            return (
              <div
                key={ach.id}
                className={`${rowBg} p-4 border-b border-[#1C1C1C] flex items-center justify-between gap-4 transition-colors`}
              >
                <div className="flex items-center gap-4 min-w-0 pr-4">
                  <div
                    className={`w-[40px] h-[40px] bg-[#1A1A1A] rounded-[2px] flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? "border-[#C9A96E] text-[#C9A96E] shadow-[0_0_15px_rgba(201,169,110,0.15)]"
                        : "border-[#242424] text-[#4A4A4A]"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[#F5F5F5] tracking-tight truncate">
                      {ach.isSecret && !isUnlocked ? "Secret Achievement ????" : ach.title}
                    </div>
                    <div className="text-[12px] text-[#8A8A8A] mt-0.5">
                      {ach.isSecret && !isUnlocked
                        ? "Keep exploring FocusOS to uncover this achievement."
                        : ach.description}
                    </div>
                  </div>
                </div>

                <div className="text-[#C9A96E] text-xs font-medium font-mono shrink-0">
                  +{ach.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
