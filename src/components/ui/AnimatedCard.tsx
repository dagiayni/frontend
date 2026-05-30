"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: any;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  as: Component = "div" 
}: AnimatedCardProps) {
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.3, delay, ease: [0.4, 0.0, 0.2, 1] }}
      className={`bg-white border border-brand-light rounded-[10px] p-5 shadow-[0_1px_4px_rgba(128,0,32,0.06)] ${className}`}
    >
      {children}
    </MotionComponent>
  );
}
