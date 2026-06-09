import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const BREADCRUMBS = {
  "/admin/dashboard": ["Admin", "Dashboard"],
  "/admin/kyc": ["Admin", "KYC Requests"],
};

export default function AdminTopbar({ onMenuClick }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const pathname = window.location.pathname;
  const crumbs = BREADCRUMBS[pathname] ?? ["Admin"];

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
    toast.success("Admin logged out successfully.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-10 bg-[#0a1929]/95
                       backdrop-blur-sm border-b border-gray-800
                       px-4 sm:px-6 lg:px-8 h-16 flex items-center
                       justify-between gap-4 flex-shrink-0"
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500
                     hover:bg-gray-800 hover:text-gray-300
                     transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 min-w-0">
          {crumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-700 text-sm">/</span>}
              <span
                className={`text-sm font-semibold truncate
                ${i === crumbs.length - 1 ? "text-white" : "text-gray-500"}`}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>

        {/* Mobile */}
        <span className="sm:hidden text-sm font-bold text-white truncate">
          {crumbs[crumbs.length - 1]}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Admin badge */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5
                        rounded-xl bg-amber-500/10
                        border border-amber-500/20"
        >
          <ShieldCheck size={13} className="text-amber-400" />
          <span className="text-amber-400 text-xs font-bold">Admin Mode</span>
        </div>

        {/* User dropdown */}
        <div ref={dropRef} className="relative">
          <button
            onClick={() => setDropOpen((p) => !p)}
            className="flex items-center gap-2 pl-1 pr-2 py-1
                       rounded-xl hover:bg-gray-800 transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full bg-amber-500
                            flex items-center justify-center flex-shrink-0"
            >
              <span className="text-white text-xs font-black">
                {auth?.firstName?.charAt(0) ?? "A"}
              </span>
            </div>
            <span
              className="hidden sm:block text-sm font-semibold
                             text-gray-300 max-w-[100px] truncate"
            >
              {auth?.firstName}
            </span>
            <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52
                           bg-[#0f2033] rounded-2xl border border-gray-800
                           shadow-2xl overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm font-bold text-white truncate">
                    {auth?.firstName}
                  </p>
                  <p className="text-xs text-amber-400/70">Administrator</p>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-3
                             text-sm text-red-400 hover:bg-red-500/10
                             transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
