"use client";

import { motion } from "framer-motion";
import { SECTOR_ORDER } from "@/lib/sectors";

const FUNDING_GROUPS = [
  { label: "Pre-Seed", stages: ["Pre-seed", "Pre-Seed"] },
  { label: "Seed", stages: ["Seed"] },
  { label: "Series A-C", stages: ["Series A", "Series B", "Series C"] },
  { label: "Series D+", stages: ["Series D", "Series E", "Late Stage"] },
  { label: "Public", stages: ["Public", "IPO"] },
];

export interface Filters {
  sectors: string[];
  fundingGroups: string[];
  sort: "default" | "funding";
}

export interface ViewToggles {
  heatmap: boolean;
  connections: boolean;
  timeline: boolean;
}

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  resultCount: number;
  totalCount: number;
  viewToggles: ViewToggles;
  onViewToggle: (key: keyof ViewToggles) => void;
}

export default function Toolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  resultCount,
  totalCount,
  viewToggles,
  onViewToggle,
}: ToolbarProps) {
  const hasActiveFilters =
    filters.sectors.length > 0 || filters.fundingGroups.length > 0;
  const isFiltered = hasActiveFilters || searchQuery.trim().length > 0;

  function toggleSector(sector: string) {
    const next = filters.sectors.includes(sector)
      ? filters.sectors.filter((s) => s !== sector)
      : [...filters.sectors, sector];
    onFiltersChange({ ...filters, sectors: next });
  }

  function toggleFunding(group: string) {
    const next = filters.fundingGroups.includes(group)
      ? filters.fundingGroups.filter((g) => g !== group)
      : [...filters.fundingGroups, group];
    onFiltersChange({ ...filters, fundingGroups: next });
  }

  function toggleSort() {
    onFiltersChange({
      ...filters,
      sort: filters.sort === "default" ? "funding" : "default",
    });
  }

  function clearAll() {
    onFiltersChange({ sectors: [], fundingGroups: [], sort: "default" });
    onSearchChange("");
  }

  const toggleBtnClass = (active: boolean) =>
    `shrink-0 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
      active
        ? "border-accent/50 bg-accent/10 text-accent"
        : "border-border text-muted-light hover:text-white hover:border-white/20"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      className="mx-auto flex w-full max-w-[1280px] 2xl:max-w-[1536px] flex-col gap-3 px-4 md:px-6 pb-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center rounded-lg border border-border bg-[#141414] px-3.5 py-2.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="mr-2.5 shrink-0 text-[#666]"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search companies, categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-[13px] text-white placeholder-[#666] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="ml-2 shrink-0 text-white/30 hover:text-white/60"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={toggleSort}
            className={toggleBtnClass(filters.sort === "funding")}
          >
            {filters.sort === "funding" ? "Funding ↓" : "Sort"}
          </button>
          <button
            onClick={() => onViewToggle("heatmap")}
            className={toggleBtnClass(viewToggles.heatmap)}
            title="Toggle funding heatmap"
          >
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Heatmap
            </span>
          </button>
          <button
            onClick={() => onViewToggle("connections")}
            className={toggleBtnClass(viewToggles.connections)}
            title="View connection graph"
          >
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <circle cx="18" cy="6" r="3" />
                <path d="M8.5 8.5l7 7M8.5 6h7" />
              </svg>
              Connections
            </span>
          </button>
          <button
            onClick={() => onViewToggle("timeline")}
            className={toggleBtnClass(viewToggles.timeline)}
            title="View funding timeline"
          >
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 12l4-4M3 12l4 4" />
                <circle cx="9" cy="7" r="2" />
                <circle cx="15" cy="17" r="2" />
                <circle cx="18" cy="9" r="2" />
              </svg>
              Timeline
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
          Sector
        </span>
        {SECTOR_ORDER.map((sector) => {
          const active = filters.sectors.includes(sector);
          const short = sector
            .replace("Enterprise: ", "")
            .replace("Data & Analytics", "Data")
            .replace("DevOps & MLOps", "DevOps");
          return (
            <button
              key={sector}
              onClick={() => toggleSector(sector)}
              className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {short}
              {active && " ×"}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] font-medium uppercase tracking-wider text-white/30">
          Stage
        </span>
        {FUNDING_GROUPS.map((group) => {
          const active = filters.fundingGroups.includes(group.label);
          return (
            <button
              key={group.label}
              onClick={() => toggleFunding(group.label)}
              className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {group.label}
              {active && " ×"}
            </button>
          );
        })}
      </div>

      {isFiltered && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-accent">
            {resultCount} {resultCount === 1 ? "company" : "companies"} found
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export { FUNDING_GROUPS };
