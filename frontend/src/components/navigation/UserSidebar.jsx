import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  FileText,
  ShieldCheck,
  User,
  MapPin,
  Settings,
  LogOut,
  X,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        to: "/user/dashboard",
        Icon: LayoutDashboard,
        label: "Dashboard",
      },
    ],
  },
  {
    label: "Banking",
    items: [
      {
        to: "/user/accounts",
        Icon: CreditCard,
        label: "My Accounts",
      },
      {
        to: "/user/deposit",
        Icon: TrendingUp,
        label: "Deposit",
      },
      {
        to: "/user/withdraw",
        Icon: TrendingDown,
        label: "Withdraw",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/user/kyc",
        Icon: ShieldCheck,
        label: "KYC",
      },
      {
        to: "/user/profile",
        Icon: User,
        label: "Profile",
      },
      {
        to: "/user/address",
        Icon: MapPin,
        label: "Addresses",
      },
      {
        to: "/user/settings",
        Icon: Settings,
        label: "Settings",
      },
    ],
  },
];

function SidebarContent({ onClose }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5
                      border-b border-gray-100 dark:border-gray-800
                      flex-shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl bg-[#1a3c5e] flex items-center
                          justify-center shadow-md"
          >
            <Building2 size={17} className="text-white" />
          </div>
          <div className="leading-none">
            <p
              className="text-sm font-black text-[#1a3c5e] dark:text-white
                          tracking-tight"
            >
              NexaBank
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">
              User Portal
            </p>
          </div>
        </div>

        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400
                       hover:text-gray-600 hover:bg-gray-100
                       dark:hover:bg-gray-800 transition-colors"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* User info pill */}
      <div className="px-4 py-4 flex-shrink-0">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                        bg-[#1a3c5e]/5 dark:bg-blue-400/5
                        border border-[#1a3c5e]/10 dark:border-blue-400/10"
        >
          <div
            className="w-8 h-8 rounded-full bg-[#1a3c5e] flex items-center
                          justify-center flex-shrink-0"
          >
            <span className="text-white text-xs font-black">
              {auth?.firstName?.charAt(0) ?? "U"}
            </span>
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-bold text-gray-900 dark:text-white
                          truncate"
            >
              {auth?.firstName ?? "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">Personal Account</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 pb-4 space-y-5
                      scrollbar-thin"
      >
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label}>
            <p
              className="px-3 mb-1.5 text-[10px] font-black uppercase
                          tracking-widest text-gray-400 dark:text-gray-500"
            >
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ to, Icon, label: itemLabel }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/user/dashboard"}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm font-semibold transition-all duration-150
                    ${
                      isActive
                        ? "bg-[#1a3c5e] text-white shadow-md shadow-[#1a3c5e]/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        className={
                          isActive
                            ? "text-white"
                            : "text-gray-400 dark:text-gray-500"
                        }
                      />
                      {itemLabel}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className="px-3 py-4 border-t border-gray-100 dark:border-gray-800
                      flex-shrink-0"
      >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                     text-sm font-semibold text-red-500 hover:bg-red-50
                     dark:hover:bg-red-900/20 transition-all duration-150"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function UserSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen
                        w-64 bg-white dark:bg-gray-900 border-r
                        border-gray-100 dark:border-gray-800 z-30"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — slides in */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-72
                       bg-white dark:bg-gray-900 border-r border-gray-100
                       dark:border-gray-800 z-30 flex flex-col shadow-2xl"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
