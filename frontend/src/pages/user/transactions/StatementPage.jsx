import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  FileText,
  Search,
  Filter,
  X,
  Calendar,
  CreditCard,
  Download,
} from "lucide-react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAccounts } from "../../../hooks/useAccounts";
import { TRANSACTION_TYPES } from "../../../utils/constants";
import { toApiDate } from "../../../utils/formatDate";
import StatementTable from "../../../components/transactions/StatementTable";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import Alert from "../../../components/common/Alert";

const schema = yup.object({
  accountNumber: yup.string().required("Select an account"),
  fromDate: yup.string().required("Start date is required"),
  toDate: yup.string().required("End date is required"),
  transactionType: yup.string().nullable(),
});

// Quick date range presets
const DATE_PRESETS = [
  { label: "This Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "This Year", days: 365 },
];

function getPresetDates(days) {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - days);
  return {
    fromDate: toApiDate(from),
    toDate: toApiDate(today),
  };
}

// CSV export utility
function exportToCsv(transactions, accountNumber, fromDate, toDate) {
  const headers = [
    "Transaction ID",
    "Date",
    "Type",
    "Payment Mode",
    "Amount",
    "Balance After",
    "Status",
  ];
  const rows = transactions.map((t) => [
    t.transactionId,
    t.date,
    t.type,
    t.paymentMode,
    t.amount,
    t.balanceAfter,
    t.status,
  ]);

  const csvContent = [
    `Account: ${accountNumber}`,
    `Period: ${fromDate} to ${toDate}`,
    "",
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `statement_${accountNumber}_${fromDate}_${toDate}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Statement exported!");
}

export default function StatementPage() {
  const [searchParams] = useSearchParams();
  const { handleGetStatement, loading, error, setError } = useTransactions();
  const { accounts, fetchAccounts, loading: accLoading } = useAccounts();
  const [transactions, setTransactions] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [stmtMeta, setStmtMeta] = useState(null);

  // Get account from URL param if navigated from account detail
  const preselectedAccount = searchParams.get("account");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      accountNumber: preselectedAccount ?? "",
      fromDate: getPresetDates(30).fromDate,
      toDate: getPresetDates(30).toDate,
      transactionType: "",
    },
  });

  const watchedAccount = watch("accountNumber");
  const watchedFrom = watch("fromDate");
  const watchedTo = watch("toDate");

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Auto-fetch if account pre-selected from URL
  useEffect(() => {
    if (preselectedAccount && accounts.length > 0) {
      setValue("accountNumber", preselectedAccount);
      // Auto-submit with default 30-day range
      const { fromDate, toDate } = getPresetDates(30);
      fetchStatement({
        accountNumber: preselectedAccount,
        fromDate,
        toDate,
        transactionType: "",
      });
    }
  }, [preselectedAccount, accounts]);

  const fetchStatement = useCallback(
    async (data) => {
      const payload = {
        accountNumber: data.accountNumber,
        fromDate: data.fromDate,
        toDate: data.toDate,
      };
      if (data.transactionType) {
        payload.transactionType = data.transactionType;
      }
      const res = await handleGetStatement(payload);
      if (res.success) {
        const txns = res.data?.transactions ?? [];
        setTransactions(txns);
        setStmtMeta({
          fromDate: res.data?.fromDate ?? data.fromDate,
          toDate: res.data?.toDate ?? data.toDate,
          account: data.accountNumber,
        });
        setFetched(true);
        setFilterOpen(false);
        if (txns.length === 0) {
          toast.info("No transactions found for the selected period.");
        }
      }
    },
    [handleGetStatement],
  );

  const onSubmit = (data) => fetchStatement(data);

  const applyPreset = (days) => {
    const { fromDate, toDate } = getPresetDates(days);
    setValue("fromDate", fromDate);
    setValue("toDate", toDate);
  };

  const handleExport = () => {
    if (!stmtMeta || transactions.length === 0) return;
    exportToCsv(
      transactions,
      stmtMeta.account,
      stmtMeta.fromDate,
      stmtMeta.toDate,
    );
  };

  return (
    <>
      <Helmet>
        <title>Account Statement — NexaBank</title>
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
              className="w-10 h-10 rounded-2xl bg-amber-500
                            flex items-center justify-center shadow-md"
            >
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black text-gray-900
                             dark:text-white"
              >
                Account Statement
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and export your transaction history
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="md"
              variant="outline"
              onClick={() => setFilterOpen((p) => !p)}
            >
              <Filter size={15} />
              {filterOpen ? "Hide Filters" : "Filters"}
            </Button>
            {fetched && transactions.length > 0 && (
              <Button size="md" variant="ghost" onClick={handleExport}>
                <Download size={15} />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {(filterOpen || !fetched) && (
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-black text-gray-900
                             dark:text-white uppercase tracking-wide"
              >
                Statement Filters
              </h3>
              {fetched && (
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400
                             hover:bg-gray-100 dark:hover:bg-gray-800
                             transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <Alert
              type="error"
              message={error}
              show={!!error}
              onClose={() => setError("")}
              className="mb-4"
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* Account selector */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300"
                >
                  Account <span className="text-red-500">*</span>
                </label>
                {accLoading ? (
                  <div
                    className="h-12 rounded-xl bg-gray-100
                                  dark:bg-gray-800 animate-pulse"
                  />
                ) : (
                  <select
                    {...register("accountNumber")}
                    className={`
                      w-full px-4 py-3 rounded-xl border text-sm
                      font-medium bg-white dark:bg-gray-900
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-3
                      transition-all duration-200
                      ${
                        errors.accountNumber
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                      }
                    `}
                  >
                    <option value="">Select account...</option>
                    {accounts.map((acc) => (
                      <option key={acc.accountId} value={acc.accountNumber}>
                        ••••&nbsp;{acc.accountNumber?.slice(-4)} (
                        {acc.interestRate ? "Savings" : "Current"}) — Bal:{" "}
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(acc.accountBalance ?? 0)}
                      </option>
                    ))}
                  </select>
                )}
                {errors.accountNumber && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>

              {/* Date presets */}
              <div>
                <p
                  className="text-xs font-semibold text-gray-500
                               dark:text-gray-400 uppercase tracking-wide
                               mb-2"
                >
                  Quick Select
                </p>
                <div className="flex flex-wrap gap-2">
                  {DATE_PRESETS.map(({ label, days }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => applyPreset(days)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold
                                 border border-gray-200 dark:border-gray-700
                                 text-gray-600 dark:text-gray-400
                                 hover:border-[#1a3c5e] hover:text-[#1a3c5e]
                                 dark:hover:border-blue-400
                                 dark:hover:text-blue-400
                                 transition-all duration-150"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold text-gray-700
                                     dark:text-gray-300"
                  >
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={15}
                      className="absolute left-3.5 top-1/2
                                         -translate-y-1/2 text-gray-400
                                         pointer-events-none"
                    />
                    <input
                      type="date"
                      {...register("fromDate")}
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-xl border
                        text-sm font-medium bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-3
                        transition-all duration-200
                        ${
                          errors.fromDate
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                        }
                      `}
                    />
                  </div>
                  {errors.fromDate && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.fromDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold text-gray-700
                                     dark:text-gray-300"
                  >
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={15}
                      className="absolute left-3.5 top-1/2
                                         -translate-y-1/2 text-gray-400
                                         pointer-events-none"
                    />
                    <input
                      type="date"
                      {...register("toDate")}
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-xl border
                        text-sm font-medium bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-3
                        transition-all duration-200
                        ${
                          errors.toDate
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                        }
                      `}
                    />
                  </div>
                  {errors.toDate && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.toDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Transaction type filter */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300"
                >
                  Transaction Type
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value=""
                      {...register("transactionType")}
                      className="sr-only peer"
                    />
                    <div
                      className="px-3 py-2 rounded-xl border-2
                                    text-xs font-bold cursor-pointer
                                    transition-all border-gray-100
                                    dark:border-gray-800 text-gray-500
                                    peer-checked:border-[#1a3c5e]
                                    peer-checked:bg-[#1a3c5e]/5
                                    peer-checked:text-[#1a3c5e]
                                    dark:peer-checked:border-blue-400
                                    dark:peer-checked:text-blue-400
                                    hover:border-gray-300"
                    >
                      All Types
                    </div>
                  </label>
                  {TRANSACTION_TYPES.map((t) => (
                    <label key={t} className="cursor-pointer">
                      <input
                        type="radio"
                        value={t}
                        {...register("transactionType")}
                        className="sr-only peer"
                      />
                      <div
                        className="px-3 py-2 rounded-xl border-2
                                      text-xs font-bold cursor-pointer
                                      transition-all border-gray-100
                                      dark:border-gray-800 text-gray-500
                                      peer-checked:border-[#1a3c5e]
                                      peer-checked:bg-[#1a3c5e]/5
                                      peer-checked:text-[#1a3c5e]
                                      dark:peer-checked:border-blue-400
                                      dark:peer-checked:text-blue-400
                                      hover:border-gray-300"
                      >
                        {t}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                disabled={accLoading}
              >
                <Search size={16} />
                Fetch Statement
              </Button>
            </form>
          </Card>
        )}

        {/* Results */}
        {fetched && (
          <div>
            {/* Active filters summary */}
            {!filterOpen && stmtMeta && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="text-xs text-gray-500
                                 dark:text-gray-400 font-semibold"
                >
                  Showing:
                </span>
                <div
                  className="flex items-center gap-1.5 px-3 py-1
                                rounded-full bg-[#1a3c5e]/8
                                dark:bg-blue-400/10 text-xs font-bold
                                text-[#1a3c5e] dark:text-blue-400"
                >
                  <CreditCard size={11} />
                  ••••&nbsp;{stmtMeta.account?.slice(-4)}
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1
                                rounded-full bg-gray-100 dark:bg-gray-800
                                text-xs font-bold text-gray-600
                                dark:text-gray-400"
                >
                  <Calendar size={11} />
                  {stmtMeta.fromDate} → {stmtMeta.toDate}
                </div>
                <button
                  onClick={() => setFilterOpen(true)}
                  className="text-xs text-[#1a3c5e] dark:text-blue-400
                             hover:underline font-semibold"
                >
                  Change filters
                </button>
              </div>
            )}

            <StatementTable
              transactions={transactions}
              loading={loading}
              fromDate={stmtMeta?.fromDate}
              toDate={stmtMeta?.toDate}
              onExport={transactions.length > 0 ? handleExport : undefined}
            />
          </div>
        )}
      </div>
    </>
  );
}
