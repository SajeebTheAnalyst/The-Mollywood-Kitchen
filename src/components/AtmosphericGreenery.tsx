import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function AtmosphericGreenery() {
  const { scrollYProgress } = useScroll();

  // We map scroll progress to translateY values for parallax effect
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y5 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y6 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y7 = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const y8 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y9 = useTransform(scrollYProgress, [0, 1], [0, 350]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top Section Leaves */}
      <motion.div
        style={{ y: y1 }}
        animate={{ rotate: [10, 30, 10], x: [0, 15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] left-[2%] blur-[1px]"
      >
        <Leaf className="h-20 w-20" color="#16a34a" fill="#22c55e" strokeWidth={1} />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        animate={{ rotate: [-20, -50, -20], x: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[12%] right-[4%] drop-shadow-2xl"
      >
        <Leaf className="h-24 w-24" color="#15803d" fill="#16a34a" strokeWidth={1} />
      </motion.div>

      <motion.div
        style={{ y: y8 }}
        animate={{ rotate: [30, -10, 30], x: [0, 10, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[6%] blur-[2px]"
      >
        <Leaf className="h-28 w-28" color="#15803d" fill="#16a34a" strokeWidth={1.5} />
      </motion.div>

      {/* Mid Section Leaves */}
      <motion.div
        style={{ y: y3 }}
        animate={{ rotate: [45, 15, 45], x: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] right-[90%] blur-[1px]"
      >
        <Leaf className="h-16 w-16" color="#16a34a" fill="#22c55e" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        style={{ y: y4 }}
        animate={{ rotate: [0, 30, 0], x: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[48%] right-[3%] blur-[2px]"
      >
        <Leaf className="h-32 w-32" color="#14532d" fill="#15803d" strokeWidth={1} />
      </motion.div>

      <motion.div
        style={{ y: y9 }}
        animate={{ rotate: [-10, 20, -10], x: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[55%] left-[85%] blur-[1px]"
      >
        <Leaf className="h-24 w-24" color="#16a34a" fill="#22c55e" strokeWidth={1} />
      </motion.div>

      {/* Lower Mid Section Leaves */}
      <motion.div
        style={{ y: y5 }}
        animate={{ rotate: [-10, -40, -10], x: [0, 10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[68%] left-[2%]"
      >
        <Leaf className="h-16 w-16" color="#16a34a" fill="#22c55e" strokeWidth={1.2} />
      </motion.div>

      <motion.div
        style={{ y: y6 }}
        animate={{ rotate: [60, 20, 60], x: [0, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[78%] right-[4%] blur-[2px]"
      >
        <Leaf className="h-40 w-40" color="#15803d" fill="#16a34a" strokeWidth={1} />
      </motion.div>

      {/* Bottom Section Leaves */}
      <motion.div
        style={{ y: y7 }}
        animate={{ rotate: [-30, 10, -30], x: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[88%] left-[6%] blur-[1px]"
      >
        <Leaf className="h-20 w-20" color="#15803d" fill="#16a34a" strokeWidth={1.2} />
      </motion.div>
      
      <motion.div
        style={{ y: y1 }}
        animate={{ rotate: [10, -20, 10], x: [0, -15, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[95%] right-[5%] drop-shadow-xl"
      >
        <Leaf className="h-28 w-28" color="#16a34a" fill="#22c55e" strokeWidth={1} />
      </motion.div>

      {/* Extra floating bits */}
      <motion.div
        style={{ y: y5 }}
        animate={{ rotate: [-50, -20, -50], x: [0, -10, 0] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[28%] right-[85%] blur-[2px]"
      >
        <Leaf className="h-10 w-10" color="#16a34a" fill="#22c55e" strokeWidth={1} />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        animate={{ rotate: [30, 70, 30], x: [0, 15, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[85%] right-[85%] blur-[1px]"
      >
        <Leaf className="h-14 w-14" color="#15803d" fill="#16a34a" strokeWidth={1.5} />
      </motion.div>

    </div>
  );
}
