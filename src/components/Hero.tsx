"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-[1280px] 2xl:max-w-[1536px] flex-col items-center gap-4 px-4 md:px-6 pb-10 pt-15 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-display text-6xl font-bold text-white md:text-[80px] md:leading-none"
      >
        MARKET MAP
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="max-w-2xl text-base text-muted-light"
      >
        Explore the AI landscape. Click any company to view their profile, open
        roles, and investment details.
      </motion.p>
    </section>
  );
}
