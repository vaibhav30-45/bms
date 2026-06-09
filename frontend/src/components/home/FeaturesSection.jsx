import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  PiggyBank,
  CreditCard,
  TrendingUp,
  Home,
  Landmark,
  Umbrella,
  ArrowRight,
} from "lucide-react";

const PRODUCTS = [
  {
    Icon: PiggyBank,
    title: "Savings Account",
    desc: "Earn up to 4.5% p.a. interest with zero balance option. Open instantly with full digital KYC.",
    badge: "Up to 4.5% p.a.",
    badgeColor:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    iconColor:
      "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    cta: "Open Account",
  },
  {
    Icon: CreditCard,
    title: "Credit Cards",
    desc: "Travel, cashback and reward credit cards with zero joining fee and exclusive lifestyle privileges.",
    badge: "Zero Joining Fee",
    badgeColor:
      "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
    iconColor:
      "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
    cta: "Apply Now",
  },
  {
    Icon: TrendingUp,
    title: "Personal Loan",
    desc: "Instant personal loans up to ₹50 lakhs at competitive rates. Approval in as little as 4 hours.",
    badge: "From 10.5% p.a.",
    badgeColor:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    iconColor:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    cta: "Check Eligibility",
  },
  {
    Icon: Home,
    title: "Home Loan",
    desc: "Fulfil your dream of owning a home with flexible tenure up to 30 years and doorstep service.",
    badge: "From 8.5% p.a.",
    badgeColor:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    iconColor:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    cta: "Apply Now",
  },
  {
    Icon: Landmark,
    title: "Fixed Deposits",
    desc: "Lock in assured returns up to 7.5% p.a. with flexible tenures from 7 days to 10 years.",
    badge: "Up to 7.5% p.a.",
    badgeColor:
      "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    iconColor:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    cta: "Book FD",
  },
  {
    Icon: Umbrella,
    title: "Insurance",
    desc: "Comprehensive life, health and general insurance plans to protect you and your loved ones.",
    badge: "Comprehensive Cover",
    badgeColor:
      "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
    iconColor:
      "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
    cta: "Explore Plans",
  },
];

export default function FeaturesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      id="products"
      className="py-16 lg:py-24 bg-white dark:bg-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold
                           bg-[#1a3c5e]/8 text-[#1a3c5e] dark:bg-blue-400/10
                           dark:text-blue-400 uppercase tracking-widest mb-4"
          >
            Personal Banking
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black text-gray-900
                         dark:text-white tracking-tight mb-4"
          >
            Products built for you
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            From savings to credit cards, home loans to insurance — everything
            you need, all in one place.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map(
            ({ Icon, title, desc, badge, badgeColor, iconColor, cta }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-6 rounded-2xl border border-gray-100
                         dark:border-gray-800 bg-white dark:bg-gray-900
                         hover:shadow-xl hover:-translate-y-1 transition-all
                         duration-300 flex flex-col"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center
                               justify-center mb-4 ${iconColor}`}
                >
                  <Icon size={22} />
                </div>

                {/* Badge */}
                <span
                  className={`inline-block self-start px-2.5 py-0.5 rounded-full
                               text-[11px] font-bold mb-3 ${badgeColor}`}
                >
                  {badge}
                </span>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-5">
                  {desc}
                </p>

                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-1.5 text-sm font-semibold
                           text-[#1a3c5e] dark:text-blue-400
                           group-hover:gap-2.5 transition-all duration-200"
                >
                  {cta}
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </motion.div>
            ),
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm
                       font-semibold border-2 border-[#1a3c5e] text-[#1a3c5e]
                       dark:border-blue-400 dark:text-blue-400
                       hover:bg-[#1a3c5e] hover:text-white dark:hover:bg-blue-400
                       dark:hover:text-white transition-all duration-200"
          >
            View All Products
            <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
