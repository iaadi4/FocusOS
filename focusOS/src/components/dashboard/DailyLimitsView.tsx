import React, { useState } from "react";
import type { Limit } from "../../utils/types";
import { formatDuration } from "../../utils/format";
import { Favicon } from "../ui/Favicon";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { SectionLabel } from "../ui/SectionLabel";
import { Badge } from "../ui/Badge";
import { Trash2 } from "lucide-react";

export interface DailyLimitsViewProps {
  limits: { [domain: string]: Limit };
  onSaveLimit: (domain: string, limit: Limit) => void;
  onRemoveLimit: (domain: string) => void;
}

export function DailyLimitsView({
  limits,
  onSaveLimit,
  onRemoveLimit,
}: DailyLimitsViewProps) {
  const [domain, setDomain] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [block, setBlock] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    if (clean && minutes > 0) {
      onSaveLimit(clean, {
        timeLimit: minutes * 60 * 1000,
        notify80: true,
        notify100: true,
        blockOnLimit: block,
      });
      setDomain("");
    }
  };

  const domainEntries = Object.entries(limits || {});

  return (
    <div className="flex flex-col gap-8 pb-16 select-none">
      <div className="border-b border-[#1C1C1C] pb-6">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight">
          Daily Limits
        </h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">
          Set daily time limits for distraction websites.
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-[#111111] border border-[#242424] p-5 rounded-[4px] flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4 flex-1">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <SectionLabel>DOMAIN</SectionLabel>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="reddit.com"
              className="text-xs h-9"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-32 shrink-0">
            <SectionLabel>LIMIT (MINUTES)</SectionLabel>
            <Input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="text-xs h-9 font-mono font-semibold text-[#C9A96E]"
            />
          </div>
          <div className="flex items-center gap-2 h-9">
            <input
              type="checkbox"
              id="blockCheck"
              checked={block}
              onChange={(e) => setBlock(e.target.checked)}
              className="accent-[#C9A96E] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="blockCheck" className="text-xs text-[#8A8A8A] cursor-pointer">
              Block when exceeded
            </label>
          </div>
        </div>
        <Button variant="primary" type="submit" className="h-9 px-5 text-xs">
          + ADD LIMIT
        </Button>
      </form>

      <div className="bg-[#111111] border border-[#242424] p-6 rounded-[4px] flex flex-col overflow-x-auto">
        <SectionLabel className="mb-4">ACTIVE LIMITS ({domainEntries.length})</SectionLabel>
        <table className="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-[#242424] h-10">
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">DOMAIN</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">DAILY LIMIT</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2">ACTION ON LIMIT</th>
              <th className="text-[10px] uppercase tracking-widest text-[#4A4A4A] font-medium pb-2 text-right">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {domainEntries.map(([dom, lim]) => (
              <tr key={dom} className="border-b border-[#1C1C1C] h-[48px] hover:bg-[#1A1A1A] transition-colors">
                <td>
                  <div className="flex items-center gap-3 pr-4">
                    <Favicon src="" domain={dom} size={20} />
                    <span className="text-[13px] font-medium text-[#F5F5F5]">{dom}</span>
                  </div>
                </td>
                <td className="text-[13px] text-[#C9A96E] font-mono font-semibold pr-4">
                  {formatDuration(lim.timeLimit)}
                </td>
                <td className="pr-4">
                  {lim.blockOnLimit ? (
                    <Badge variant="danger">BLOCK PAGE</Badge>
                  ) : (
                    <Badge variant="gold">NOTIFY ONLY</Badge>
                  )}
                </td>
                <td className="text-right">
                  <button
                    onClick={() => onRemoveLimit(dom)}
                    className="text-[#4A4A4A] hover:text-[#9E5A5A] transition-colors p-1.5 focus:outline-none"
                    title="Remove limit"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {domainEntries.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs text-[#4A4A4A]">
                  No daily limits configured. Add one above to prevent excessive time on specific sites.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
