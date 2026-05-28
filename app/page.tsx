"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-3xl animate-pulse" />

        <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-500/30 blur-3xl animate-pulse" />

        <div className="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
      </div>

      {/* HERO SECTION */}
      <section className="relative px-6 pb-24 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* BADGE */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                AI-Powered Influencer Collaboration Platform
              </div>

              {/* TITLE */}
              <h1 className="text-5xl font-black leading-tight md:text-7xl">
                Build Powerful
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {" "}
                  Creator Campaigns{" "}
                </span>
                At Scale.
              </h1>

              {/* SUBTITLE */}
              <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
                MingleMart helps brands discover creators, manage influencer
                campaigns, negotiate collaborations, and process secure
                campaign payments — all inside one modern platform.
              </p>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105">
                  <span className="relative z-10">
                    Start As Creator
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>

                <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
                  Join As Brand
                </button>
              </div>

              {/* STATS */}
              <div className="mt-14 grid grid-cols-3 gap-6">
                <div>
                  <h3 className="text-3xl font-bold text-blue-400">10K+</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Creator Profiles
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-purple-400">
                    2K+
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Brand Campaigns
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-pink-400">
                    ₹50L+
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Campaign Volume
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              {/* MAIN GLASS CARD */}
              <div className="relative rounded-[40px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.2)]">
                {/* TOP BAR */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Campaign Dashboard
                    </h3>

                    <p className="text-gray-400">
                      Real-time collaboration management
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold">
                    LIVE
                  </div>
                </div>

                {/* MOCK CREATOR CARDS */}
                <div className="space-y-5">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.03 }}
                      className="rounded-3xl border border-white/10 bg-black/40 p-5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600" />

                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">
                            Fashion Creator
                          </h4>

                          <p className="text-sm text-gray-400">
                            Instagram • Lifestyle • Fashion
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                              Verified
                            </span>

                            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
                              50K Followers
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* FLOATING CARD */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                  }}
                  className="absolute -right-10 -top-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl"
                >
                  <p className="text-sm text-gray-300">
                    Monthly Growth
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-green-400">
                    +240%
                  </h3>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="mb-4 text-blue-400">
              PLATFORM FEATURES
            </p>

            <h2 className="text-4xl font-bold md:text-6xl">
              Everything Needed For
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}
                Influencer Marketing
              </span>
            </h2>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Smart Creator Discovery",
                desc: "Discover niche creators based on category, audience size, and campaign fit.",
              },
              {
                title: "Real-Time Messaging",
                desc: "Brands and creators communicate directly with seamless campaign discussions.",
              },
              {
                title: "Campaign Workflow",
                desc: "Manage campaign deliverables, approvals, pricing, and timelines.",
              },
              {
                title: "Secure Payments",
                desc: "Transparent payment handling with secure campaign transactions.",
              },
              {
                title: "Creator Profiles",
                desc: "Detailed creator profiles with engagement insights and reviews.",
              },
              {
                title: "Scalable Collaborations",
                desc: "Launch and manage multiple influencer campaigns efficiently.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-2xl font-bold">
                    {index + 1}
                  </div>

                  <h3 className="text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-300">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-12 text-center backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),transparent_70%)]" />

            <div className="relative">
              <h2 className="text-4xl font-bold md:text-6xl">
                Ready To Launch Your
                Next Creator Campaign?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                Join MingleMart and connect with creators and brands through
                one powerful influencer collaboration platform.
              </p>

              <button className="mt-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}