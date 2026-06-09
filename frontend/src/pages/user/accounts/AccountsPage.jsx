import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreditCard,
  Plus,
  PiggyBank,
  Building2,
  Info,
  RefreshCw,
} from "lucide-react";
import {
  createSavingsAccount,
  createCurrentAccount,
} from "../../../api/accountApi";
import { useAccounts } from "../../../hooks/useAccounts";
import { getErrorMessage } from "../../../utils/helpers";
import { formatCurrency } from "../../../utils/formatCurrency";
import AccountCard from "../../../components/accounts/AccountCard";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

export default function AccountsPage() {
  const navigate = useNavigate();
  const { accounts, loading, fetchAccounts } = useAccounts();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCreate = async ({ type, branchId }) => {
    try {
      setCreating(true);
      setCreateErr("");
      if (type === "savings") {
        await createSavingsAccount({ branchId });
      } else {
        await createCurrentAccount({ branchId });
      }
      toast.success(
        `${type === "savings" ? "Savings" : "Current"} account created!`,
      );
      setModalOpen(false);
      fetchAccounts();
    } catch (err) {
      setCreateErr(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAccounts();
    setRefreshing(false);
    toast.success("Accounts refreshed!");
  };

  // Split accounts by type
  const savingsAccounts = accounts.filter((a) => !!a.interestRate);
  const currentAccounts = accounts.filter((a) => !a.interestRate);

  // Total balance
  const totalBalance = accounts.reduce(
    (sum, a) => sum + (Number(a.accountBalance) || 0),
    0,
  );

  return (
    <>
      <Helmet>
        <title>My Accounts — NexaBank</title>
        <meta name="robots" content="noindex" />
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
              My Accounts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your savings and current accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors disabled:opacity-50"
              aria-label="Refresh accounts"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            {accounts.length < 4 && (
              <Button
                size="md"
                onClick={() => navigate("/user/accounts/apply")}
              >
                <Plus size={16} />
                New Account
              </Button>
            )}
          </div>
        </div>

        {/* Account limit info */}
        <div
          className="flex items-start gap-3 p-4 rounded-2xl
                        bg-blue-50 dark:bg-blue-900/20
                        border border-blue-200 dark:border-blue-800"
        >
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You can create up to <strong>2 Savings</strong> and{" "}
            <strong>2 Current</strong> accounts. Currently:{" "}
            {savingsAccounts.length}/2 savings, {currentAccounts.length}/2
            current.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" text="Loading accounts..." />
          </div>
        ) : accounts.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={CreditCard}
              title="No accounts yet"
              description="Create your first savings or current account to get started with NexaBank."
              actionLabel="Create Account"
              onAction={() => navigate("/user/accounts/apply")}
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Total balance summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Balance",
                  value: formatCurrency(totalBalance),
                  sub: `Across ${accounts.length} account${accounts.length !== 1 ? "s" : ""}`,
                  bg: "bg-[#1a3c5e] text-white",
                },
                {
                  label: "Savings Balance",
                  value: formatCurrency(
                    savingsAccounts.reduce(
                      (s, a) => s + (Number(a.accountBalance) || 0),
                      0,
                    ),
                  ),
                  sub: `${savingsAccounts.length} savings account${savingsAccounts.length !== 1 ? "s" : ""}`,
                  bg: "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
                },
                {
                  label: "Current Balance",
                  value: formatCurrency(
                    currentAccounts.reduce(
                      (s, a) => s + (Number(a.accountBalance) || 0),
                      0,
                    ),
                  ),
                  sub: `${currentAccounts.length} current account${currentAccounts.length !== 1 ? "s" : ""}`,
                  bg: "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
                },
              ].map(({ label, value, sub, bg }) => (
                <div key={label} className={`rounded-2xl p-4 sm:p-5 ${bg}`}>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide
                                 mb-1 ${
                                   bg.includes("[#1a3c5e]")
                                     ? "text-white/60"
                                     : "text-gray-400"
                                 }`}
                  >
                    {label}
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-black
                                 ${
                                   bg.includes("[#1a3c5e]")
                                     ? "text-white"
                                     : "text-gray-900 dark:text-white"
                                 }`}
                  >
                    {value}
                  </p>
                  <p
                    className={`text-xs mt-0.5
                                 ${
                                   bg.includes("[#1a3c5e]")
                                     ? "text-white/40"
                                     : "text-gray-400"
                                 }`}
                  >
                    {sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Savings accounts */}
            {savingsAccounts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl bg-blue-100
                                  dark:bg-blue-900/40 flex items-center
                                  justify-center"
                  >
                    <PiggyBank
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h2
                      className="text-base font-black text-gray-900
                                   dark:text-white"
                    >
                      Savings Accounts
                    </h2>
                    <p className="text-xs text-gray-400">
                      {savingsAccounts.length}/2 accounts
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savingsAccounts.map((acc, i) => (
                    <AccountCard key={acc.accountId} account={acc} index={i} />
                  ))}
                  {savingsAccounts.length < 2 && (
                    <AddAccountPlaceholder
                      label="Add Savings Account"
                      onClick={() => navigate("/user/accounts/apply")}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Current accounts */}
            {currentAccounts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl bg-amber-100
                                  dark:bg-amber-900/40 flex items-center
                                  justify-center"
                  >
                    <Building2
                      size={16}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  <div>
                    <h2
                      className="text-base font-black text-gray-900
                                   dark:text-white"
                    >
                      Current Accounts
                    </h2>
                    <p className="text-xs text-gray-400">
                      {currentAccounts.length}/2 accounts
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentAccounts.map((acc, i) => (
                    <AccountCard key={acc.accountId} account={acc} index={i} />
                  ))}
                  {currentAccounts.length < 2 && (
                    <AddAccountPlaceholder
                      label="Add Current Account"
                      onClick={() => navigate("/user/accounts/apply")}
                    />
                  )}
                </div>
              </div>
            )}

            {/* No accounts of one type — show placeholders */}
            {savingsAccounts.length === 0 && accounts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl bg-blue-100
                                  dark:bg-blue-900/40 flex items-center
                                  justify-center"
                  >
                    <PiggyBank size={16} className="text-blue-600" />
                  </div>
                  <h2
                    className="text-base font-black text-gray-900
                                 dark:text-white"
                  >
                    Savings Accounts
                  </h2>
                </div>
                <AddAccountPlaceholder
                  label="Create Savings Account"
                  onClick={() => navigate("/user/accounts/apply")}
                  fullWidth
                />
              </div>
            )}

            {currentAccounts.length === 0 && accounts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl bg-amber-100
                                  dark:bg-amber-900/40 flex items-center
                                  justify-center"
                  >
                    <Building2 size={16} className="text-amber-600" />
                  </div>
                  <h2
                    className="text-base font-black text-gray-900
                                 dark:text-white"
                  >
                    Current Accounts
                  </h2>
                </div>
                <AddAccountPlaceholder
                  label="Create Current Account"
                  onClick={() => navigate("/user/accounts/apply")}
                  fullWidth
                />
              </div>
            )}
          </div>
        )}
      </div>
      
    </>
  );
}

// ── Add account placeholder card ──
function AddAccountPlaceholder({ label, onClick, fullWidth }) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-2xl p-5 sm:p-6 border-2 border-dashed
        border-gray-200 dark:border-gray-700
        hover:border-[#1a3c5e] dark:hover:border-blue-400
        flex flex-col items-center justify-center gap-2
        text-gray-400 hover:text-[#1a3c5e] dark:hover:text-blue-400
        transition-all duration-200 min-h-[160px] group
        ${fullWidth ? "w-full max-w-sm" : ""}
      `}
    >
      <div
        className="w-12 h-12 rounded-2xl bg-gray-100
                      dark:bg-gray-800 group-hover:bg-[#1a3c5e]/10
                      flex items-center justify-center transition-colors"
      >
        <Plus size={22} />
      </div>
      <span className="text-sm font-semibold text-center">{label}</span>
    </button>
  );
}
