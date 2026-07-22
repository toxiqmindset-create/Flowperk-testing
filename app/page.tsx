"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(168,85,247,0.15), transparent 70%)`
  );

  return (
    <main
      onMouseMove={handleMouseMove}
      className="min-h-screen overflow-hidden relative"
    >
      {/* Mouse-follow spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotlightBg }}
      />

      {/* Floating purple/pink bubbles drifting in the background */}
      <motion.div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-lime/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-violet/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-lime/10 blur-2xl"
        animate={{ x: [0, 25, 0], y: [0, -35, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-violet/15 blur-2xl"
        animate={{ x: [0, -20, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-10 right-1/3 w-40 h-40 rounded-full bg-lime/15 blur-xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
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
        <MagneticButton href="/signup" primary small>
          Get started
        </MagneticButton>
      </motion.nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.h1
            variants={fadeUp}
            className="font-display font-bold text-5xl md:text-6xl leading-[1.05] tracking-tight"
          >
            Every clip
            <br />
            adds up to <ShimmerText>income.</ShimmerText>
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
            <MagneticButton href="/signup?role=creator" primary>
              Start clipping
            </MagneticButton>
            <MagneticButton href="/signup?role=brand">
              Launch a campaign
            </MagneticButton>
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
                  i % 3 === 0 ? "#A855F7" : i % 3 === 1 ? "#F472B6" : "#251640",
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
          <TiltCard n="01" title="Find a campaign" body="Browse live campaigns with real budgets. Pick one that fits, join instantly." />
          <TiltCard n="02" title="Post your clip" body="Clip the content, post it to TikTok, Reels, or Shorts, drop the link back in." />
          <TiltCard n="03" title="Get paid" body="Once views clear the campaign minimum, payout is calculated automatically." />
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

/* Shimmering animated gradient text */
function ShimmerText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="bg-clip-text text-transparent inline-block"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #A855F7, #F472B6, #A855F7, #F472B6)",
        backgroundSize: "300% 100%",
      }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* Button that subtly follows the cursor within its bounds (magnetic effect) */
function MagneticButton({
  href,
  children,
  primary,
  small,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  small?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.3);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`font-display font-semibold rounded-md inline-block transition ${
          primary
            ? "bg-lime text-base hover:brightness-95"
            : "border border-white/15 hover:border-lime/50"
        } ${small ? "text-sm px-4 py-2" : "px-6 py-3"}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

/* Card with real 3D tilt that follows the mouse */
function TiltCard({ n, title, body }: { n: string; title: string; body: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springRY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  }
  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      variants={fadeUp}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformPerspective: 800,
      }}
      whileHover={{ borderColor: "rgba(168,85,247,0.5)", scale: 1.02 }}
      className="border border-white/10 rounded-lg p-6 bg-surface transition-colors"
    >
      <div className="font-mono-num text-violet text-sm mb-4">{n}</div>
      <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{body}</p>
    </motion.div>
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
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springRY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current!.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(-py * 8);
  }
  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      variants={fadeUp}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springRX,
        rotateY: springRY,
        transformPerspective: 1000,
      }}
      whileHover={{ borderColor: "rgba(168,85,247,0.5)" }}
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
