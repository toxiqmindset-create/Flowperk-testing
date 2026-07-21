"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-lime/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-violet/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
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
          className="font-display font-bold text-3xl mt-8 mb-8"
        >
          Welcome back
        </motion.h1>

        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="space-y-4 border border-white/10 rounded-2xl p-6 bg-surface/60 backdrop-blur"
        >
          <label className="block">
            <span className="text-sm text-muted mb-1.5 block">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-md px-4 py-2.5 text-ink focus:border-lime/50 outline-none transition"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted mb-1.5 block">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-md px-4 py-2.5 text-ink focus:border-lime/50 outline-none transition"
            />
          </label>

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
            {loading ? "Logging in…" : "Log in"}
          </motion.button>
        </motion.form>

        <motion.p variants={item} className="text-muted text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-lime hover:underline">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
