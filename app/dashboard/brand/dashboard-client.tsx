"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, animate } from "framer-motion";
import { Megaphone, DollarSign, Clock, Rocket } from "lucide-react";
import type { Campaign } from "@/lib/types";

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

export default function BrandDashboardClient({
  firstName,
  campaigns,
  totalBudget,
  activeCount,
  pendingCount,
}: {
  firstName: string;
  campaigns: Campaign[];
  totalBudget: number;
  activeCount: number;
  pendingCount: number;
}) {
  const budgetDisplay = useCountUp(totalBudget);
  const activeDisplay = useCountUp(activeCount);
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
          <p className="text-muted mt-1">Manage your campaigns and creators.</p>
        </div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/dashboard/brand/new"
            className="bg-lime text-base font-display font-semibold text-sm px-4 py-2.5 rounded-md hover:brightness-95 transition text-center shrink-0 block"
          >
            + New campaign
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid grid-cols-3 gap-2 md:gap-4 mb-10"
      >
        <StatCard
          icon={<DollarSign size={18} />}
          label="Total budget"
          value={`$${budgetDisplay.toFixed(0)}`}
        />
        <StatCard
          icon={<Rocket size={18} />}
          label="Active campaigns"
          value={`${Math.round(activeDisplay)}`}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Awaiting review"
          value={`${Math.round(pendingDisplay)}`}
        />
      </motion.div>

      <h2 className="font-display font-semibold text-xl mb-4">Your campaigns</h2>

      {campaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-white/10 rounded-lg p-10 text-center"
        >
          <Megaphone className="mx-auto mb-3 text-muted" size={28} />
          <p className="text-muted">
            No campaigns yet. Launch your first one to start getting clips.
          </p>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-4">
          {campaigns.map((c) => (
            <motion.div key={c.id} variants={cardIn}>
              <Link
                href={`/dashboard/brand/campaigns/${c.id}`}
                className="border border-white/10 rounded-lg p-6 bg-surface flex items-center justify-between hover:border-lime/30 transition-colors block"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs uppercase tracking-widest text-violet font-display font-semibold">
                      {c.campaign_type}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === "active"
                          ? "bg-lime/10 text-lime"
                          : "bg-white/5 text-muted"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg">{c.title}</h3>
                </div>
                <div className="text-right font-mono-num">
                  <div className="text-lime">${c.budget}</div>
                  <div className="text-xs text-muted">
                    ${c.pay_rate_per_100k}/100K views
                  </div>
                </div>
              </Link>
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
