import type { SiteAnalysisData, TrendMetrics } from "../../utils/types";
import { formatDuration } from "../../utils/format";
import { Favicon } from "../ui/Favicon";
import { Button } from "../ui/Button";
import { SectionLabel } from "../ui/SectionLabel";
import { Tooltip } from "../ui/Tooltip";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

export interface SiteAnalysisViewProps {
  data: SiteAnalysisData | null;
  trends: TrendMetrics | null;
  onBack: () => void;
}

export function SiteAnalysisView({
  data,
  trends,
  onBack,
}: SiteAnalysisViewProps) {
  if (!data) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-24 select-none">
        <p className="text-sm text-[#8A8A8A]">Select a site to inspect analytics.</p>
        <Button variant="ghost" onClick={onBack}>
          ← BACK TO DASHBOARD
        </Button>
      </div>
    );
  }

  const intensityColors = [
    "#1A1A1A",
    "#2D2515",
    "#5C4A28",
    "#8F7040",
    "#C9A96E",
  ];

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      <div className="flex items-end justify-between border-b border-[#1C1C1C] pb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
            Site Analysis
          </h1>
          <p className="text-[13px] text-[#8A8A8A] mt-1">
            Detailed analytics for a specific website.
          </p>
        </div>
        <Button variant="ghost" onClick={onBack} className="gap-2 text-xs">
          ← BACK
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col justify-between gap-6">
          <div className="flex items-center gap-4">
            <Favicon src={data.favicon} domain={data.domain} size={32} goldBorder />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-[#F5F5F5] tracking-tight truncate">
                {data.domain}
              </h2>
              <span className="text-xs text-[#C9A96E] font-mono tracking-wider uppercase mt-0.5 block">Active Target</span>
            </div>
          </div>

          <div className="border-t border-[#1C1C1C] pt-4 flex flex-col gap-3 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[#8A8A8A]">TOTAL TIME</span>
              <strong className="text-[#F5F5F5] text-sm font-semibold">{formatDuration(data.totalTime)}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8A8A8A]">TOTAL VISITS</span>
              <strong className="text-[#F5F5F5] text-sm">{data.totalVisits}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#8A8A8A]">FIRST TRACKED</span>
              <strong className="text-[#F5F5F5]">{data.firstUsed || "N/A"}</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col justify-between overflow-x-auto">
          <SectionLabel className="mb-4">ACTIVITY HEATMAP (LAST 26 WEEKS)</SectionLabel>
          <div className="flex items-start gap-2.5 min-w-max my-auto">
            <div className="grid grid-rows-7 gap-[3px] pt-[2px]">
              {daysOfWeek.map((d, i) => (
                <div key={i} className="h-[16px] text-[10px] text-[#4A4A4A] font-mono flex items-center leading-none pr-1">
                  {i % 2 === 0 ? d : ""}
                </div>
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {data.heatMapData.slice(-182).map((cell, idx) => (
                <Tooltip
                  key={idx}
                  content={
                    <span>
                      <strong>{cell.date}</strong>: {formatDuration(cell.time)}
                    </span>
                  }
                >
                  <div
                    className="w-[16px] h-[16px] rounded-[2px] transition-colors duration-150"
                    style={{
                      backgroundColor:
                        intensityColors[Math.min(cell.intensity, 4)] || "#1A1A1A",
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
      {trends && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
            <SectionLabel>PERIOD TREND METRICS</SectionLabel>
            <div className="text-xs font-mono text-[#8A8A8A] bg-[#141414] border border-[#242424] px-3 py-1 rounded-[2px]">
              Active Period ▼
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px]">
              <SectionLabel>ACTIVE DAYS</SectionLabel>
              <div className="text-[28px] font-light font-mono text-[#F5F5F5] mt-2">
                {trends.activeDays} <span className="text-xs text-[#4A4A4A]">/ {trends.totalDays}</span>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px]">
              <SectionLabel>MAX DAILY TIME</SectionLabel>
              <div className="text-[28px] font-light font-mono text-[#F5F5F5] mt-2">
                {formatDuration(trends.maxDailyTime)}
              </div>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px]">
              <SectionLabel>AVG DAILY TIME</SectionLabel>
              <div className="text-[28px] font-light font-mono text-[#F5F5F5] mt-2">
                {formatDuration(trends.avgDailyTime)}
              </div>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px]">
              <SectionLabel>MAX VISITS</SectionLabel>
              <div className="text-[28px] font-light font-mono text-[#F5F5F5] mt-2">
                {trends.maxDailyVisits}
              </div>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px]">
              <SectionLabel>AVG VISITS</SectionLabel>
              <div className="text-[28px] font-light font-mono text-[#F5F5F5] mt-2">
                {trends.avgDailyVisits.toFixed(1)}
              </div>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-[4px]">
              <SectionLabel>% CHANGE (TREND)</SectionLabel>
              <div className={`text-[28px] font-light font-mono mt-2 ${trends.timeChange >= 0 ? "text-[#C9A96E]" : "text-[#9E5A5A]"}`}>
                {trends.timeChange >= 0 ? "↑" : "↓"} {Math.abs(Math.round(trends.timeChange))}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col justify-between">
          <SectionLabel>PERIOD TOTAL TIME</SectionLabel>
          <div className="my-6">
            <div className="text-[44px] font-light font-mono text-[#C9A96E] leading-tight">
              {formatDuration(data.totalTime)}
            </div>
            <div className="text-xs text-[#8A8A8A] mt-2">
              Across {data.totalVisits} recorded visits
            </div>
          </div>
          <div className="border-t border-[#1C1C1C] pt-3 text-[11px] font-mono text-[#4A4A4A]">
            Active {data.totalActiveDays} days
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col">
          <SectionLabel className="mb-4">BROWSE TIME TRENDS</SectionLabel>
          <div className="flex-1 h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyData.slice(-14)}>
                <defs>
                  <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C1C1C" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fill: "#4A4A4A", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4A4A4A", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 60000)}m`} />
                <RechartsTooltip
                  formatter={(val: number | string | ReadonlyArray<number | string> | null | undefined) => [formatDuration(Number(val) || 0), "Duration"]}
                  contentStyle={{ background: "#111111", border: "1px solid #242424", borderRadius: 4 }}
                  labelStyle={{ color: "#8A8A8A", fontSize: 11 }}
                  itemStyle={{ color: "#F5F5F5", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="time" stroke="#C9A96E" strokeWidth={1.5} fill="url(#goldFade)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col">
          <SectionLabel className="mb-4">VISIT TRENDS</SectionLabel>
          <div className="flex-1 h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyData.slice(-14)}>
                <defs>
                  <linearGradient id="goldFade2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C1C1C" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fill: "#4A4A4A", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4A4A4A", fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  formatter={(val: number | string | ReadonlyArray<number | string> | null | undefined) => [Number(val) || 0, "Visits"]}
                  contentStyle={{ background: "#111111", border: "1px solid #242424", borderRadius: 4 }}
                  labelStyle={{ color: "#8A8A8A", fontSize: 11 }}
                  itemStyle={{ color: "#F5F5F5", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="visits" stroke="#C9A96E" strokeWidth={1.5} fill="url(#goldFade2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
