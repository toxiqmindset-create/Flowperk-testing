"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

function useCountUp(target: number, duration = 1.4) {
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
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function WalletClient({
  balance,
  transactions,
}: {
  balance: number;
  transactions: { id: string; title: string; amount: number; date: string }[];
}) {
  const displayed = useCountUp(balance);
  const [withdrawClicked, setWithdrawClicked] = useState(false);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl md:text-5xl mb-8">Wallet</h1>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 mb-10"
        style={{
          background:
            "linear-gradient(135deg, #A855F7 0%, #7C3AED 45%, #F472B6 100%)",
        }}
      >
        <motion.div
          className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-black/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          <span className="text-white/70 text-sm font-display font-semibold uppercase tracking-widest">
            Available balance
          </span>
          <div className="font-mono-num text-5xl md:text-6xl font-bold text-white mt-3">
            ${displayed.toFixed(2)}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWithdrawClicked(true)}
              className="bg-white text-base font-display font-semibold px-6 py-3 rounded-md hover:brightness-95 transition"
              style={{ color: "#7C3AED" }}
            >
              Withdraw
            </motion.button>
            <motion.div
              initial={false}
              animate={
                withdrawClicked
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -10 }
              }
              className="flex items-center text-sm text-white/90"
            >
              {withdrawClicked && "Payouts launch soon — this campaign is manually tracked for now."}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <h2 className="font-display font-semibold text-xl mb-4">Transaction history</h2>

      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-white/10 rounded-lg p-10 text-center"
        >
          <p className="text-muted">
            No earnings yet. Get a clip approved to see it here.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-3"
        >
          {transactions.map((t) => (
            <motion.div
              key={t.id}
              variants={item}
              whileHover={{ x: 4 }}
              className="border border-white/10 rounded-lg p-5 bg-surface flex items-center justify-between transition-colors hover:border-lime/30"
            >
              <div>
                <h3 className="font-display font-semibold">{t.title}</h3>
                <p className="text-muted text-xs mt-1">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>
              <div className="font-mono-num text-lime text-lg">
                +${t.amount.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
