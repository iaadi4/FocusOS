import { useState, useEffect, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { getAggregatedData } from "../utils/storage";
import type { AggregatedData } from "../utils/types";
import { formatDuration } from "../utils/format";
import { Favicon } from "../components/ui/Favicon";
import { Button } from "../components/ui/Button";
import { SectionLabel } from "../components/ui/SectionLabel";
import { Hourglass } from "lucide-react";
import "../index.css";

export function NewTabApp() {
  const [data, setData] = useState<AggregatedData>({
    totalTime: 0,
    byDomain: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAggregatedData("today");
      setData(result);
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const openDashboard = () => {
    browser.tabs.create({ url: "dashboard.html" });
  };

  return (
    <div className="h-screen w-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex overflow-hidden select-none">
      <aside className="h-full w-[320px] bg-[#0A0A0A] border-r border-[#242424] p-8 flex flex-col justify-between shrink-0 z-10">
        <div>
          <header className="flex items-center gap-2.5 mb-12">
            <Hourglass size={16} className="text-[#C9A96E]" />
            <span className="text-sm uppercase tracking-[0.14em] font-semibold text-[#F5F5F5]">
              FOCUSOS
            </span>
          </header>

          <div className="mb-10">
            <SectionLabel className="mb-2">TODAY'S BROWSING</SectionLabel>
            <div className="text-[52px] font-light leading-[60px] text-[#C9A96E] font-mono tracking-tight">
              {formatDuration(data.totalTime)}
            </div>
            <div className="text-xs text-[#4A4A4A] mt-1">
              Active tracking time
            </div>
          </div>

          <div className="flex flex-col">
            <SectionLabel className="mb-3">TOP SITES</SectionLabel>
            <div className="border border-[#242424] bg-[#111111] rounded-[4px] overflow-hidden">
              {data.byDomain.slice(0, 5).map((site, index) => (
                <div
                  key={site.domain}
                  className={`h-[44px] px-3 flex items-center justify-between transition-colors duration-150 hover:bg-[#1A1A1A] ${
                    index < Math.min(data.byDomain.length, 5) - 1
                      ? "border-b border-[#1C1C1C]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="text-[11px] font-mono text-[#4A4A4A] w-3 text-center shrink-0">
                      {index + 1}
                    </span>
                    <Favicon src={site.favicon} domain={site.domain} size={20} />
                    <span className="text-[13px] font-normal text-[#F5F5F5] truncate">
                      {site.domain}
                    </span>
                  </div>
                  <span className="text-[13px] font-medium font-mono text-[#F5F5F5] shrink-0">
                    {formatDuration(site.time)}
                  </span>
                </div>
              ))}
              {data.byDomain.length === 0 && (
                <div className="h-[88px] flex items-center justify-center text-xs text-[#4A4A4A]">
                  No browsing tracked today
                </div>
              )}
            </div>
          </div>
        </div>

        <Button variant="primary" onClick={openDashboard} className="w-full text-xs">
          FULL DASHBOARD →
        </Button>
      </aside>

      <main className="flex-1 bg-[#0A0A0A] relative flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#242424 1px, transparent 1px), linear-gradient(90deg, #242424 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="text-center select-none pointer-events-none z-0">
          <h2 className="text-[140px] font-thin text-[#111111] tracking-widest leading-none">
            FOCUSOS
          </h2>
        </div>
      </main>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <NewTabApp />
    </StrictMode>
  );
}
