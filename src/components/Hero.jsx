import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));

export default function Hero() {
  const scrollToSection = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.3) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(249,115,22,0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.2) 0%, transparent 60%)
              `,
            }}
          />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 text-sm text-primary font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Keep Fit & Gain Skills
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-none mb-6"
        >
          <span className="block text-white">FORGE YOUR</span>
          <span className="block text-gradient">STRENGTH</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transform your body. Elevate your mind. Join thousands who chose
          excellence over ordinary.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn-primary text-lg px-10 py-4"
          >
            Join Now
          </button>
          <button
            onClick={() => scrollToSection('#gallery')}
            className="btn-outline text-lg px-10 py-4"
          >
            View Gallery
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {[
            { value: '2500+', label: 'Members' },
            { value: '50+', label: 'Trainers' },
            { value: '10+', label: 'Years' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl py-4 px-3">
              <div className="font-display text-2xl font-bold text-primary">
                {s.value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10 bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
