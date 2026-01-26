import { useState, useEffect } from "react";
import {
  getAggregatedData,
  getSiteCategories,
  setSiteCategory,
} from "../../utils/storage";
import type {
  TimeRange,
  SiteCategory,
  SiteCategoryMap,
} from "../../utils/types";
import { formatDomain, formatDuration } from "../../utils/format";
import {
  Search,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Circle,
  Plus,
} from "lucide-react";

interface SiteCategoriesViewProps {
  range: TimeRange;
}

export function SiteCategoriesView({ range }: SiteCategoriesViewProps) {
  const [categories, setCategories] = useState<SiteCategoryMap>({});
  const [sites, setSites] = useState<
    Array<{ domain: string; time: number; favicon: string }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    SiteCategory | "all"
  >("all");
  const [newDomain, setNewDomain] = useState("");
  const [newCategory, setNewCategory] = useState<SiteCategory>("productive");

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [range]);

  const fetchData = async () => {
    const [aggregatedData, categoriesData] = await Promise.all([
      getAggregatedData(range),
      getSiteCategories(),
    ]);

    // Merge visited sites with categorized sites
    const visitedDomains = new Set(
      aggregatedData.byDomain.map((s) => s.domain),
    );
    const allSites = [...aggregatedData.byDomain];

    // Add sites that are categorized but not visited in this range
    Object.keys(categoriesData).forEach((domain) => {
      if (!visitedDomains.has(domain)) {
        allSites.push({
          domain,
          time: 0,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}`,
          visitCount: 0,
          lastVisited: 0,
        });
      }
    });

    // Sort by time (desc) then domain (asc)
    allSites.sort((a, b) => {
      if (b.time !== a.time) return b.time - a.time;
      return a.domain.localeCompare(b.domain);
    });

    setCategories(categoriesData);
    setSites(allSites);
  };

  const handleCategoryChange = async (
    domain: string,
    category: SiteCategory,
  ) => {
    await setSiteCategory(domain, category);
    await fetchData();
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    await setSiteCategory(newDomain, newCategory);
    setNewDomain("");
    await fetchData();
  };

  const getCategoryIcon = (category: SiteCategory) => {
    switch (category) {
      case "productive":
        return <CheckCircle2 className="w-4 h-4" />;
      case "distraction":
        return <XCircle className="w-4 h-4" />;
      case "neutral":
        return <MinusCircle className="w-4 h-4" />;
      case "others":
        return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: SiteCategory) => {
    switch (category) {
      case "productive":
        return "text-primary bg-primary/20 border-primary/30";
      case "distraction":
        return "text-primary bg-primary/15 border-primary/25";
      case "neutral":
        return "text-primary bg-primary/10 border-primary/20";
      case "others":
        return "text-primary bg-primary/5 border-primary/10";
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.domain
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const siteCategory = categories[site.domain] || "others";
    const matchesCategory =
      selectedCategory === "all" || siteCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = {
    productive: sites.filter((s) => categories[s.domain] === "productive")
      .length,
    distraction: sites.filter((s) => categories[s.domain] === "distraction")
      .length,
    neutral: sites.filter((s) => categories[s.domain] === "neutral").length,
    others: sites.filter(
      (s) => !categories[s.domain] || categories[s.domain] === "others",
    ).length,
  };

  return (
    <div className="space-y-4 pr-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Productive
            </h3>
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {categoryCounts.productive}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              sites
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-primary/15 border border-primary/25 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Distraction
            </h3>
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {categoryCounts.distraction}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              sites
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1">
            <MinusCircle className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Neutral
            </h3>
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {categoryCounts.neutral}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              sites
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1">
            <Circle className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Others
            </h3>
          </div>
          <div>
            <div className="text-xl font-bold text-white">
              {categoryCounts.others}
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              sites
            </div>
          </div>
        </div>
      </div>

      {/* Manual Add */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <h3 className="text-sm font-bold mb-3 text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          Add Site to Category
        </h3>
        <form onSubmit={handleAddSite} className="flex gap-3">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral-600"
          />
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
            {(["productive", "distraction", "neutral", "others"] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    newCategory === cat
                      ? getCategoryColor(cat)
                      : "text-neutral-500 hover:text-white hover:bg-white/5"
                  }`}
                  title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                >
                  {getCategoryIcon(cat)}
                </button>
              ),
            )}
          </div>
          <button
            type="submit"
            disabled={!newDomain}
            className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          {(
            ["all", "productive", "distraction", "neutral", "others"] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sites List */}
      <div className="space-y-2">
        {filteredSites.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl text-sm">
            No sites found.
          </div>
        ) : (
          filteredSites.map((site) => {
            const currentCategory = categories[site.domain] || "others";
            return (
              <div
                key={site.domain}
                className={`p-3 rounded-xl border transition-all hover:shadow-lg ${getCategoryColor(
                  currentCategory,
                )}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={
                        site.favicon ||
                        `https://www.google.com/s2/favicons?domain=${site.domain}`
                      }
                      className="w-8 h-8 rounded-md bg-black/50 p-1"
                      alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate text-sm">
                        {formatDomain(site.domain)}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {formatDuration(site.time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {(
                      [
                        "productive",
                        "distraction",
                        "neutral",
                        "others",
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(site.domain, cat)}
                        className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                          currentCategory === cat
                            ? getCategoryColor(cat)
                            : "text-neutral-500 bg-white/5 border border-white/5 hover:bg-white/10"
                        }`}
                        title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                      >
                        {getCategoryIcon(cat)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
