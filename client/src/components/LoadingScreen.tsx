import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-midnight-navy"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      aria-hidden={!visible}
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-16 rounded-full bg-champagne/10 blur-3xl" />
        <motion.span
          className="font-display text-5xl md:text-6xl gold-text-gradient relative"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.15em' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          NB
        </motion.span>
        <motion.span
          className="relative mt-3 text-ivory/80 text-xs md:text-sm tracking-[0.5em] uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          Classic Scents
        </motion.span>
        <motion.div
          className="relative mt-6 h-px w-40 overflow-hidden bg-champagne/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-champagne to-transparent"
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
