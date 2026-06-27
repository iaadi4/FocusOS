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
  Menu,
  Calendar,
  TrendingUp,
  Award,
  ArrowLeft,
  ExternalLink,
  Timer,
  Hourglass,
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
      color: "bg-[#C9A96E]",
    },
    {
      name: "youtube.com",
      time: "5h 30m",
      last: "1 hour ago",
      icon: <Youtube className="w-4 h-4" />,
      color: "bg-[#8A7248]",
    },
    {
      name: "github.com",
      time: "2h 45m",
      last: "Just now",
      icon: <Github className="w-4 h-4" />,
      color: "bg-[#4A4A4A]",
    },
    {
      name: "figma.com",
      time: "1h 20m",
      last: "Yesterday",
      icon: <Globe className="w-4 h-4" />,
      color: "bg-[#242424]",
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
    <div className="relative w-full h-full">
      <div className="relative flex bg-[#0A0A0A] overflow-hidden min-h-[600px] text-left w-full">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/80 z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div
          className={`absolute inset-y-0 left-0 z-50 w-56 border-r border-[#242424] bg-[#0D0D0D] flex flex-col p-4 transform transition-transform duration-300 md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center text-[#C9A96E]">
                <Hourglass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#F5F5F5] tracking-tight">FocusOS</div>
                <div className="text-[9px] font-semibold tracking-[0.1em] uppercase text-[#4A4A4A]">
                  Hardware v2
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-[#8A8A8A] hover:text-[#F5F5F5]"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="px-2 text-[10px] font-semibold tracking-[0.08em] uppercase text-[#4A4A4A] mb-2">
                Time Range
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsSidebarOpen(false);
                    setSelectedDomain(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-[#1A1A1A] text-[#C9A96E] border border-[#242424]"
                      : "text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#111111] border border-transparent"
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    activeTab === "site-details" || activeTab === "site-analysis"
                      ? "bg-[#1A1A1A] text-[#C9A96E] border border-[#242424]"
                      : "text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#111111] border border-transparent"
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    activeTab === "pomodoro"
                      ? "bg-[#1A1A1A] text-[#C9A96E] border border-[#242424]"
                      : "text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#111111] border border-transparent"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Pomodoro
                </button>
              </nav>
            </div>

            <div>
              <div className="px-2 text-[10px] font-semibold tracking-[0.08em] uppercase text-[#4A4A4A] mb-2">
                Configuration
              </div>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#111111] rounded-[6px] text-xs font-medium transition-colors border border-transparent">
                  <MousePointer2 className="w-4 h-4" />
                  Daily Limits
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#111111] rounded-[6px] text-xs font-medium transition-colors border border-transparent">
                  <Shield className="w-4 h-4" />
                  Whitelist
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#111111] rounded-[6px] text-xs font-medium transition-colors border border-transparent">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-auto px-2 hidden md:block">
            <div className="flex items-center gap-3 px-1 py-2 text-[#4A4A4A] hover:text-[#8A8A8A] transition-colors cursor-pointer text-xs uppercase tracking-wider font-medium">
              <PanelLeftClose className="w-4 h-4" /> Collapse Sidebar
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#0A0A0A] overflow-hidden relative flex flex-col">
          {/* Mobile Header Trigger */}
          <div className="md:hidden p-4 border-b border-[#242424] flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-[#8A8A8A] hover:text-[#F5F5F5]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              {activeTab === "site-analysis"
                ? "Site Analysis"
                : activeTab.replace("-", " ")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full p-5 md:p-6 overflow-y-auto"
              >
                {/* Dashboard Content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F5] mb-1">
                      Your Performance
                    </h2>
                    <p className="text-xs md:text-sm text-[#8A8A8A]">
                      Deep dive into your focus metrics and digital patterns.
                    </p>
                  </div>
                  <div className="flex items-center bg-[#111111] rounded-[6px] p-1 border border-[#242424] self-start md:self-auto overflow-x-auto max-w-full gap-0.5">
                    <button className="px-3 py-1 text-xs font-semibold bg-[#C9A96E] text-[#0A0A0A] rounded-[4px] whitespace-nowrap transition-colors">
                      Today
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors whitespace-nowrap">
                      Week
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors whitespace-nowrap">
                      Month
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors whitespace-nowrap">
                      All Time
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                  <div className="bg-[#111111] p-4 md:p-5 rounded-[8px] border border-[#242424]">
                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#C9A96E] uppercase mb-2">
                      <Clock className="w-3.5 h-3.5" /> Total Browsing
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F5F5F5] font-mono">13m 10s</div>
                  </div>
                  <div className="bg-[#111111] p-4 md:p-5 rounded-[8px] border border-[#242424]">
                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#8A8A8A] uppercase mb-2">
                      <BarChart2 className="w-3.5 h-3.5" /> Avg Per Site
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F5F5F5] font-mono">3m 17s</div>
                  </div>
                  <div className="bg-[#111111] p-4 md:p-5 rounded-[8px] border border-[#242424]">
                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#8A8A8A] uppercase mb-2">
                      <Globe className="w-3.5 h-3.5" /> Most Visited
                    </div>
                    <div className="text-base md:text-lg font-bold text-[#F5F5F5]">X.com</div>
                    <div className="text-xs text-[#8A8A8A] font-mono mt-0.5">7m 5s</div>
                  </div>
                  <div className="bg-[#111111] p-4 md:p-5 rounded-[8px] border border-[#242424]">
                    <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#8A8A8A] uppercase mb-2">
                      <Shield className="w-3.5 h-3.5" /> Unique Sites
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F5F5F5] font-mono">4</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                  <div className="lg:col-span-5 bg-[#111111] p-5 md:p-6 rounded-[8px] border border-[#242424] flex flex-col min-h-[300px]">
                    <div className="text-sm md:text-base font-bold text-[#F5F5F5] mb-6">
                      Distribution
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                      <div className="relative w-36 h-36 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 176 176">
                          <circle
                            cx="88"
                            cy="88"
                            r="76"
                            fill="transparent"
                            stroke="#1C1C1C"
                            strokeWidth="20"
                          />
                          <circle
                            cx="88"
                            cy="88"
                            r="76"
                            fill="transparent"
                            stroke="#C9A96E"
                            strokeWidth="20"
                            strokeDasharray="320 477"
                            strokeDashoffset="0"
                          />
                          <circle
                            cx="88"
                            cy="88"
                            r="76"
                            fill="transparent"
                            stroke="#8A7248"
                            strokeWidth="20"
                            strokeDasharray="110 477"
                            strokeDashoffset="-320"
                          />
                          <circle
                            cx="88"
                            cy="88"
                            r="76"
                            fill="transparent"
                            stroke="#4A4A4A"
                            strokeWidth="20"
                            strokeDasharray="25 477"
                            strokeDashoffset="-430"
                          />
                          <circle
                            cx="88"
                            cy="88"
                            r="76"
                            fill="transparent"
                            stroke="#242424"
                            strokeWidth="20"
                            strokeDasharray="22 477"
                            strokeDashoffset="-455"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-[#0A0A0A] border border-[#242424]"></div>
                        </div>
                      </div>
                      <div className="space-y-2.5 w-full sm:w-auto">
                        <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-[#8A8A8A]">
                          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#C9A96E]" />
                          x.com
                        </div>
                        <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-[#8A8A8A]">
                          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#8A7248]" />
                          youtube.com
                        </div>
                        <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-[#8A8A8A]">
                          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#4A4A4A]" />
                          github.com
                        </div>
                        <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-[#8A8A8A]">
                          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#242424]" />
                          localhost
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#111111] p-5 md:p-6 rounded-[8px] border border-[#242424] min-h-[300px] flex flex-col">
                    <div className="text-sm md:text-base font-bold text-[#F5F5F5] mb-6">
                      Detailed Activity
                    </div>
                    <div className="space-y-4">
                      {siteData.map((site, index) => (
                        <div
                          key={index}
                          className="group cursor-pointer hover:bg-[#161616] p-2 md:p-2.5 rounded-[6px] -mx-2 transition-colors border border-transparent hover:border-[#2A2A2A]"
                          onClick={() => handleSiteClick(site.name)}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#4A4A4A] font-mono">
                                {index + 1}
                              </span>
                              <div className="text-[#C9A96E] w-3.5 h-3.5 flex items-center justify-center">
                                {site.icon}
                              </div>
                              <span className="text-xs md:text-sm text-[#F5F5F5] font-semibold">
                                {site.name}
                              </span>
                            </div>
                            <span className="text-xs text-[#8A8A8A] font-mono font-medium">
                              {site.time}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full p-5 md:p-6 flex flex-col overflow-y-auto"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F5] mb-1">
                      Site Details
                    </h2>
                    <p className="text-xs md:text-sm text-[#8A8A8A]">
                      Detailed breakdown of your browsing history across domains.
                    </p>
                  </div>
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
                    <input
                      type="text"
                      placeholder="Search usage..."
                      className="pl-9 pr-3 py-2 bg-[#111111] border border-[#242424] rounded-[6px] text-xs md:text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C9A96E] w-full md:w-64 transition-colors placeholder:text-[#4A4A4A]"
                    />
                  </div>
                </div>

                <div className="flex-1 bg-[#111111] border border-[#242424] rounded-[8px] overflow-x-auto">
                  <div className="min-w-[540px]">
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#242424] text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#4A4A4A] uppercase">
                      <div className="col-span-5">Site Name</div>
                      <div className="col-span-3">Time Spent</div>
                      <div className="col-span-3">Last Visited</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    <div className="divide-y divide-[#1C1C1C]">
                      {siteData.map((site, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[#161616] transition-colors group cursor-pointer"
                          onClick={() => handleSiteClick(site.name)}
                        >
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center text-[#C9A96E]">
                              {site.icon}
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-[#F5F5F5]">
                              {site.name}
                            </span>
                          </div>
                          <div className="col-span-3 text-xs md:text-sm text-[#8A8A8A] font-mono">
                            {site.time}
                          </div>
                          <div className="col-span-3 text-xs md:text-sm text-[#8A8A8A]">
                            {site.last}
                          </div>
                          <div className="col-span-1 flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1 hover:bg-[#1A1A1A] border border-transparent hover:border-[#242424] rounded-[6px] text-[#8A8A8A] hover:text-[#C9A96E] transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              className="p-1 hover:bg-[#1A1A1A] border border-transparent hover:border-[#242424] rounded-[6px] text-[#8A8A8A] hover:text-[#C9A96E] transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full p-5 md:p-6 flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F5] mb-1">
                      Site Analysis
                    </h2>
                    <p className="text-xs md:text-sm text-[#8A8A8A]">
                      Detailed analytics and focus history for domain.
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="px-3 py-2 rounded-[6px] bg-transparent border border-[#242424] text-[#8A8A8A] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all flex items-center gap-1.5 text-xs font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                </div>

                <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-5 md:p-6 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center text-[#C9A96E]">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-[#F5F5F5] mb-0.5">
                        {selectedDomain || "Unknown Site"}
                      </h1>
                      <a
                        href={`https://${selectedDomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#C9A96E] hover:text-[#D9BA84] flex items-center gap-1 transition-colors"
                      >
                        Visit Site <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-[#1A1A1A] border border-[#242424] rounded-[6px] p-4">
                      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#4A4A4A] mb-1">
                        Total Time
                      </div>
                      <div className="text-lg md:text-xl font-bold text-[#F5F5F5] font-mono">7h 15m</div>
                    </div>
                    <div className="bg-[#1A1A1A] border border-[#242424] rounded-[6px] p-4">
                      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#4A4A4A] mb-1">
                        Active Days
                      </div>
                      <div className="text-lg md:text-xl font-bold text-[#F5F5F5] font-mono">12</div>
                    </div>
                    <div className="bg-[#1A1A1A] border border-[#242424] rounded-[6px] p-4">
                      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#4A4A4A] mb-1">
                        Visits
                      </div>
                      <div className="text-lg md:text-xl font-bold text-[#F5F5F5] font-mono">45</div>
                    </div>
                    <div className="bg-[#1A1A1A] border border-[#242424] rounded-[6px] p-4">
                      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#4A4A4A] mb-1">
                        First Seen
                      </div>
                      <div className="text-xs md:text-sm font-semibold text-[#F5F5F5] mt-1">
                        Oct 12, 2025
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm md:text-base font-bold text-[#F5F5F5]">
                      Usage Trends
                    </h3>
                    <div className="px-3 py-1.5 rounded-[6px] bg-[#111111] border border-[#242424] text-xs font-medium text-[#8A8A8A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A96E]" />
                      Oct 10 - Oct 25
                    </div>
                  </div>
                  <div className="p-6 rounded-[8px] bg-[#111111] border border-[#242424] h-56 flex items-center justify-center text-xs md:text-sm text-[#4A4A4A]">
                    Chart Placeholder (Activity)
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "pomodoro" && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full p-5 md:p-6 flex flex-col overflow-y-auto"
              >
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-[#F5F5F5] mb-1">
                    Pomodoro Timer
                  </h2>
                  <p className="text-xs md:text-sm text-[#8A8A8A]">
                    Track your focus sessions and productivity patterns.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                  <div className="p-4 md:p-5 rounded-[8px] bg-[#111111] border border-[#242424]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-[6px] bg-[#1A1A1A] border border-[#242424] text-[#C9A96E]">
                        <Timer className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F5F5F5] font-mono mb-0.5">
                      12
                    </div>
                    <div className="text-[11px] md:text-xs text-[#8A8A8A]">
                      Total Sessions
                    </div>
                  </div>
                  <div className="p-4 md:p-5 rounded-[8px] bg-[#111111] border border-[#242424]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-[6px] bg-[#1A1A1A] border border-[#242424] text-[#C9A96E]">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F5F5F5] font-mono mb-0.5">
                      4h 30m
                    </div>
                    <div className="text-[11px] md:text-xs text-[#8A8A8A]">
                      Total Focus Time
                    </div>
                  </div>
                  <div className="p-4 md:p-5 rounded-[8px] bg-[#111111] border border-[#242424]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-[6px] bg-[#1A1A1A] border border-[#242424] text-[#C9A96E]">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#F5F5F5] font-mono mb-0.5">
                      22m
                    </div>
                    <div className="text-[11px] md:text-xs text-[#8A8A8A]">
                      Average Session
                    </div>
                  </div>
                  <div className="p-4 md:p-5 rounded-[8px] bg-[#111111] border border-[#242424]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-[6px] bg-[#1A1A1A] border border-[#242424] text-[#C9A96E]">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-lg md:text-xl font-bold text-[#F5F5F5] mb-0.5">
                      Deep Work
                    </div>
                    <div className="text-[11px] md:text-xs text-[#8A8A8A]">
                      Most Used Template
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm md:text-base font-bold text-[#F5F5F5] mb-3">
                    Session History
                  </h3>
                  <div className="overflow-hidden rounded-[8px] border border-[#242424] bg-[#111111]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead className="bg-[#1A1A1A] border-b border-[#242424]">
                          <tr>
                            <th className="text-left px-5 py-3 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#4A4A4A] uppercase">
                              Date
                            </th>
                            <th className="text-left px-5 py-3 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#4A4A4A] uppercase">
                              Template
                            </th>
                            <th className="text-center px-5 py-3 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#4A4A4A] uppercase">
                              Cycles
                            </th>
                            <th className="text-center px-5 py-3 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#4A4A4A] uppercase">
                              Duration
                            </th>
                            <th className="text-center px-5 py-3 text-[10px] md:text-[11px] font-semibold tracking-[0.08em] text-[#4A4A4A] uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1C1C1C]">
                          {pomodoroSessions.map((session) => (
                            <tr
                              key={session.id}
                              className="hover:bg-[#161616] transition-colors"
                            >
                              <td className="px-5 py-3.5 text-xs md:text-sm text-[#8A8A8A] whitespace-nowrap font-mono">
                                {session.date}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <span className="text-xs md:text-sm font-semibold text-[#F5F5F5]">
                                  {session.template}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className="text-xs md:text-sm font-mono text-[#F5F5F5]">
                                  {session.cycles}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span className="text-xs md:text-sm font-mono text-[#C9A96E] font-medium">
                                  {session.duration}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium border ${
                                    session.status === "Completed"
                                      ? "bg-[rgba(201,169,110,0.1)] text-[#C9A96E] border-[#C9A96E]/30"
                                      : "bg-[#1A1A1A] text-[#8A8A8A] border-[#242424]"
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
      </div>
    </div>
  );
}
