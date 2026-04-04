"use client";

import { Company } from "@/lib/types";
import { SECTOR_ORDER, SECTOR_COLORS, sectorToSlug } from "@/lib/sectors";
import CategoryGroup from "./CategoryGroup";
import SectorCard from "./SectorCard";

interface CategoryGridProps {
  companies: Company[];
}

export default function CategoryGrid({ companies }: CategoryGridProps) {
  const groupedBySector = SECTOR_ORDER.reduce(
    (acc, sector) => {
      acc[sector] = companies.filter((c) => c.sector === sector);
      return acc;
    },
    {} as Record<string, Company[]>
  );

  let visibleIndex = 0;

  return (
    <div className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1536px] px-4 md:px-6 pb-12">
      <div className="market-grid">
        {SECTOR_ORDER.map((sector) => {
          const sectorCompanies = groupedBySector[sector] || [];
          if (sectorCompanies.length === 0) return null;

          const index = visibleIndex++;

          return (
            <SectorCard key={sector} index={index} href={`/sector/${sectorToSlug(sector)}`}>
              <CategoryGroup
                sectorName={sector}
                sectorColor={SECTOR_COLORS[sector] || "#808080"}
                companies={sectorCompanies}
              />
            </SectorCard>
          );
        })}
      </div>
    </div>
  );
}
