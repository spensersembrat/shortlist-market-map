import { SectorConfig } from "./types";

export const SECTOR_ORDER: string[] = [
  "AI & Models",
  "Enterprise Software",
  "Consumer & Marketplace",
  "Developer Tools",
  "Healthcare & Biotech",
  "Media & Marketing",
  "Hardware & Robotics",
  "Fintech",
  "Security & Privacy",
  "Automation & Agents",
  "Defense & Government",
  "Energy & Climate",
];

export const SECTOR_COLORS: Record<string, string> = {
  "AI & Models": "#b280e5",
  "Enterprise Software": "#598ce5",
  "Consumer & Marketplace": "#4dbf73",
  "Developer Tools": "#73a6d9",
  "Healthcare & Biotech": "#e57373",
  "Media & Marketing": "#e57340",
  "Hardware & Robotics": "#d9668c",
  Fintech: "#e5c040",
  "Security & Privacy": "#e5a633",
  "Automation & Agents": "#9973bf",
  "Defense & Government": "#8cb24d",
  "Energy & Climate": "#40bfbf",
};

export function sectorToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToSector(slug: string): string | undefined {
  return SECTOR_ORDER.find((s) => sectorToSlug(s) === slug);
}

export const SECTOR_CONFIGS: SectorConfig[] = SECTOR_ORDER.map((name) => ({
  name,
  color: SECTOR_COLORS[name] || "#808080",
  gridArea: name.toLowerCase().replace(/[^a-z]/g, ""),
}));
