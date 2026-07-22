import { createClient } from "@/lib/supabase/server";
import CreatorDashboardClient from "./dashboard-client";

export default async function CreatorDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, campaigns(title, campaign_type)")
    .eq("creator_id", user!.id)
    .order("created_at", { ascending: false });

  const totalEarnings = (submissions ?? []).reduce(
    (sum, s) => sum + (s.earnings || 0),
    0
  );
  const approvedCount = (submissions ?? []).filter(
    (s) => s.status === "approved"
  ).length;
  const pendingCount = (submissions ?? []).filter(
    (s) => s.status === "pending"
  ).length;

  return (
    <CreatorDashboardClient
      firstName={profile?.full_name?.split(" ")[0] ?? "there"}
      totalEarnings={totalEarnings}
      approvedCount={approvedCount}
      pendingCount={pendingCount}
      submissions={submissions ?? []}
    />
  );
}
