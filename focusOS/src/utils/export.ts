import { getStorageData, getTodayKey, getAggregatedData } from "./storage";
import type { DailyData } from "./types";
import { getPomodoroSessions } from "./pomodoro-storage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportData {
  date: string;
  domain: string;
  timeSeconds: number;
  visitCount: number;
  lastVisited: string;
}

export type ExportType = "daily" | "sites" | "pomodoro";

export const getAllDataForExport = async (): Promise<ExportData[]> => {
  const data = await getStorageData(null);
  const result: ExportData[] = [];

  Object.keys(data).forEach((key) => {
    // Check if key is a date (YYYY-MM-DD)
    if (!key.match(/^\d{4}-\d{2}-\d{2}$/)) return;

    // Use type assertion safely
    const dailyData = data[key] as unknown as DailyData;

    // Safety check - if it's not an object or array, skip it
    if (typeof dailyData !== "object" || dailyData === null) return;

    Object.entries(dailyData).forEach(([domain, stats]) => {
      // Double check stats structure
      if (typeof stats !== "object" || stats === null) return;

      result.push({
        date: key,
        domain,
        timeSeconds: Math.round((stats.time || 0) / 1000),
        visitCount: stats.visitCount || 0,
        lastVisited: new Date(stats.lastVisited || 0).toLocaleString(),
      });
    });
  });

  // Sort by date descending
  return result.sort((a, b) => b.date.localeCompare(a.date));
};

export const getSiteDetailsForExport = async () => {
  const data = await getAggregatedData("all-time");
  return data.byDomain.map((site) => ({
    domain: site.domain,
    totalTimeSeconds: Math.round(site.time / 1000),
    visitCount: site.visitCount,
    lastVisited: new Date(site.lastVisited).toLocaleString(),
  }));
};

export const getPomodoroDataForExport = async () => {
  const sessions = await getPomodoroSessions();
  return sessions.map((session) => ({
    date: new Date(session.startTime).toLocaleDateString(),
    time: new Date(session.startTime).toLocaleTimeString(),
    template: session.templateName,
    workMinutes: session.workMinutes,
    breakMinutes: session.breakMinutes,
    cycles: session.completedCycles,
    status: session.interrupted ? "Interrupted" : "Completed",
  }));
};

export const exportToCSV = async (type: ExportType = "daily") => {
  let csvContent = "";
  let filename = "";

  if (type === "daily") {
    const data = await getAllDataForExport();
    if (data.length === 0) {
      alert("No data!");
      return;
    }

    const headers = [
      "Date",
      "Domain",
      "Time (Seconds)",
      "Visit Count",
      "Last Visited",
    ];
    csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.date,
          `"${row.domain}"`, // Quote domain to handle potential commas
          row.timeSeconds,
          row.visitCount,
          `"${row.lastVisited}"`,
        ].join(","),
      ),
    ].join("\n");
    filename = `focusos_daily_export_${getTodayKey()}.csv`;
  } else if (type === "sites") {
    const data = await getSiteDetailsForExport();
    if (data.length === 0) {
      alert("No data!");
      return;
    }

    const headers = [
      "Domain",
      "Total Time (Seconds)",
      "Total Visits",
      "Last Visited",
    ];
    csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          `"${row.domain}"`,
          row.totalTimeSeconds,
          row.visitCount,
          `"${row.lastVisited}"`,
        ].join(","),
      ),
    ].join("\n");
    filename = `focusos_sites_export_${getTodayKey()}.csv`;
  } else if (type === "pomodoro") {
    const data = await getPomodoroDataForExport();
    if (data.length === 0) {
      alert("No data!");
      return;
    }

    const headers = [
      "Date",
      "Time",
      "Template",
      "Work (mins)",
      "Break (mins)",
      "Cycles",
      "Status",
    ];
    csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.date,
          row.time,
          `"${row.template}"`,
          row.workMinutes,
          row.breakMinutes,
          row.cycles,
          row.status,
        ].join(","),
      ),
    ].join("\n");
    filename = `focusos_pomodoro_export_${getTodayKey()}.csv`;
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (type: ExportType = "daily") => {
  const doc = new jsPDF();
  let filename = "";

  doc.setFontSize(18);

  if (type === "daily") {
    const data = await getAllDataForExport();
    if (data.length === 0) {
      alert("No data!");
      return;
    }

    doc.text("FocusOS - Daily Activity Export", 14, 22);

    const tableData = data.map((row) => [
      row.date,
      row.domain,
      formatTime(row.timeSeconds),
      row.visitCount.toString(),
      row.lastVisited,
    ]);

    autoTable(doc, {
      head: [["Date", "Domain", "Time", "Visits", "Last Visited"]],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38] },
    });
    filename = `focusos_daily_export_${getTodayKey()}.pdf`;
  } else if (type === "sites") {
    const data = await getSiteDetailsForExport();
    if (data.length === 0) {
      alert("No data!");
      return;
    }

    doc.text("FocusOS - Site Details Export", 14, 22);

    const tableData = data.map((row) => [
      row.domain,
      formatTime(row.totalTimeSeconds),
      row.visitCount.toString(),
      row.lastVisited,
    ]);

    autoTable(doc, {
      head: [["Domain", "Total Time", "Visits", "Last Visited"]],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] }, // Blue
    });
    filename = `focusos_sites_export_${getTodayKey()}.pdf`;
  } else if (type === "pomodoro") {
    const data = await getPomodoroDataForExport();
    if (data.length === 0) {
      alert("No data!");
      return;
    }

    doc.text("FocusOS - Pomodoro Stats Export", 14, 22);

    const tableData = data.map((row) => [
      row.date,
      row.time,
      row.template,
      `${row.workMinutes}/${row.breakMinutes}`,
      row.cycles.toString(),
      row.status,
    ]);

    autoTable(doc, {
      head: [["Date", "Time", "Template", "W/B (m)", "Cycles", "Status"]],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 163, 74] }, // Green
    });
    filename = `focusos_pomodoro_export_${getTodayKey()}.pdf`;
  }

  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.save(filename);
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};
