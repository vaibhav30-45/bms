import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PiggyBank,
  Building2,
  TrendingUp,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import Badge from "../common/Badge";

export default function AccountCard({ account, index = 0 }) {
  const navigate = useNavigate();
  const isSavings = !!account.interestRate;

  const gradients = [
    "from-[#1a3c5e] to-[#0f2033]",
    "from-[#1e4976] to-[#0f2033]",
    "from-[#0f2033] to-[#1a3c5e]",
    "from-[#162d45] to-[#0a1929]",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/user/accounts/${account.accountId}`)}
      className={`
        relative rounded-2xl bg-gradient-to-br ${gradient}
        border border-white/10 shadow-lg cursor-pointer
        overflow-hidden p-5 sm:p-6
      `}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-white/5
                      to-transparent pointer-events-none rounded-2xl"
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between mb-5 sm:mb-6">
        <div>
          <p className="text-white/50 text-xs font-semibold mb-1">
            {isSavings ? "Savings Account" : "Current Account"}
          </p>
          <p
            className="text-white font-mono text-sm font-bold
                        tracking-widest"
          >
            ••••&nbsp;••••&nbsp;
            {account.accountNumber?.slice(-4) ?? "0000"}
          </p>
        </div>
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl
                        bg-white/10 flex items-center justify-center
                        flex-shrink-0"
        >
          {isSavings ? (
            <PiggyBank size={18} className="text-amber-400" />
          ) : (
            <Building2 size={18} className="text-blue-300" />
          )}
        </div>
      </div>

      {/* Balance */}
      <div className="relative mb-4">
        <p className="text-white/40 text-xs mb-0.5">Available Balance</p>
        <p
          className="text-white text-2xl sm:text-3xl font-black
                      tracking-tight"
        >
          {formatCurrency(account.accountBalance)}
        </p>
      </div>

      {/* Bottom row */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={account.accountStatus ?? "ACTIVE"} size="sm" dot />
          {isSavings && account.interestRate && (
            <span className="text-white/40 text-xs">
              {account.interestRate}% p.a
            </span>
          )}
          {!isSavings && account.overdraftLimit && (
            <span className="text-white/40 text-xs">
              OD: {formatCurrency(account.overdraftLimit)}
            </span>
          )}
        </div>
        <div
          className="flex items-center gap-1.5 text-white/50
                        hover:text-white transition-colors"
        >
          <Eye size={13} />
          <span className="text-xs font-semibold">View</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* Min balance warning */}
      {account.accountBalance < account.minimumRequiredBalance && (
        <div
          className="relative mt-3 flex items-center gap-2 px-3 py-2
                        rounded-xl bg-red-500/20 border border-red-500/30"
        >
          <AlertCircle size={13} className="text-red-300 flex-shrink-0" />
          <p className="text-red-200 text-xs font-medium">
            Below minimum balance (
            {formatCurrency(account.minimumRequiredBalance)})
          </p>
        </div>
      )}
    </motion.div>
  );
}
