import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    tag: "Savings Account",
    headline: "Earn Up to 4.5% Interest",
    subline: "on your Savings Account",
    body: "Zero balance option available. Open instantly with full digital KYC and start earning from day one.",
    cta: "Open Now",
    ctaPath: "/register",
    accent: "#1a3c5e",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          <div
            className="w-64 h-40 md:w-80 md:h-48 rounded-3xl
                          bg-gradient-to-br from-[#1a3c5e] to-[#0d2440]
                          border border-white/20 shadow-2xl p-6 flex flex-col
                          justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/50 text-xs">Account Balance</p>
                <p className="text-white text-2xl font-black mt-1">₹2,45,890</p>
              </div>
              <div
                className="w-10 h-10 rounded-xl bg-amber-400/20 flex
                              items-center justify-center"
              >
                <span className="text-amber-400 font-black text-lg">N</span>
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[10px] mb-1">Account Number</p>
              <p className="text-white/80 text-sm font-mono tracking-widest">
                •••• •••• 4521
              </p>
              <div className="flex justify-between mt-2">
                <p className="text-white/60 text-xs">SAVINGS</p>
                <p className="text-amber-400 text-xs font-bold">4.5% p.a.</p>
              </div>
            </div>
          </div>
          <div
            className="absolute -top-4 -right-6 bg-white rounded-2xl
                          shadow-xl p-3 border border-gray-100"
          >
            <p className="text-[10px] text-gray-400">Interest Earned</p>
            <p className="text-base font-black text-emerald-600">+₹11,065</p>
          </div>
          <div
            className="absolute -bottom-4 -left-6 bg-white rounded-2xl
                          shadow-xl p-3 border border-gray-100"
          >
            <p className="text-[10px] text-gray-400">KYC Status</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold text-emerald-600">Verified</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    tag: "Credit Cards",
    headline: "Enjoy Travel, Cashback",
    subline: "and Zero Joining Fee",
    body: "Apply for NexaBank Credit Cards and unlock exclusive rewards, airport lounge access, and zero annual fee benefits.",
    cta: "Apply Now",
    ctaPath: "/register",
    accent: "#1a3c5e",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute top-0 right-4 w-56 md:w-64 h-36 md:h-40 rounded-2xl
                          bg-gradient-to-br from-gray-800 to-gray-900
                          border border-white/10 shadow-xl rotate-6
                          flex flex-col justify-between p-5"
          >
            <div className="flex justify-between">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Platinum
              </p>
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded-full bg-amber-400/80" />
                <div className="w-5 h-5 rounded-full bg-amber-500/50 -ml-2" />
              </div>
            </div>
            <div>
              <p className="text-white/50 text-[9px]">₹3000 · 0 Joining Fee</p>
              <p className="text-white/80 text-xs font-mono tracking-widest mt-1">
                •••• •••• •••• 7823
              </p>
            </div>
          </div>
          <div
            className="relative top-8 w-56 md:w-64 h-36 md:h-40 rounded-2xl
                          bg-gradient-to-br from-[#1a3c5e] to-[#0d2440]
                          border border-blue-400/20 shadow-2xl -rotate-3
                          flex flex-col justify-between p-5"
          >
            <div className="flex justify-between">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                Cashback+
              </p>
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded-full bg-red-400/80" />
                <div className="w-5 h-5 rounded-full bg-red-600/50 -ml-2" />
              </div>
            </div>
            <div>
              <p className="text-amber-400 text-[9px] font-bold">
                ₹750 · 0 Joining Fee
              </p>
              <p className="text-white/80 text-xs font-mono tracking-widest mt-1">
                •••• •••• •••• 3412
              </p>
            </div>
          </div>
          <div
            className="absolute -bottom-2 -right-4 bg-white rounded-2xl
                          shadow-xl px-3 py-2 border border-gray-100"
          >
            <p className="text-[10px] text-gray-400">Cashback</p>
            <p className="text-sm font-black text-[#1a3c5e]">
              5% on all spends
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    tag: "Personal Loan",
    headline: "Get ₹50 Lakh Loan",
    subline: "in Just 4 Hours",
    body: "Instant approval for personal loans up to ₹50 lakhs. Competitive interest rates starting at 10.5% p.a. Minimal documentation.",
    cta: "Apply Now",
    ctaPath: "/register",
    accent: "#1a3c5e",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          <div
            className="w-56 md:w-64 bg-white rounded-3xl shadow-2xl p-6
                          border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl bg-[#1a3c5e] flex
                              items-center justify-center"
              >
                <span className="text-white font-black">N</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Personal Loan</p>
                <p className="text-[10px] text-gray-400">Approved ✓</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-1">Loan Amount</p>
            <p className="text-3xl font-black text-[#1a3c5e] mb-4">
              ₹10,00,000
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Rate of Interest</span>
                <span className="font-bold text-gray-900">10.5% p.a.</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Tenure</span>
                <span className="font-bold text-gray-900">60 Months</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">EMI</span>
                <span className="font-bold text-emerald-600">₹21,494/mo</span>
              </div>
            </div>
          </div>
          <div
            className="absolute -top-4 -right-4 bg-emerald-500 rounded-2xl
                          shadow-xl px-3 py-2"
          >
            <p className="text-white text-xs font-bold">Approved in</p>
            <p className="text-white text-lg font-black leading-none">4 hrs</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    tag: "Fixed Deposits",
    headline: "Lock in 7.5% Returns",
    subline: "with NexaBank Fixed Deposits",
    body: "Highest FD rates with flexible tenures from 7 days to 10 years. Guaranteed returns with full deposit insurance.",
    cta: "Book FD Now",
    ctaPath: "/register",
    accent: "#1a3c5e",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          <div
            className="w-56 md:w-64 bg-gradient-to-br from-amber-50 to-amber-100
                          rounded-3xl shadow-2xl p-6 border border-amber-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Fixed Deposit
                </p>
                <p className="text-2xl font-black text-[#1a3c5e] mt-1">
                  7.5% p.a.
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl bg-[#1a3c5e] flex
                              items-center justify-center"
              >
                <span className="text-amber-400 font-black">N</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Principal</span>
                <span className="font-bold text-gray-900">₹5,00,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Tenure</span>
                <span className="font-bold text-gray-900">2 Years</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Maturity Value</span>
                <span className="font-bold text-emerald-600">₹5,78,810</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200">
              <p className="text-[10px] text-gray-400">Interest Earned</p>
              <p className="text-lg font-black text-emerald-600">+₹78,810</p>
            </div>
          </div>
          <div
            className="absolute -bottom-4 -right-4 bg-[#1a3c5e] rounded-2xl
                          shadow-xl px-3 py-2"
          >
            <p className="text-white/70 text-[10px]">Deposit Insurance</p>
            <p className="text-white text-sm font-bold">₹5L Guaranteed</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br
                        from-[#f0f4f8] via-white to-[#e8eef5]
                        dark:from-[#0f2033] dark:via-[#1a3c5e] dark:to-[#0f2033]
                        min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]"
    >
      {/* Light mode subtle bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                        bg-[#1a3c5e]/5 blur-3xl dark:bg-blue-400/10"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full
                        bg-amber-400/8 blur-3xl dark:bg-amber-400/10"
        />
      </div>

      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                      py-12 sm:py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[340px]">
          {/* Left: Text content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id + "-text"}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <span
                className="inline-block px-3.5 py-1.5 rounded-full text-xs
                               font-bold bg-[#1a3c5e]/10 dark:bg-white/10
                               text-[#1a3c5e] dark:text-white/80 uppercase
                               tracking-widest mb-4"
              >
                {slide.tag}
              </span>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black
                             text-[#1a3c5e] dark:text-white leading-tight
                             tracking-tight mb-2"
              >
                {slide.headline}
              </h1>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-black
                             text-gray-600 dark:text-blue-200/80 leading-tight mb-4"
              >
                {slide.subline}
              </h2>

              <p
                className="text-sm sm:text-base text-gray-500 dark:text-blue-100/70
                            leading-relaxed mb-7 max-w-md"
              >
                {slide.body}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(slide.ctaPath)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm
                             font-bold bg-[#1a3c5e] text-white hover:bg-[#15304d]
                             transition-colors shadow-lg shadow-[#1a3c5e]/25"
                >
                  {slide.cta}
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm
                             font-semibold border-2 border-[#1a3c5e] text-[#1a3c5e]
                             dark:border-blue-300 dark:text-blue-300
                             hover:bg-[#1a3c5e]/6 dark:hover:bg-white/10 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Visual */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id + "-visual"}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="hidden lg:block relative h-72"
            >
              {slide.visual}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 lg:mt-10">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`transition-all duration-300 rounded-full
                  ${
                    i === current
                      ? "w-8 h-2.5 bg-[#1a3c5e] dark:bg-blue-400"
                      : "w-2.5 h-2.5 bg-gray-300 dark:bg-white/30 hover:bg-gray-400"
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-xl border border-[#1a3c5e]/20 dark:border-white/20
                         flex items-center justify-center text-[#1a3c5e] dark:text-white
                         hover:bg-[#1a3c5e]/8 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-xl border border-[#1a3c5e]/20 dark:border-white/20
                         flex items-center justify-center text-[#1a3c5e] dark:text-white
                         hover:bg-[#1a3c5e]/8 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-6 sm:h-8 fill-white dark:fill-gray-950"
        >
          <path d="M0,40 C360,0 1080,40 1440,0 L1440,40 Z" />
        </svg>
      </div>
    </section>
  );
}
