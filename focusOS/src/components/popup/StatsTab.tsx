import { formatDuration } from "../../utils/format";
import { SectionLabel } from "../ui/SectionLabel";
import { Favicon } from "../ui/Favicon";
import { Button } from "../ui/Button";
import { Divider } from "../ui/Divider";

export interface StatsTabProps {
  totalTime: number;
  topSites: { domain: string; time: number; favicon: string }[];
  onOpenDashboard: () => void;
}

export function StatsTab({
  totalTime,
  topSites,
  onOpenDashboard,
}: StatsTabProps) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full min-h-0">
      <div>
        <div className="mb-6">
          <SectionLabel className="mb-1">TODAY'S BROWSING</SectionLabel>
          <div className="text-[52px] font-light leading-[60px] text-[#C9A96E] tracking-tight truncate">
            {formatDuration(totalTime)}
          </div>
          <div className="text-[11px] text-[#4A4A4A] mt-1 font-normal">
            Total active time today
          </div>
        </div>

        <Divider className="my-4" />

        <div>
          <SectionLabel className="mb-2">TOP SITES</SectionLabel>
          <div className="border border-[#242424] bg-[#111111] rounded-[4px] overflow-hidden">
            {topSites.map((site, idx) => (
              <div
                key={site.domain}
                className={`h-[44px] px-3 flex items-center justify-between transition-colors duration-150 hover:bg-[#1A1A1A] ${
                  idx < topSites.length - 1 ? "border-b border-[#1C1C1C]" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <span className="text-[11px] font-mono text-[#4A4A4A] w-3 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <Favicon src={site.favicon} domain={site.domain} size={20} />
                  <span className="text-[13px] font-normal text-[#F5F5F5] truncate">
                    {site.domain}
                  </span>
                </div>
                <span className="text-[13px] font-medium text-[#F5F5F5] shrink-0">
                  {formatDuration(site.time)}
                </span>
              </div>
            ))}
            {topSites.length === 0 && (
              <div className="h-[88px] flex items-center justify-center text-[13px] text-[#4A4A4A]">
                No sites tracked today
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Divider className="my-4" />
        <Button
          variant="primary"
          onClick={onOpenDashboard}
          className="w-full text-xs"
        >
          FULL DASHBOARD →
        </Button>
      </div>
    </div>
  );
}
