"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Company } from "@/lib/types";
import { SECTOR_COLORS } from "@/lib/sectors";

interface FundingTimelineProps {
  companies: Company[];
  onClose: () => void;
}

interface Dot {
  company: Company;
  x: number;
  y: number;
  r: number;
  color: string;
}

const PADDING = { top: 60, right: 40, bottom: 50, left: 70 };
const MIN_YEAR = 2018;
const MAX_YEAR = 2026;

function parseDate(d: string): number {
  const [y, m] = d.split("-").map(Number);
  return y + (m - 1) / 12;
}

function formatFunding(m: number): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m}M`;
}

export default function FundingTimeline({
  companies,
  onClose,
}: FundingTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Dot | null>(null);
  const [dims, setDims] = useState({ w: 1000, h: 500 });

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const withDates = useMemo(
    () => companies.filter((c) => c.fundingDate && c.totalFunding),
    [companies]
  );

  const maxFunding = useMemo(
    () => Math.max(...withDates.map((c) => c.totalFunding!), 1),
    [withDates]
  );

  const plotW = dims.w - PADDING.left - PADDING.right;
  const plotH = dims.h - PADDING.top - PADDING.bottom;

  const dots: Dot[] = useMemo(() => {
    if (plotW <= 0 || plotH <= 0) return [];
    const logMax = Math.log10(maxFunding + 1);

    return withDates.map((c) => {
      const dateVal = parseDate(c.fundingDate!);
      const x =
        PADDING.left +
        ((dateVal - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * plotW;
      const logVal = Math.log10((c.totalFunding ?? 0) + 1);
      const y = PADDING.top + plotH - (logVal / logMax) * plotH;
      const r = Math.max(4, Math.min(18, Math.sqrt(c.totalFunding! / 10)));
      const color = SECTOR_COLORS[c.sector] || "#808080";
      return { company: c, x, y, r, color };
    });
  }, [withDates, maxFunding, plotW, plotH]);

  const years = Array.from(
    { length: MAX_YEAR - MIN_YEAR + 1 },
    (_, i) => MIN_YEAR + i
  );

  const yTicks = useMemo(() => {
    const vals = [10, 100, 500, 1000, 5000, 10000];
    const logMax = Math.log10(maxFunding + 1);
    return vals
      .filter((v) => v <= maxFunding * 1.2)
      .map((v) => ({
        value: v,
        y: PADDING.top + plotH - (Math.log10(v + 1) / logMax) * plotH,
        label: formatFunding(v),
      }));
  }, [maxFunding, plotH]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">
            Funding Timeline
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            Close ✕
          </button>
        </div>

        <div ref={containerRef} className="flex-1 px-4 pb-4">
          <svg width={dims.w} height={dims.h} className="overflow-visible">
            {years.map((year) => {
              const x =
                PADDING.left +
                ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * plotW;
              return (
                <g key={year}>
                  <line
                    x1={x}
                    y1={PADDING.top}
                    x2={x}
                    y2={PADDING.top + plotH}
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <text
                    x={x}
                    y={PADDING.top + plotH + 24}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize={11}
                  >
                    {year}
                  </text>
                </g>
              );
            })}

            {yTicks.map((tick) => (
              <g key={tick.value}>
                <line
                  x1={PADDING.left}
                  y1={tick.y}
                  x2={PADDING.left + plotW}
                  y2={tick.y}
                  stroke="rgba(255,255,255,0.04)"
                />
                <text
                  x={PADDING.left - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.25)"
                  fontSize={10}
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {dots.map((dot, i) => (
              <circle
                key={dot.company.name + i}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                fill={dot.color}
                fillOpacity={hover && hover.company.name !== dot.company.name ? 0.15 : 0.7}
                stroke={dot.color}
                strokeWidth={hover?.company.name === dot.company.name ? 2 : 0}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHover(dot)}
                onMouseLeave={() => setHover(null)}
              />
            ))}

            {hover && (
              <g>
                <rect
                  x={hover.x + 12}
                  y={hover.y - 36}
                  width={Math.max(120, hover.company.name.length * 7.5 + 30)}
                  height={50}
                  rx={8}
                  fill="#1a1a1a"
                  stroke="rgba(255,255,255,0.1)"
                />
                <text
                  x={hover.x + 22}
                  y={hover.y - 16}
                  fill="white"
                  fontSize={12}
                  fontWeight={600}
                >
                  {hover.company.name}
                </text>
                <text
                  x={hover.x + 22}
                  y={hover.y + 2}
                  fill="rgba(255,255,255,0.5)"
                  fontSize={10}
                >
                  {hover.company.fundingRound} ·{" "}
                  {formatFunding(hover.company.totalFunding ?? 0)} ·{" "}
                  {hover.company.fundingDate}
                </text>
              </g>
            )}
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
