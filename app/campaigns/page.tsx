import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export default async function CampaignsPage() {
  const supabase = createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <Link href="/" className="font-display font-bold text-xl">
          flow<span className="text-lime">perk</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-ink transition"
        >
          Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">
          Live campaigns
        </h1>

        {!campaigns || campaigns.length === 0 ? (
          <div className="border border-white/10 rounded-lg p-10 text-center">
            <p className="text-muted">
              No campaigns live yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {(campaigns as Campaign[]).map((c) => (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="border border-white/10 rounded-lg p-6 bg-surface card-hover"
              >
                <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
                  {c.campaign_type}
                </span>
                <h3 className="font-display font-semibold text-lg mt-1 mb-2">
                  {c.title}
                </h3>
                <p className="text-muted text-sm line-clamp-2 mb-4">
                  {c.description}
                </p>
                <div className="flex justify-between font-mono-num text-sm">
                  <span className="text-lime">
                    ${c.pay_rate_per_100k}/100K views
                  </span>
                  <span className="text-muted">${c.budget} budget</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
