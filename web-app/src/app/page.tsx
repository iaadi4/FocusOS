"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  Timer,
  BarChart2,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  Chrome,
  Eye,
  Star,
  Users,
  Github,
  Lock,
  Ghost,
  Smartphone,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-react";
import HeroDashboard from "@/components/HeroDashboard";
import { useEffect, useState } from "react";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
}

export default function Home() {
  const [stars, setStars] = useState<number | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsNavbarVisible(false);
    } else {
      setIsNavbarVisible(true);
    }
  });

  useEffect(() => {
    // Fetch Stars
    fetch("https://api.github.com/repos/iaadi4/FocusOS")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Failed to fetch stars", err));

    // Fetch Contributors
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
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
      {/* Smart Navbar */}
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-150%" },
        }}
        animate={isNavbarVisible ? "visible" : "hidden"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none"
      >
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <Image
              src="/icon.png"
              width={24}
              height={24}
              alt="FocusOS"
              className="w-6 h-6 text-purple-500"
            />
            FocusOS
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a
              href="https://github.com/iaadi4/FocusOS"
              className="hover:text-white transition-colors"
            >
              Github
            </a>
          </div>
          <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            Coming Soon
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
              Master Your <br />
              <span className="text-gradient">Digital Life.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              Stop procrastination in its tracks. FocusOS combines powerful
              blocking, analytics, and flow-state tools into one beautiful
              dashboard.
            </p>

            <div className="flex flex-col items-center justify-center gap-8 mb-16">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />{" "}
                    {stars !== null ? stars : "..."} stars
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />{" "}
                    {contributors.length > 0 ? contributors.length : "..."}{" "}
                    contributors
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <HeroDashboard />
        </div>
      </section>

      {/* Features Section - Aesthetic Bento Grid */}
      <section
        id="features"
        className="py-32 px-4 bg-zinc-950/50 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Everything You Need.
              <br />
              Nothing You Don't.
            </h2>
            <p className="text-gray-400 text-lg">
              Built for the disciplined. A complete operating system for your
              focus habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
              <BarChart2 className="w-10 h-10 text-white mb-6" />
              <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Understand your habits with precision. Visualize where your time
                goes with beautiful, real-time charts and insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <Shield className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-3">Smart Blocking</h3>
              <p className="text-gray-400 text-sm">
                Eliminate distractions instantly. Set strict limits or absolute
                blocks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <Zap className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-3">Flow State</h3>
              <p className="text-gray-400 text-sm">
                Environment designed to induce and maintain deep work states.
              </p>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <Clock className="w-10 h-10 text-white mb-6" />
              <h3 className="text-2xl font-bold mb-3">Pomodoro Timer</h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Built-in focus timer with customizable intervals. Syncs
                perfectly with your blocking schedule.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <Ghost className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-3">Privacy First</h3>
              <p className="text-gray-400 text-sm">
                Your data stays local. We don't track your browsing history.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <Lock className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-3">Whitelist Mode</h3>
              <p className="text-gray-400 text-sm">
                Total lockdown. Only access usage-critical applications.
              </p>
            </div>
            {/* Feature 7 */}
            <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <Smartphone className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-3">Cross Sync</h3>
              <p className="text-gray-400 text-sm">
                (Coming Soon) Sync your meaningful limits across all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 px-4 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/icon.png"
                width={24}
                height={24}
                alt="FocusOS"
                className="w-6 h-6"
              />
              <h3 className="text-xl font-bold text-white">FocusOS</h3>
              <span className="text-zinc-600 font-serif italic">focus</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              A collection of helpful utility tools for productivity and focus,
              built with modern web technologies. Designed for speed,
              accessibility, and ease of use.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white">
                Contributed by:
              </span>
              <div className="flex -space-x-2">
                {contributors.length > 0 ? (
                  contributors
                    .slice(0, 5)
                    .map((contributor) => (
                      <img
                        key={contributor.id}
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-6 h-6 rounded-full border border-black bg-zinc-800"
                      />
                    ))
                ) : (
                  // Fallback placeholders
                  <>
                    <div className="w-6 h-6 rounded-full bg-zinc-700 border border-black" />
                    <div className="w-6 h-6 rounded-full bg-zinc-600 border border-black" />
                    <div className="w-6 h-6 rounded-full bg-zinc-500 border border-black" />
                  </>
                )}
                {contributors.length > 5 && (
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[8px] font-bold text-white">
                    +{contributors.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end items-end space-y-6">
            <div className="flex gap-4">
              <a
                href="https://github.com/iaadi4/FocusOS"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
