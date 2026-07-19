"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const shards = [
  { h: 40, delay: 0 },
  { h: 70, delay: 0.05 },
  { h: 55, delay: 0.1 },
  { h: 95, delay: 0.15 },
  { h: 75, delay: 0.2 },
  { h: 120, delay: 0.25 },
  { h: 100, delay: 0.3 },
  { h: 150, delay: 0.35 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Ambient glow blobs, slow drifting motion in the background */}
      <motion.div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-lime/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-violet/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6 relative z-10"
      >
        <span className="font-display font-bold text-xl tracking-tight">
          flow<span className="text-lime">perk</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <Link href="/campaigns" className="hover:text-ink transition">
            Browse campaigns
          </Link>
          <Link href="/login" className="hover:text-ink transition">
            Log in
          </Link>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/signup"
            className="bg-lime text-base font-display font-semibold text-sm px-4 py-2 rounded-md inline-block hover:brightness-95 transition"
          >
            Get started
          </Link>
        </motion.div>
      </motion.nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-5xl md:text-6xl leading-[1.05] tracking-tight"
          >
            Every clip
            <br />
            adds up to <span className="text-lime">income.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-muted text-lg max-w-md"
          >
            Brands fund campaigns. Creators turn content into clips, post
            them, and get paid per verified view. No followers required, no
            client hunting.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup?role=creator"
                className="bg-lime text-base font-display font-semibold px-6 py-3 rounded-md inline-block hover:brightness-95 transition"
              >
                Start clipping
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup?role=brand"
                className="border border-white/15 font-display font-semibold px-6 py-3 rounded-md inline-block hover:border-lime/50 transition"
              >
                Launch a campaign
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Signature: fragmented shards assemble on load, then idle-float forever */}
        <div className="flex items-end justify-center gap-2 h-64" aria-hidden="true">
          {shards.map((s, i) => (
            <motion.div
              key={i}
              className="w-6 md:w-8 rounded-sm"
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.5, delay: s.delay },
                scale: { duration: 0.5, delay: s.delay },
                y: {
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: s.delay + 0.6,
                },
              }}
              style={{
                height: `${s.h}px`,
                background:
                  i % 3 === 0 ? "#C4F135" : i % 3 === 1 ? "#7B61FF" : "#1A2036",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/5 bg-surface/50 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center"
        >
          <Stat label="Creators" value="Live" />
          <Stat label="Campaign types" value="Clipping + UGC" />
          <Stat label="Payout time" value="< 72 hrs" />
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="font-display font-bold text-3xl md:text-4xl mb-12"
        >
          From campaign to payout, three steps.
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-8"
        >
          <Step
            n="01"
            title="Find a campaign"
            body="Browse live campaigns with real budgets. Pick one that fits, join instantly."
          />
          <Step
            n="02"
            title="Post your clip"
            body="Clip the content, post it to TikTok, Reels, or Shorts, drop the link back in."
          />
          <Step
            n="03"
            title="Get paid"
            body="Once views clear the campaign minimum, payout is calculated automatically."
          />
        </motion.div>
      </section>

      {/* CHOOSE ROLE */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-6 relative z-10"
      >
        <RoleCard
          eyebrow="For brands"
          title="Turn your content into a paid distribution channel"
          points={[
            "Set your own budget and pay rate",
            "Review every clip before it counts",
            "Reach creators you'd never find manually",
          ]}
          cta="Launch a campaign"
          href="/signup?role=brand"
        />
        <RoleCard
          eyebrow="For creators"
          title="Stop clipping for free"
          points={[
            "No follower minimum to join",
            "Every approved view has a price tag",
            "Get paid without chasing anyone",
          ]}
          cta="Start earning"
          href="/signup?role=creator"
        />
      </motion.section>

      <footer className="border-t border-white/5 py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-sm text-muted flex justify-between">
          <span>© 2026 Flowperk</span>
          <span>Built for creators and brands, everywhere.</span>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div variants={fadeUp}>
      <div className="font-mono-num text-2xl text-lime">{value}</div>
      <div className="text-muted text-sm mt-1">{label}</div>
    </motion.div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, borderColor: "rgba(196,241,53,0.4)" }}
      className="border border-white/10 rounded-lg p-6 bg-surface transition-colors"
    >
      <div className="font-mono-num text-violet text-sm mb-4">{n}</div>
      <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

function RoleCard({
  eyebrow,
  title,
  points,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  points: string[];
  cta: string;
  href: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, borderColor: "rgba(196,241,53,0.4)" }}
      className="border border-white/10 rounded-lg p-8 bg-surface flex flex-col transition-colors"
    >
      <span className="text-lime text-xs uppercase tracking-widest font-display font-semibold">
        {eyebrow}
      </span>
      <h3 className="font-display font-bold text-2xl mt-3 mb-6">{title}</h3>
      <ul className="space-y-3 text-sm text-muted flex-1">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-lime">—</span>
            {p}
          </li>
        ))}
      </ul>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          href={href}
          className="mt-8 inline-block w-full bg-lime text-base font-display font-semibold text-center px-5 py-3 rounded-md hover:brightness-95 transition"
        >
          {cta}
        </Link>
      </motion.div>
    </motion.div>
  );
}
