export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 blur-3xl">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full" />
          <div className="absolute top-32 right-10 w-72 h-72 bg-purple-500 rounded-full" />
        </div>

        <div className="relative px-6 py-24 md:py-32 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-2 text-sm text-gray-300 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Built for creators and modern brands
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
            Connect the right brands with the right creators.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-8">
            MingleMart helps businesses discover Instagram creators, review
            niche-fit profiles, chat directly, and launch paid collaborations
            in one smooth platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 transition px-7 py-3 rounded-2xl font-semibold shadow-xl">
              Join as Creator
            </button>

            <button className="bg-white/10 hover:bg-white/20 border border-white/10 transition px-7 py-3 rounded-2xl font-semibold">
              Join as Brand
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left">
              <h3 className="text-xl font-semibold mb-2">Discover Creators</h3>
              <p className="text-gray-300 text-sm leading-6">
                Search creators by niche, audience size, and campaign fit for
                faster brand decisions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left">
              <h3 className="text-xl font-semibold mb-2">Chat & Negotiate</h3>
              <p className="text-gray-300 text-sm leading-6">
                Brands and creators can discuss deliverables, pricing, and
                campaign ideas directly inside the platform.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left">
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-300 text-sm leading-6">
                Manage campaign payments smoothly while MingleMart handles the
                platform commission flow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}