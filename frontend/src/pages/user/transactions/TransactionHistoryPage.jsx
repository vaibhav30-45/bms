import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  RefreshCw,
  FileText,
  CreditCard,
  Filter,
} from "lucide-react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAccounts } from "../../../hooks/useAccounts";
import { TRANSACTION_TYPES } from "../../../utils/constants";
import { toApiDate } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";
import StatementTable from "../../../components/transactions/StatementTable";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const { handleGetStatement, loading } = useTransactions();
  const { accounts, fetchAccounts, loading: accLoading } = useAccounts();
  const [selectedAccount, setSelectedAcc] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeType, setActiveType] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Auto-select first account when accounts load
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAcc(accounts[0]);
    }
  }, [accounts]);

  // Fetch transactions when selected account changes
  useEffect(() => {
    if (selectedAccount?.accountNumber) {
      fetchTxns(selectedAccount.accountNumber);
    }
  }, [selectedAccount?.accountNumber]);

  const fetchTxns = useCallback(
    async (accountNumber) => {
      const today = new Date();
      const from = new Date(today);
      from.setMonth(from.getMonth() - 3); // Last 3 months by default

      const res = await handleGetStatement({
        accountNumber,
        fromDate: toApiDate(from),
        toDate: toApiDate(today),
      });
      if (res.success) {
        setTransactions(res.data?.transactions ?? []);
        setFetched(true);
      }
    },
    [handleGetStatement],
  );

  const handleRefresh = async () => {
    if (!selectedAccount) return;
    setRefreshing(true);
    await fetchTxns(selectedAccount.accountNumber);
    setRefreshing(false);
    toast.success("Transactions refreshed!");
  };

  // Filter transactions by type
  const filteredTxns = transactions.filter((t) =>
    activeType === "ALL" ? true : t.type === activeType,
  );

  // Quick stats from transactions
  const stats = {
    totalCredit: transactions
      .filter((t) => t.type === "CREDIT")
      .reduce((s, t) => s + Number(t.amount), 0),
    totalDebit: transactions
      .filter((t) => t.type !== "CREDIT")
      .reduce((s, t) => s + Number(t.amount), 0),
    totalTxns: transactions.length,
  };

  const TYPE_TABS = [
    { value: "ALL", label: "All", Icon: Filter },
    { value: "CREDIT", label: "Credits", Icon: TrendingUp },
    { value: "DEBIT", label: "Debits", Icon: TrendingDown },
    { value: "TRANSFER", label: "Transfers", Icon: ArrowLeftRight },
  ];

  return (
    <>
      <Helmet>
        <title>Transaction History — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-[#1a3c5e]
                            flex items-center justify-center shadow-md"
            >
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black text-gray-900
                             dark:text-white"
              >
                Transaction History
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last 3 months across all accounts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading || !selectedAccount}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors disabled:opacity-50"
              aria-label="Refresh transactions"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <Button
              size="md"
              variant="outline"
              onClick={() => navigate("/user/statement")}
            >
              <FileText size={15} />
              Full Statement
            </Button>
          </div>
        </div>

        {/* Account selector tabs */}
        {accLoading ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-40 rounded-2xl bg-gray-100
                              dark:bg-gray-800 animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div
            className="flex gap-3 overflow-x-auto pb-1
                          scrollbar-thin"
          >
            {accounts.map((acc) => {
              const isSelected = selectedAccount?.accountId === acc.accountId;
              const isSavings = !!acc.interestRate;
              return (
                <button
                  key={acc.accountId}
                  onClick={() => {
                    setSelectedAcc(acc);
                    setActiveType("ALL");
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl
                    border-2 flex-shrink-0 transition-all duration-200
                    text-left
                    ${
                      isSelected
                        ? "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:border-blue-400 dark:bg-blue-400/10"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                    }
                  `}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center
                                   justify-center flex-shrink-0
                                   ${
                                     isSavings
                                       ? "bg-blue-100 dark:bg-blue-900/40"
                                       : "bg-amber-100 dark:bg-amber-900/40"
                                   }`}
                  >
                    <CreditCard
                      size={16}
                      className={
                        isSavings
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-black truncate
                      ${
                        isSelected
                          ? "text-[#1a3c5e] dark:text-blue-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      ••••&nbsp;{acc.accountNumber?.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {formatCurrency(acc.accountBalance)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Quick stats */}
        {fetched && selectedAccount && (
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Credits",
                value: formatCurrency(stats.totalCredit),
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
              },
              {
                label: "Debits",
                value: formatCurrency(stats.totalDebit),
                color: "text-red-600",
                bg: "bg-red-50 dark:bg-red-900/20",
              },
              {
                label: "Total Txns",
                value: stats.totalTxns,
                color: "text-[#1a3c5e] dark:text-blue-400",
                bg: "bg-[#1a3c5e]/5 dark:bg-blue-400/10",
              },
            ].map(({ label, value, color, bg }) => (
              <div
                key={label}
                className={`rounded-2xl p-3 sm:p-4 ${bg} text-center`}
              >
                <p
                  className={`text-base sm:text-xl font-black ${color}
                               truncate`}
                >
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Type filter tabs */}
        {fetched && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {TYPE_TABS.map(({ value, label, Icon }) => {
              const count =
                value === "ALL"
                  ? transactions.length
                  : transactions.filter((t) => t.type === value).length;

              return (
                <button
                  key={value}
                  onClick={() => setActiveType(value)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl
                    text-xs font-bold transition-all duration-150
                    whitespace-nowrap flex-shrink-0
                    ${
                      activeType === value
                        ? "bg-[#1a3c5e] text-white shadow-md shadow-[#1a3c5e]/20"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon size={13} />
                  {label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px]
                    ${
                      activeType === value
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Transactions */}
        {!selectedAccount ? (
          <Card padding="lg">
            <EmptyState
              icon={CreditCard}
              title="No accounts found"
              description="Create an account to start seeing transaction history."
              actionLabel="Create Account"
              onAction={() => navigate("/user/accounts")}
            />
          </Card>
        ) : loading && !refreshing ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" text="Loading transactions..." />
          </div>
        ) : (
          <StatementTable
            transactions={filteredTxns}
            loading={loading && !refreshing}
            fromDate={(() => {
              const d = new Date();
              d.setMonth(d.getMonth() - 3);
              return toApiDate(d);
            })()}
            toDate={toApiDate(new Date())}
          />
        )}
      </div>
    </>
  );
}
