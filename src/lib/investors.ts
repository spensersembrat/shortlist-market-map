export const TOP_INVESTORS = [
  "Sequoia Capital",
  "a16z",
  "Benchmark",
  "Lightspeed Venture Partners",
  "Founders Fund",
  "Greylock Partners",
  "Accel",
  "Index Ventures",
  "Kleiner Perkins",
  "NEA",
  "General Catalyst",
  "Khosla Ventures",
  "Tiger Global",
  "Coatue Management",
  "Thrive Capital",
  "Spark Capital",
  "Y Combinator",
  "GV",
  "Microsoft",
  "Google Ventures",
  "NVIDIA",
  "Salesforce Ventures",
  "Insight Partners",
  "IVP",
  "Lux Capital",
  "Radical Ventures",
] as const;

export type InvestorName = (typeof TOP_INVESTORS)[number];

export function getSharedInvestors(
  investorsA: string[],
  investorsB: string[]
): string[] {
  return investorsA.filter((inv) => investorsB.includes(inv));
}
