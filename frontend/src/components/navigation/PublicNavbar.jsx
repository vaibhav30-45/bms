import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Building2,
  ChevronDown,
  Search,
  PiggyBank,
  CreditCard,
  Landmark,
  TrendingUp,
  Home,
  Umbrella,
  Info,
  Award,
  Briefcase,
  BookOpen,
  Calculator,
  HelpCircle,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  GraduationCap,
  BarChart2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const NAV_ITEMS = [
  {
    label: "Personal",
    key: "personal",
    children: [
      {
        group: "Accounts",
        items: [
          { Icon: PiggyBank, label: "Savings Account", to: "/services" },
          { Icon: Building2, label: "Current Account", to: "/services" },
          { Icon: Landmark, label: "Fixed Deposits", to: "/services" },
        ],
      },
      {
        group: "Loans",
        items: [
          { Icon: Home, label: "Home Loan", to: "/services" },
          { Icon: TrendingUp, label: "Personal Loan", to: "/services" },
        ],
      },
      {
        group: "Cards & More",
        items: [
          { Icon: CreditCard, label: "Credit Cards", to: "/services" },
          { Icon: Umbrella, label: "Insurance", to: "/services" },
        ],
      },
    ],
  },
  {
    label: "About Us",
    key: "about",
    children: [
      {
        group: "Company",
        items: [
          { Icon: Info, label: "About NexaBank", to: "/about" },
          { Icon: Award, label: "Awards & Recognition", to: "/about" },
          { Icon: Briefcase, label: "Careers", to: "/about" },
        ],
      },
    ],
  },
  {
    label: "Learn",
    key: "learn",
    children: [
      {
        group: "Resources",
        items: [
          {
            Icon: GraduationCap,
            label: "Financial Education",
            to: "/blogs",
          },
          { Icon: BookOpen, label: "Blog & Insights", to: "/blogs" },
          { Icon: Calculator, label: "Calculators", to: "/blogs" },
          { Icon: BarChart2, label: "Market Updates", to: "/blogs" },
        ],
      },
    ],
  },
  {
    label: "Help",
    key: "help",
    children: [
      {
        group: "Support",
        items: [
          { Icon: Phone, label: "Contact Us", to: "/contact" },
          { Icon: MapPin, label: "Locate Branch / ATM", to: "/contact" },
          { Icon: AlertTriangle, label: "Report Fraud", to: "/contact" },
          { Icon: FileText, label: "Grievance Redressal", to: "/contact" },
          { Icon: HelpCircle, label: "FAQs", to: "/contact" },
        ],
      },
    ],
  },
];

