import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const PERKS = [
  "Zero account opening fee",
  "KYC verified in 24 hours",
  "Instant fund transfers",
  "Dedicated relationship manager",
  "Exclusive credit card offers",
  "Highest FD rates guaranteed",
];

export default function CtaSection() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="py-14 sm:py-20 lg:py-24 bg-white dark:bg-gray-950"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="bg-gradient-to-br from-[#1a3c5e] to-[#0f2033]
                     rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-14
                     relative overflow-hidden text-center"
        >
          {/* Decorations */}
          <div
            className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64
                          rounded-full bg-blue-400/10 blur-3xl pointer-events-none"
          />
          <div
            className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64
                          rounded-full bg-amber-400/10 blur-3xl pointer-events-none"
          />

          <div className="relative">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold
                             bg-white/10 text-white/70 uppercase tracking-widest mb-5"
            >
              Get Started Today
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-black
                           text-white mb-3 sm:mb-4 tracking-tight"
            >
              Start banking smarter today
            </h2>
            <p className="text-blue-200/70 text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Join over 20 million customers who trust NexaBank for their
              everyday banking, savings, loans and investments.
            </p>

            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5
                            mb-8 sm:mb-10 max-w-lg mx-auto text-left"
            >
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-amber-400 flex-shrink-0"
                  />
                  <span className="text-sm text-blue-100/80 font-medium">
                    {perk}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm
                           font-bold bg-amber-400 text-gray-900 hover:bg-amber-300
                           transition-colors shadow-xl shadow-amber-500/25 w-full sm:w-auto"
              >
                Open Free Account
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm
                           font-semibold text-white hover:bg-white/10 transition-colors
                           w-full sm:w-auto"
              >
                Sign In to Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
