"use client";

import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Toolbar, {
  Filters,
  FUNDING_GROUPS,
  ViewToggles,
} from "@/components/Toolbar";
import CategoryGrid from "@/components/CategoryGrid";
import HeatmapLegend from "@/components/HeatmapLegend";
import FundingTimeline from "@/components/FundingTimeline";
import ConnectionGraph from "@/components/ConnectionGraph";
import Footer from "@/components/Footer";
import { ViewContext } from "@/lib/view-context";
import companiesData from "../../data/companies.json";
import { Company } from "@/lib/types";

const companies: Company[] = companiesData;

const FUNDING_RANK: Record<string, number> = {
  "Pre-seed": 0,
  "Pre-Seed": 0,
  Seed: 1,
  "Series A": 2,
  "Series B": 3,
  "Series C": 4,
  "Series D": 5,
  "Series E": 6,
  "Late Stage": 7,
  IPO: 8,
  Public: 9,
};

const maxFunding = Math.max(...companies.map((c) => c.totalFunding ?? 0));

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    sectors: [],
    fundingGroups: [],
    sort: "default",
  });
  const [viewToggles, setViewToggles] = useState<ViewToggles>({
    heatmap: false,
    connections: false,
    timeline: false,
  });

  const handleViewToggle = useCallback((key: keyof ViewToggles) => {
    setViewToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const filteredCompanies = useMemo(() => {
    let result = companies;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (filters.sectors.length > 0) {
      result = result.filter((c) => filters.sectors.includes(c.sector));
    }

    if (filters.fundingGroups.length > 0) {
      const allowedStages = filters.fundingGroups.flatMap(
        (label) =>
          FUNDING_GROUPS.find((g) => g.label === label)?.stages ?? []
      );
      result = result.filter(
        (c) => c.fundingRound && allowedStages.includes(c.fundingRound)
      );
    }

    if (filters.sort === "funding") {
      result = [...result].sort(
        (a, b) =>
          (FUNDING_RANK[b.fundingRound ?? ""] ?? -1) -
          (FUNDING_RANK[a.fundingRound ?? ""] ?? -1)
      );
    }

    return result;
  }, [searchQuery, filters]);

  const viewCtx = useMemo(
    () => ({
      heatmapActive: viewToggles.heatmap,
      maxFunding,
      allCompanies: companies,
    }),
    [viewToggles.heatmap]
  );

  return (
    <ViewContext.Provider value={viewCtx}>
      <div className="flex min-h-screen flex-col">
        {/* <Header /> */}
        <main className="flex-1">
          <Hero />
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredCompanies.length}
            totalCount={companies.length}
            viewToggles={viewToggles}
            onViewToggle={handleViewToggle}
          />
          <HeatmapLegend visible={viewToggles.heatmap} />
          <CategoryGrid companies={filteredCompanies} />
        </main>
        {/* <Footer /> */}
      </div>

      {viewToggles.timeline && (
        <FundingTimeline
          companies={filteredCompanies}
          onClose={() => setViewToggles((p) => ({ ...p, timeline: false }))}
        />
      )}

      {viewToggles.connections && (
        <ConnectionGraph
          companies={filteredCompanies}
          onClose={() => setViewToggles((p) => ({ ...p, connections: false }))}
        />
      )}
    </ViewContext.Provider>
  );
}
