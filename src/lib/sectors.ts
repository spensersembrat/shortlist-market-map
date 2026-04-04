import { SectorConfig } from "./types";

export const SECTOR_ORDER: string[] = [
  "Consumer",
  "Enterprise: Horizontal",
  "Infrastructure",
  "Enterprise: Vertical",
  "Prosumer",
  "DevOps & MLOps",
  "Data & Analytics",
  "Security",
  "Robotics",
  "Agents",
];

export const SECTOR_COLORS: Record<string, string> = {
  Consumer: "#4dbf73",
  Infrastructure: "#b280e5",
  "Data & Analytics": "#8cb24d",
  "Enterprise: Horizontal": "#598ce5",
  "Enterprise: Vertical": "#e57340",
  Security: "#e5a633",
  Prosumer: "#40bfbf",
  Robotics: "#d9668c",
  "DevOps & MLOps": "#73a6d9",
  Agents: "#9973bf",
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
