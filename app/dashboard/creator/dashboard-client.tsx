"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, animate } from "framer-motion";
import { Megaphone, Film, Wallet, Clock } from "lucide-react";

function useCountUp(target: number, duration = 1.2) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        setValue(v);
      },
    });
    return () => controls.stop();
  }, [target, duration]);
  return value;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

type Submission = {
  id: string;
  video_url: string;
  status: string;
  campaigns: { title: string; campaign_type: string } | null;
};

export default function CreatorDashboardClient({
  firstName,
  totalEarnings,
  approvedCount,
  pendingCount,
  submissions,
}: {
  firstName: string;
  totalEarnings: number;
  approvedCount: number;
  pendingCount: number;
  submissions: Submission[];
}) {
  const earnedDisplay = useCountUp(totalEarnings);
  const approvedDisplay = useCountUp(approvedCount);
  const pendingDisplay = useCountUp(pendingCount);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display font-bold text-3xl md:text-5xl">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted mt-1">Track your clips and earnings.</p>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/dashboard/creator/wallet"
              className="border border-lime/40 text-lime font-display font-semibold text-sm px-4 py-2.5 rounded-md hover:bg-lime/10 transition text-center shrink-0 block"
            >
              Wallet
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/campaigns"
              className="bg-lime text-base font-display font-semibold text-sm px-4 py-2.5 rounded-md hover:brightness-95 transition text-center shrink-0 block"
            >
              Browse campaigns
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid grid-cols-3 gap-2 md:gap-4 mb-10"
      >
        <StatCard
          icon={<Wallet size={18} />}
          label="Total earned"
          value={`$${earnedDisplay.toFixed(2)}`}
        />
        <StatCard
          icon={<Film size={18} />}
          label="Approved clips"
          value={`${Math.round(approvedDisplay)}`}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Pending review"
          value={`${Math.round(pendingDisplay)}`}
        />
      </motion.div>

      <h2 className="font-display font-semibold text-xl mb-4">Your submissions</h2>

      {submissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-white/10 rounded-lg p-10 text-center"
        >
          <Megaphone className="mx-auto mb-3 text-muted" size={28} />
          <p className="text-muted">
            No submissions yet. Browse campaigns to get started.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-3"
        >
          {submissions.map((s) => (
            <motion.div
              key={s.id}
              variants={cardIn}
              whileHover={{ x: 4 }}
              className="border border-white/10 rounded-lg p-5 bg-surface flex items-center justify-between hover:border-lime/30 transition-colors"
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
                  {s.campaigns?.campaign_type}
                </span>
                <h3 className="font-display font-semibold">{s.campaigns?.title}</h3>
                <a
                  href={s.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime text-sm hover:underline"
                >
                  View submission
                </a>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  s.status === "approved"
                    ? "bg-lime/10 text-lime"
                    : s.status === "rejected"
                    ? "bg-red-400/10 text-red-400"
                    : "bg-violet/10 text-violet"
                }`}
              >
                {s.status}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      variants={cardIn}
      whileHover={{ y: -4, borderColor: "rgba(168,85,247,0.4)" }}
      className="border border-white/10 rounded-lg p-3 md:p-5 bg-surface overflow-hidden transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-violet">{icon}</span>
      </div>
      <div className="font-mono-num text-lg md:text-2xl text-lime truncate">
        {value}
      </div>
      <div className="text-muted text-xs md:text-sm mt-1 truncate">{label}</div>
    </motion.div>
  );
}
