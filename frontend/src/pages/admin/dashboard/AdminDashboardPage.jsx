import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CreditCard,
  PiggyBank,
  Building2,
  Eye,
} from "lucide-react";
import { getPendingKyc } from "../../../api/kycApi";
import {
  adminGetAllAccounts,
  adminGetAllSavingsAccounts,
  adminGetAllCurrentAccounts,
} from "../../../api/accountApi";
import { useAuth } from "../../../context/AuthContext";
import { getErrorMessage } from "../../../utils/helpers";
import { KYC_STATUS } from "../../../utils/constants";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import Alert from "../../../components/common/Alert";

// Stat card component
function StatCard({ icon: Icon, label, value, sub, color, bg, loading }) {
  return (
    <Card className="flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center
                       justify-center flex-shrink-0 ${bg}`}
      >
        <Icon size={22} className={color} />
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
            className="h-7 w-16 bg-gray-100 dark:bg-gray-800
                          rounded-lg animate-pulse"
          />
        ) : (
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {value}
          </p>
        )}
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

// KYC list item for dashboard preview
function KycPreviewRow({ kyc, onView }) {
  return (
    <div
      className="flex items-center gap-3 py-3 border-b
                    border-gray-50 dark:border-gray-800 last:border-0"
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full bg-[#1a3c5e] flex items-center
                      justify-center flex-shrink-0"
      >
        <span className="text-white text-xs font-black">
          {kyc.userName?.charAt(0) ?? "U"}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold text-gray-900 dark:text-white
                      truncate"
        >
          {kyc.userName ?? "Unknown User"}
        </p>
        <p className="text-xs text-gray-400 truncate">
          KYC #{kyc.kycId} · Submitted for review
        </p>
      </div>

      {/* Steps */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        {[
          { key: "info", done: kyc.infoSubmitted },
          { key: "doc", done: kyc.documentsSubmitted },
          { key: "video", done: kyc.videoSubmitted },
        ].map(({ key, done }) => (
          <div
            key={key}
            className={`w-2 h-2 rounded-full ${
              done ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      <Badge variant="PENDING" size="sm" dot className="flex-shrink-0" />

      <button
        onClick={() => onView(kyc.kycId)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3c5e]
                   dark:hover:text-blue-400 hover:bg-gray-100
                   dark:hover:bg-gray-800 transition-all flex-shrink-0"
      >
        <Eye size={15} />
      </button>
    </div>
  );
}

// Account preview row for dashboard
function AccountPreviewRow({ account, onView }) {
  const isSavings = account.interestRate !== undefined;
  return (
    <div
      className="flex items-center gap-3 py-3 border-b
                    border-gray-50 dark:border-gray-800 last:border-0"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
          ${isSavings ? "bg-blue-100 dark:bg-blue-900/30" : "bg-purple-100 dark:bg-purple-900/30"}`}
      >
        {isSavings ? (
          <PiggyBank size={16} className="text-blue-600 dark:text-blue-400" />
        ) : (
          <Building2
            size={16}
            className="text-purple-600 dark:text-purple-400"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
          {account.accountNumber ?? `Account #${account.accountId}`}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {account.userName ?? "—"} · {account.branchName ?? "—"}
        </p>
      </div>

      <Badge
        variant={isSavings ? "SAVINGS" : "CURRENT"}
        size="sm"
        className="flex-shrink-0"
      />

      <button
        onClick={() => onView(account.accountId)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3c5e]
                   dark:hover:text-blue-400 hover:bg-gray-100
                   dark:hover:bg-gray-800 transition-all flex-shrink-0"
      >
        <Eye size={15} />
      </button>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [pendingList, setPendingList] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [currentAccounts, setCurrentAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setError("");
      const [kycRes, allRes, savingsRes, currentRes] = await Promise.allSettled(
        [
          getPendingKyc(),
          adminGetAllAccounts(),
          adminGetAllSavingsAccounts(),
          adminGetAllCurrentAccounts(),
        ],
      );

      if (kycRes.status === "fulfilled") {
        const list = kycRes.value.data?.data ?? kycRes.value.data ?? [];
        setPendingList(Array.isArray(list) ? list : []);
      }
      if (allRes.status === "fulfilled") {
        const list = allRes.value.data?.data ?? allRes.value.data ?? [];
        setAllAccounts(Array.isArray(list) ? list : []);
      }
      if (savingsRes.status === "fulfilled") {
        const list = savingsRes.value.data?.data ?? savingsRes.value.data ?? [];
        setSavingsAccounts(Array.isArray(list) ? list : []);
      }
      if (currentRes.status === "fulfilled") {
        const list = currentRes.value.data?.data ?? currentRes.value.data ?? [];
        setCurrentAccounts(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
    toast.success("Dashboard refreshed!");
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — NexaBank</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3"
        >
          <div>
            <h1
              className="text-xl sm:text-2xl font-black text-gray-900
                           dark:text-white"
            >
              {greeting}, {auth?.firstName}! 🛡️
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Admin control panel — NexaBank
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-colors disabled:opacity-50 self-start"
            aria-label="Refresh"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Admin notice */}
        <div
          className="flex items-start gap-3 p-4 rounded-2xl
                        bg-amber-50 dark:bg-amber-900/20
                        border border-amber-200 dark:border-amber-800"
        >
          <AlertTriangle
            size={16}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You are in the admin control panel. All actions are logged and
            irreversible. Handle KYC requests and account data carefully.
          </p>
        </div>

        {/* Error */}
        <Alert
          type="error"
          title="Failed to load data"
          message={error}
          show={!!error}
          onClose={() => setError("")}
        />

        {/* Stat cards — row 1: KYC */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
            KYC Overview
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={Clock}
              label="Pending KYC"
              value={pendingList.length}
              sub="Awaiting review"
              bg="bg-amber-100 dark:bg-amber-900/40"
              color="text-amber-600"
              loading={loading}
            />
            <StatCard
              icon={ShieldCheck}
              label="Total Requests"
              value={pendingList.length}
              sub="This session"
              bg="bg-blue-100 dark:bg-blue-900/40"
              color="text-blue-600"
              loading={loading}
            />
            <StatCard
              icon={CheckCircle2}
              label="Approved Today"
              value="—"
              sub="Session data"
              bg="bg-emerald-100 dark:bg-emerald-900/40"
              color="text-emerald-600"
              loading={loading}
            />
            <StatCard
              icon={XCircle}
              label="Rejected Today"
              value="—"
              sub="Session data"
              bg="bg-red-100 dark:bg-red-900/40"
              color="text-red-600"
              loading={loading}
            />
          </div>
        </div>

        {/* Stat cards — row 2: Accounts */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
            Accounts Overview
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={CreditCard}
              label="Total Accounts"
              value={allAccounts.length}
              sub="All account types"
              bg="bg-[#1a3c5e]/10 dark:bg-blue-900/40"
              color="text-[#1a3c5e] dark:text-blue-400"
              loading={loading}
            />
            <StatCard
              icon={PiggyBank}
              label="Savings Accounts"
              value={savingsAccounts.length}
              sub="Active savings"
              bg="bg-blue-100 dark:bg-blue-900/40"
              color="text-blue-600"
              loading={loading}
            />
            <StatCard
              icon={Building2}
              label="Current Accounts"
              value={currentAccounts.length}
              sub="Active current"
              bg="bg-purple-100 dark:bg-purple-900/40"
              color="text-purple-600"
              loading={loading}
            />
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
          {/* Pending KYC list */}
          <div className="xl:col-span-2 flex flex-col gap-5 sm:gap-6">
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className="text-base font-black text-gray-900
                                 dark:text-white"
                  >
                    Pending KYC Requests
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {pendingList.length} request
                    {pendingList.length !== 1 ? "s" : ""} awaiting review
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate("/admin/kyc")}>
                  View All
                  <ArrowRight size={13} />
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader text="Loading requests..." />
                </div>
              ) : pendingList.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All caught up!"
                  description="No pending KYC requests at the moment."
                  className="py-8"
                />
              ) : (
                <div>
                  {pendingList.slice(0, 5).map((kyc) => (
                    <KycPreviewRow
                      key={kyc.kycId}
                      kyc={kyc}
                      onView={() => navigate("/admin/kyc")}
                    />
                  ))}
                  {pendingList.length > 5 && (
                    <Button
                      fullWidth
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate("/admin/kyc")}
                    >
                      View {pendingList.length - 5} more requests
                      <ArrowRight size={13} />
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Recent Accounts preview */}
            <Card padding="md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white">
                    Recent Accounts
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {allAccounts.length} total account
                    {allAccounts.length !== 1 ? "s" : ""} registered
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate("/admin/accounts")}>
                  View All
                  <ArrowRight size={13} />
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader text="Loading accounts..." />
                </div>
              ) : allAccounts.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No accounts yet"
                  description="No accounts have been created yet."
                  className="py-8"
                />
              ) : (
                <div>
                  {allAccounts.slice(0, 5).map((account) => (
                    <AccountPreviewRow
                      key={account.accountId}
                      account={account}
                      onView={() => navigate("/admin/accounts")}
                    />
                  ))}
                  {allAccounts.length > 5 && (
                    <Button
                      fullWidth
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate("/admin/accounts")}
                    >
                      View {allAccounts.length - 5} more accounts
                      <ArrowRight size={13} />
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right panel — quick actions + guides */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            {/* Quick actions */}
            <Card padding="md">
              <h3
                className="text-sm font-black text-gray-900 dark:text-white
                             uppercase tracking-wide mb-4"
              >
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  {
                    Icon: ShieldCheck,
                    label: "Review KYC Requests",
                    desc: `${pendingList.length} pending`,
                    color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600",
                    path: "/admin/kyc",
                  },
                  {
                    Icon: CreditCard,
                    label: "Manage Accounts",
                    desc: `${allAccounts.length} total accounts`,
                    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600",
                    path: "/admin/accounts",
                  },
                ].map(({ Icon, label, desc, color, path }) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-3 p-3 rounded-xl
                               hover:bg-gray-50 dark:hover:bg-gray-800
                               transition-colors text-left group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center
                                     justify-center flex-shrink-0 ${color}`}
                    >
                      <Icon size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-gray-900
                                    dark:text-white"
                      >
                        {label}
                      </p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-gray-300 dark:text-gray-600
                                           group-hover:text-gray-500
                                           transition-colors"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* KYC process guide */}
            <Card padding="md">
              <h3
                className="text-sm font-black text-gray-900 dark:text-white
                             uppercase tracking-wide mb-4"
              >
                KYC Review Guide
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    step: "1",
                    label: "Check Documents",
                    desc: "Verify Aadhaar and PAN card scans are legible and authentic",
                    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600",
                  },
                  {
                    step: "2",
                    label: "Review Video",
                    desc: "Confirm user holds their ID card and states name and date",
                    color:
                      "bg-purple-100 dark:bg-purple-900/40 text-purple-600",
                  },
                  {
                    step: "3",
                    label: "Approve or Reject",
                    desc: "If everything matches, approve. Else reject with a reason",
                    color:
                      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600",
                  },
                ].map(({ step, label, desc, color }) => (
                  <div key={step} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center
                                     justify-center flex-shrink-0 text-xs
                                     font-black ${color}`}
                    >
                      {step}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-bold text-gray-900
                                    dark:text-white"
                      >
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 leading-snug mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Accounts type breakdown */}
            <Card padding="md">
              <h3
                className="text-sm font-black text-gray-900 dark:text-white
                             uppercase tracking-wide mb-4"
              >
                Account Breakdown
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {[
                    {
                      label: "Savings",
                      count: savingsAccounts.length,
                      total: allAccounts.length,
                      color: "bg-blue-500",
                      textColor: "text-blue-600 dark:text-blue-400",
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                    },
                    {
                      label: "Current",
                      count: currentAccounts.length,
                      total: allAccounts.length,
                      color: "bg-purple-500",
                      textColor: "text-purple-600 dark:text-purple-400",
                      bg: "bg-purple-100 dark:bg-purple-900/30",
                    },
                  ].map(({ label, count, total, color, textColor, bg }) => {
                    const pct =
                      total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {label}
                          </span>
                          <span className={`text-xs font-black ${textColor}`}>
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
