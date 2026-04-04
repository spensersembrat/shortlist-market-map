"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface SectorCardProps {
  children: ReactNode;
  index: number;
  href: string;
}

export default function SectorCard({ children, index, href }: SectorCardProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(href);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
        delay: (index % 4) * 0.08,
      }}
      onClick={handleClick}
      className="cursor-pointer rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-3 transition-colors hover:border-[#2a2a2a]"
    >
      {children}
    </motion.div>
  );
}
