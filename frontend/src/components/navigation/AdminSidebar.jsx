import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    Icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/admin/kyc",
    Icon: ShieldCheck,
    label: "KYC Requests",
  },
  {
    to: "/admin/accounts",
    Icon: CreditCard,
    label: "Accounts",
  },
];

function SidebarContent({ onClose }) {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Admin logged out successfully.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5
                      border-b border-gray-800 flex-shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl bg-amber-500
                          flex items-center justify-center shadow-md"
          >
            <Building2 size={17} className="text-white" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-black text-white tracking-tight">
              NexaBank
            </p>
            <p
              className="text-[9px] text-gray-500 uppercase
                          tracking-widest"
            >
              Admin Portal
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-500
                       hover:text-gray-300 hover:bg-gray-800
                       transition-colors"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Admin badge */}
      <div className="px-4 py-4 flex-shrink-0">
        <div
          className="flex items-center gap-3 px-3 py-2.5
                        rounded-xl bg-amber-500/10
                        border border-amber-500/20"
        >
          <div
            className="w-8 h-8 rounded-full bg-amber-500
                          flex items-center justify-center flex-shrink-0"
          >
            <span className="text-white text-xs font-black">
              {auth?.firstName?.charAt(0) ?? "A"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {auth?.firstName ?? "Admin"}
            </p>
            <p className="text-xs text-amber-400/70">Administrator</p>
          </div>
        </div>
      </div>

      {/* Restricted access notice */}
      <div className="px-4 mb-3 flex-shrink-0">
        <div
          className="flex items-start gap-2 px-3 py-2.5
                        rounded-xl bg-red-500/10
                        border border-red-500/20"
        >
          <AlertTriangle
            size={13}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-[10px] text-red-400 leading-relaxed">
            Restricted area. All actions are logged and monitored.
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p
          className="px-3 mb-2 text-[10px] font-black uppercase
                      tracking-widest text-gray-600"
        >
          Navigation
        </p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-semibold transition-all duration-150
                ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    className={isActive ? "text-white" : "text-gray-500"}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5
                     rounded-xl text-sm font-semibold text-red-400
                     hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0
                        h-screen w-64 bg-[#0a1929]
                        border-r border-gray-800 z-30"
      >
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-72
                       bg-[#0a1929] border-r border-gray-800
                       z-30 flex flex-col shadow-2xl"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
