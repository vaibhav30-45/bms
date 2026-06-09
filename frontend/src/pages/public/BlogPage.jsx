import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  GraduationCap,
  BarChart2,
  Clock,
  ArrowRight,
  Search,
  Tag,
} from "lucide-react";

const CATEGORIES = [
  { label: "All", key: "all" },
  { label: "Financial Tips", key: "tips", Icon: TrendingUp },
  { label: "Education", key: "education", Icon: GraduationCap },
  { label: "Market Updates", key: "market", Icon: BarChart2 },
  { label: "Banking Guides", key: "guides", Icon: BookOpen },
];

const ARTICLES = [
  {
    id: 1,
    category: "education",
    categoryLabel: "Financial Education",
    title: "How to Build an Emergency Fund in 6 Months",
    excerpt:
      "An emergency fund is your financial safety net. Learn how to start small, automate your savings, and reach your goal faster with NexaBank's high-yield savings account.",
    author: "Priya Sharma",
    authorRole: "Senior Financial Advisor",
    date: "May 22, 2026",
    readTime: "5 min read",
    featured: true,
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    id: 2,
    category: "market",
    categoryLabel: "Market Updates",
    title: "RBI Holds Repo Rate at 6.25% — What It Means for Your Loans",
    excerpt:
      "The Reserve Bank of India kept the repo rate unchanged in its latest Monetary Policy Committee meeting. Here's how this decision impacts your existing home loans, personal loans, and FD returns.",
    author: "Rahul Mehta",
    authorRole: "Economic Analyst",
    date: "May 18, 2026",
    readTime: "4 min read",
    featured: false,
    color:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    id: 3,
    category: "guides",
    categoryLabel: "Banking Guide",
    title: "Fixed Deposit vs Recurring Deposit: Which Is Right for You?",
    excerpt:
      "Both FDs and RDs are safe investment options but serve different purposes. This guide breaks down the differences so you can make the right choice for your financial goals.",
    author: "Anjali Nair",
    authorRole: "Investment Specialist",
    date: "May 14, 2026",
    readTime: "6 min read",
    featured: false,
    color:
      "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    id: 4,
    category: "tips",
    categoryLabel: "Financial Tips",
    title: "5 Smart Ways to Use Your Credit Card Without Getting Into Debt",
    excerpt:
      "Credit cards can be powerful financial tools when used wisely. Discover how to maximise rewards, avoid interest charges, and keep your credit score healthy.",
    author: "Karan Bose",
    authorRole: "Personal Finance Coach",
    date: "May 10, 2026",
    readTime: "7 min read",
    featured: false,
    color: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  },
  {
    id: 5,
    category: "education",
    categoryLabel: "Financial Education",
    title: "Understanding KYC: Why It Matters and How to Complete It Fast",
    excerpt:
      "Know Your Customer (KYC) is a mandatory process for all banking customers in India. Learn what documents you need, how the process works, and how NexaBank makes it 100% digital.",
    author: "Sneha Iyer",
    authorRole: "Compliance Officer",
    date: "May 6, 2026",
    readTime: "4 min read",
    featured: false,
    color:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  {
    id: 6,
    category: "market",
    categoryLabel: "Market Updates",
    title: "NIFTY 50 Hits All-Time High — How Should You Invest Now?",
    excerpt:
      "With equity markets at record levels, many investors are wondering whether to stay invested or move to safety. Our experts share a balanced perspective on asset allocation in 2026.",
    author: "Vikram Joshi",
    authorRole: "Chief Investment Strategist",
    date: "Apr 30, 2026",
    readTime: "8 min read",
    featured: false,
    color: "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
  },
  {
    id: 7,
    category: "guides",
    categoryLabel: "Banking Guide",
    title: "NEFT vs IMPS vs RTGS: Which Transfer Method Should You Use?",
    excerpt:
      "All three are inter-bank transfer modes in India, but they differ in speed, limits, and availability. This quick guide explains when to use each method for maximum efficiency.",
    author: "Deepa Krishnan",
    authorRole: "Digital Banking Expert",
    date: "Apr 25, 2026",
    readTime: "5 min read",
    featured: false,
    color:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
  {
    id: 8,
    category: "tips",
    categoryLabel: "Financial Tips",
    title: "How to Save ₹1 Lakh in One Year on a Salaried Income",
    excerpt:
      "Saving ₹1 lakh in 12 months is achievable for most working professionals. Follow this step-by-step savings plan, automate your investments, and track your progress monthly.",
    author: "Arjun Patel",
    authorRole: "Financial Planner",
    date: "Apr 20, 2026",
    readTime: "6 min read",
    featured: false,
    color:
      "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  },
];

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);

  return (
    <>
      <Helmet>
        <title>Blog & Insights — NexaBank</title>
        <meta
          name="description"
          content="Financial education, market updates, banking guides and expert tips from NexaBank."
        />
      </Helmet>

      {/* Page header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold
                             bg-[#1a3c5e]/8 text-[#1a3c5e] dark:bg-blue-400/10
                             dark:text-blue-400 uppercase tracking-widest mb-3"
            >
              Knowledge Centre
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Blog & Insights
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl">
              Expert advice, market updates, and financial guides to help you
              make smarter money decisions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                    ${
                      activeCategory === key
                        ? "bg-[#1a3c5e] text-white shadow-sm"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#1a3c5e]/40 hover:text-[#1a3c5e]"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800
                           border border-gray-200 dark:border-gray-700 rounded-xl
                           outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                           text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen
                size={40}
                className="text-gray-300 dark:text-gray-600 mx-auto mb-3"
              />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No articles found.
              </p>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {featured && activeCategory === "all" && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                             dark:border-gray-700 p-6 lg:p-8 mb-6
                             hover:shadow-lg transition-shadow group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                       text-[11px] font-bold ${featured.color}`}
                        >
                          <Tag size={10} />
                          {featured.categoryLabel}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          Featured
                        </span>
                      </div>
                      <h2
                        className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white
                                     leading-tight mb-3 group-hover:text-[#1a3c5e]
                                     dark:group-hover:text-blue-400 transition-colors"
                      >
                        {featured.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 max-w-2xl">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full bg-[#1a3c5e]/10 dark:bg-blue-400/10
                                          flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-[#1a3c5e] dark:text-blue-400">
                              {featured.author[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {featured.author}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {featured.authorRole}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {featured.readTime}
                          </span>
                          <span>{featured.date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="mt-5 lg:mt-0 lg:self-center flex items-center gap-2 px-4 py-2.5
                                 rounded-xl text-sm font-semibold text-[#1a3c5e] dark:text-blue-400
                                 border border-[#1a3c5e]/20 dark:border-blue-400/20
                                 hover:bg-[#1a3c5e] hover:text-white dark:hover:bg-blue-400
                                 dark:hover:text-white transition-all whitespace-nowrap"
                    >
                      Read Article
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Article grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeCategory === "all" && !searchQuery
                  ? rest
                  : filtered
                ).map((article, i) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
                                 dark:border-gray-700 p-5 flex flex-col
                                 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1
                                     rounded-full text-[11px] font-bold mb-3 ${article.color}`}
                    >
                      <Tag size={10} />
                      {article.categoryLabel}
                    </span>

                    <h3
                      className="text-sm font-bold text-gray-900 dark:text-white leading-snug
                                     mb-2 group-hover:text-[#1a3c5e] dark:group-hover:text-blue-400
                                     transition-colors"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full bg-[#1a3c5e]/10 dark:bg-blue-400/10
                                          flex items-center justify-center"
                        >
                          <span className="text-[9px] font-bold text-[#1a3c5e] dark:text-blue-400">
                            {article.author[0]}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                          {article.author}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock size={10} />
                        {article.readTime}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 bg-gradient-to-br from-[#1a3c5e] to-[#0d2440] rounded-2xl
                       p-7 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center
                       justify-between gap-5"
          >
            <div>
              <h3 className="text-lg font-black text-white mb-1">
                Stay Financially Informed
              </h3>
              <p className="text-sm text-blue-200/70">
                Get the latest articles, tips, and market updates delivered to
                your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 sm:w-56 px-3.5 py-2.5 text-sm rounded-xl
                           bg-white/10 border border-white/20 text-white
                           placeholder:text-white/40 outline-none
                           focus:ring-2 focus:ring-amber-400/40"
              />
              <button
                className="px-4 py-2.5 rounded-xl text-sm font-bold
                           bg-amber-400 text-gray-900 hover:bg-amber-300
                           transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
