import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

export default async function BrandDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: pendingCount } = await supabase
    .from("submissions")
    .select("id, campaigns!inner(brand_id)", { count: "exact" })
    .eq("status", "pending")
    .eq("campaigns.brand_id", user!.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl md:text-5xl">Your campaigns</h1>
        <Link
          href="/dashboard/brand/new"
          className="bg-lime text-base font-display font-semibold text-sm px-4 py-2.5 rounded-md hover:brightness-95 transition"
        >
          + New campaign
        </Link>
      </div>

      {pendingCount && pendingCount.length > 0 && (
        <p className="text-sm text-violet mb-6">
          {pendingCount.length} submission(s) waiting for your review.
        </p>
      )}

      {!campaigns || campaigns.length === 0 ? (
        <div className="border border-white/10 rounded-lg p-10 text-center">
          <p className="text-muted">
            No campaigns yet. Launch your first one to start getting clips.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {(campaigns as Campaign[]).map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/brand/campaigns/${c.id}`}
              className="border border-white/10 rounded-lg p-6 bg-surface card-hover flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
                    {c.campaign_type}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "active"
                        ? "bg-lime/10 text-lime"
                        : "bg-white/5 text-muted"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg">{c.title}</h3>
              </div>
              <div className="text-right font-mono-num">
                <div className="text-lime">${c.budget}</div>
                <div className="text-xs text-muted">
                  ${c.pay_rate_per_100k}/100K views
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
