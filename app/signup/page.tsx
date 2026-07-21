"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
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

    router.push(`/dashboard/${role}`);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden py-12">
      <motion.div
        className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-violet/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-lime/20 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={item}>
          <Link href="/" className="font-display font-bold text-xl">
            flow<span className="text-lime">perk</span>
          </Link>
        </motion.div>
        <motion.h1
          variants={item}
          className="font-display font-bold text-3xl mt-8 mb-2"
        >
          Create your account
        </motion.h1>
        <motion.p variants={item} className="text-muted text-sm mb-8">
          Choose how you want to use Flowperk.
        </motion.p>

        <motion.div variants={item} className="flex gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setRole("creator")}
            className={`flex-1 border rounded-md py-3 font-display font-semibold text-sm transition ${
              role === "creator"
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/15 text-muted"
            }`}
          >
            I'm a creator
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setRole("brand")}
            className={`flex-1 border rounded-md py-3 font-display font-semibold text-sm transition ${
              role === "brand"
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/15 text-muted"
            }`}
          >
            I'm a brand
          </motion.button>
        </motion.div>

        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="space-y-4 border border-white/10 rounded-2xl p-6 bg-surface/60 backdrop-blur"
        >
          <Input label="Full name" value={fullName} onChange={setFullName} required />
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

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-lime text-base font-display font-semibold py-3 rounded-md hover:brightness-95 transition disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </motion.button>
        </motion.form>

        <motion.p variants={item} className="text-muted text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-lime hover:underline">
            Log in
          </Link>
        </motion.p>
      </motion.div>
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
