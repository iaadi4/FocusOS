"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  Shield,
  Clock,
  Globe,
  MousePointer2,
  PanelLeftClose,
  X,
  Github,
  Youtube,
  Search,
  Pin,
  MoreVertical,
  Play,
  RotateCcw,
  Menu,
  Calendar,
  TrendingUp,
  Award,
  ArrowLeft,
  ExternalLink,
  Timer,
} from "lucide-react";

export default function HeroDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleSiteClick = (domain: string) => {
    setSelectedDomain(domain);
    setActiveTab("site-analysis");
    setIsSidebarOpen(false);
  };

  const handleBack = () => {
    setSelectedDomain(null);
    setActiveTab("dashboard");
  };

  // Mock Data
  const siteData = [
    {
      name: "x.com",
      time: "7h 15m",
      last: "2 mins ago",
      icon: <X className="w-4 h-4" />,
      color: "bg-purple-500",
    },
    {
      name: "youtube.com",
      time: "5h 30m",
      last: "1 hour ago",
      icon: <Youtube className="w-4 h-4" />,
      color: "bg-purple-500",
    },
    {
      name: "github.com",
      time: "2h 45m",
      last: "Just now",
      icon: <Github className="w-4 h-4" />,
      color: "bg-purple-500",
    },
    {
      name: "figma.com",
      time: "1h 20m",
      last: "Yesterday",
      icon: <Globe className="w-4 h-4" />,
      color: "bg-purple-500",
    },
  ];

  const pomodoroSessions = [
    {
      id: 1,
      date: "Oct 24, 10:30 AM",
      template: "Deep Work",
      cycles: 4,
      duration: "1h 40m",
      status: "Completed",
    },
    {
      id: 2,
      date: "Oct 24, 02:15 PM",
      template: "Quick Focus",
      cycles: 2,
      duration: "50m",
      status: "Completed",
    },
    {
      id: 3,
      date: "Oct 23, 09:00 AM",
      template: "Coding",
      cycles: 3,
      duration: "1h 15m",
      status: "Interrupted",
    },
    {
      id: 4,
      date: "Oct 23, 04:45 PM",
      template: "Email",
      cycles: 1,
      duration: "25m",
      status: "Completed",
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Background Glows */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex bg-[#030303] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-h-[600px] text-left"
      >
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div
          className={`absolute inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#030303] flex flex-col p-4 transform transition-transform duration-300 md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <Image
                  src="/icon.png"
                  width={20}
                  height={20}
                  alt="FocusOS"
                  className="opacity-80"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-white">FocusOS</div>
                <div className="text-[10px] text-gray-500">
                  Browsing Tracker
                </div>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="px-2 text-[10px] uppercase font-bold text-gray-600 mb-2 tracking-wider">
                Time Range
              </div>
              <nav className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsSidebarOpen(false);
                    setSelectedDomain(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab("site-details");
                    setIsSidebarOpen(false);
                    setSelectedDomain(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "site-details" ||
                    activeTab === "site-analysis"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  Site Details
                </button>
                <button
                  onClick={() => {
                    setActiveTab("pomodoro");
                    setIsSidebarOpen(false);
                    setSelectedDomain(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "pomodoro"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Pomodoro
                </button>
              </nav>
            </div>

            <div>
              <div className="px-2 text-[10px] uppercase font-bold text-gray-600 mb-2 tracking-wider">
                Configuration
              </div>
              <nav className="space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
                  <MousePointer2 className="w-4 h-4" />
                  Daily Limits
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
                  <Shield className="w-4 h-4" />
                  Whitelist
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-auto px-2 hidden md:block">
            <div className="flex items-center gap-3 px-1 py-2 text-gray-400 hover:text-white cursor-pointer text-sm">
              <PanelLeftClose className="w-4 h-4" /> Collapse Sidebar
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#050505] overflow-hidden relative flex flex-col">
          {/* Mobile Header Trigger */}
          <div className="md:hidden p-4 border-b border-white/5 flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {activeTab === "site-analysis"
                ? "Site Analysis"
                : activeTab.replace("-", " ")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full p-6 md:p-8 overflow-y-auto"
              >
                {/* Dashboard Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Your Performance
                    </h2>
                    <p className="text-sm text-gray-500">
                      Deep dive into your focus metrics.
                    </p>
                  </div>
                  <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-white/5 self-start md:self-auto overflow-x-auto max-w-full">
                    <button className="px-4 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-md shadow-sm whitespace-nowrap">
                      Today
                    </button>
                    <button className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                      Week
                    </button>
                    <button className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                      Month
                    </button>
                    <button className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                      All Time
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">
                      <Clock className="w-3 h-3" /> Total Browsing
                    </div>
                    <div className="text-2xl font-bold text-white">13m 10s</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      <BarChart2 className="w-3 h-3" /> Avg Per Site
                    </div>
                    <div className="text-2xl font-bold text-white">3m 17s</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      <Globe className="w-3 h-3" /> Most Visited
                    </div>
                    <div className="text-sm font-medium text-white">X.com</div>
                    <div className="text-xs text-gray-500">7m 5s</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      <Shield className="w-3 h-3" /> Unique Sites
                    </div>
                    <div className="text-2xl font-bold text-white">4</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#0A0A0A] p-6 rounded-xl border border-white/5 flex flex-col h-auto min-h-[320px]">
                    <div className="text-sm font-medium text-white mb-8">
                      Distribution
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
                      <div className="relative w-40 h-40 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="transparent"
                            stroke="#1f1f22"
                            strokeWidth="20"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="transparent"
                            stroke="#a855f7"
                            strokeWidth="20"
                            strokeDasharray="300 440"
                            strokeDashoffset="0"
                            className="opacity-80 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="transparent"
                            stroke="#d946ef"
                            strokeWidth="20"
                            strokeDasharray="100 440"
                            strokeDashoffset="-300"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="transparent"
                            stroke="#ec4899"
                            strokeWidth="20"
                            strokeDasharray="20 440"
                            strokeDashoffset="-400"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="transparent"
                            stroke="#eab308"
                            strokeWidth="20"
                            strokeDasharray="20 440"
                            strokeDashoffset="-420"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-[#050505]"></div>
                        </div>
                      </div>
                      <div className="space-y-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          x.com
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
                          youtube.com
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-pink-500" />
                          github.com
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          localhost
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-6 rounded-xl border border-white/5 min-h-[320px] flex flex-col">
                    <div className="text-sm font-medium text-white mb-6">
                      Detailed Activity
                    </div>
                    <div className="space-y-6">
                      {siteData.map((site, index) => (
                        <div
                          key={index}
                          className="group cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors"
                          onClick={() => handleSiteClick(site.name)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-600 font-mono">
                                {index + 1}
                              </span>
                              <div className="text-gray-400 w-4 h-4">
                                {site.icon}
                              </div>
                              <span className="text-sm text-gray-300">
                                {site.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 font-mono">
                              {site.time}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${site.color}`}
                              style={{
                                width: `${
                                  100 - index * 25 > 0 ? 100 - index * 25 : 5
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "site-details" && (
              <motion.div
                key="site-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full p-6 md:p-8 flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Site Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Detailed breakdown of your browsing history.
                    </p>
                  </div>
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search usage..."
                      className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 w-full md:w-64"
                    />
                  </div>
                </div>

                <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-xl overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-5">Site Name</div>
                      <div className="col-span-3">Time Spent</div>
                      <div className="col-span-3">Last Visited</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {siteData.map((site, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group cursor-pointer"
                          onClick={() => handleSiteClick(site.name)}
                        >
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                              {site.icon}
                            </div>
                            <span className="text-sm font-medium text-white">
                              {site.name}
                            </span>
                          </div>
                          <div className="col-span-3 text-sm text-gray-400">
                            {site.time}
                          </div>
                          <div className="col-span-3 text-sm text-gray-500">
                            {site.last}
                          </div>
                          <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pin className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "site-analysis" && (
              <motion.div
                key="site-analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full p-6 md:p-8 flex flex-col"
              >
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Site Analysis
                    </h2>
                    <p className="text-sm text-gray-500">
                      Detailed analytics for a specific website.
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 hover:border-white/10 transition-all flex items-center gap-2 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>

                {/* Site Summary Card */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">
                        {selectedDomain || "Unknown Site"}
                      </h1>
                      <a
                        href={`https://${selectedDomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-purple-500 hover:text-purple-400 flex items-center gap-1 transition-colors"
                      >
                        Visit Site <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 mb-1">
                        Total Time
                      </div>
                      <div className="text-lg font-bold text-white">7h 15m</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 mb-1">
                        Active Days
                      </div>
                      <div className="text-lg font-bold text-white">12</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 mb-1">
                        Visits
                      </div>
                      <div className="text-lg font-bold text-white">45</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 mb-1">
                        First Seen
                      </div>
                      <div className="text-sm font-medium text-white">
                        Oct 12, 2025
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trends Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-neutral-200">
                      Trends
                    </h3>
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                      <div className="px-3 py-1.5 rounded-md bg-white/10 text-xs font-medium text-white flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        Oct 10 - Oct 25
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 h-64 flex items-center justify-center text-gray-500">
                    Chart Placeholder (Activity)
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "pomodoro" && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full p-6 md:p-8 flex flex-col overflow-y-auto"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Pomodoro Timer
                  </h2>
                  <p className="text-sm text-gray-500">
                    Track your focus sessions and productivity patterns.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <Timer className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white mb-1">
                      12
                    </div>
                    <div className="text-sm text-neutral-400">
                      Total Sessions
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white mb-1">
                      4h 30m
                    </div>
                    <div className="text-sm text-neutral-400">
                      Total Focus Time
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <Clock className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white mb-1">
                      22m
                    </div>
                    <div className="text-sm text-neutral-400">
                      Average Session
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <Award className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-white mb-1">
                      Deep Work
                    </div>
                    <div className="text-sm text-neutral-400">
                      Most Used Template
                    </div>
                  </div>
                </div>

                {/* Session History */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Session History
                  </h3>
                  <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A]">
                    <div className="overflow-x-auto">
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
                          {pomodoroSessions.map((session) => (
                            <tr
                              key={session.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-neutral-300 whitespace-nowrap">
                                {session.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-white">
                                  {session.template}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-sm font-mono text-white">
                                  {session.cycles}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-sm font-mono text-purple-400">
                                  {session.duration}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                    session.status === "Completed"
                                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  }`}
                                >
                                  {session.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
