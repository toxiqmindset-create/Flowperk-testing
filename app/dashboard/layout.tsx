import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-display font-bold text-xl">
            flow<span className="text-lime">perk</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted">
              {profile?.full_name}{" "}
              <span className="text-lime capitalize">({profile?.role})</span>
            </span>
            <Link href="/campaigns" className="text-muted hover:text-ink transition">
              Browse
            </Link>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
