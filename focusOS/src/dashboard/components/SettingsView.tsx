import { Settings, Download, FileText, File } from "lucide-react";
import { useState } from "react";
import { exportToCSV, exportToPDF } from "../../utils/export";

interface SettingsViewProps {
  trackingDelay: number;
  onTrackingDelayChange: (value: number) => void;
  onSave: () => void;
}

export function SettingsView({
  trackingDelay,
  onTrackingDelayChange,
  onSave,
}: SettingsViewProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: "csv" | "pdf") => {
    setIsExporting(true);
    try {
      if (type === "csv") {
        await exportToCSV();
      } else {
        await exportToPDF();
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-400" />
          Tracking Delay
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          Set how many seconds you need to stay on a website before it starts
          counting towards your tracked time. This delay only applies to the
          first visit of the day. Subsequent visits are tracked immediately.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            max={100}
            value={trackingDelay}
            onChange={(e) => {
              const val = Math.min(
                100,
                Math.max(1, parseInt(e.target.value) || 1),
              );
              onTrackingDelayChange(val);
            }}
            className="w-24 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-red-500/50 transition-colors"
          />
          <span className="text-neutral-400">seconds</span>
          <button
            onClick={onSave}
            className="bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-400 transition-colors flex items-center gap-2 ml-auto"
          >
            Save
          </button>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-400" />
          Export Data
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          Download all your tracked data for backup or analysis.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting}
            className="bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export as CSV"}
          </button>
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <File className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export as PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
