import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Badge from "../common/Badge";

// Breadcrumb map
const BREADCRUMBS = {
  "/user/dashboard": ["Dashboard"],
  "/user/accounts": ["Banking", "My Accounts"],
  "/user/deposit": ["Banking", "Deposit"],
  "/user/withdraw": ["Banking", "Withdraw"],
  "/user/transfer": ["Banking", "Fund Transfer"],
  "/user/transactions": ["Banking", "Transactions"],
  "/user/statement": ["Banking", "Statement"],
  "/user/kyc": ["Account", "KYC"],
  "/user/profile": ["Account", "Profile"],
  "/user/address": ["Account", "Addresses"],
  "/user/settings": ["Account", "Settings"],
};

export default function UserTopbar({ onMenuClick }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const pathname = window.location.pathname;
  const crumbs = BREADCRUMBS[pathname] ?? ["Dashboard"];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-10 bg-white dark:bg-gray-900
                       border-b border-gray-100 dark:border-gray-800
                       px-4 sm:px-6 lg:px-8 h-16 flex items-center
                       justify-between gap-4 flex-shrink-0"
    >
      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav
          className="hidden sm:flex items-center gap-1.5 min-w-0"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <span
                  className="text-gray-300 dark:text-gray-600
                                 text-sm flex-shrink-0"
                >
                  /
                </span>
              )}
              <span
                className={`text-sm font-semibold truncate
                ${
                  i === crumbs.length - 1
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        {/* Mobile — just show last crumb */}
        <span
          className="sm:hidden text-sm font-bold text-gray-900
                         dark:text-white truncate"
        >
          {crumbs[crumbs.length - 1]}
        </span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* KYC quick link */}
        <Link
          to="/user/kyc"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5
                     rounded-xl bg-amber-50 dark:bg-amber-900/20
                     border border-amber-200 dark:border-amber-800
                     text-amber-700 dark:text-amber-400 text-xs font-bold
                     hover:bg-amber-100 dark:hover:bg-amber-900/40
                     transition-colors"
        >
          <ShieldCheck size={13} />
          KYC
        </Link>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-xl text-gray-500
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                           bg-red-500 border-2 border-white
                           dark:border-gray-900"
          />
        </button>

        {/* User dropdown */}
        <div ref={dropRef} className="relative">
          <button
            onClick={() => setDropOpen((p) => !p)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full bg-[#1a3c5e] flex items-center
                            justify-center flex-shrink-0"
            >
              <span className="text-white text-xs font-black">
                {auth?.firstName?.charAt(0) ?? "U"}
              </span>
            </div>
            <span
              className="hidden sm:block text-sm font-semibold
                             text-gray-900 dark:text-white max-w-[100px]
                             truncate"
            >
              {auth?.firstName}
            </span>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52
                           bg-white dark:bg-gray-900 rounded-2xl
                           border border-gray-100 dark:border-gray-800
                           shadow-xl shadow-gray-200/50
                           dark:shadow-gray-900/50 overflow-hidden z-50"
              >
                {/* User info */}
                <div
                  className="px-4 py-3 border-b border-gray-50
                                dark:border-gray-800"
                >
                  <p
                    className="text-sm font-bold text-gray-900
                                dark:text-white truncate"
                  >
                    {auth?.firstName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Personal Account
                  </p>
                </div>

                {/* Menu items */}
                {[
                  { Icon: User, label: "Profile", to: "/user/profile" },
                  { Icon: Settings, label: "Settings", to: "/user/settings" },
                  { Icon: ShieldCheck, label: "KYC", to: "/user/kyc" },
                ].map(({ Icon, label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5
                               text-sm text-gray-600 dark:text-gray-400
                               hover:bg-gray-50 dark:hover:bg-gray-800
                               hover:text-gray-900 dark:hover:text-white
                               transition-colors"
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                ))}

                {/* Divider + logout */}
                <div className="border-t border-gray-50 dark:border-gray-800">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5
                               text-sm text-red-500 hover:bg-red-50
                               dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
