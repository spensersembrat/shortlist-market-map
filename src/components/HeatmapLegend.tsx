"use client";

import { motion, AnimatePresence } from "framer-motion";

interface HeatmapLegendProps {
  visible: boolean;
}

export default function HeatmapLegend({ visible }: HeatmapLegendProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1536px] overflow-hidden px-4 md:px-6"
        >
          <div className="flex items-center gap-3 pb-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Funding
            </span>
            <div className="flex h-2 w-40 overflow-hidden rounded-full">
              <div
                className="h-full flex-1"
                style={{
                  background:
                    "linear-gradient(to right, rgba(194,241,126,0.08), rgba(194,241,126,0.5), rgba(194,241,126,0.9))",
                }}
              />
            </div>
            <div className="flex gap-3 text-[10px] text-white/40">
              <span>$0M</span>
              <span>$1B</span>
              <span>$10B+</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
