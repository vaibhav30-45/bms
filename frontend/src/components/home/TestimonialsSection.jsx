import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Savings Account Holder",
    city: "Mumbai",
    rating: 5,
    text: "Opening a savings account with NexaBank was incredibly smooth. The digital KYC was done in minutes and I started earning 4.5% interest from day one.",
    avatar: "PS",
    color: "bg-blue-500",
  },
  {
    name: "Rahul Verma",
    role: "Credit Card Customer",
    city: "Bengaluru",
    rating: 5,
    text: "The NexaBank Cashback+ credit card is amazing — zero joining fee and 5% cashback on all my online purchases. Best card I've ever had.",
    avatar: "RV",
    color: "bg-emerald-500",
  },
  {
    name: "Anita Patel",
    role: "Home Loan Customer",
    city: "Ahmedabad",
    rating: 5,
    text: "Got my home loan approved in just 48 hours with competitive rates. The entire process was transparent and the relationship manager was extremely helpful.",
    avatar: "AP",
    color: "bg-amber-500",
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50"
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
            Customer Stories
          </span>
          <h2
            className="text-3xl sm:text-4xl font-black text-gray-900
                         dark:text-white tracking-tight mb-4"
          >
            Trusted by millions across India
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Real customers, real experiences. Here's what they say about
            NexaBank.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(
            ({ name, role, city, rating, text, avatar, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border
                         border-gray-100 dark:border-gray-800 shadow-sm
                         hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <Quote
                  size={28}
                  className="text-[#1a3c5e]/20 dark:text-blue-400/20 mb-4"
                />

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-6">
                  "{text}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${color} flex items-center
                                 justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {role} · {city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
