"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Company } from "@/lib/types";
import { SECTOR_COLORS, sectorToSlug } from "@/lib/sectors";
import { useView } from "@/lib/view-context";
import { getSharedInvestors } from "@/lib/investors";

interface CompanyTileProps {
  company: Company;
}

interface PopoverPos {
  x: number;
  y: number;
  below: boolean;
}

function Popover({
  company,
  sectorColor,
  pos,
  onClose,
  relatedCompanies,
}: {
  company: Company;
  sectorColor: string;
  pos: PopoverPos;
  onClose: () => void;
  relatedCompanies: { name: string; sharedCount: number }[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 10);
    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        zIndex: 9999,
        left: pos.x,
        top: pos.y,
        transform: pos.below
          ? "translateX(-50%)"
          : "translateX(-50%) translateY(-100%)",
      }}
    >
      <div className="relative w-[280px] rounded-xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
        <div
          className={`absolute left-1/2 -translate-x-1/2 size-3 rotate-45 border-white/10 bg-[#1a1a1a] ${
            pos.below
              ? "-top-1.5 border-l border-t"
              : "-bottom-1.5 border-b border-r"
          }`}
        />

        <p className="text-[15px] font-semibold text-white">{company.name}</p>

        {company.description && (
          <p className="mt-2 text-[13px] leading-relaxed text-white/50">
            {company.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {company.fundingRound && (
            <span className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/70">
              {company.fundingRound}
            </span>
          )}
          <span
            className="rounded-md px-2.5 py-1 text-[11px] font-medium"
            style={{
              color: sectorColor,
              border: `1px solid ${sectorColor}40`,
            }}
          >
            {company.category}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <a
            href={`/sector/${sectorToSlug(company.sector)}`}
            className="text-[13px] font-medium text-white/70 transition-colors hover:text-white"
          >
            View market segment →
          </a>
          <a
            href={company.shortlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-accent transition-colors hover:text-accent/80"
          >
            View full profile →
          </a>
        </div>

        {relatedCompanies.length > 0 && (
          <div className="mt-4 border-t border-white/5 pt-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Companies like this
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {relatedCompanies.map((rc) => (
                <span
                  key={rc.name}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60"
                  title={`${rc.sharedCount} shared investor${rc.sharedCount > 1 ? "s" : ""}`}
                >
                  {rc.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompanyTile({ company }: CompanyTileProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopoverPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { heatmapActive, maxFunding, allCompanies } = useView();
  const initial = company.name.charAt(0).toUpperCase();
  const displayName =
    company.name.length > 10 ? company.name.slice(0, 9) + ".." : company.name;
  const sectorColor = SECTOR_COLORS[company.sector] || "#808080";

  const heatmapIntensity = heatmapActive
    ? Math.max(0.08, Math.min(0.9, (company.totalFunding ?? 0) / maxFunding))
    : 0;

  const relatedCompanies = useMemo(() => {
    if (!open || !company.investors?.length) return [];
    return allCompanies
      .filter((c) => c.name !== company.name && c.investors?.length)
      .map((c) => ({
        name: c.name,
        sharedCount: getSharedInvestors(company.investors!, c.investors!).length,
      }))
      .filter((r) => r.sharedCount > 0)
      .sort((a, b) => b.sharedCount - a.sharedCount)
      .slice(0, 3);
  }, [open, company, allCompanies]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = useCallback(() => {
    if (open) {
      setOpen(false);
      return;
    }
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const below = spaceAbove < 300;

    setPos({
      x: centerX,
      y: below ? rect.bottom + 8 : rect.top - 8,
      below,
    });
    setOpen(true);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        title={company.name}
        className={`group flex size-[72px] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg transition-colors hover:bg-[#2a2a2a] ${
          !heatmapActive ? "bg-card" : ""
        }`}
        style={
          heatmapActive
            ? { backgroundColor: `rgba(194, 241, 126, ${heatmapIntensity})` }
            : undefined
        }
      >
        <span className="text-xl font-bold text-white">{initial}</span>
        <span className="text-center text-[9px] font-medium leading-tight text-muted">
          {displayName}
        </span>
      </button>

      {open &&
        mounted &&
        pos &&
        createPortal(
          <Popover
                company={company}
                sectorColor={sectorColor}
                pos={pos}
                onClose={() => setOpen(false)}
                relatedCompanies={relatedCompanies}
              />,
          document.body
        )}
    </>
  );
}
