"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const RoiCalculator = () => {
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(50);
  
  // Weekly cost = hours * rate
  // Yearly cost = hours * rate * 52
  // Automation cost (projected) = 20% of manual cost (arbitrary estimate for calc)
  // Savings = Yearly Cost - Automation Cost
  
  const yearlyCost = hours * rate * 52;
  const projectedSavings = Math.floor(yearlyCost * 0.8);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-10 backdrop-blur-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Calculate Your ROI
          </h2>
          <p className="text-zinc-400 mt-2">
            See how much you could save annually by automating repetitive tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <label className="text-zinc-300">Manual Hours / Week</label>
                <span className="text-indigo-400 font-bold">{hours} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <label className="text-zinc-300">Hourly Cost ($)</label>
                <span className="text-indigo-400 font-bold">${rate}/hr</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-center">
            <div className="text-sm text-zinc-400 mb-2">Potential Annual Savings</div>
            <motion.div
              key={projectedSavings}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-white mb-4"
            >
              ${projectedSavings.toLocaleString()}
            </motion.div>
            <div className="text-xs text-zinc-500 mb-6">
              Based on 80% efficiency gain
            </div>
            <Button className="w-full bg-white text-indigo-950 hover:bg-zinc-200">
              Start Saving Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
