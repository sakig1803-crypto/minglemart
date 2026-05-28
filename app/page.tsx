export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 opacity-20 blur-3xl">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-blue-500" />
          <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-purple-500" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          {/* TOP BADGE */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Trusted influencer marketing collaboration platform
          </div>

          {/* MAIN HEADING */}
          <h1 className="mx-auto max-w-6xl text-5xl font-bold leading-tight md:text-7xl">
            Scale Your Brand With Trusted Influencer Collaborations.
          </h1>

          {/* SUBTEXT */}
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
            MingleMart is an influencer marketing platform that helps
            businesses discover verified creators, manage campaign
            collaborations, and launch high-performing promotional partnerships
            securely.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-blue-500 px-7 py-3 font-semibold shadow-xl transition hover:scale-105 hover:bg-blue-600">
              Join as Creator
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/10 px-7 py-3 font-semibold transition hover:bg-white/20">
              Join as Brand
            </button>
          </div>

          {/* FEATURE CARDS */}
          <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* CARD 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 text-left backdrop-blur-md transition hover:-translate-y-1 hover:border-blue-400/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-2xl font-bold">
                ✓
              </div>

              <h3 className="mb-3 text-2xl font-semibold">
                Verified Influencer Discovery
              </h3>

              <p className="text-sm leading-7 text-gray-300">
                Find niche-specific creators based on audience category,
                engagement quality, campaign fit, and collaboration goals.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 text-left backdrop-blur-md transition hover:-translate-y-1 hover:border-purple-400/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-2xl font-bold">
                ✦
              </div>

              <h3 className="mb-3 text-2xl font-semibold">
                Campaign Collaboration Tools
              </h3>

              <p className="text-sm leading-7 text-gray-300">
                Manage campaign discussions, pricing negotiations,
                deliverables, timelines, and collaboration workflows in one
                centralized platform.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 text-left backdrop-blur-md transition hover:-translate-y-1 hover:border-green-400/30">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-2xl font-bold">
                ₹
              </div>

              <h3 className="mb-3 text-2xl font-semibold">
                Secure Campaign Payments
              </h3>

              <p className="text-sm leading-7 text-gray-300">
                Process influencer campaign payments securely with transparent
                transaction workflows and protected payment handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY BRANDS CHOOSE US */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-300">
              Why Brands Choose MingleMart
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Built For Modern Influencer Campaigns
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
              MingleMart helps brands simplify influencer marketing operations
              with creator discovery, campaign coordination, secure payments,
              and collaboration management tools.
            </p>
          </div>

          {/* TRUST GRID */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
              <h3 className="text-xl font-semibold">
                Verified Creator Profiles
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
              <h3 className="text-xl font-semibold">
                Transparent Campaign Pricing
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
              <h3 className="text-xl font-semibold">
                Secure Payment Workflow
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
              <h3 className="text-xl font-semibold">
                Direct Collaboration Management
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/30 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-2xl font-bold">MingleMart</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
              Influencer marketing platform helping brands collaborate with
              digital creators for promotional campaigns and sponsored content.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-300">
            <a href="/about-us" className="hover:text-white">
              About Us
            </a>

            <a href="/contact-us" className="hover:text-white">
              Contact Us
            </a>

            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>

            <a href="/terms-and-conditions" className="hover:text-white">
              Terms & Conditions
            </a>

            <a href="/refund-policy" className="hover:text-white">
              Refund Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}