"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState<"clipping" | "ugc">(
    "clipping"
  );
  const [budget, setBudget] = useState("");
  const [payRate, setPayRate] = useState("");
  const [minViews, setMinViews] = useState("10000");
  const [requirements, setRequirements] = useState("");
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

    const { data, error: insertError } = await supabase
      .from("campaigns")
      .insert({
        brand_id: user!.id,
        title,
        description,
        campaign_type: campaignType,
        budget: parseFloat(budget),
        pay_rate_per_100k: parseFloat(payRate),
        min_views: parseInt(minViews),
        requirements,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/dashboard/brand/campaigns/${data.id}`);
  }

  return (
    <div className="max-w-xl lg:max-w-2xl">
      <h1 className="font-display font-bold text-3xl md:text-5xl mb-8">
        Launch a campaign
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-3">
          {(["clipping", "ugc"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCampaignType(t)}
              className={`flex-1 border rounded-md py-3 font-display font-semibold text-sm capitalize transition ${
                campaignType === t
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-white/15 text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Field label="Campaign title">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Clip our podcast into shorts"
            className="input"
          />
        </Field>

        <Field label="Description">
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What should creators know about the content and brand?"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Total budget (USD)">
            <input
              required
              type="number"
              min="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="1000"
              className="input"
            />
          </Field>
          <Field label="Pay rate per 100K views (USD)">
            <input
              required
              type="number"
              min="1"
              value={payRate}
              onChange={(e) => setPayRate(e.target.value)}
              placeholder="200"
              className="input"
            />
          </Field>
        </div>

        <Field label="Minimum views to qualify for payout">
          <input
            required
            type="number"
            min="0"
            value={minViews}
            onChange={(e) => setMinViews(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Requirements (optional)">
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={3}
            placeholder="e.g. Minimum 20 seconds, include our logo watermark"
            className="input"
          />
        </Field>

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
          {loading ? "Launching…" : "Launch campaign"}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          background: #1B1029;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 10px 16px;
          color: #F5F0FA;
          outline: none;
        }
        .input:focus { border-color: rgba(168,85,247,0.5); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
