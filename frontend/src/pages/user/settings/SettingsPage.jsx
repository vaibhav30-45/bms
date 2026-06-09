import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Sun,
  Moon,
  Monitor,
  LogOut,
  Shield,
  Bell,
  Eye,
  Palette,
  ChevronRight,
  Check,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

// ─────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────
function SettingsSection({ title, description, children }) {
  return (
    <Card padding="md">
      <div className="mb-5">
        <h3
          className="text-sm font-black text-gray-900 dark:text-white
                       uppercase tracking-wide"
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      {children}
    </Card>
  );
}

// ─────────────────────────────────────────────
// Theme option button
// ─────────────────────────────────────────────
function ThemeOption({ icon: Icon, label, value, current, onClick }) {
  const active = current === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-2xl border-2
        transition-all duration-200 flex-1
        ${
          active
            ? "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:border-blue-400 dark:bg-blue-400/10"
            : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
        }
      `}
    >
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center
                       ${
                         active
                           ? "bg-[#1a3c5e] dark:bg-blue-500"
                           : "bg-gray-100 dark:bg-gray-800"
                       }`}
      >
        <Icon
          size={18}
          className={active ? "text-white" : "text-gray-500 dark:text-gray-400"}
        />
      </div>
      <span
        className={`text-xs font-bold
        ${
          active
            ? "text-[#1a3c5e] dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </span>
      {active && (
        <div
          className="w-4 h-4 rounded-full bg-[#1a3c5e] dark:bg-blue-500
                        flex items-center justify-center"
        >
          <Check size={10} className="text-white" />
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────
// Settings row
// ─────────────────────────────────────────────
function SettingsRow({
  icon: Icon,
  label,
  description,
  value,
  onClick,
  danger,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-3 rounded-xl
                  transition-all duration-150 group
                  ${
                    danger
                      ? "hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center
                       flex-shrink-0
                       ${
                         danger
                           ? "bg-red-100 dark:bg-red-900/30"
                           : "bg-gray-100 dark:bg-gray-800"
                       }`}
      >
        <Icon
          size={16}
          className={
            danger ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          }
        />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p
          className={`text-sm font-semibold
          ${
            danger
              ? "text-red-600 dark:text-red-400"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {label}
        </p>
        {description && (
          <p
            className="text-xs text-gray-400 dark:text-gray-500 mt-0.5
                        truncate"
          >
            {description}
          </p>
        )}
      </div>
      {value && (
        <span className="text-xs font-bold text-gray-400 flex-shrink-0">
          {value}
        </span>
      )}
      <ChevronRight
        size={15}
        className={`flex-shrink-0 transition-transform
                                group-hover:translate-x-0.5
                                ${danger ? "text-red-400" : "text-gray-300 dark:text-gray-600"}`}
      />
    </button>
  );
}


// Main Settings Page
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleThemeChange = (value) => {
    setTheme(value);
    toast.success(`${value} mode enabled!`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Settings — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1
            className="text-xl sm:text-2xl font-black text-gray-900
                         dark:text-white"
          >
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your preferences and account settings
          </p>
        </div>

        {/* ── Appearance ── */}
        <SettingsSection
          title="Appearance"
          description="Choose how NexaBank looks for you"
        >
          <div className="flex gap-3">
            <ThemeOption
              icon={Sun}
              label="Light"
              value="light"
              current={theme}
              onClick={handleThemeChange}
            />
            <ThemeOption
              icon={Moon}
              label="Dark"
              value="dark"
              current={theme}
              onClick={handleThemeChange}
            />
          </div>
          <p
            className="text-xs text-gray-400 dark:text-gray-500 mt-3
                        flex items-center gap-1.5"
          >
            <Palette size={12} />
            Theme preference is saved and applied across all sessions.
          </p>
        </SettingsSection>

        {/* ── Security ── */}
        <SettingsSection
          title="Security"
          description="Manage your account security"
        >
          <div className="flex flex-col gap-1">
            <SettingsRow
              icon={Shield}
              label="KYC Verification"
              description="Manage your identity verification"
              onClick={() => navigate("/user/kyc")}
            />
            <SettingsRow
              icon={Eye}
              label="Profile Information"
              description="Update name, phone and address"
              onClick={() => navigate("/user/profile")}
            />
          </div>
        </SettingsSection>

        {/* ── Notifications (info only) ── */}
        <SettingsSection
          title="Notifications"
          description="Transaction and account alerts"
        >
          <div
            className="flex items-start gap-3 p-3 rounded-xl
                          bg-blue-50 dark:bg-blue-900/20"
          >
            <Bell size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You will receive toast notifications for all account activities
              including transactions, KYC updates, and profile changes.
            </p>
          </div>
        </SettingsSection>

        {/* ── Danger zone ── */}
        <SettingsSection
          title="Account Actions"
          description="Session and account management"
        >
          <SettingsRow
            icon={LogOut}
            label="Sign Out"
            description="Sign out of your current session"
            onClick={handleLogout}
            danger
          />
        </SettingsSection>

        {/* App version */}
        <div className="text-center py-2">
          <p className="text-xs text-gray-300 dark:text-gray-700">
            NexaBank v1.0.0 · Built with ♥ in India
          </p>
        </div>
      </div>
    </>
  );
}
