export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808]">
      <div className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1536px] px-4 md:px-6 py-16">
        <div className="flex flex-col gap-6 md:gap-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4 md:max-w-[448px]">
              <div className="font-display text-2xl font-bold tracking-tight">
                <span className="text-white">SHORT</span>
                <span className="text-white/60">List</span>
              </div>
              <p className="text-sm text-white/40">
                The first job board that&apos;s built to make you a millionaire.
              </p>

              {/* Mobile link columns */}
              <div className="flex flex-col gap-3 md:hidden">
                <div className="flex flex-col gap-3">
                  <h3 className="pb-1 text-sm font-medium text-white">Product</h3>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com">Drops</a>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/listings">Job Board</a>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/your-links">Referrals</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="pb-1 text-sm font-medium text-white">Company</h3>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="#">About</a>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="#">Contact</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="pb-1 text-sm font-medium text-white">Legal</h3>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/privacy-policy">Privacy</a>
                  <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/terms-of-service">Terms</a>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <a
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Twitter"
                  href="#"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                </a>
                <a
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="LinkedIn"
                  href="#"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a
                  className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Instagram"
                  href="#"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
              </div>
            </div>

            {/* Desktop link columns */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-12">
              <div className="flex flex-col gap-3">
                <h3 className="pb-1 text-sm font-medium text-white">Product</h3>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com">Drops</a>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/listings">Job Board</a>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/your-links">Referrals</a>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="pb-1 text-sm font-medium text-white">Company</h3>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="#">About</a>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="#">Contact</a>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="pb-1 text-sm font-medium text-white">Legal</h3>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/privacy-policy">Privacy</a>
                <a className="text-sm text-white/60 transition-colors hover:text-white" href="https://shortlistjobs.com/terms-of-service">Terms</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <p className="text-xs text-white/40">&copy; 2026 SHORTList</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
