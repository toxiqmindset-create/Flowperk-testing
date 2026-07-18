"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = params.get("role") === "brand" ? "brand" : "creator";

  const [role, setRole] = useState<"brand" | "creator">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Go straight to the correct dashboard using the role picked in this form,
    // instead of re-querying the profile (avoids a race with the DB trigger
    // that creates the profile row, which was causing both roles to land
    // on the same dashboard).
    router.push(`/dashboard/${role}`);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display font-bold text-xl">
          flow<span className="text-lime">perk</span>
        </Link>
        <h1 className="font-display font-bold text-3xl mt-8 mb-2">
          Create your account
        </h1>
        <p className="text-muted text-sm mb-8">
          Choose how you want to use Flowperk.
        </p>

        <div className="flex gap-3 mb-8">
          <button
            type="button"
            onClick={() => setRole("creator")}
            className={`flex-1 border rounded-md py-3 font-display font-semibold text-sm transition ${
              role === "creator"
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/15 text-muted"
            }`}
          >
            I'm a creator
          </button>
          <button
            type="button"
            onClick={() => setRole("brand")}
            className={`flex-1 border rounded-md py-3 font-display font-semibold text-sm transition ${
              role === "brand"
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/15 text-muted"
            }`}
          >
            I'm a brand
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={setFullName}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />

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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-muted text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-lime hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-white/10 rounded-md px-4 py-2.5 text-ink focus:border-lime/50 outline-none transition"
      />
    </label>
  );
}