function DropdownMenu({ item, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50
                 bg-white dark:bg-gray-900 border border-gray-100
                 dark:border-gray-800 rounded-2xl shadow-2xl shadow-black/10
                 p-5 min-w-[220px]"
    >
      {item.children.map((group) => (
        <div key={group.group} className="mb-4 last:mb-0">
          <p
            className="text-[10px] font-bold uppercase tracking-widest
                        text-gray-400 dark:text-gray-500 mb-2 px-1"
          >
            {group.group}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={onClose}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl
                           text-sm font-medium text-gray-700 dark:text-gray-300
                           hover:bg-[#1a3c5e]/6 hover:text-[#1a3c5e]
                           dark:hover:bg-blue-400/10 dark:hover:text-blue-400
                           transition-colors group"
              >
                <Icon
                  size={15}
                  className="text-[#1a3c5e] dark:text-blue-400
                                           group-hover:scale-110 transition-transform
                                           flex-shrink-0"
                />
                {label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDashboard = () => {
    if (!auth) {
      navigate("/login");
      return;
    }
    navigate(
      auth.role === ROLES.ADMIN ? "/admin/dashboard" : "/user/dashboard",
    );
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-40 w-full transition-all duration-300
        ${
          scrolled
            ? "bg-white/97 dark:bg-gray-950/97 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-800"
            : "bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div
              className="w-9 h-9 rounded-xl bg-[#1a3c5e] flex items-center
                            justify-center shadow-md group-hover:bg-[#15304d] transition-colors"
            >
              <Building2 size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-black text-[#1a3c5e] dark:text-white tracking-tight">
                NexaBank
              </span>
              <span
                className="text-[9px] font-medium text-gray-400 dark:text-gray-500
                               tracking-widest uppercase"
              >
                Management System
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.key} className="relative">
                <button
                  onMouseEnter={() => setOpenDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.key ? null : item.key)
                  }
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm
                              font-semibold transition-all duration-200 whitespace-nowrap
                              ${
                                openDropdown === item.key
                                  ? "text-[#1a3c5e] dark:text-blue-400 bg-[#1a3c5e]/8 dark:bg-blue-400/10"
                                  : "text-gray-700 dark:text-gray-300 hover:text-[#1a3c5e] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${openDropdown === item.key ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  onMouseEnter={() => setOpenDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <AnimatePresence>
                    {openDropdown === item.key && (
                      <DropdownMenu
                        item={item}
                        onClose={() => setOpenDropdown(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                 ${
                   isActive
                     ? "text-[#1a3c5e] dark:text-blue-400 bg-[#1a3c5e]/8"
                     : "text-gray-700 dark:text-gray-300 hover:text-[#1a3c5e] hover:bg-gray-100 dark:hover:bg-gray-800"
                 }`
              }
            >
              Services
            </NavLink>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100
                           dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white
                               dark:bg-gray-900 border border-gray-100
                               dark:border-gray-800 rounded-2xl shadow-2xl p-3"
                  >
                    <input
                      autoFocus
                      placeholder="Search products, services…"
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800
                                 border border-gray-200 dark:border-gray-700 rounded-xl
                                 outline-none focus:ring-2 focus:ring-[#1a3c5e]/30
                                 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {auth ? (
              <button
                onClick={handleDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                           font-semibold bg-[#1a3c5e] text-white hover:bg-[#15304d]
                           transition-colors shadow-sm"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                             font-semibold border border-[#1a3c5e] text-[#1a3c5e]
                             dark:border-blue-400 dark:text-blue-400
                             hover:bg-[#1a3c5e]/6 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                             font-bold bg-[#1a3c5e] text-white hover:bg-[#15304d]
                             transition-colors shadow-sm"
                >
                  Open Account
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-gray-100
                       dark:border-gray-800 bg-white dark:bg-gray-950"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.key}>
                  <button
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === item.key ? null : item.key,
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3
                               rounded-xl text-sm font-semibold text-gray-700
                               dark:text-gray-300 hover:bg-gray-50
                               dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${mobileExpanded === item.key ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpanded === item.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mb-2 space-y-0.5">
                          {item.children.flatMap((g) =>
                            g.items.map(({ Icon, label, to }) => (
                              <Link
                                key={label}
                                to={to}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setMobileExpanded(null);
                                }}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                                           text-sm text-gray-600 dark:text-gray-400
                                           hover:text-[#1a3c5e] hover:bg-[#1a3c5e]/6
                                           transition-colors"
                              >
                                <Icon
                                  size={14}
                                  className="text-[#1a3c5e] dark:text-blue-400 flex-shrink-0"
                                />
                                {label}
                              </Link>
                            )),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                to="/services"
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm
                           font-semibold text-gray-700 dark:text-gray-300
                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Services
              </Link>

              <div
                className="pt-3 flex flex-col gap-2 border-t border-gray-100
                              dark:border-gray-800 mt-2"
              >
                {auth ? (
                  <button
                    onClick={() => {
                      handleDashboard();
                      setMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-xl text-sm font-bold
                               bg-[#1a3c5e] text-white hover:bg-[#15304d] transition-colors"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl text-sm font-semibold border
                                 border-[#1a3c5e] text-[#1a3c5e] hover:bg-[#1a3c5e]/6
                                 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMenuOpen(false);
                      }}
                      className="w-full py-3 rounded-xl text-sm font-bold
                                 bg-[#1a3c5e] text-white hover:bg-[#15304d] transition-colors"
                    >
                      Open Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
