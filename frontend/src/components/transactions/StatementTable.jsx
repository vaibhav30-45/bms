import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Download,
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import { useState } from "react";

// Transaction type icon map
const TXN_ICONS = {
  CREDIT: {
    Icon: TrendingUp,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    color: "text-emerald-600",
  },
  DEBIT: {
    Icon: TrendingDown,
    bg: "bg-red-100 dark:bg-red-900/30",
    color: "text-red-500",
  },
  TRANSFER: {
    Icon: ArrowLeftRight,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    color: "text-blue-600",
  },
};

const STATUS_ICONS = {
  SUCCESS: { Icon: CheckCircle2, color: "text-emerald-500" },
  FAILED: { Icon: XCircle, color: "text-red-500" },
  PENDING: { Icon: Clock, color: "text-amber-500" },
};

const PAGE_SIZE = 10;

// Summary bar shown above the table
function StatementSummary({ transactions }) {
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, txn) => {
        const amt = Number(txn.amount) || 0;
        if (txn.type === "CREDIT") {
          acc.totalCredit += amt;
          acc.creditCount += 1;
        } else if (txn.type === "DEBIT" || txn.type === "TRANSFER") {
          acc.totalDebit += amt;
          acc.debitCount += 1;
        }
        return acc;
      },
      { totalCredit: 0, creditCount: 0, totalDebit: 0, debitCount: 0 },
    );
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {[
        {
          label: "Total Credits",
          value: formatCurrency(summary.totalCredit),
          count: summary.creditCount,
          color: "text-emerald-600",
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          border: "border-emerald-200 dark:border-emerald-800",
          Icon: TrendingUp,
          iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
        },
        {
          label: "Total Debits",
          value: formatCurrency(summary.totalDebit),
          count: summary.debitCount,
          color: "text-red-600",
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          Icon: TrendingDown,
          iconBg: "bg-red-100 dark:bg-red-900/40",
        },
        {
          label: "Net Change",
          value: formatCurrency(summary.totalCredit - summary.totalDebit),
          count: transactions.length,
          color:
            summary.totalCredit >= summary.totalDebit
              ? "text-emerald-600"
              : "text-red-600",
          bg: "bg-gray-50 dark:bg-gray-800/50",
          border: "border-gray-200 dark:border-gray-700",
          Icon: Filter,
          iconBg: "bg-gray-100 dark:bg-gray-800",
        },
      ].map(({ label, value, count, color, bg, border, Icon, iconBg }) => (
        <div
          key={label}
          className={`flex items-center gap-3 p-4 rounded-2xl
                         border ${bg} ${border}`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center
                           justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon size={18} className={color} />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs text-gray-500 dark:text-gray-400
                          font-semibold"
            >
              {label}
            </p>
            <p
              className={`text-base sm:text-lg font-black ${color}
                           truncate`}
            >
              {value}
            </p>
            <p className="text-xs text-gray-400">
              {count} transaction{count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Individual transaction row — desktop table
function TxnTableRow({ txn, index }) {
  const typeConf = TXN_ICONS[txn.type] ?? TXN_ICONS.DEBIT;
  const statusConf = STATUS_ICONS[txn.status] ?? STATUS_ICONS.PENDING;
  const isCredit = txn.type === "CREDIT";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="border-b border-gray-50 dark:border-gray-800
                 hover:bg-gray-50/50 dark:hover:bg-gray-800/30
                 transition-colors"
    >
      {/* Type */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center
                           justify-center flex-shrink-0
                           ${typeConf.bg}`}
          >
            <typeConf.Icon size={15} className={typeConf.color} />
          </div>
          <div>
            <p
              className="text-sm font-bold text-gray-900 dark:text-white
                          capitalize"
            >
              {txn.type?.toLowerCase()}
            </p>
            <p className="text-xs text-gray-400">{txn.paymentMode}</p>
          </div>
        </div>
      </td>

      {/* Date */}
      <td
        className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400
                     whitespace-nowrap"
      >
        {formatDateTime(txn.date)}
      </td>

      {/* Amount */}
      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <span
          className={`text-sm font-black
          ${isCredit ? "text-emerald-600" : "text-red-500"}`}
        >
          {isCredit ? "+" : "−"}
          {formatCurrency(txn.amount)}
        </span>
      </td>

      {/* Balance after */}
      <td
        className="px-4 py-3.5 text-right text-sm font-semibold
                     text-gray-700 dark:text-gray-300 whitespace-nowrap"
      >
        {formatCurrency(txn.balanceAfter)}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <statusConf.Icon size={13} className={statusConf.color} />
          <Badge variant={txn.status} size="sm" />
        </div>
      </td>
    </motion.tr>
  );
}

// Mobile card view for each transaction
function TxnMobileCard({ txn, index }) {
  const typeConf = TXN_ICONS[txn.type] ?? TXN_ICONS.DEBIT;
  const isCredit = txn.type === "CREDIT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="flex items-center gap-3 py-3.5 border-b
                 border-gray-50 dark:border-gray-800 last:border-0"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center
                       justify-center flex-shrink-0 ${typeConf.bg}`}
      >
        <typeConf.Icon size={18} className={typeConf.color} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold text-gray-900 dark:text-white
                      capitalize"
        >
          {txn.type?.toLowerCase()}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {txn.paymentMode} · {formatDateTime(txn.date)}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className={`text-sm font-black
          ${isCredit ? "text-emerald-600" : "text-red-500"}`}
        >
          {isCredit ? "+" : "−"}
          {formatCurrency(txn.amount)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Bal: {formatCurrency(txn.balanceAfter)}
        </p>
        <Badge variant={txn.status} size="sm" className="mt-1" />
      </div>
    </motion.div>
  );
}

export default function StatementTable({
  transactions = [],
  loading = false,
  fromDate,
  toDate,
  onExport,
}) {
  const [page, setPage] = useState(1);

  // Reset to page 1 when transactions change
  useMemo(() => setPage(1), [transactions]);

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {/* Skeleton summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-100
                                    dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
        {/* Skeleton rows */}
        <div
          className="rounded-2xl border border-gray-100
                        dark:border-gray-800 overflow-hidden"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-4
                            border-b border-gray-50 dark:border-gray-800
                            last:border-0"
            >
              <div
                className="w-8 h-8 rounded-xl bg-gray-100
                              dark:bg-gray-700 animate-pulse flex-shrink-0"
              />
              <div className="flex-1 flex flex-col gap-1.5">
                <div
                  className="h-3.5 w-24 bg-gray-100 dark:bg-gray-700
                                rounded-lg animate-pulse"
                />
                <div
                  className="h-2.5 w-32 bg-gray-100 dark:bg-gray-700
                                rounded-lg animate-pulse"
                />
              </div>
              <div
                className="h-4 w-20 bg-gray-100 dark:bg-gray-700
                              rounded-lg animate-pulse"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No transactions found"
        description="No transactions match your filter criteria. Try adjusting the date range or transaction type."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <StatementSummary transactions={transactions} />

      {/* Date range + export */}
      <div
        className="flex flex-col sm:flex-row sm:items-center
                      justify-between gap-3"
      >
        {fromDate && toDate && (
          <div
            className="flex items-center gap-2 text-sm
                          text-gray-500 dark:text-gray-400"
          >
            <Calendar size={14} className="flex-shrink-0" />
            <span className="font-medium">{fromDate}</span>
            <span>→</span>
            <span className="font-medium">{toDate}</span>
            <span className="text-gray-400">
              ({transactions.length} transactions)
            </span>
          </div>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       border border-gray-200 dark:border-gray-700
                       text-sm font-semibold text-gray-600
                       dark:text-gray-400 hover:bg-gray-50
                       dark:hover:bg-gray-800 transition-colors
                       self-start sm:self-auto"
          >
            <Download size={15} />
            Export CSV
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div
        className="hidden sm:block rounded-2xl border border-gray-100
                      dark:border-gray-800 overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead
            className="bg-gray-50 dark:bg-gray-800/60 border-b
                            border-gray-100 dark:border-gray-800"
          >
            <tr>
              {[
                "Transaction",
                "Date & Time",
                "Amount",
                "Balance",
                "Status",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-black
                                  text-gray-500 dark:text-gray-400
                                  uppercase tracking-wider
                                  ${i >= 2 ? "text-right" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((txn, i) => (
              <TxnTableRow key={txn.transactionId} txn={txn} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div
        className="sm:hidden bg-white dark:bg-gray-900 rounded-2xl
                      border border-gray-100 dark:border-gray-800 px-4"
      >
        {paginated.map((txn, i) => (
          <TxnMobileCard key={txn.transactionId} txn={txn} index={i} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-2"
        />
      )}
    </div>
  );
}
