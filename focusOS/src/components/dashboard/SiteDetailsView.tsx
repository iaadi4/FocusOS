import { useState } from "react";
import type { AggregatedData } from "../../utils/types";
import { formatDuration } from "../../utils/format";
import { Favicon } from "../ui/Favicon";
import { Input } from "../ui/Input";
import { SectionLabel } from "../ui/SectionLabel";
import { Search } from "lucide-react";

export interface SiteDetailsViewProps {
  data: AggregatedData;
  onSelectDomain: (domain: string) => void;
}

export function SiteDetailsView({ data, onSelectDomain }: SiteDetailsViewProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"time" | "visits">("time");

  const filtered = data.byDomain
    .filter((d) => d.domain.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === "time" ? b.time - a.time : b.visitCount - a.visitCount));

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      <div className="border-b border-[#1C1C1C] pb-6">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
          Site Details
        </h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">
          Comprehensive list of all visited websites and focus metrics.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#242424] p-4 rounded-[4px] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domain..."
            className="w-full text-xs pl-8 h-9"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-[#4A4A4A]" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium">SORT BY:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setSort("time")}
              className={`px-3 py-1 rounded-[2px] text-[10px] uppercase tracking-wider font-mono font-medium transition-colors border focus:outline-none ${
                sort === "time"
                  ? "bg-[#C9A96E] border-[#C9A96E] text-[#0A0A0A]"
                  : "bg-[#1A1A1A] border-[#242424] text-[#8A8A8A] hover:border-[#C9A96E]"
              }`}
            >
              TIME
            </button>
            <button
              onClick={() => setSort("visits")}
              className={`px-3 py-1 rounded-[2px] text-[10px] uppercase tracking-wider font-mono font-medium transition-colors border focus:outline-none ${
                sort === "visits"
                  ? "bg-[#C9A96E] border-[#C9A96E] text-[#0A0A0A]"
                  : "bg-[#1A1A1A] border-[#242424] text-[#8A8A8A] hover:border-[#C9A96E]"
              }`}
            >
              VISITS
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col overflow-x-auto">
        <SectionLabel className="mb-4">TRACKED SITES ({filtered.length})</SectionLabel>
        <table className="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-[#242424] h-10">
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">#</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">DOMAIN</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-right">VISITS</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-right">LAST VISITED</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-right">DURATION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((site, idx) => {
              const lastVisitedStr = site.lastVisited
                ? new Date(site.lastVisited).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                : "—";

              return (
                <tr
                  key={site.domain}
                  onClick={() => onSelectDomain(site.domain)}
                  className="border-b border-[#1C1C1C] h-[48px] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <td className="text-[11px] font-mono text-[#4A4A4A] w-8">{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Favicon src={site.favicon} domain={site.domain} size={20} />
                      <span className="text-[13px] font-medium text-[#F5F5F5]">{site.domain}</span>
                    </div>
                  </td>
                  <td className="text-[13px] text-[#8A8A8A] font-mono text-right">{site.visitCount}</td>
                  <td className="text-[13px] text-[#8A8A8A] font-mono text-right">{lastVisitedStr}</td>
                  <td className="text-[13px] text-[#C9A96E] font-mono font-medium text-right">{formatDuration(site.time)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-[#4A4A4A]">
                  No websites matching "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
