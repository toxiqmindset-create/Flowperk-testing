import { createClient } from "@/lib/supabase/server";
import WalletClient from "./wallet-client";

export default async function WalletPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, campaigns(title)")
    .eq("creator_id", user!.id)
    .order("created_at", { ascending: false });

  const approved = (submissions ?? []).filter((s) => s.status === "approved");
  const balance = approved.reduce((sum, s) => sum + (s.earnings || 0), 0);

  const transactions = approved.map((s) => ({
    id: s.id,
    title: s.campaigns?.title ?? "Campaign",
    amount: s.earnings || 0,
    date: s.created_at,
  }));

  return <WalletClient balance={balance} transactions={transactions} />;
}
