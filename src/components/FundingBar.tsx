import { Company } from "@/lib/types";

interface FundingBarProps {
  companies: Company[];
  sectorColor: string;
}

const STAGE_GROUPS: { label: string; stages: string[]; opacity: number }[] = [
  { label: "Seed", stages: ["Pre-seed", "Pre-Seed", "Seed"], opacity: 0.3 },
  { label: "A-C", stages: ["Series A", "Series B", "Series C"], opacity: 0.55 },
  { label: "D+", stages: ["Series D", "Series E", "Late Stage"], opacity: 0.8 },
  { label: "Public", stages: ["Public", "IPO"], opacity: 1 },
];

function formatFunding(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  return `$${millions}M`;
}

export default function FundingBar({ companies, sectorColor }: FundingBarProps) {
  const total = companies.reduce((sum, c) => sum + (c.totalFunding ?? 0), 0);
  if (total === 0) return null;

  const segments = STAGE_GROUPS.map((group) => {
    const amount = companies
      .filter((c) => c.fundingRound && group.stages.includes(c.fundingRound))
      .reduce((sum, c) => sum + (c.totalFunding ?? 0), 0);
    return { ...group, amount, pct: (amount / total) * 100 };
  }).filter((s) => s.amount > 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-[5px] flex-1 overflow-hidden rounded-full bg-white/5">
        {segments.map((seg) => (
          <div
            key={seg.label}
            title={`${seg.label}: ${formatFunding(seg.amount)}`}
            style={{
              width: `${seg.pct}%`,
              backgroundColor: sectorColor,
              opacity: seg.opacity,
            }}
          />
        ))}
      </div>
      <span className="shrink-0 text-[9px] font-medium text-white/30">
        {formatFunding(total)}
      </span>
    </div>
  );
}
