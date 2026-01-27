import React, { useState, useEffect } from "react";
import { Search, Pin, ExternalLink, ArrowUpDown } from "lucide-react";
import {
  getAggregatedData,
  getPinnedSites,
  togglePinnedSite,
} from "../../utils/storage";
import { formatDuration, formatDomain } from "../../utils/format";
import type { AggregatedData } from "../../utils/types";

interface SiteDetailsViewProps {
  onSelect?: (domain: string) => void;
}

export function SiteDetailsView({ onSelect }: SiteDetailsViewProps) {
  const [data, setData] = useState<AggregatedData>({
    totalTime: 0,
    byDomain: [],
  });
  const [pinnedSites, setPinnedSites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"time" | "visits" | "lastVisited">(
    "time",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchData = async () => {
    const [aggregated, pinned] = await Promise.all([
      getAggregatedData("all-time"),
      getPinnedSites(),
    ]);
    setData(aggregated);
    setPinnedSites(pinned);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePin = async (domain: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await togglePinnedSite(domain);
    await fetchData();
  };

  const filteredSites = data.byDomain
    .filter((site) =>
      site.domain.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      // Pinned sites always on top
      const isPinnedA = pinnedSites.includes(a.domain);
      const isPinnedB = pinnedSites.includes(b.domain);

      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;

      // Then sort by field
      let valA, valB;
      if (sortField === "visits") {
        valA = a.visitCount;
        valB = b.visitCount;
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });

  const handleSort = (field: "time" | "visits" | "lastVisited") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="h-full flex flex-col pr-6 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral-600"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>{filteredSites.length} sites found</span>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-6 py-4 border-b border-white/5 text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-black/20">
          <div className="w-8"></div>
          <div className="flex-1">Domain</div>
          <div
            className="w-32 cursor-pointer hover:text-white transition-colors flex items-center gap-1 justify-end text-right"
            onClick={() => handleSort("time")}
          >
            Total Time
            <ArrowUpDown className="w-3 h-3" />
          </div>
          <div
            className="w-24 cursor-pointer hover:text-white transition-colors flex items-center gap-1 justify-end text-right"
            onClick={() => handleSort("visits")}
          >
            Visits
            <ArrowUpDown className="w-3 h-3" />
          </div>
          <div
            className="w-32 cursor-pointer hover:text-white transition-colors flex items-center gap-1 justify-end text-right"
            onClick={() => handleSort("lastVisited")}
          >
            Last Visited
            <ArrowUpDown className="w-3 h-3" />
          </div>
          <div className="w-16"></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredSites.map((site) => {
            const isPinned = pinnedSites.includes(site.domain);
            return (
              <div
                key={site.domain}
                className={`flex items-center px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors group ${
                  onSelect ? "cursor-pointer" : ""
                } ${isPinned ? "bg-primary/5" : ""}`}
                onClick={() => onSelect?.(site.domain)}
              >
                <div className="w-8 flex justify-center mr-3">
                  <button
                    onClick={(e) => handleTogglePin(site.domain, e)}
                    className={`p-1 rounded-lg transition-colors ${
                      isPinned
                        ? "text-primary bg-primary/20 hover:bg-primary/30"
                        : "text-neutral-600 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <img
                    src={
                      site.favicon ||
                      `https://www.google.com/s2/favicons?domain=${site.domain}`
                    }
                    className="w-6 h-6 rounded bg-black/50 p-0.5"
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                    }}
                  />
                  <div className="truncate font-medium text-neutral-200">
                    {formatDomain(site.domain)}
                  </div>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="w-32 text-right font-mono text-neutral-400">
                  {formatDuration(site.time)}
                </div>
                <div className="w-24 text-right font-mono text-neutral-400">
                  {site.visitCount}
                </div>
                <div className="w-32 text-right text-xs text-neutral-500">
                  {new Date(site.lastVisited).toLocaleDateString()}
                </div>
                <div className="w-16 flex justify-end"></div>
              </div>
            );
          })}
          {filteredSites.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-primary opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-neutral-200 mb-2">
                No sites found
              </h3>
              <p className="text-neutral-500 max-w-xs mx-auto">
                No visited sites match your search query "{searchQuery}".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
