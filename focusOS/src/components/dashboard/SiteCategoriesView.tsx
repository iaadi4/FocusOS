import React, { useState } from "react";
import type { SiteCategoryMap, SiteCategory, AggregatedData } from "../../utils/types";
import { formatDuration } from "../../utils/format";
import { Favicon } from "../ui/Favicon";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export interface SiteCategoriesViewProps {
  categories: SiteCategoryMap;
  onUpdateCategory: (domain: string, category: SiteCategory) => void;
  data: AggregatedData;
}

export function SiteCategoriesView({
  categories,
  onUpdateCategory,
  data,
}: SiteCategoriesViewProps) {
  const [newDomain, setNewDomain] = useState("");
  const [newCat, setNewCat] = useState<SiteCategory>("productive");
  const [filter, setFilter] = useState<"ALL" | "P" | "D" | "N" | "O">("ALL");

  const totals = {
    productive: { time: 0, count: 0 },
    distraction: { time: 0, count: 0 },
    neutral: { time: 0, count: 0 },
    others: { time: 0, count: 0 },
  };

  const allDomains = Array.from(
    new Set([...data.byDomain.map((d) => d.domain), ...Object.keys(categories)])
  );

  const domainStatsMap = new Map(data.byDomain.map((d) => [d.domain, d]));

  allDomains.forEach((domain) => {
    const cat = categories[domain] || "others";
    const stat = domainStatsMap.get(domain);
    if (stat) {
      totals[cat].time += stat.time;
    }
    totals[cat].count += 1;
  });

  const catConfigs: { id: SiteCategory; label: string; dot: string; short: "P" | "D" | "N" | "O" }[] = [
    { id: "productive", label: "PRODUCTIVE", dot: "#6A9E6A", short: "P" },
    { id: "distraction", label: "DISTRACTION", dot: "#9E5A5A", short: "D" },
    { id: "neutral", label: "NEUTRAL", dot: "#C9A96E", short: "N" },
    { id: "others", label: "OTHERS", dot: "#4A4A4A", short: "O" },
  ];

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain.trim()) {
      const clean = newDomain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
      if (clean) {
        onUpdateCategory(clean, newCat);
        setNewDomain("");
      }
    }
  };

  const filteredDomains = allDomains.filter((dom) => {
    const c = categories[dom] || "others";
    if (filter === "ALL") return true;
    if (filter === "P" && c === "productive") return true;
    if (filter === "D" && c === "distraction") return true;
    if (filter === "N" && c === "neutral") return true;
    if (filter === "O" && c === "others") return true;
    return false;
  });

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      <div className="border-b border-[#1C1C1C] pb-6">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
          Site Categories
        </h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">
          Organize sites into productive, distraction, neutral, and others.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {catConfigs.map((cfg) => (
          <div key={cfg.id} className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8A8A8A] font-medium">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cfg.dot }} />
              <span>{cfg.label}</span>
            </div>
            <div className="text-[28px] font-light text-[#F5F5F5] mt-3 font-mono">
              {formatDuration(totals[cfg.id].time)}
            </div>
            <div className="text-xs text-[#4A4A4A] mt-1 font-mono">
              {totals[cfg.id].count} sites
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddSite} className="bg-[#111111] border border-[#242424] p-4 rounded-[4px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 text-xs h-9"
          />
          <div className="flex gap-1">
            {catConfigs.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setNewCat(c.id)}
                className={`w-7 h-7 rounded-[2px] text-xs font-mono font-bold transition-colors focus:outline-none border ${
                  newCat === c.id
                    ? "bg-[#C9A96E] border-[#C9A96E] text-[#0A0A0A]"
                    : "bg-[#141414] border-[#242424] text-[#8A8A8A] hover:border-[#C9A96E]"
                }`}
                title={`Set initial category to ${c.label}`}
              >
                {c.short}
              </button>
            ))}
          </div>
        </div>
        <Button variant="primary" type="submit" className="h-9 px-4 text-xs">
          + ADD
        </Button>
      </form>

      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium">
          CLASSIFIED DOMAINS ({filteredDomains.length})
        </span>
        <div className="flex gap-1.5">
          {(["ALL", "P", "D", "N", "O"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-[2px] text-[10px] uppercase tracking-widest font-mono font-medium transition-colors border focus:outline-none ${
                filter === f
                  ? "bg-[#C9A96E] border-[#C9A96E] text-[#0A0A0A]"
                  : "bg-[#1A1A1A] border-[#242424] text-[#8A8A8A] hover:border-[#C9A96E]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {filteredDomains.map((dom) => {
          const cat = categories[dom] || "others";
          const stat = domainStatsMap.get(dom);
          const timeText = stat ? `${Math.round(stat.time / 60000)} min today` : "0 min today";

          return (
            <div
              key={dom}
              className="py-3.5 border-b border-[#1C1C1C] flex items-center justify-between gap-4 transition-colors duration-150 hover:bg-[#111111] px-3 -mx-3 rounded-[2px]"
            >
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <Favicon src={stat?.favicon || ""} domain={dom} size={20} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#F5F5F5] truncate">
                    {dom}
                  </div>
                  <div className="text-[11px] text-[#8A8A8A] font-mono mt-0.5">
                    {timeText}
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                {catConfigs.map((c) => {
                  const isActive = cat === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onUpdateCategory(dom, c.id)}
                      className={`w-[28px] h-[28px] rounded-[2px] text-xs font-mono font-bold transition-colors flex items-center justify-center border focus:outline-none ${
                        isActive
                          ? "bg-[#C9A96E] border-[#C9A96E] text-[#0A0A0A]"
                          : "bg-[#141414] border-[#242424] text-[#4A4A4A] hover:border-[#C9A96E] hover:text-[#8A8A8A]"
                      }`}
                      title={c.label}
                    >
                      {c.short}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filteredDomains.length === 0 && (
          <div className="py-12 text-center text-xs text-[#4A4A4A]">
            No sites matching this filter
          </div>
        )}
      </div>
    </div>
  );
}
