"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-white/20">

            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
                    backgroundSize: "4rem 4rem"
                }}
            />

            {/* Ambient Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-900/0 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center px-4 text-center">

                {/* Glitchy 404 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="font-heading font-black text-[15vw] md:text-[12rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 font-heading font-black text-[15vw] md:text-[12rem] leading-none text-red-500/20 blur-sm animate-pulse tracking-tighter select-none pointer-events-none">
                        404
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-4 md:mt-8 space-y-2"
                >
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                        System Failure
                    </h2>
                    <p className="text-zinc-400 max-w-md mx-auto text-sm md:text-base">
                        The requested resource could not be located in the neural network.
                    </p>
                </motion.div>

                {/* Return Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-8 md:mt-12"
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Return to Base</span>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
