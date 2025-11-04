"use client"

import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number; // fine-tune if needed
  delay?: number;
};

/**
 * AnimatedCard
 * - subtle fade/slide on mount
 * - gentle scale on hover (motion-safe)
 */
export function AnimatedCard({ children, className = "", hoverScale = 1.02, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: "easeOut", delay }}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.995 }}
      // Respect reduced motion by disabling gestures in CSS (globals) and framer's reducedMotion config if desired
      className={`group ${className}`}
    >
      {children}
    </motion.div>
  );
}