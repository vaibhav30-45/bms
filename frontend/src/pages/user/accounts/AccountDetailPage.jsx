import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileText,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { getAccountById } from "../../../api/accountApi";
import { getStatement } from "../../../api/transactionApi";
import { getErrorMessage } from "../../../utils/helpers";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";
import AccountDetailsCard from "../../../components/accounts/AccountDetailsCard";
import Loader from "../../../components/common/Loader";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";
import Alert from "../../../components/common/Alert";

export default function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txnLoading, setTxnLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAccountById(id);
      const data = res.data?.data ?? res.data;
      setAccount(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTxns = async (accountNumber) => {
    try {
      setTxnLoading(true);
      const today = new Date();
      const from = new Date(today);
      from.setMonth(from.getMonth() - 1);
      const res = await getStatement({
        accountNumber,
        fromDate: from.toISOString().split("T")[0],
        toDate: today.toISOString().split("T")[0],
      });
      const list = res.data?.data?.transactions ?? res.data?.transactions ?? [];
      setTxns(list.slice(0, 8));
    } catch {
      // Silently fail
    } finally {
      setTxnLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [id]);

  useEffect(() => {
    if (account?.accountNumber) {
      fetchRecentTxns(account.accountNumber);
    }
  }, [account?.accountNumber]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAccount();
    if (account?.accountNumber) {
      await fetchRecentTxns(account.accountNumber);
    }
    setRefreshing(false);
    toast.success("Account refreshed!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="lg" text="Loading account details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <Alert
          type="error"
          title="Failed to load account"
          message={error}
          show
        />
        <Button
          variant="outline"
          size="md"
          className="mt-4"
          onClick={() => navigate("/user/accounts")}
        >
          <ArrowLeft size={15} />
          Back to Accounts
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Account Details — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/user/accounts")}
              className="p-2 rounded-xl text-gray-500
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors"
              aria-label="Back to accounts"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black text-gray-900
                             dark:text-white"
              >
                Account Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ••••&nbsp;{account?.accountNumber?.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Account details */}
        <AccountDetailsCard account={account} />

        {/* Quick actions */}
        <div>
          <h2
            className="text-base font-black text-gray-900 dark:text-white
                         mb-3"
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                Icon: Calendar,
                label: " Book Deposit",
                color: "bg-emerald-500",
                path: "/user/deposit",
              },
              {
                Icon: TrendingDown,
                label: "Withdraw",
                color: "bg-red-500",
                path: "/user/withdraw",
              },
              // {
              //   Icon: ArrowLeftRight,
              //   label: "Transfer",
              //   color: "bg-[#1a3c5e]",
              //   path: "/user/transfer",
              // },
              {
                Icon: FileText,
                label: "Statement",
                color: "bg-amber-500",
                path: `/user/statement?account=${account?.accountNumber}`,
              },
            ].map(({ Icon, label, color, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-2 p-4
                           rounded-2xl bg-white dark:bg-gray-900
                           border border-gray-100 dark:border-gray-800
                           hover:shadow-md hover:-translate-y-0.5
                           transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl
                                 flex items-center justify-center ${color}`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <span
                  className="text-xs sm:text-sm font-semibold
                                 text-gray-700 dark:text-gray-300"
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-base font-black text-gray-900
                             dark:text-white"
              >
                Recent Transactions
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 30 days</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(`/user/statement?account=${account?.accountNumber}`)
              }
            >
              View All
            </Button>
          </div>

          {txnLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="sm" text="Loading transactions..." />
            </div>
          ) : txns.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No transactions yet"
              description="Transactions for this account will appear here."
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {txns.map((txn) => {
                const isCredit = txn.type === "CREDIT";
                return (
                  <div
                    key={txn.transactionId}
                    className="flex items-center gap-3 py-3"
                  >
                    <div
                      className={`
                      w-9 h-9 rounded-xl flex items-center
                      justify-center flex-shrink-0
                      ${
                        isCredit
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }
                    `}
                    >
                      {isCredit ? (
                        <TrendingUp size={16} className="text-emerald-600" />
                      ) : (
                        <TrendingDown size={16} className="text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-gray-800
                                    dark:text-gray-200 truncate capitalize"
                      >
                        {txn.type?.toLowerCase()}
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
                      <p className="text-xs text-gray-400">
                        {formatCurrency(txn.balanceAfter)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
