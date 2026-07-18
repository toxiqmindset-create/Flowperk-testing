import { createClient } from "@/lib/supabase/server";
import type { Submission } from "@/lib/types";
import SubmissionRow from "./submission-row";

export default async function CampaignReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, profiles(full_name)")
    .eq("campaign_id", params.id)
    .order("created_at", { ascending: false });

  if (!campaign) {
    return <p className="text-muted">Campaign not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
          {campaign.campaign_type}
        </span>
        <h1 className="font-display font-bold text-3xl mt-1">
          {campaign.title}
        </h1>
        <p className="text-muted mt-2 max-w-xl">{campaign.description}</p>
        <div className="flex gap-6 mt-4 font-mono-num text-sm">
          <span>
            Budget: <span className="text-lime">${campaign.budget}</span>
          </span>
          <span>
            Rate:{" "}
            <span className="text-lime">
              ${campaign.pay_rate_per_100k}/100K
            </span>
          </span>
          <span>
            Min views:{" "}
            <span className="text-lime">{campaign.min_views}</span>
          </span>
        </div>
      </div>

      <h2 className="font-display font-semibold text-xl mb-4">Submissions</h2>

      {!submissions || submissions.length === 0 ? (
        <div className="border border-white/10 rounded-lg p-10 text-center">
          <p className="text-muted">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(submissions as (Submission & { profiles: { full_name: string } })[]).map(
            (s) => (
              <SubmissionRow key={s.id} submission={s} />
            )
          )}
        </div>
      )}
    </div>
  );
}
