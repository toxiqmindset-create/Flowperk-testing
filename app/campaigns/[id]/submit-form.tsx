"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SubmitClipForm({
  campaignId,
}: {
  campaignId: string;
}) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState<"tiktok" | "instagram" | "youtube">(
    "tiktok"
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("submissions").insert({
      campaign_id: campaignId,
      creator_id: user!.id,
      video_url: videoUrl,
      platform,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="border border-lime/30 bg-lime/5 rounded-lg p-6 text-center">
        <p className="text-lime font-display font-semibold">
          Submitted. The brand will review it soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 rounded-lg p-6 bg-surface space-y-4"
    >
      <h3 className="font-display font-semibold text-lg">Submit your clip</h3>

      <div className="flex gap-2">
        {(["tiktok", "instagram", "youtube"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`flex-1 border rounded-md py-2 text-sm capitalize transition ${
              platform === p
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/15 text-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-sm text-muted mb-1.5 block">
          Link to your posted clip
        </span>
        <input
          required
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://tiktok.com/@you/video/..."
          className="w-full bg-base border border-white/10 rounded-md px-4 py-2.5 text-ink focus:border-lime/50 outline-none transition"
        />
      </label>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-lime text-base font-display font-semibold py-3 rounded-md hover:brightness-95 transition disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit clip"}
      </button>
    </form>
  );
}
