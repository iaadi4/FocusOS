import { useState } from "react";
import type { Settings } from "../../utils/types";
import { SectionLabel } from "../ui/SectionLabel";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Favicon } from "../ui/Favicon";
import { Download, Trash2 } from "lucide-react";

export interface SettingsViewProps {
  settings: Settings;
  onSaveSettings: (newSettings: Partial<Settings>) => void;
  onExport: (type: "csv" | "pdf", category: "daily" | "summary" | "pomodoro") => void;
  isExporting: boolean;
  whitelist: string[];
  onAddWhitelist: (domain: string) => void;
  onRemoveWhitelist: (domain: string) => void;
}

export function SettingsView({
  settings,
  onSaveSettings,
  onExport,
  isExporting,
  whitelist,
  onAddWhitelist,
  onRemoveWhitelist,
}: SettingsViewProps) {
  const [domainInput, setDomainInput] = useState("");

  const exportCards = [
    {
      id: "daily" as const,
      title: "Daily Activity",
      desc: "Per-site records",
    },
    {
      id: "summary" as const,
      title: "Site Summaries",
      desc: "Aggregated stats",
    },
    {
      id: "pomodoro" as const,
      title: "Pomodoro Stats",
      desc: "Focus sessions",
    },
  ];

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domainInput.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (clean) {
      onAddWhitelist(clean);
      setDomainInput("");
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-16 select-none">
      <div className="border-b border-[#1C1C1C] pb-6">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
          Settings
        </h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">
          Configure how the extension tracks your time and data.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <SectionLabel>EXPORT DATA</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F5F5]">
                  <Download size={14} className="text-[#C9A96E]" />
                  <span>{card.title}</span>
                </div>
                <p className="text-xs text-[#8A8A8A] mt-1">{card.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  disabled={isExporting}
                  onClick={() => onExport("csv", card.id)}
                  className="w-full text-[10px]"
                >
                  EXPORT CSV
                </Button>
                <Button
                  variant="ghost"
                  disabled={isExporting}
                  onClick={() => onExport("pdf", card.id)}
                  className="w-full text-[10px]"
                >
                  EXPORT PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F5]">Tracking Delay</h2>
          <p className="text-xs text-[#8A8A8A] mt-1">
            How long a site must be active before time is recorded.
          </p>
        </div>

        <div className="flex items-center gap-6 max-w-xl">
          <div className="bg-[#141414] border border-[#242424] px-3 py-1.5 rounded-[4px] text-sm font-mono font-semibold text-[#C9A96E] min-w-[70px] text-center shrink-0">
            {settings.trackingDelaySeconds}s
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <input
              type="range"
              min={1}
              max={100}
              value={settings.trackingDelaySeconds}
              onChange={(e) =>
                onSaveSettings({ trackingDelaySeconds: Number(e.target.value) })
              }
              className="w-full h-1 bg-[#1A1A1A] rounded-none appearance-none cursor-pointer accent-[#C9A96E]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#4A4A4A]">
              <span>1s</span>
              <span>100s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#F5F5F5]">Whitelist (Excluded Domains)</h2>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Websites listed here will not be tracked or recorded by FocusOS.
          </p>
        </div>

        <form onSubmit={handleAddDomain} className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 flex-1 max-w-lg">
            <SectionLabel>DOMAIN TO EXCLUDE</SectionLabel>
            <Input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="localhost, internal-app.dev"
              className="text-xs h-9"
            />
          </div>
          <Button variant="primary" type="submit" className="h-9 px-5 text-xs">
            + EXCLUDE DOMAIN
          </Button>
        </form>

        <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col overflow-x-auto">
          <SectionLabel className="mb-4">EXCLUDED DOMAINS ({whitelist.length})</SectionLabel>
          <table className="w-full border-collapse text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-[#242424] h-10">
                <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">DOMAIN</th>
                <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-right">REMOVE</th>
              </tr>
            </thead>
            <tbody>
              {whitelist.map((dom) => (
                <tr key={dom} className="border-b border-[#1C1C1C] h-[48px] hover:bg-[#1A1A1A] transition-colors">
                  <td>
                    <div className="flex items-center gap-3 pr-4">
                      <Favicon src="" domain={dom} size={20} />
                      <span className="text-[13px] font-medium text-[#F5F5F5]">{dom}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveWhitelist(dom)}
                      className="text-[#4A4A4A] hover:text-[#9E5A5A] transition-colors p-1.5 focus:outline-none"
                      title="Remove from whitelist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {whitelist.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-12 text-center text-xs text-[#4A4A4A]">
                    No domains excluded. All visited websites are currently tracked.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
