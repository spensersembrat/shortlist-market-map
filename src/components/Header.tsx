"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-white/[0.06]"
    >
      <div className="mx-auto flex h-14 md:h-20 w-full max-w-[1280px] 2xl:max-w-[1536px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          <a
            href="https://shortlistjobs.com"
            className="font-display text-[22px] font-bold tracking-tight"
          >
            <span className="text-white">SHORT</span>
            <span className="text-white/50">List</span>
          </a>
          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            <a
              className="text-[14px] font-medium transition-colors hover:text-white text-white/70"
              href="https://shortlistjobs.com"
            >
              Drops
            </a>
            <a
              className="text-[14px] font-medium transition-colors hover:text-white text-white/70"
              href="https://shortlistjobs.com/featured"
            >
              Featured
            </a>
            <a
              className="text-[14px] font-medium transition-colors hover:text-white text-white/70"
              href="https://shortlistjobs.com/listings"
            >
              Job Listings
            </a>
            <a
              className="text-[14px] font-medium transition-colors hover:text-white text-white/70"
              href="https://shortlistjobs.com/for-employers"
            >
              For Employers
            </a>
            <a
              className="text-[14px] font-medium transition-colors hover:text-white text-white/70"
              href="https://shortlistjobs.com/login"
            >
              Referrals
            </a>
            <div className="rounded-full border border-[#c2f17e]/60 px-4 py-1.5">
              <span className="font-display text-[10px] leading-none font-medium text-[#c2f17e] tracking-[1.2px] uppercase whitespace-nowrap">
                WEDNESDAY DROP 6:00AM EST
              </span>
            </div>
          </nav>
        </div>
        <div className="hidden items-center gap-6 lg:flex">
          <div className="h-4 w-px bg-white/10" />
          <a
            className="text-sm font-medium text-white transition-colors hover:text-white/80"
            href="https://shortlistjobs.com/login"
          >
            Log in
          </a>
          <a
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
            href="https://shortlistjobs.com/login"
          >
            Sign up
          </a>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="inline-flex items-center justify-center rounded-full size-9 text-white hover:bg-white/10 transition-colors"
            type="button"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
