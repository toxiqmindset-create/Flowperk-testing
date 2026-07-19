import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Submission } from "@/lib/types";

export default async function CreatorDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, campaigns(title, campaign_type)")
    .eq("creator_id", user!.id)
    .order("created_at", { ascending: false });

  const totalEarnings = (submissions ?? []).reduce(
    (sum, s) => sum + (s.earnings || 0),
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl md:text-5xl">Your submissions</h1>
        <Link
          href="/campaigns"
          className="bg-lime text-base font-display font-semibold text-sm px-4 py-2.5 rounded-md hover:brightness-95 transition"
        >
          Browse campaigns
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total earned" value={`$${totalEarnings.toFixed(2)}`} />
        <StatCard
          label="Approved clips"
          value={`${(submissions ?? []).filter((s) => s.status === "approved").length}`}
        />
        <StatCard
          label="Pending review"
          value={`${(submissions ?? []).filter((s) => s.status === "pending").length}`}
        />
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="border border-white/10 rounded-lg p-10 text-center">
          <p className="text-muted">
            No submissions yet. Browse campaigns to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(
            submissions as (Submission & {
              campaigns: { title: string; campaign_type: string };
            })[]
          ).map((s) => (
            <div
              key={s.id}
              className="border border-white/10 rounded-lg p-5 bg-surface flex items-center justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
                  {s.campaigns?.campaign_type}
                </span>
                <h3 className="font-display font-semibold">{s.campaigns?.title}</h3>
                <a
                  href={s.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime text-sm hover:underline"
                >
                  View submission
                </a>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  s.status === "approved"
                    ? "bg-lime/10 text-lime"
                    : s.status === "rejected"
                    ? "bg-red-400/10 text-red-400"
                    : "bg-violet/10 text-violet"
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 rounded-lg p-5 bg-surface">
      <div className="font-mono-num text-2xl text-lime">{value}</div>
      <div className="text-muted text-sm mt-1">{label}</div>
    </div>
  );
}
