import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import Button from "../common/Button";

export default function CashSlotReceipt({
  slotResult,
  onNewTransaction,
  variant = "deposit",
}) {
  const isWithdraw = variant === "withdraw";
  const slotDate =
    slotResult.slotDate ??
    (slotResult.slotDateTime ? formatDate(slotResult.slotDateTime) : "—");
  const slotTimeRange =
    slotResult.startTime && slotResult.endTime
      ? `${slotResult.startTime} – ${slotResult.endTime}`
      : slotResult.slotDateTime
        ? formatDateTime(slotResult.slotDateTime)
        : "—";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center text-center gap-5"
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center
          ${isWithdraw ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}
      >
        <CheckCircle2
          size={40}
          className={isWithdraw ? "text-red-500" : "text-emerald-500"}
        />
      </div>
      <div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
          Slot Assigned!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isWithdraw
            ? "Visit the branch at your slot time to withdraw cash."
            : "Visit the branch at your slot time to deposit cash."}
        </p>
      </div>
      <div
        className="w-full max-w-sm bg-gray-50 dark:bg-gray-800/50 rounded-2xl
                      border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div
          className={`p-5 text-center ${isWithdraw ? "bg-red-500" : "bg-emerald-500"}`}
        >
          <p className="text-white/70 text-xs mb-1">Your Token</p>
          <p className="text-white text-2xl font-black">
            {slotResult.tokenNumber}
          </p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {[
            { label: "Branch", value: slotResult.branchName },
            { label: "Date", value: slotDate },
            { label: "Slot Time", value: slotTimeRange },
            { label: "Amount", value: formatCurrency(slotResult.amount) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button size="md" onClick={onNewTransaction} className="flex-1">
          <RotateCcw size={15} />
          {isWithdraw ? "New Withdrawal" : "New Deposit"}
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1"
        >
          Go Back
        </Button>
      </div>
    </motion.div>
  );
}
