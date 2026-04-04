import { Company } from "@/lib/types";
import CompanyTile from "./CompanyTile";

interface CategoryRowProps {
  categoryName: string;
  companies: Company[];
}

export default function CategoryRow({
  categoryName,
  companies,
}: CategoryRowProps) {
  if (companies.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-muted">
        {categoryName}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {companies.map((company) => (
          <CompanyTile key={company.name} company={company} />
        ))}
      </div>
    </div>
  );
}
