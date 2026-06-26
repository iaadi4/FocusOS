import type { AggregatedData, Insights, FocusScore, TimeRange } from "../../utils/types";
import { formatDuration, formatDomain } from "../../utils/format";
import { Favicon } from "../ui/Favicon";
import { ProgressBar } from "../ui/ProgressBar";
import { SectionLabel } from "../ui/SectionLabel";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface OverviewViewProps {
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
  data: AggregatedData;
  insights: Insights;
  focusScore: FocusScore;
  onSelectDomain: (domain: string) => void;
}

export function OverviewView({
  range,
  onRangeChange,
  data,
  insights,
  focusScore,
  onSelectDomain,
}: OverviewViewProps) {
  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: "today", label: "TODAY" },
    { id: "week", label: "WEEK" },
    { id: "month", label: "MONTH" },
    { id: "all-time", label: "ALL TIME" },
  ];

  const avgTime =
    range === "today"
      ? data.byDomain.length > 0
        ? Math.round(data.totalTime / data.byDomain.length)
        : 0
      : insights.dailyAverage;

  const mostVisited = data.byDomain[0];

  const topSitesForChart = data.byDomain.slice(0, 6);
  const chartColors = [
    "#C9A96E",
    "#8A7248",
    "#5C4A28",
    "#4A4A4A",
    "#2A2A2A",
    "#1A1A1A",
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 select-none">
      <div className="flex items-end justify-between border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
            Your Performance
          </h1>
          <p className="text-[13px] text-[#8A8A8A] mt-1">
            Deep dive into your focus metrics.
          </p>
        </div>
        <div className="flex gap-4">
          {timeRanges.map((tr) => (
            <button
              key={tr.id}
              onClick={() => onRangeChange(tr.id)}
              className={`pb-2 px-1 text-xs uppercase tracking-wider transition-colors duration-150 focus:outline-none ${
                range === tr.id
                  ? "border-b-2 border-[#C9A96E] text-[#C9A96E] font-semibold"
                  : "border-b-2 border-transparent text-[#8A8A8A] hover:text-[#F5F5F5]"
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>TOTAL TIME</SectionLabel>
          <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono tracking-tight">
            {formatDuration(data.totalTime)}
          </div>
          <div className="text-xs text-[#8A8A8A] mt-1">Active duration</div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>
            {range === "today" ? "AVG PER SITE" : "DAILY AVG"}
          </SectionLabel>
          <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono tracking-tight">
            {formatDuration(avgTime)}
          </div>
          <div className="text-xs text-[#8A8A8A] mt-1">Per session metric</div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>MOST VISITED</SectionLabel>
          <div className="text-[22px] font-normal text-[#F5F5F5] mt-3 truncate">
            {mostVisited ? formatDomain(mostVisited.domain) : "—"}
          </div>
          <div className="text-xs text-[#C9A96E] mt-1 font-mono">
            {mostVisited ? formatDuration(mostVisited.time) : "0s"}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>UNIQUE SITES</SectionLabel>
          <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono tracking-tight">
            {data.byDomain.length}
          </div>
          <div className="text-xs text-[#8A8A8A] mt-1">Tracked domains</div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between relative overflow-hidden group">
          <SectionLabel>FOCUS SCORE</SectionLabel>
          <div className="flex items-center justify-between mt-2">
            <div className="text-[28px] font-light text-[#C9A96E] font-mono">
              {focusScore.score}
              <span className="text-sm text-[#8A8A8A]">/100</span>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#242424"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#C9A96E"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 20 * (1 - focusScore.score / 100)
                  }`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-[11px] text-[#8A8A8A] mt-1">Productivity index</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col h-[460px]">
          <SectionLabel className="mb-4 shrink-0">DISTRIBUTION</SectionLabel>
          <div className="flex-1 min-h-0 w-full relative flex items-center justify-center">
            {topSitesForChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topSitesForChart}
                    dataKey="time"
                    nameKey="domain"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    stroke="none"
                  >
                    {topSitesForChart.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#4A4A4A]">No activity recorded</div>
            )}
            {topSitesForChart.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase text-[#4A4A4A] tracking-wider font-mono">
                  TOP
                </span>
                <span className="text-sm font-semibold text-[#F5F5F5]">
                  {formatDuration(topSitesForChart[0]?.time || 0)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-[#1C1C1C] pt-3 shrink-0 max-h-[140px] overflow-y-auto">
            {topSitesForChart.map((item, idx) => (
              <div key={item.domain} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span
                    className="w-2 h-2 rounded-[1px] shrink-0"
                    style={{
                      backgroundColor: chartColors[idx % chartColors.length],
                    }}
                  />
                  <span className="text-[#8A8A8A] truncate">
                    {formatDomain(item.domain)}
                  </span>
                </div>
                <span className="font-mono text-[#F5F5F5] shrink-0">
                  {formatDuration(item.time)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col h-[460px]">
          <SectionLabel className="mb-4 shrink-0">DETAILED ACTIVITY</SectionLabel>
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-2">
            {data.byDomain.map((site, index) => {
              const share = data.totalTime > 0 ? site.time / data.totalTime : 0;
              const percent = Math.round(share * 100);

              return (
                <div
                  key={site.domain}
                  onClick={() => onSelectDomain(site.domain)}
                  className={`py-3.5 flex flex-col gap-2.5 cursor-pointer transition-colors duration-150 hover:bg-[#1A1A1A] -mx-3 px-3 rounded-[2px] ${
                    index < data.byDomain.length - 1 ? "border-b border-[#1C1C1C]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate pr-4">
                      <Favicon src={site.favicon} domain={site.domain} size={20} />
                      <span className="text-[13px] font-medium text-[#F5F5F5] truncate">
                        {site.domain}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8A8A8A] font-mono shrink-0">
                      {formatDuration(site.time)} · {site.visitCount} visits
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar value={share} max={1} />
                    </div>
                    <span className="text-[10px] text-[#4A4A4A] font-mono w-8 text-right shrink-0">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
            {data.byDomain.length === 0 && (
              <div className="py-12 text-center text-xs text-[#4A4A4A]">
                No detailed browsing activity available for this time range.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
