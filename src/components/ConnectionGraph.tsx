"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";
import { Company } from "@/lib/types";
import { SECTOR_COLORS, SECTOR_ORDER } from "@/lib/sectors";

interface ConnectionGraphProps {
  companies: Company[];
  onClose: () => void;
}

interface GNode extends SimulationNodeDatum {
  id: string;
  company: Company;
  color: string;
  r: number;
}

interface GLink extends SimulationLinkDatum<GNode> {
  investors: string[];
  strength: number;
}

function formatFunding(m: number): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m}M`;
}

export default function ConnectionGraph({
  companies,
  onClose,
}: ConnectionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1000, h: 600 });
  const [activeNode, setActiveNode] = useState<GNode | null>(null);
  const [hoverNode, setHoverNode] = useState<GNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<GNode[]>([]);
  const linksRef = useRef<GLink[]>([]);
  const simRef = useRef<ReturnType<typeof forceSimulation<GNode>> | null>(null);

  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ startX: number; startY: number; txStart: number; tyStart: number; didDrag: boolean } | null>(null);

  const focusNode = activeNode || hoverNode;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activeNode) {
          setActiveNode(null);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, activeNode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const { nodes, links, linksByNode } = useMemo(() => {
    const withInvestors = companies.filter(
      (c) => c.investors && c.investors.length > 0
    );

    const nodes: GNode[] = withInvestors.map((c) => ({
      id: c.name,
      company: c,
      color: SECTOR_COLORS[c.sector] || "#808080",
      r: Math.max(6, Math.min(24, Math.sqrt((c.totalFunding ?? 10) / 5))),
    }));

    const links: GLink[] = [];
    const linksByNode = new Map<string, GLink[]>();

    for (let i = 0; i < withInvestors.length; i++) {
      for (let j = i + 1; j < withInvestors.length; j++) {
        const a = withInvestors[i];
        const b = withInvestors[j];
        const shared = a.investors!.filter((inv) => b.investors!.includes(inv));
        if (shared.length >= 1) {
          const link: GLink = {
            source: a.name,
            target: b.name,
            investors: shared,
            strength: shared.length,
          };
          links.push(link);

          if (!linksByNode.has(a.name)) linksByNode.set(a.name, []);
          linksByNode.get(a.name)!.push(link);
          if (!linksByNode.has(b.name)) linksByNode.set(b.name, []);
          linksByNode.get(b.name)!.push(link);
        }
      }
    }

    return { nodes, links, linksByNode };
  }, [companies]);

  useEffect(() => {
    nodesRef.current = nodes;
    linksRef.current = links;

    const sim = forceSimulation<GNode>(nodes)
      .force(
        "link",
        forceLink<GNode, GLink>(links)
          .id((d) => d.id)
          .distance(120)
          .strength((l) => Math.min(0.12, l.strength * 0.04))
      )
      .force("charge", forceManyBody().strength(-300).distanceMax(500))
      .force("center", forceCenter(dims.w / 2, dims.h / 2))
      .force(
        "collide",
        forceCollide<GNode>().radius((d) => d.r + 6).strength(0.8)
      )
      .alpha(0.6)
      .alphaDecay(0.015);

    simRef.current = sim;
    sim.on("tick", () => draw());

    return () => {
      sim.stop();
    };
  }, [nodes, links, dims]);

  const getConnectedIds = useCallback(
    (nodeId: string): Set<string> => {
      const nodeLinks = linksByNode.get(nodeId) || [];
      const ids = new Set<string>([nodeId]);
      for (const l of nodeLinks) {
        const sId = typeof l.source === "object" ? (l.source as GNode).id : (l.source as string);
        const tId = typeof l.target === "object" ? (l.target as GNode).id : (l.target as string);
        ids.add(sId);
        ids.add(tId);
      }
      return ids;
    },
    [linksByNode]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = dims.w * dpr;
    canvas.height = dims.h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, dims.w, dims.h);

    const t = transformRef.current;
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const focusId = focusNode?.id;
    const connectedIds = focusId ? getConnectedIds(focusId) : null;
    const focusLinks = focusId ? (linksByNode.get(focusId) || []) : [];

    // Only draw edges for the focused node
    if (focusId) {
      for (const link of focusLinks) {
        const s = link.source as GNode;
        const t2 = link.target as GNode;
        if (s.x == null || t2.x == null) continue;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y!);
        ctx.lineTo(t2.x, t2.y!);
        ctx.strokeStyle =
          link.strength >= 2
            ? "rgba(194, 241, 126, 0.5)"
            : "rgba(194, 241, 126, 0.2)";
        ctx.lineWidth = Math.min(3, link.strength);
        ctx.stroke();
      }
    }

    // Draw nodes
    for (const node of nodesRef.current) {
      if (node.x == null) continue;
      const isConnected = connectedIds?.has(node.id);
      const dimmed = focusId && !isConnected;

      ctx.beginPath();
      ctx.arc(node.x, node.y!, node.r, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? `${node.color}15` : node.color + "CC";
      ctx.fill();

      if (focusId === node.id) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else if (isConnected && focusId) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Labels for larger or connected nodes
      const showLabel =
        (!focusId && node.r >= 12 && t.k >= 0.7) ||
        (focusId && isConnected);

      if (showLabel) {
        ctx.font = `${Math.max(9, Math.min(12, node.r * 0.7))}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = dimmed ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)";
        ctx.fillText(node.company.name, node.x, node.y! + node.r + 3);
      }
    }

    ctx.restore();
  }, [dims, focusNode, getConnectedIds, linksByNode]);

  useEffect(() => {
    draw();
  }, [draw]);

  const screenToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { cx: 0, cy: 0 };
      const t = transformRef.current;
      return {
        cx: (clientX - rect.left - t.x) / t.k,
        cy: (clientY - rect.top - t.y) / t.k,
      };
    },
    []
  );

  const findNode = useCallback(
    (cx: number, cy: number): GNode | null => {
      let closest: GNode | null = null;
      let minDist = Infinity;
      for (const node of nodesRef.current) {
        if (node.x == null) continue;
        const dx = node.x - cx;
        const dy = node.y! - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < node.r + 6 && dist < minDist) {
          minDist = dist;
          closest = node;
        }
      }
      return closest;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          dragRef.current.didDrag = true;
        }
        transformRef.current.x = dragRef.current.txStart + dx;
        transformRef.current.y = dragRef.current.tyStart + dy;
        draw();
        return;
      }

      const { cx, cy } = screenToCanvas(e.clientX, e.clientY);
      setHoverNode(findNode(cx, cy));
    },
    [screenToCanvas, findNode, draw]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { cx, cy } = screenToCanvas(e.clientX, e.clientY);
      const node = findNode(cx, cy);
      if (node) {
        setActiveNode((prev) => (prev?.id === node.id ? null : node));
        return;
      }
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        txStart: transformRef.current.x,
        tyStart: transformRef.current.y,
        didDrag: false,
      };
    },
    [screenToCanvas, findNode]
  );

  const handleMouseUp = useCallback(() => {
    if (dragRef.current && !dragRef.current.didDrag) {
      setActiveNode(null);
    }
    dragRef.current = null;
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const t = transformRef.current;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const scaleFactor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      const newK = Math.max(0.2, Math.min(4, t.k * scaleFactor));
      const ratio = newK / t.k;

      t.x = mx - ratio * (mx - t.x);
      t.y = my - ratio * (my - t.y);
      t.k = newK;

      draw();
    },
    [draw]
  );

  const connectedCount = focusNode
    ? getConnectedIds(focusNode.id).size - 1
    : 0;

  const focusInvestorLinks = useMemo(() => {
    if (!focusNode) return [];
    const nodeLinks = linksByNode.get(focusNode.id) || [];
    const investorMap = new Map<string, string[]>();
    for (const l of nodeLinks) {
      for (const inv of l.investors) {
        const sId = typeof l.source === "object" ? (l.source as GNode).id : (l.source as string);
        const tId = typeof l.target === "object" ? (l.target as GNode).id : (l.target as string);
        const other = sId === focusNode.id ? tId : sId;
        if (!investorMap.has(inv)) investorMap.set(inv, []);
        investorMap.get(inv)!.push(other);
      }
    }
    return Array.from(investorMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5);
  }, [focusNode, linksByNode]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0a]/95 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Connection Graph
              </h2>
              <p className="text-xs text-white/40">
                {nodes.length} companies · Hover or click a node to see connections
              </p>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              {SECTOR_ORDER.slice(0, 6).map((sector) => (
                <div key={sector} className="flex items-center gap-1.5">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: SECTOR_COLORS[sector] }}
                  />
                  <span className="text-[10px] text-white/40">
                    {sector.replace("Enterprise: ", "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/30">
              Scroll to zoom · Drag to pan · Click to pin
            </span>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              Close ✕
            </button>
          </div>
        </div>

        <div ref={containerRef} className="relative flex-1">
          <canvas
            ref={canvasRef}
            style={{ width: dims.w, height: dims.h }}
            className="cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoverNode(null);
              dragRef.current = null;
            }}
            onWheel={handleWheel}
          />

          {/* Info panel for focused node */}
          {focusNode && (
            <div
              className="pointer-events-none absolute right-6 top-6 w-[280px] rounded-xl border border-white/10 bg-[#141414] p-5 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-white">
                    {focusNode.company.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {focusNode.company.sector} · {focusNode.company.category}
                  </p>
                </div>
                <div
                  className="mt-1 size-3 rounded-full"
                  style={{ backgroundColor: focusNode.color }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {focusNode.company.fundingRound && (
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
                    {focusNode.company.fundingRound}
                  </span>
                )}
                {focusNode.company.totalFunding != null && (
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
                    {formatFunding(focusNode.company.totalFunding)}
                  </span>
                )}
                <span className="rounded-md border border-accent/30 px-2 py-0.5 text-[10px] font-medium text-accent">
                  {connectedCount} connections
                </span>
              </div>

              {focusInvestorLinks.length > 0 && (
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-white/25">
                    Shared Investors
                  </p>
                  <div className="mt-2 flex flex-col gap-2">
                    {focusInvestorLinks.map(([investor, linkedCompanies]) => (
                      <div key={investor}>
                        <p className="text-[11px] font-medium text-white/70">
                          {investor}
                        </p>
                        <p className="text-[10px] leading-relaxed text-white/35">
                          {linkedCompanies.slice(0, 4).join(", ")}
                          {linkedCompanies.length > 4
                            ? ` +${linkedCompanies.length - 4} more`
                            : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeNode && (
                <p className="mt-3 text-[10px] text-white/20">
                  Click again or press Esc to unpin
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
