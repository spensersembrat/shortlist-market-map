import Link from "next/link";
import { Company } from "@/lib/types";
import { sectorToSlug } from "@/lib/sectors";
import CategoryRow from "./CategoryRow";
import FundingBar from "./FundingBar";

interface CategoryGroupProps {
  sectorName: string;
  sectorColor: string;
  companies: Company[];
}

export default function CategoryGroup({
  sectorName,
  sectorColor,
  companies,
}: CategoryGroupProps) {
  const categories = Array.from(
    new Set(companies.map((c) => c.category))
  );

  if (companies.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 p-1">
      <div className="flex flex-col gap-1">
        <Link
          href={`/sector/${sectorToSlug(sectorName)}`}
          className="font-display text-sm font-bold transition-opacity hover:opacity-70"
          style={{ color: sectorColor }}
        >
          {sectorName}
        </Link>
        <FundingBar companies={companies} sectorColor={sectorColor} />
      </div>
      {categories.map((category) => (
        <CategoryRow
          key={category}
          categoryName={category}
          companies={companies.filter((c) => c.category === category)}
        />
      ))}
    </div>
  );
}
