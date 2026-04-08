import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import companiesData from "../../../../data/companies.json";
import { Company } from "@/lib/types";
import {
  SECTOR_ORDER,
  SECTOR_COLORS,
  sectorToSlug,
  slugToSector,
} from "@/lib/sectors";

const companies: Company[] = companiesData;

export function generateStaticParams() {
  return SECTOR_ORDER.map((sector) => ({ slug: sectorToSlug(sector) }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const sectorName = slugToSector(params.slug);
  return {
    title: sectorName ? `${sectorName} | Market Map` : "Sector | Market Map",
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sectorName = slugToSector(slug);

  if (!sectorName) {
    notFound();
  }

  const sectorColor = SECTOR_COLORS[sectorName] || "#808080";
  const sectorCompanies = companies.filter((c) => c.sector === sectorName);
  const categories = Array.from(
    new Set(sectorCompanies.map((c) => c.category))
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1536px] px-4 md:px-6 pt-12 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Market Map
          </Link>
          <h1
            className="mt-6 font-display text-4xl font-bold md:text-5xl"
            style={{ color: sectorColor }}
          >
            {sectorName}
          </h1>
          <p className="mt-2 text-base text-white/50">
            {sectorCompanies.length} companies across {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>
        </section>

        <section className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1536px] px-4 md:px-6 pb-16">
          <div className="flex flex-col gap-12">
            {categories.map((category) => {
              const catCompanies = sectorCompanies.filter(
                (c) => c.category === category
              );
              return (
                <div key={category}>
                  <h2 className="mb-5 text-xs font-semibold uppercase tracking-[1px] text-white/40">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {catCompanies.map((company) => (
                      <div
                        key={company.name}
                        className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#111] p-5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                            style={{
                              backgroundColor: `${sectorColor}18`,
                              color: sectorColor,
                            }}
                          >
                            {company.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-medium text-white">
                              {company.name}
                            </p>
                            {company.fundingRound && (
                              <p className="text-xs text-white/40">
                                {company.fundingRound}
                              </p>
                            )}
                          </div>
                        </div>
                        {company.description && (
                          <p className="text-[13px] leading-relaxed text-white/50">
                            {company.description}
                          </p>
                        )}
                        <a
                          href={company.shortlistUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex w-fit items-center rounded-lg border border-accent/50 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10"
                        >
                          View Profile
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
