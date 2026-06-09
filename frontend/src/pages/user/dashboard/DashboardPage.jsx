import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PiggyBank, FileText, Calendar } from "lucide-react";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  ShieldCheck,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Wallet,
  Building2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useAccounts } from "../../../hooks/useAccounts";
import { useProfile } from "../../../hooks/useProfile";
import { getStatement } from "../../../api/transactionApi";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";
import {
  KYC_STATUS,
  isKycVerified,
  normalizeKycStatus,
} from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/helpers";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import Button from "../../../components/common/Button";
import EmptyState from "../../../components/common/EmptyState";
import Alert from "../../../components/common/Alert";


// Sub-components
function GreetingBanner({ firstName, kycStatus }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center
                    justify-between gap-3"
    >
      <div>
        <h1
          className="text-xl sm:text-2xl font-black text-gray-900
                       dark:text-white"
        >
          {greeting}, {firstName}! 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Here's your financial overview for today.
        </p>
      </div>
      <Badge
        variant={kycStatus ?? KYC_STATUS.NOT_SUBMITTED}
        label={`KYC: ${kycStatus ?? "Not Submitted"}`}
        dot
        size="md"
      />
    </div>
  );
}

function KycBanner({ kycStatus, navigate }) {
  if (isKycVerified(kycStatus)) return null;

  const config = {
    [KYC_STATUS.NOT_SUBMITTED]: {
      type: "warning",
      title: "Complete your KYC",
      message:
        "You need to complete KYC verification to unlock all banking features.",
      cta: "Start KYC",
    },
    [KYC_STATUS.PENDING]: {
      type: "info",
      title: "KYC Under Review",
      message:
        "Your KYC documents are being reviewed. This usually takes 24 hours.",
      cta: null,
    },
    [KYC_STATUS.REJECTED]: {
      type: "error",
      title: "KYC Rejected",
      message: "Your KYC was rejected. Please resubmit your documents.",
      cta: "Resubmit KYC",
    },
  };

  const c = config[kycStatus] ?? config[KYC_STATUS.NOT_SUBMITTED];

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center
                     justify-between gap-3 p-4 rounded-2xl border
                     ${
                       c.type === "warning"
                         ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                         : c.type === "info"
                           ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                           : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                     }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={18}
          className={`flex-shrink-0 mt-0.5
            ${
              c.type === "warning"
                ? "text-amber-500"
                : c.type === "info"
                  ? "text-blue-500"
                  : "text-red-500"
            }`}
        />
        <div>
          <p
            className={`text-sm font-bold
            ${
              c.type === "warning"
                ? "text-amber-800 dark:text-amber-300"
                : c.type === "info"
                  ? "text-blue-800 dark:text-blue-300"
                  : "text-red-800 dark:text-red-300"
            }`}
          >
            {c.title}
          </p>
          <p
            className={`text-xs mt-0.5
            ${
              c.type === "warning"
                ? "text-amber-700 dark:text-amber-400"
                : c.type === "info"
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-red-700 dark:text-red-400"
            }`}
          >
            {c.message}
          </p>
        </div>
      </div>
      {c.cta && (
        <Button
          size="sm"
          variant={c.type === "error" ? "danger" : "secondary"}
          onClick={() => navigate("/user/kyc")}
          className="flex-shrink-0 self-start sm:self-auto"
        >
          {c.cta}
          <ArrowRight size={13} />
        </Button>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <Card className="flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center
                       justify-center flex-shrink-0 ${color}`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-xs font-semibold text-gray-500 dark:text-gray-400
                      uppercase tracking-wide mb-1"
        >
          {label}
        </p>
        {loading ? (
          <div
            className="h-6 w-24 bg-gray-100 dark:bg-gray-800
                          rounded-lg animate-pulse"
          />
        ) : (
          <p
            className="text-lg sm:text-xl font-black text-gray-900
                        dark:text-white truncate"
          >
            {value}
          </p>
        )}
        {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </Card>
  );
}

function AccountCard({ account, onClick }) {
  const isSavings = !!account.interestRate;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl p-5 relative overflow-hidden
                 bg-gradient-to-br
                 from-[#1a3c5e] to-[#0f2033]
                 border border-white/10 shadow-lg"
    >
      {/* Shine */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-white/5
                      to-transparent pointer-events-none rounded-2xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/50 text-xs font-medium mb-0.5">
              {isSavings ? "Savings Account" : "Current Account"}
            </p>
            <p className="text-white font-mono text-sm font-bold tracking-widest">
              ••••&nbsp;{account.accountNumber?.slice(-4) ?? "0000"}
            </p>
          </div>
          <div
            className="w-8 h-8 rounded-xl bg-white/10 flex items-center
                          justify-center"
          >
            {isSavings ? (
              <PiggyBank size={16} className="text-amber-400" />
            ) : (
              <Building2 size={16} className="text-blue-400" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <Badge variant={account.accountStatus ?? "ACTIVE"} size="sm" dot />
          {isSavings && account.interestRate && (
            <span className="text-xs text-white/50">
              {account.interestRate}% p.a
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function QuickAction({ icon: Icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 p-4 rounded-2xl
                 bg-white dark:bg-gray-900 border border-gray-100
                 dark:border-gray-800 hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200 w-full"
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center
                       justify-center ${color}`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <span
        className="text-xs sm:text-sm font-semibold text-gray-700
                       dark:text-gray-300 text-center leading-tight"
      >
        {label}
      </span>
    </button>
  );
}

function TxnRow({ txn }) {
  const isCredit = txn.type === "CREDIT";
  return (
    <div
      className="flex items-center gap-3 py-3 border-b
                    border-gray-50 dark:border-gray-800 last:border-0"
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center
                       flex-shrink-0
                       ${
                         isCredit
                           ? "bg-emerald-100 dark:bg-emerald-900/30"
                           : "bg-red-100 dark:bg-red-900/30"
                       }`}
      >
        {isCredit ? (
          <TrendingUp size={16} className="text-emerald-600" />
        ) : (
          <TrendingDown size={16} className="text-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold text-gray-800 dark:text-gray-200
                      truncate capitalize"
        >
          {txn.type?.toLowerCase() ?? "Transaction"}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {txn.paymentMode} · {formatDateTime(txn.date)}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-bold
          ${isCredit ? "text-emerald-600" : "text-red-500"}`}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(txn.amount)}
        </p>
        <Badge variant={txn.status} size="sm" />
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { accounts, loading: acLoading, fetchAccounts } = useAccounts();
  const { profile, loading: prLoading, fetchProfile } = useProfile();
  const [recentTxns, setRecentTxns] = useState([]);
  const [txnLoading, setTxnLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    fetchProfile();
    fetchAccounts();
  }, [fetchProfile, fetchAccounts]);

  // Fetch recent transactions for first account
  useEffect(() => {
    if (!accounts.length) return;
    const fetchTxns = async () => {
      try {
        setTxnLoading(true);
        const today = new Date();
        const from = new Date(today);
        from.setMonth(from.getMonth() - 1);
        const toDate = today.toISOString().split("T")[0];
        const fromDate = from.toISOString().split("T")[0];
        const res = await getStatement({
          accountNumber: accounts[0].accountNumber,
          fromDate,
          toDate,
        });
        const list =
          res.data?.data?.transactions ?? res.data?.transactions ?? [];
        setRecentTxns(list.slice(0, 5));
      } catch {
        toast.error(getErrorMessage("Failed to load recent transactions"));
      } finally {
        setTxnLoading(false);
      }
    };
    fetchTxns();
  }, [accounts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchAccounts()]);
    setRefreshing(false);
    toast.success("Dashboard refreshed!");
  };

  // Compute total balance
  const totalBalance = accounts.reduce(
    (sum, a) => sum + (Number(a.accountBalance) || 0),
    0,
  );

  const isLoading = acLoading || prLoading;

  return (
    <>
      <Helmet>
        <title>Dashboard — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Greeting + refresh */}
        <div className="flex items-start justify-between gap-3">
          <GreetingBanner
            firstName={auth?.firstName ?? "User"}
            kycStatus={profile?.kycStatus}
          />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-colors flex-shrink-0 disabled:opacity-50"
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* KYC Banner */}
        {profile && !isKycVerified(profile.kycStatus) && (
          <KycBanner kycStatus={profile.kycStatus} navigate={navigate} />
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Wallet}
            label="Total Balance"
            value={formatCurrency(totalBalance)}
            sub={`${accounts.length} account${accounts.length !== 1 ? "s" : ""}`}
            color="bg-[#1a3c5e]"
            loading={isLoading}
          />
          <StatCard
            icon={CreditCard}
            label="Savings Accounts"
            value={accounts.filter((a) => a.interestRate).length}
            sub="Max 2 allowed"
            color="bg-blue-500"
            loading={isLoading}
          />
          <StatCard
            icon={Building2}
            label="Current Accounts"
            value={accounts.filter((a) => !a.interestRate).length}
            sub="Max 2 allowed"
            color="bg-amber-500"
            loading={isLoading}
          />
          <StatCard
            icon={CheckCircle2}
            label="KYC Status"
            value={profile?.kycStatus ?? KYC_STATUS.NOT_SUBMITTED}
            sub="Identity verification"
            color={
              isKycVerified(profile?.kycStatus)
                ? "bg-emerald-500"
                : profile?.kycStatus === KYC_STATUS.PENDING
                  ? "bg-blue-500"
                  : profile?.kycStatus === KYC_STATUS.REJECTED
                    ? "bg-red-500"
                    : "bg-gray-400"
            }
            loading={prLoading}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6">
          {/* Left column — accounts + quick actions */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* My Accounts */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2
                  className="text-base sm:text-lg font-black text-gray-900
                               dark:text-white"
                >
                  My Accounts
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/user/accounts")}
                >
                  View All
                  <ArrowRight size={13} />
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader text="Loading accounts..." />
                </div>
              ) : accounts.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No accounts yet"
                  description="Create your first savings or current account to get started."
                  actionLabel="Create Account"
                  onAction={() => navigate("/user/accounts")}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accounts.map((acc) => (
                    <AccountCard
                      key={acc.accountId}
                      account={acc}
                      onClick={() =>
                        navigate(`/user/accounts/${acc.accountId}`)
                      }
                    />
                  ))}

                  {/* Add account card */}
                  {accounts.length < 4 && (
                    <button
                      onClick={() => navigate("/user/accounts")}
                      className="rounded-2xl p-5 border-2 border-dashed
                                 border-gray-200 dark:border-gray-700
                                 hover:border-[#1a3c5e] dark:hover:border-blue-400
                                 flex flex-col items-center justify-center gap-2
                                 text-gray-400 dark:text-gray-500
                                 hover:text-[#1a3c5e] dark:hover:text-blue-400
                                 transition-all duration-200 min-h-[140px]
                                 group"
                    >
                      <div
                        className="w-10 h-10 rounded-2xl bg-gray-100
                                      dark:bg-gray-800 group-hover:bg-[#1a3c5e]/10
                                      flex items-center justify-center
                                      transition-colors"
                      >
                        <Plus size={20} />
                      </div>
                      <span className="text-sm font-semibold">Add Account</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2
                className="text-base sm:text-lg font-black text-gray-900
                             dark:text-white mb-3 sm:mb-4"
              >
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickAction
                  icon={Calendar}
                  label=" Book Deposit"
                  color="bg-emerald-500"
                  onClick={() => navigate("/user/deposit")}
                />
                <QuickAction
                  icon={TrendingDown}
                  label="Withdraw"
                  color="bg-red-500"
                  onClick={() => navigate("/user/withdraw")}
                />
                <QuickAction
                  icon={FileText}
                  label="Statement"
                  color="bg-amber-500"
                  onClick={() => navigate("/user/statement")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile quick info */}
        {profile && (
          <Card padding="md">
            <div
              className="flex flex-col sm:flex-row sm:items-center
                            justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl bg-[#1a3c5e] flex
                                items-center justify-center flex-shrink-0"
                >
                  <span className="text-white text-lg font-black">
                    {profile.firstName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-black text-gray-900 dark:text-white">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/user/profile")}
                >
                  Edit Profile
                </Button>
                <Button size="sm" onClick={() => navigate("/user/kyc")}>
                  <ShieldCheck size={13} />
                  KYC
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
