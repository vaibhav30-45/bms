import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  PiggyBank,
  Building2,
  ShieldCheck,
  FileText,
  UserCheck,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  BarChart3,
  Lock,
  BadgeCheck,
  Star,
} from "lucide-react";

const SERVICES = [
  {
    id: "savings",
    Icon: PiggyBank,
    title: "Savings Account",
    tagline: "Grow your money, effortlessly",
    color: "bg-blue-500",
    lightBg: "bg-blue-50 dark:bg-blue-900/20",
    badge: "Most Popular",
    badgeColor:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
    features: [
      "Up to 4.5% annual interest rate",
      "Zero minimum balance requirement",
      "Up to 2 savings accounts allowed",
      "Daily transaction limits with auto-renewal",
      "Per-withdrawal limit controls",
      "Last interest credit date tracking",
    ],
    highlight: "4.5% p.a.",
    highlightLabel: "Interest Rate",
  },
  {
    id: "current",
    Icon: Building2,
    title: "Current Account",
    tagline: "Built for business, built for scale",
    color: "bg-amber-500",
    lightBg: "bg-amber-50 dark:bg-amber-900/20",
    badge: "Business",
    badgeColor:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
    features: [
      "Overdraft facility up to approved limit",
      "High-volume transaction support",
      "Monthly service fee structure",
      "Up to 2 current accounts allowed",
      "Real-time overdraft tracking",
      "Competitive overdraft interest rates",
    ],
    highlight: "OD Ready",
    highlightLabel: "Overdraft Facility",
  },
  {
    id: "deposit",
    Icon: TrendingUp,
    title: "Cash Deposit",
    tagline: "Book your slot, skip the queue",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
    badge: "Slot Based",
    badgeColor:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    features: [
      "Book 15-minute branch appointment online",
      "Choose preferred date and time slot",
      "Get instant token confirmation",
      "28 slots available per branch per day",
      "Monday to Saturday 10 AM – 5 PM",
      "Zero waiting time at the counter",
    ],
    highlight: "28/day",
    highlightLabel: "Slots Available",
  },
  {
    id: "withdraw",
    Icon: TrendingDown,
    title: "Cash Withdrawal",
    tagline: "Money when you need it, on your terms",
    color: "bg-red-500",
    lightBg: "bg-red-50 dark:bg-red-900/20",
    badge: "Slot Based",
    badgeColor: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
    features: [
      "Branch slot booking for cash withdrawal",
      "Money deducted only at counter",
      "No surprise deductions before visit",
      "Select branch, date and preferred time",
      "Valid government ID required",
      "Slot confirmation token via app",
    ],
    highlight: "Safe",
    highlightLabel: "No Pre-Deduction",
  },
];

