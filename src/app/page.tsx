import Link from "next/link";

const features = [
  {
    title: "Find local businesses",
    description:
      "Search by niche, city, state, and radius to uncover local service business leads.",
  },
  {
    title: "Spot weak web presence",
    description:
      "Identify businesses with no website, social-only presence, or outdated websites.",
  },
  {
    title: "Score opportunities",
    description:
      "Rank leads by sales potential so the best opportunities rise to the top.",
  },
  {
    title: "Generate outreach",
    description:
      "Create personalized outreach drafts you can review, edit, and use immediately.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-16 md:px-10">
        <section className="grid gap-10 border-b border-zinc-800 pb-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm text-orange-300">
              High Ridge Lead Finder
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find local businesses with weak websites and turn them into real opportunities.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Search by service type and location, identify businesses with no website or poor web
              presence, score the opportunity, and generate outreach drafts from one dashboard.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/new"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-orange-500 px-5 font-medium text-black transition hover:bg-orange-400"
              >
                Start New Search
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-5 font-medium text-zinc-100 transition hover:bg-zinc-900"
              >
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-sm text-zinc-400">Primary workflow</div>
              <div className="mt-2 text-xl font-semibold">Search → Audit → Score → Outreach</div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                A focused lead-generation workflow for finding local businesses that need a better
                website and a stronger online presence.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-sm text-zinc-400">Quick links</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/leads" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
                  Leads
                </Link>
                <Link href="/clients" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
                  Clients
                </Link>
                <Link href="/settings" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">What this app does</h2>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Built for finding service businesses that need stronger websites, better conversion,
              and more professional outreach.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
