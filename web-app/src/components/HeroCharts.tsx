"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

interface ChartProps {
  data: {
    date: string;
    time: number;
    visits: number;
  }[];
}

export const BrowsingTrendsChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-sm font-medium text-neutral-400 mb-4 text-center">
        Browsing Time Trends
      </h3>
      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff10"
              vertical={false}
            />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value: any) => [
                formatDuration(Number(value) || 0),
                "Time",
              ]}
              labelStyle={{ color: "#a1a1aa" }}
              cursor={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <Area
              type="monotone"
              dataKey="time"
              stroke="#a855f7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTime)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const VisitTrendsChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-sm font-medium text-neutral-400 mb-4 text-center">
        Visit Trends
      </h3>
      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff10"
              vertical={false}
            />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value: any) => [Number(value) || 0, "Visits"]}
              labelStyle={{ color: "#a1a1aa" }}
              cursor={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#a855f7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorVisits)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface ActivityHeatMapProps {
  data: {
    date: string;
    time: number;
    intensity: number;
  }[];
}

export const ActivityHeatMap: React.FC<ActivityHeatMapProps> = ({ data }) => {
  const weeks: { date: string; time: number; intensity: number }[][] = [];
  let currentWeek: { date: string; time: number; intensity: number }[] = [];

  if (data.length > 0) {
    const firstDate = new Date(data[0].date);
    const dayOfWeek = firstDate.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: "", time: 0, intensity: -1 });
    }
  }

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-white/5";
      case 1:
        return "bg-purple-500/20";
      case 2:
        return "bg-purple-500/40";
      case 3:
        return "bg-purple-500/70";
      case 4:
        return "bg-purple-500";
      default:
        return "bg-transparent";
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-neutral-400">
          Activity in Recent Weeks
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full overflow-hidden">
        <div className="flex gap-2 w-full">
          {/* Day Labels */}
          <div className="flex flex-col gap-1 text-[8px] text-neutral-600 font-mono justify-between py-1 shrink-0">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid */}
          <div className="flex gap-1 flex-1 overflow-x-auto pb-2 scrollbar-hide">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col gap-1 flex-1 min-w-[10px]"
              >
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-full aspect-square rounded-sm ${getIntensityColor(
                      day.intensity,
                    )} transition-all duration-200 group relative hover:z-50`}
                  >
                    {day.date && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                        <div className="bg-neutral-900 border border-white/10 rounded-lg py-1 px-2 text-xs whitespace-nowrap shadow-xl">
                          <div className="font-bold text-white">{day.date}</div>
                          <div className="text-neutral-400">
                            {formatDuration(day.time)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
