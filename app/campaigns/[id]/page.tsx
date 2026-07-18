import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubmitClipForm from "./submit-form";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, profiles(full_name)")
    .eq("id", params.id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  if (!campaign) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Campaign not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <Link href="/" className="font-display font-bold text-xl">
          flow<span className="text-lime">perk</span>
        </Link>
        <Link
          href="/campaigns"
          className="text-sm text-muted hover:text-ink transition"
        >
          ← All campaigns
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
          {campaign.campaign_type}
        </span>
        <h1 className="font-display font-bold text-3xl mt-1">
          {campaign.title}
        </h1>
        <p className="text-muted text-sm mt-1">
          by {campaign.profiles?.full_name}
        </p>

        <div className="flex gap-8 mt-6 font-mono-num">
          <div>
            <div className="text-lime text-xl">
              ${campaign.pay_rate_per_100k}
            </div>
            <div className="text-xs text-muted">per 100K views</div>
          </div>
          <div>
            <div className="text-lime text-xl">${campaign.budget}</div>
            <div className="text-xs text-muted">total budget</div>
          </div>
          <div>
            <div className="text-lime text-xl">{campaign.min_views}</div>
            <div className="text-xs text-muted">min views to qualify</div>
          </div>
        </div>

        <p className="mt-8 text-ink leading-relaxed">{campaign.description}</p>

        {campaign.requirements && (
          <div className="mt-6 border border-white/10 rounded-lg p-5 bg-surface">
            <h3 className="font-display font-semibold text-sm mb-2">
              Requirements
            </h3>
            <p className="text-muted text-sm">{campaign.requirements}</p>
          </div>
        )}

        <div className="mt-10">
          {!user ? (
            <div className="border border-white/10 rounded-lg p-6 text-center">
              <p className="text-muted mb-4">
                Log in as a creator to submit a clip for this campaign.
              </p>
              <Link
                href="/login"
                className="bg-lime text-base font-display font-semibold px-5 py-2.5 rounded-md inline-block hover:brightness-95 transition"
              >
                Log in
              </Link>
            </div>
          ) : role === "creator" ? (
            <SubmitClipForm campaignId={campaign.id} />
          ) : (
            <p className="text-muted text-sm">
              Only creator accounts can submit clips to this campaign.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
