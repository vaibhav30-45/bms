import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATS = [
  { value: 20, suffix: "M+", label: "Happy Customers", prefix: "" },
  { value: 16, suffix: "+", label: "Years of Banking", prefix: "" },
  { value: 1600, suffix: "+", label: "Branches Nationwide", prefix: "" },
  { value: 99.9, suffix: "%", label: "Uptime SLA", prefix: "" },
];

function CountUp({ target, prefix, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });
  const frameRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [inView, target, duration]);

  const display =
    target % 1 !== 0
      ? count.toFixed(1)
      : target >= 1000
        ? Math.round(count).toLocaleString("en-IN")
        : Math.round(count).toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="py-14 lg:py-20 bg-gradient-to-r from-[#1a3c5e] to-[#0f2033]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map(({ value, suffix, label, prefix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl lg:text-4xl font-black text-white mb-2">
                <CountUp target={value} prefix={prefix} suffix={suffix} />
              </p>
              <p className="text-sm font-medium text-blue-200/70">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
