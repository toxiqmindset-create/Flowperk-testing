import { createClient } from "@/lib/supabase/server";
import BrandDashboardClient from "./dashboard-client";

export default async function BrandDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: pendingSubs } = await supabase
    .from("submissions")
    .select("id, campaigns!inner(brand_id)")
    .eq("status", "pending")
    .eq("campaigns.brand_id", user!.id);

  const totalBudget = (campaigns ?? []).reduce((sum, c) => sum + c.budget, 0);
  const activeCount = (campaigns ?? []).filter(
    (c) => c.status === "active"
  ).length;

  return (
    <BrandDashboardClient
      firstName={profile?.full_name?.split(" ")[0] ?? "there"}
      campaigns={campaigns ?? []}
      totalBudget={totalBudget}
      activeCount={activeCount}
      pendingCount={(pendingSubs ?? []).length}
    />
  );
}