const BRANCH_FEATURES = [
  {
    Icon: Clock,
    title: "Branch Hours",
    desc: "Monday to Saturday, 10:00 AM to 5:00 PM",
  },
  {
    Icon: MapPin,
    title: "10+ Cities",
    desc: "Mumbai, Delhi, Hyderabad, Bengaluru and more",
  },
  {
    Icon: Calendar,
    title: "Slot System",
    desc: "28 fifteen-minute slots per branch per day",
  },
  {
    Icon: BadgeCheck,
    title: "Zero Queue",
    desc: "Walk in at your slot time, straight to the counter",
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });
  const [branchRef, branchInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>

      {/* ── Hero ── */}
      <section
        className="bg-gradient-to-br from-[#0a1929]
                          via-[#0f2033] to-[#1a3c5e]
                          py-20 sm:py-28 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                 linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)
               `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full
                        bg-blue-600/10 blur-3xl pointer-events-none"
        />

        <div
          className="relative max-w-4xl mx-auto px-4 sm:px-6
                        lg:px-8 text-center"
          ref={heroRef}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full
                             text-xs font-bold bg-white/10
                             text-white/70 uppercase tracking-widest
                             mb-5 backdrop-blur-sm"
            >
              Our Services
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black
                           text-white mb-5 leading-tight"
            >
              Everything you need,
              <span
                className="block text-transparent bg-clip-text
                               bg-gradient-to-r from-amber-400
                               to-amber-200"
              >
                under one roof.
              </span>
            </h1>
            <p
              className="text-blue-100/70 text-base sm:text-lg
                          max-w-2xl mx-auto mb-8"
            >
              From opening your first account to managing daily transactions —
              NexaBank gives you every banking tool you need, all in one secure
              platform.
            </p>
            <div
              className="flex flex-wrap items-center justify-center
                            gap-4 sm:gap-8"
            >
              {[
                { v: "6", l: "Core Services" },
                { v: "10+", l: "Cities" },
                { v: "24×7", l: "Support" },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-black text-white">{v}</p>
                  <p className="text-white/50 text-xs font-medium">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-8 sm:h-12
                          fill-white dark:fill-gray-950"
          >
            <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Service cards ── */}
      <section
        className="py-14 sm:py-20 bg-white dark:bg-gray-950"
        ref={cardRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-900
                           dark:text-white mb-3"
            >
              All Services
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Click any service to learn more and get started.
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {SERVICES.map(
              (
                {
                  Icon,
                  title,
                  tagline,
                  color,
                  lightBg,
                  badge,
                  badgeColor,
                  features,
                  highlight,
                  highlightLabel,
                },
                i,
              ) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={cardInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl
                           border border-gray-100 dark:border-gray-800
                           overflow-hidden hover:shadow-xl
                           transition-all duration-300
                           hover:-translate-y-1 flex flex-col group"
                >
                  {/* Card header */}
                  <div className="p-5 sm:p-6">
                    <div
                      className="flex items-start justify-between
                                  mb-4"
                    >
                      <div
                        className={`w-12 h-12 ${color} rounded-2xl
                                     flex items-center justify-center
                                     shadow-lg`}
                      >
                        <Icon size={22} className="text-white" />
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[11px]
                                      font-bold ${badgeColor}`}
                      >
                        {badge}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-black text-gray-900
                                 dark:text-white mb-1"
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400
                                mb-4"
                    >
                      {tagline}
                    </p>

                    {/* Highlight stat */}
                    <div
                      className={`inline-flex items-center gap-2 px-3
                                   py-2 rounded-xl ${lightBg} mb-4`}
                    >
                      <span
                        className="text-base font-black text-gray-900
                                     dark:text-white"
                      >
                        {highlight}
                      </span>
                      <span
                        className="text-xs text-gray-500
                                     dark:text-gray-400"
                      >
                        {highlightLabel}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <CheckCircle2
                            size={14}
                            className="text-emerald-500 flex-shrink-0
                                     mt-0.5"
                          />
                          <span
                            className="text-sm text-gray-600
                                         dark:text-gray-400"
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA footer */}
                  <div className="mt-auto px-5 sm:px-6 pb-5 sm:pb-6">
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full flex items-center justify-center
                               gap-2 py-3 rounded-xl border-2
                               border-gray-100 dark:border-gray-800
                               text-sm font-bold text-gray-700
                               dark:text-gray-300
                               group-hover:border-[#1a3c5e]
                               group-hover:text-[#1a3c5e]
                               dark:group-hover:border-blue-400
                               dark:group-hover:text-blue-400
                               transition-all duration-200"
                    >
                      Get Started
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Branch slot system ── */}
      <section
        className="py-14 sm:py-20
                          bg-gray-50 dark:bg-gray-900/50"
        ref={branchRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid lg:grid-cols-2 gap-10 lg:gap-16
                          items-center"
          >
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={branchInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full
                               text-xs font-bold bg-emerald-50
                               dark:bg-emerald-900/20 text-emerald-600
                               dark:text-emerald-400 uppercase
                               tracking-widest mb-5"
              >
                Branch Slot System
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black
                             text-gray-900 dark:text-white mb-5"
              >
                No more waiting in
                <span className="text-[#1a3c5e] dark:text-blue-400">
                  {" "}
                  long queues.
                </span>
              </h2>
              <p
                className="text-gray-500 dark:text-gray-400
                            leading-relaxed mb-6"
              >
                NexaBank's branch appointment system lets you book a 15-minute
                slot for cash deposits and withdrawals from your phone. Walk in
                at your time, straight to the counter — zero waiting.
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {[
                  "Book from app — no phone calls needed",
                  "Choose your branch, date and time",
                  "Get instant token confirmation",
                  "Teller ready when you arrive",
                ].map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full bg-emerald-100
                                    dark:bg-emerald-900/30 flex items-center
                                    justify-center flex-shrink-0"
                    >
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <span
                      className="text-sm text-gray-700
                                     dark:text-gray-300 font-medium"
                    >
                      {p}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 px-6 py-3.5
                           rounded-xl bg-[#1a3c5e] hover:bg-[#15304d]
                           text-white font-black text-sm transition-all
                           shadow-lg shadow-[#1a3c5e]/20"
              >
                Book a Slot
                <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Right — feature grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={branchInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {BRANCH_FEATURES.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white dark:bg-gray-900 rounded-2xl
                                p-5 border border-gray-100
                                dark:border-gray-800 hover:shadow-md
                                transition-shadow"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-[#1a3c5e]/8
                                  dark:bg-blue-400/10 flex items-center
                                  justify-center mb-3"
                  >
                    <Icon
                      size={18}
                      className="text-[#1a3c5e] dark:text-blue-400"
                    />
                  </div>
                  <p
                    className="text-sm font-black text-gray-900
                                dark:text-white mb-1"
                  >
                    {title}
                  </p>
                  <p
                    className="text-xs text-gray-500 dark:text-gray-400
                                leading-snug"
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 sm:py-20 bg-white dark:bg-gray-950">
        <div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8
                        text-center"
        >
          <h2
            className="text-2xl sm:text-3xl font-black text-gray-900
                         dark:text-white mb-4"
          >
            Ready to get started?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Open your account in minutes. No paperwork, no branch visits
            required for signup.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center
                          justify-center gap-3"
          >
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 px-8 py-4 rounded-xl
                         bg-[#1a3c5e] hover:bg-[#15304d] text-white
                         font-black text-sm transition-all shadow-lg
                         shadow-[#1a3c5e]/20 w-full sm:w-auto
                         justify-center"
            >
              Open Free Account
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-8 py-4 rounded-xl
                         border border-gray-200 dark:border-gray-700
                         text-gray-700 dark:text-gray-300 font-bold
                         text-sm hover:bg-gray-50
                         dark:hover:bg-gray-800 transition-all
                         w-full sm:w-auto justify-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
