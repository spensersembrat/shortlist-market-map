import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const VALID_SECTORS: Record<string, string[]> = {
  Consumer: ["Entertainment", "Social", "Music", "Education", "Gaming"],
  Infrastructure: ["Models", "Compute", "Vector DBs"],
  "Data & Analytics": ["Data Ops", "BI & Insights", "Analytics"],
  "Enterprise: Horizontal": ["Sales", "Marketing", "Design", "Engineering"],
  "Enterprise: Vertical": ["Healthcare", "Legal", "Finance"],
  Security: ["AI Safety", "Privacy", "Compliance"],
  Prosumer: ["Search", "Video", "Image", "3D & AR"],
  Robotics: ["Humanoid", "Industrial", "Autonomous"],
  "DevOps & MLOps": ["ML Platform", "Deployment", "Monitoring"],
  Agents: ["Coding", "Task Automation", "Customer"],
};

interface Company {
  name: string;
  sector: string;
  category: string;
  shortlistUrl: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function printUsage() {
  console.log(`
Usage: npx tsx scripts/add-company.ts <name> <sector> <category> [url]

Arguments:
  name       Company name (required)
  sector     Sector name (required)
  category   Category within the sector (required)
  url        Shortlist URL (optional, auto-generated from name)

Valid sectors and categories:`);

  for (const [sector, categories] of Object.entries(VALID_SECTORS)) {
    console.log(`  ${sector}: ${categories.join(", ")}`);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 3 || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
  }

  const [name, sector, category, url] = args;

  if (!VALID_SECTORS[sector]) {
    console.error(`Invalid sector: "${sector}"`);
    console.error(`Valid sectors: ${Object.keys(VALID_SECTORS).join(", ")}`);
    process.exit(1);
  }

  if (!VALID_SECTORS[sector].includes(category)) {
    console.error(`Invalid category: "${category}" for sector "${sector}"`);
    console.error(
      `Valid categories: ${VALID_SECTORS[sector].join(", ")}`
    );
    process.exit(1);
  }

  const DROPS_PLACEHOLDER = "e76d0065-9dae-47f8-819b-4c63408685b6";
  const shortlistUrl =
    url || `https://shortlistjobs.com/drops/${DROPS_PLACEHOLDER}?ref=${slugify(name)}`;

  const filePath = resolve(import.meta.dirname, "../data/companies.json");
  const companies: Company[] = JSON.parse(readFileSync(filePath, "utf-8"));

  const exists = companies.some(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    console.error(`Company "${name}" already exists in the data file.`);
    process.exit(1);
  }

  const newCompany: Company = { name, sector, category, shortlistUrl };

  const insertIdx = companies.findLastIndex(
    (c) => c.sector === sector && c.category === category
  );

  if (insertIdx >= 0) {
    companies.splice(insertIdx + 1, 0, newCompany);
  } else {
    const sectorIdx = companies.findLastIndex((c) => c.sector === sector);
    if (sectorIdx >= 0) {
      companies.splice(sectorIdx + 1, 0, newCompany);
    } else {
      companies.push(newCompany);
    }
  }

  const lines = companies.map((c) => `  ${JSON.stringify(c)}`);
  writeFileSync(filePath, `[\n${lines.join(",\n")}\n]\n`, "utf-8");

  console.log(`Added "${name}" to ${sector} > ${category}`);
  console.log(`URL: ${shortlistUrl}`);
  console.log(`Total companies: ${companies.length}`);
}

main();
