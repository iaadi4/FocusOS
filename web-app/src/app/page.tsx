"use client";

import Image from "next/image";
import {
  BarChart2,
  Shield,
  Clock,
  Zap,
  Chrome,
  Star,
  Users,
  Github,
  Ghost,
  Twitter,
  List,
  Music,
  TrendingUp,
  Navigation,
  Tags,
  Award,
  FileText,
  Hourglass,
  Globe,
} from "lucide-react";
import HeroDashboard from "@/components/HeroDashboard";
import ParticlesBackground from "@/components/ParticlesBackground";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
}

export default function Home() {
  const [stars, setStars] = useState<number | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [browser, setBrowser] = useState<"firefox" | "chrome" | "other">(
    "other",
  );

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("firefox") > -1) {
      setBrowser("firefox");
    } else if (userAgent.indexOf("chrome") > -1) {
      setBrowser("chrome");
    }

    fetch("https://api.github.com/repos/iaadi4/FocusOS")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Failed to fetch stars", err));

    fetch("https://api.github.com/repos/iaadi4/FocusOS/contributors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContributors(data);
        }
      })
      .catch((err) => console.error("Failed to fetch contributors", err));
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#C9A96E]/20 overflow-x-hidden">
      {/* Background Moving Dots (Industrial Gold) */}
      <ParticlesBackground />

      {/* SECTION 1 — APPLE DYNAMIC ISLAND NAVBAR */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[640px] px-4 pointer-events-none flex justify-center">
        <motion.nav
          initial={{ y: -60, scale: 0.85, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.025,
            borderColor: "rgba(201, 169, 110, 0.5)",
            boxShadow: "0 10px 40px rgba(201, 169, 110, 0.12)",
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 28,
          }}
          className="pointer-events-auto bg-[#0A0A0A] border border-[#242424] rounded-full px-5 py-2 flex items-center justify-between shadow-2xl w-full"
        >
          <div className="flex items-center gap-2.5 pl-2">
            <div className="relative flex items-center justify-center text-[#C9A96E]">
              <Hourglass className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-[#F5F5F5] tracking-[0.02em]">
              FocusOS
            </span>
            <span className="flex h-1.5 w-1.5 relative ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A96E]"></span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/iaadi4/FocusOS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors duration-150 ease-out p-1"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {browser === "firefox" ? (
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/focusos/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C9A96E] text-[#0A0A0A] font-bold text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-[#D9BA84] transition-colors duration-150 ease-out"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg"
                  width={14}
                  height={14}
                  alt="Firefox"
                  className="w-3.5 h-3.5"
                />
                Download
              </a>
            ) : (
              <button className="bg-transparent border border-[#242424] text-[#8A8A8A] text-xs font-semibold px-4 py-1.5 rounded-full opacity-50 cursor-not-allowed">
                Coming Soon
              </button>
            )}
          </div>
        </motion.nav>
      </div>

      {/* SECTION 2 — HERO */}
      <section className="relative z-10 pt-32 pb-14 px-4 text-center bg-transparent max-w-[1200px] mx-auto">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.03em] leading-[0.95] mb-6">
          <span className="text-[#F5F5F5]">Master Your</span> <br />
          <span className="text-[#C9A96E]">Digital Life.</span>
        </h1>
        <p className="text-[#8A8A8A] text-lg sm:text-xl max-w-xl mx-auto mt-5 leading-relaxed">
          Stop procrastination in its tracks. FocusOS combines powerful
          blocking, analytics, and flow-state tools into one beautiful
          dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://addons.mozilla.org/en-US/firefox/addon/focusos/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C9A96E] text-[#0A0A0A] font-bold text-sm px-7 py-3.5 rounded-[6px] border-0 hover:bg-[#D9BA84] transition-colors duration-150 ease-out flex items-center gap-2.5 w-full sm:w-auto justify-center"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg"
              width={18}
              height={18}
              alt="Firefox"
              className="w-[18px] h-[18px]"
            />
            Add to Firefox
          </a>
          <button className="bg-transparent border border-[#242424] text-[#8A8A8A] text-sm font-semibold px-7 py-3.5 rounded-[6px] opacity-50 cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center">
            <Chrome className="w-4 h-4" />
            Chrome (Coming Soon)
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-[#4A4A4A] text-xs uppercase tracking-widest font-semibold">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>{stars !== null ? stars : "2"} stars</span>
          </div>
          <span className="text-[#242424]">·</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>
              {contributors.length > 0
                ? `${contributors.length} ${
                    contributors.length === 1 ? "contributor" : "contributors"
                  }`
                : "1 contributor"}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3 — DASHBOARD PREVIEW MOCKUP */}
      <section className="relative z-10 pb-16 pt-2 px-4 bg-transparent">
        <div className="max-w-[1180px] mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4A4A4A] mb-4">
            Dashboard Preview
          </div>
          <div className="border border-[#242424] border-t-[2px] border-t-[#C9A96E] rounded-[12px] overflow-hidden mx-auto w-full bg-[#0A0A0A]">
            <HeroDashboard />
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURES BENTO */}
      <section id="features" className="relative z-10 py-16 px-4 bg-transparent">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.03em] leading-tight">
              <span className="text-[#F5F5F5]">Everything You Need.</span>
              <br />
              <span className="text-[#C9A96E]">Nothing You Don't.</span>
            </h2>
            <p className="text-[#8A8A8A] text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              Built for the disciplined. A complete operating system for your
              focus habits and workflow engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Row 1: Large (2) + Small (1) */}
            <div className="md:col-span-2 bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <BarChart2 className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Deep Analytics
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-lg mt-2">
                Understand your habits with precision. Visualize where your time
                goes with beautiful, real-time charts and insights.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Shield className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Smart Blocking
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Automatically block sites when daily limit is reached (user can
                set daily limits).
              </p>
            </div>

            {/* Row 2: Small + Medium + Small (all span 1) */}
            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Zap className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Flow State
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Environment designed to induce and maintain deep work states.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Clock className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Pomodoro Timer
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Built-in focus timer with customizable intervals. Syncs
                perfectly with your blocking schedule.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Ghost className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Privacy First
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Your data stays local. We don't track your browsing history.
              </p>
            </div>

            {/* Row 3: Small + Small + Small */}
            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <List className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Whitelist Mode
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Sites in this list are not tracked.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Music className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Lofi Player
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Integrated background music to help you focus.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <TrendingUp className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Trend Analysis
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                See how your productivity improves over time.
              </p>
            </div>

            {/* Row 4: Highlighted Large (2) + Small (1) */}
            <div className="md:col-span-2 bg-[#111111] border border-[#C9A96E] rounded-[8px] p-8 hover:bg-[#161616] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Navigation className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Site Details
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-lg mt-2">
                Granular control and analytics for every domain.
              </p>
            </div>

            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Tags className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Site Categorization
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Organize sites into productive, distraction, or neutral piles.
              </p>
            </div>

            {/* Row 5: Small (1) + Large (2) */}
            <div className="bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <Award className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Focus Score
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed mt-2">
                Real-time 0-100 score to track your digital productivity.
              </p>
            </div>

            <div className="md:col-span-2 bg-[#111111] border border-[#242424] rounded-[8px] p-8 hover:bg-[#161616] hover:border-[#2A2A2A] hover:-translate-y-0.5 transition-all duration-150 ease-out group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-[#1A1A1A] border border-[#242424] flex items-center justify-center mb-5 transition-colors duration-150 group-hover:border-[#C9A96E] group-hover:bg-[rgba(201,169,110,0.06)]">
                  <FileText className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="text-[#F5F5F5] font-bold text-lg mt-0 mb-2">
                  Data Export
                </h3>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-lg mt-2">
                Export your activity data to CSV or PDF for analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FOOTER */}
      <footer className="relative z-10 bg-[#0A0A0A] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Hourglass className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-[#F5F5F5] font-bold text-base tracking-tight">
                  FocusOS
                </span>
                <span className="text-[#4A4A4A] italic text-sm">· focus</span>
              </div>
              <p className="text-[#8A8A8A] text-sm leading-relaxed max-w-sm">
                A collection of helpful utility tools for productivity and focus,
                built with modern web technologies. Designed for speed,
                accessibility, and ease of use.
              </p>

              <div className="mt-6 flex items-center gap-2.5">
                <span className="text-[#4A4A4A] text-xs uppercase tracking-widest font-semibold">
                  Contributed by:
                </span>
                <a
                  href="https://github.com/iaadi4/FocusOS/graphs/contributors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4A4A4A] hover:text-[#C9A96E] transition-colors duration-150 ease-out"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-5 self-start md:self-end">
              <a
                href="https://github.com/iaadi4/FocusOS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A4A4A] hover:text-[#C9A96E] transition-colors duration-150 ease-out"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <Twitter className="w-4 h-4 text-[#4A4A4A] hover:text-[#C9A96E] transition-colors duration-150 ease-out cursor-pointer" />
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#1C1C1C] flex items-center justify-between">
            <span className="text-[#4A4A4A] text-xs">© 2025 FocusOS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
