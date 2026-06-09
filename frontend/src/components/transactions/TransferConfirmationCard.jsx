import { motion } from "framer-motion";
import { User, ArrowRight, CheckCircle2, CreditCard } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function TransferConfirmationCard({
  senderAccount,
  receiverData,
  amount,
  paymentMode,
  onConfirm,
  onCancel,
  loading,
}) {
  if (!receiverData?.exists) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-[#1a3c5e]/20
                 dark:border-blue-400/20 bg-[#1a3c5e]/3
                 dark:bg-blue-400/5 p-5 sm:p-6"
    >
      <h3
        className="text-sm font-black text-gray-900 dark:text-white
                     uppercase tracking-wide mb-5"
      >
        Confirm Transfer
      </h3>

      {/* Transfer flow visualization */}
      <div
        className="flex flex-col sm:flex-row items-center
                      justify-between gap-4 mb-6"
      >
        {/* Sender */}
        <div
          className="flex flex-col items-center gap-2 flex-1
                        text-center"
        >
          <div
            className="w-12 h-12 rounded-2xl bg-[#1a3c5e]
                          flex items-center justify-center shadow-md"
          >
            <CreditCard size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
            <p
              className="text-sm font-black text-gray-900
                          dark:text-white"
            >
              ••••&nbsp;{senderAccount?.slice(-4)}
            </p>
          </div>
        </div>

        {/* Arrow + amount */}
        <div
          className="flex flex-col items-center gap-1.5
                        sm:flex-1 text-center"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-0.5 w-8 sm:w-12 bg-gradient-to-r
                            from-transparent to-[#1a3c5e]
                            dark:to-blue-400"
            />
            <div
              className="w-8 h-8 rounded-full bg-[#1a3c5e]
                            dark:bg-blue-500 flex items-center
                            justify-center shadow-md flex-shrink-0"
            >
              <ArrowRight size={14} className="text-white" />
            </div>
            <div
              className="h-0.5 w-8 sm:w-12 bg-gradient-to-r
                            from-[#1a3c5e] to-transparent
                            dark:from-blue-400"
            />
          </div>
          <div
            className="px-4 py-1.5 rounded-xl bg-[#1a3c5e]
                          dark:bg-blue-600 shadow-md"
          >
            <p className="text-white text-sm font-black whitespace-nowrap">
              {formatCurrency(amount)}
            </p>
          </div>
          <p className="text-xs text-gray-400">{paymentMode}</p>
        </div>

        {/* Receiver */}
        <div
          className="flex flex-col items-center gap-2 flex-1
                        text-center"
        >
          <div
            className="w-12 h-12 rounded-2xl bg-emerald-500
                          flex items-center justify-center shadow-md"
          >
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
            <p
              className="text-sm font-black text-gray-900
                          dark:text-white"
            >
              {receiverData.accountHolderName}
            </p>
            <p className="text-xs text-gray-400">
              ••••&nbsp;{receiverData.accountNumber?.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Details table */}
      <div
        className="bg-white dark:bg-gray-900 rounded-xl
                      border border-gray-100 dark:border-gray-800
                      divide-y divide-gray-50 dark:divide-gray-800
                      mb-5"
      >
        {[
          { label: "Receiver Name", value: receiverData.accountHolderName },
          {
            label: "Receiver Account",
            value: `••••  ${receiverData.accountNumber?.slice(-4)}`,
          },
          { label: "Amount", value: formatCurrency(amount) },
          { label: "Payment Mode", value: paymentMode },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between
                          px-4 py-3"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </span>
            <span
              className="text-sm font-bold text-gray-900
                             dark:text-white"
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Verified badge */}
      <div
        className="flex items-center gap-2 mb-5 p-3
                      rounded-xl bg-emerald-50 dark:bg-emerald-900/20
                      border border-emerald-200 dark:border-emerald-800"
      >
        <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
        <p
          className="text-xs font-semibold text-emerald-700
                      dark:text-emerald-400"
        >
          Account verified. Transfer is safe to proceed.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2
                     py-3 px-5 rounded-xl bg-[#1a3c5e] text-white
                     text-sm font-black hover:bg-[#15304d]
                     transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed shadow-md"
        >
          {loading ? (
            <div
              className="w-4 h-4 border-2 border-white
                            border-t-transparent rounded-full animate-spin"
            />
          ) : (
            <CheckCircle2 size={16} />
          )}
          {loading ? "Processing..." : "Confirm Transfer"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 px-5 rounded-xl border-2
                     border-gray-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-400
                     text-sm font-bold hover:bg-gray-50
                     dark:hover:bg-gray-800 transition-colors
                     disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
