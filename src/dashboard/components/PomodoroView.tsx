import { useState, useEffect } from "react";
import { Timer, Play, TrendingUp, Clock, Award } from "lucide-react";
import { formatDuration } from "../../utils/format";
import {
  getPomodoroSessions,
  getPomodoroStats,
} from "../../utils/pomodoro-storage";
import type { PomodoroSession, PomodoroStats } from "../../utils/types";

interface PomodoroViewProps {
  range: "today" | "week" | "month" | "year" | "all-time";
}

export function PomodoroView({ range }: PomodoroViewProps) {
  const [stats, setStats] = useState<PomodoroStats | null>(null);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsData, sessionsData] = await Promise.all([
        getPomodoroStats(),
        getPomodoroSessions(),
      ]);
      setStats(statsData);
      setSessions(sessionsData.slice(0, 50)); // Show last 50 sessions
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const date = new Date(session.startTime);
    const now = new Date();

    if (range === "today") {
      return date.toDateString() === now.toDateString();
    } else if (range === "week") {
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      return date >= weekStart;
    } else if (range === "month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return date >= monthStart;
    } else if (range === "year") {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return date >= yearStart;
    }
    return true;
  });

  // Calculate stats from filtered sessions
  const currentStats = {
    totalSessions: filteredSessions.length,
    totalFocusTime: filteredSessions.reduce((acc, s) => {
      // Use actual elapsed time if available, otherwise estimate from cycles
      const duration =
        s.endTime && s.endTime > s.startTime
          ? s.endTime - s.startTime
          : s.workMinutes * s.completedCycles * 60 * 1000;
      return acc + duration;
    }, 0),
    averageSessionLength:
      filteredSessions.length > 0
        ? filteredSessions.reduce((acc, s) => {
            const duration =
              s.endTime && s.endTime > s.startTime
                ? s.endTime - s.startTime
                : s.workMinutes * s.completedCycles * 60 * 1000;
            return acc + duration;
          }, 0) / filteredSessions.length
        : 0,
    mostUsedTemplate: (() => {
      if (filteredSessions.length === 0) return "None";
      const counts: Record<string, number> = {};
      filteredSessions.forEach((s) => {
        counts[s.templateName] = (counts[s.templateName] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    })(),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Timer className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {currentStats.totalSessions}
          </div>
          <div className="text-sm text-neutral-400">Total Sessions</div>
        </div>

        {/* Total Focus Time */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {formatDuration(currentStats.totalFocusTime)}
          </div>
          <div className="text-sm text-neutral-400">Total Focus Time</div>
        </div>

        {/* Average Session */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Clock className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {formatDuration(currentStats.averageSessionLength)}
          </div>
          <div className="text-sm text-neutral-400">Average Session</div>
        </div>

        {/* Most Used Template */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Award className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mb-1">
            {currentStats.mostUsedTemplate}
          </div>
          <div className="text-sm text-neutral-400">Most Used Template</div>
        </div>
      </div>

      {/* Today's Sessions */}
      {stats && stats.sessionsToday > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <Play className="w-5 h-5 text-primary" fill="currentColor" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {stats.sessionsToday} session
                {stats.sessionsToday !== 1 ? "s" : ""} today
              </div>
              <div className="text-sm text-neutral-400">
                Keep up the great work!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Session History</h3>
        {sessions.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white/5 border border-white/5 text-center">
            <Timer className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <div className="text-neutral-400 mb-2">No sessions yet</div>
            <div className="text-sm text-neutral-500">
              Start a Pomodoro timer from the popup to begin tracking
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Cycles
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-neutral-300">
                      {formatDate(session.startTime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-white">
                          {session.templateName}
                        </div>
                        <div className="text-xs text-neutral-500">
                          ({session.workMinutes}m + {session.breakMinutes}m)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-mono text-white">
                        {session.completedCycles}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-mono text-primary">
                        {formatDuration(
                          session.endTime && session.endTime > session.startTime
                            ? session.endTime - session.startTime
                            : session.workMinutes *
                                session.completedCycles *
                                60 *
                                1000,
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {session.interrupted ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          Interrupted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
