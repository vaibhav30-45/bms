import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  CreditCard,
  PiggyBank,
  Building2,
  Search,
  RefreshCw,
  ChevronDown,
  X,
  AlertTriangle,
  Hash,
  User,
  MapPin,
  TrendingUp,
  Banknote,
  Percent,
} from "lucide-react";
import {
  adminGetAllAccounts,
  adminGetAccountById,
  adminGetAllSavingsAccounts,
  adminGetAllCurrentAccounts,
} from "../../../api/accountApi";
import { getErrorMessage } from "../../../utils/helpers";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import Alert from "../../../components/common/Alert";

// Tab definitions 
const TABS = [
  { key: "all", label: "All Accounts", Icon: CreditCard },
  { key: "savings", label: "Savings", Icon: PiggyBank },
  { key: "current", label: "Current", Icon: Building2 },
];

//  Stat card 
function StatCard({ icon: Icon, label, value, bg, color, loading }) {
  return (
    <Card className="flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center
                       justify-center flex-shrink-0 ${bg}`}
      >
        <Icon size={20} className={color} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        {loading ? (
          <div className="h-6 w-14 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ) : (
          <p className="text-xl font-black text-gray-900 dark:text-white">
            {value}
          </p>
        )}
      </div>
    </Card>
  );
}

//  Account detail modal 
function AccountDetailModal({ accountId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await adminGetAccountById(accountId);
        setData(res.data?.data ?? res.data ?? null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/50 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
                     border border-gray-100 dark:border-gray-800
                     w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Account Details
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">ID: #{accountId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader text="Loading account details..." />
              </div>
            ) : error ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                <AlertTriangle
                  size={15}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            ) : !data ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No data found.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(data).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2.5 px-3
                               rounded-xl bg-gray-50 dark:bg-gray-800"
                  >
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {val === null || val === undefined ? "—" : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

//  All-accounts table row 
function AllAccountRow({ account, onViewDetail }) {
  return (
    <tr className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1a3c5e]/10 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-black text-[#1a3c5e] dark:text-blue-400">
              {account.userName?.charAt(0) ?? "?"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
              {account.userName ?? "—"}
            </p>
            <p className="text-xs text-gray-400">User #{account.userId}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">
          {account.accountNumber ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {account.branchName ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onViewDetail(account.accountId)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     text-xs font-semibold text-[#1a3c5e] dark:text-blue-400
                     border border-[#1a3c5e]/20 dark:border-blue-400/20
                     hover:bg-[#1a3c5e] hover:text-white dark:hover:bg-blue-400 dark:hover:text-white
                     transition-all opacity-0 group-hover:opacity-100"
        >
          View
        </button>
      </td>
    </tr>
  );
}

//  Savings account card 
function SavingsAccountCard({ account, onViewDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-100
                 dark:border-gray-800 rounded-2xl p-5
                 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <PiggyBank size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              Account #{account.accountId}
            </p>
            <Badge variant="SAVINGS" size="sm" className="mt-0.5" />
          </div>
        </div>
        <button
          onClick={() => onViewDetail(account.accountId)}
          className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600
                     hover:text-[#1a3c5e] dark:hover:text-blue-400
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronDown size={15} className="rotate-[-90deg]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Percent size={11} className="text-blue-500" />
            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Interest Rate
            </span>
          </div>
          <p className="text-lg font-black text-blue-700 dark:text-blue-300">
            {account.interestRate != null ? `${account.interestRate}%` : "—"}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Banknote size={11} className="text-amber-500" />
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Withdrawal Limit
            </span>
          </div>
          <p className="text-lg font-black text-amber-700 dark:text-amber-300">
            {account.withdrawalLimit != null
              ? `₹${Number(account.withdrawalLimit).toLocaleString("en-IN")}`
              : "—"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

//  Current account card 
function CurrentAccountCard({ account, onViewDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-100
                 dark:border-gray-800 rounded-2xl p-5
                 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Building2
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              Account #{account.accountId}
            </p>
            <Badge variant="CURRENT" size="sm" className="mt-0.5" />
          </div>
        </div>
        <button
          onClick={() => onViewDetail(account.accountId)}
          className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600
                     hover:text-[#1a3c5e] dark:hover:text-blue-400
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronDown size={15} className="rotate-[-90deg]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={11} className="text-purple-500" />
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              Overdraft Limit
            </span>
          </div>
          <p className="text-lg font-black text-purple-700 dark:text-purple-300">
            {account.overdraftLimit != null
              ? `₹${Number(account.overdraftLimit).toLocaleString("en-IN")}`
              : "—"}
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Banknote size={11} className="text-rose-500" />
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
              Monthly Fee
            </span>
          </div>
          <p className="text-lg font-black text-rose-700 dark:text-rose-300">
            {account.monthlyServiceFee != null
              ? `₹${Number(account.monthlyServiceFee).toLocaleString("en-IN")}`
              : "—"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

//  Main page 
export default function AdminAccountsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [allAccounts, setAllAccounts] = useState([]);
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [currentAccounts, setCurrentAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const [allRes, savingsRes, currentRes] = await Promise.allSettled([
        adminGetAllAccounts(),
        adminGetAllSavingsAccounts(),
        adminGetAllCurrentAccounts(),
      ]);

      if (allRes.status === "fulfilled") {
        const list = allRes.value.data?.data ?? allRes.value.data ?? [];
        setAllAccounts(Array.isArray(list) ? list : []);
      } else {
        setError(getErrorMessage(allRes.reason));
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
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success("Accounts refreshed!");
  };

  // Filtered list for "all" tab with search
  const filteredAll = allAccounts.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.accountNumber?.toLowerCase().includes(q) ||
      a.userName?.toLowerCase().includes(q) ||
      a.branchName?.toLowerCase().includes(q) ||
      String(a.accountId).includes(q)
    );
  });

  const filteredSavings = savingsAccounts.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return String(a.accountId).includes(q);
  });

  const filteredCurrent = currentAccounts.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return String(a.accountId).includes(q);
  });

  return (
    <>
      <Helmet>
        <title>Accounts — Admin · NexaBank</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Accounts Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              View and inspect all registered bank accounts
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

        {/* Error */}
        <Alert
          type="error"
          title="Failed to load accounts"
          message={error}
          show={!!error}
          onClose={() => setError("")}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            icon={CreditCard}
            label="Total Accounts"
            value={allAccounts.length}
            bg="bg-[#1a3c5e]/10 dark:bg-blue-900/40"
            color="text-[#1a3c5e] dark:text-blue-400"
            loading={loading}
          />
          <StatCard
            icon={PiggyBank}
            label="Savings Accounts"
            value={savingsAccounts.length}
            bg="bg-blue-100 dark:bg-blue-900/40"
            color="text-blue-600"
            loading={loading}
          />
          <StatCard
            icon={Building2}
            label="Current Accounts"
            value={currentAccounts.length}
            bg="bg-purple-100 dark:bg-purple-900/40"
            color="text-purple-600"
            loading={loading}
          />
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tab pills */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-start">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSearch("");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm
                             font-semibold transition-all duration-200
                             ${
                               activeTab === key
                                 ? "bg-white dark:bg-gray-900 text-[#1a3c5e] dark:text-blue-400 shadow-sm"
                                 : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                             }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={
                activeTab === "all"
                  ? "Search by name, account no…"
                  : "Search by account ID…"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700 rounded-xl
                         outline-none focus:ring-2 focus:ring-[#1a3c5e]/25
                         text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Tab content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader text="Loading accounts..." />
          </div>
        ) : (
          <>
            {/* ── All Accounts Tab ─────────────────────── */}
            {activeTab === "all" && (
              <Card padding="none">
                {filteredAll.length === 0 ? (
                  <EmptyState
                    icon={CreditCard}
                    title="No accounts found"
                    description={
                      search
                        ? "No accounts match your search query."
                        : "No accounts have been registered yet."
                    }
                    className="py-12"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <th className="px-4 py-3 text-left">
                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              <User size={11} />
                              Customer
                            </span>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              <Hash size={11} />
                              Account No.
                            </span>
                          </th>
                          <th className="px-4 py-3 text-left hidden sm:table-cell">
                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              <MapPin size={11} />
                              Branch
                            </span>
                          </th>
                          <th className="px-4 py-3 text-right">
                            <span className="text-xs font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Actions
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAll.map((account) => (
                          <AllAccountRow
                            key={account.accountId}
                            account={account}
                            onViewDetail={setSelectedAccountId}
                          />
                        ))}
                      </tbody>
                    </table>
                    <div className="px-4 py-3 border-t border-gray-50 dark:border-gray-800">
                      <p className="text-xs text-gray-400">
                        Showing {filteredAll.length} of {allAccounts.length}{" "}
                        accounts
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* ── Savings Tab ──────────────────────────── */}
            {activeTab === "savings" && (
              <>
                {filteredSavings.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon={PiggyBank}
                      title="No savings accounts found"
                      description={
                        search
                          ? "No savings accounts match your search."
                          : "No savings accounts have been created yet."
                      }
                      className="py-12"
                    />
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSavings.map((account) => (
                      <SavingsAccountCard
                        key={account.accountId}
                        account={account}
                        onViewDetail={setSelectedAccountId}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Current Tab ──────────────────────────── */}
            {activeTab === "current" && (
              <>
                {filteredCurrent.length === 0 ? (
                  <Card>
                    <EmptyState
                      icon={Building2}
                      title="No current accounts found"
                      description={
                        search
                          ? "No current accounts match your search."
                          : "No current accounts have been created yet."
                      }
                      className="py-12"
                    />
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCurrent.map((account) => (
                      <CurrentAccountCard
                        key={account.accountId}
                        account={account}
                        onViewDetail={setSelectedAccountId}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Account detail modal */}
      {selectedAccountId !== null && (
        <AccountDetailModal
          accountId={selectedAccountId}
          onClose={() => setSelectedAccountId(null)}
        />
      )}
    </>
  );
}
