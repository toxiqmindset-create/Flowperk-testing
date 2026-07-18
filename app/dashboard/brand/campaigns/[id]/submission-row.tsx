"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Submission } from "@/lib/types";

export default function SubmissionRow({
  submission,
}: {
  submission: Submission & { profiles: { full_name: string } };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: "approved" | "rejected") {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("submissions")
      .update({ status })
      .eq("id", submission.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="border border-white/10 rounded-lg p-5 bg-surface flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-display font-semibold">
            {submission.profiles?.full_name}
          </span>
          <span className="text-xs text-muted uppercase">
            {submission.platform}
          </span>
        </div>
        <a
          href={submission.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lime text-sm hover:underline truncate block"
        >
          {submission.video_url}
        </a>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded-full shrink-0 ${
          submission.status === "approved"
            ? "bg-lime/10 text-lime"
            : submission.status === "rejected"
            ? "bg-red-400/10 text-red-400"
            : "bg-violet/10 text-violet"
        }`}
      >
        {submission.status}
      </span>

      {submission.status === "pending" && (
        <div className="flex gap-2 shrink-0">
          <button
            disabled={loading}
            onClick={() => updateStatus("approved")}
            className="bg-lime text-base text-xs font-display font-semibold px-3 py-2 rounded-md hover:brightness-95 transition disabled:opacity-50"
          >
            Approve
          </button>
          <button
            disabled={loading}
            onClick={() => updateStatus("rejected")}
            className="border border-white/15 text-xs font-display font-semibold px-3 py-2 rounded-md hover:border-red-400/50 transition disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
