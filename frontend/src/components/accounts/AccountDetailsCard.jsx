import {
  PiggyBank,
  Building2,
  Calendar,
  Hash,
  Banknote,
  TrendingUp,
  AlertTriangle,
  Clock,
  CreditCard,
  Percent,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import Badge from "../common/Badge";
import Card from "../common/Card";

function DetailRow({ icon: Icon, label, value, highlight }) {
  return (
    <div
      className="flex items-start gap-3 py-3 border-b
                    border-gray-50 dark:border-gray-800 last:border-0"
    >
      <div
        className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800
                      flex items-center justify-center flex-shrink-0 mt-0.5"
      >
        <Icon size={15} className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold text-gray-400 dark:text-gray-500
                      uppercase tracking-wide mb-0.5"
        >
          {label}
        </p>
        <p
          className={`text-sm font-bold break-words
          ${
            highlight
              ? "text-[#1a3c5e] dark:text-blue-400"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default function AccountDetailsCard({ account }) {
  if (!account) return null;

  const isSavings = !!account.interestRate;
  const isOverMin = account.accountBalance >= account.minimumRequiredBalance;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* Balance hero */}
      <div
        className="relative rounded-2xl bg-gradient-to-br
                      from-[#1a3c5e] to-[#0f2033]
                      border border-white/10 shadow-xl overflow-hidden p-6"
      >
        <div
          className="absolute inset-0 bg-gradient-to-tr from-white/5
                        to-transparent pointer-events-none"
        />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/50 text-xs font-semibold mb-1">
                {isSavings ? "Savings Account" : "Current Account"}
              </p>
              <p
                className="text-white font-mono text-sm font-bold
                            tracking-widest"
              >
                {account.accountNumber ?? "—"}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-2xl bg-white/10
                            flex items-center justify-center"
            >
              {isSavings ? (
                <PiggyBank size={20} className="text-amber-400" />
              ) : (
                <Building2 size={20} className="text-blue-300" />
              )}
            </div>
          </div>

          <p className="text-white/40 text-xs mb-1">Current Balance</p>
          <p
            className="text-white text-3xl sm:text-4xl font-black
                        tracking-tight mb-4"
          >
            {formatCurrency(account.accountBalance)}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={account.accountStatus ?? "ACTIVE"} size="sm" dot />
            <span className="text-white/40 text-xs">
              {account.branchName ?? "—"}
            </span>
            <span className="text-white/40 text-xs">
              Since {account.createdOn ? formatDate(account.createdOn) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Minimum balance warning */}
      {!isOverMin && (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl
                        bg-red-50 dark:bg-red-900/20
                        border border-red-200 dark:border-red-800"
        >
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800 dark:text-red-300">
              Below Minimum Balance
            </p>
            <p className="text-xs text-red-700 dark:text-red-400">
              Please deposit at least{" "}
              {formatCurrency(
                account.minimumRequiredBalance - account.accountBalance,
              )}{" "}
              to meet the minimum balance requirement of{" "}
              {formatCurrency(account.minimumRequiredBalance)}.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Base account details */}
        <Card padding="md">
          <h3
            className="text-xs font-black text-gray-900 dark:text-white
                         uppercase tracking-wide mb-1"
          >
            Account Details
          </h3>
          <p className="text-xs text-gray-400 mb-4">Core account information</p>
          <DetailRow icon={Hash} label="Account ID" value={account.accountId} />
          <DetailRow
            icon={CreditCard}
            label="Account Number"
            value={account.accountNumber}
          />
          <DetailRow
            icon={Building2}
            label="Branch"
            value={account.branchName}
          />
          <DetailRow
            icon={Banknote}
            label="Min. Required Balance"
            value={formatCurrency(account.minimumRequiredBalance)}
          />
          <DetailRow
            icon={Calendar}
            label="Opened On"
            value={account.createdOn ? formatDate(account.createdOn) : "—"}
          />
          <DetailRow
            icon={Clock}
            label="Account Status"
            value={account.isActive ? "Active" : "Inactive"}
          />
        </Card>

        {/* Type-specific details */}
        <Card padding="md">
          {isSavings ? (
            <>
              <h3
                className="text-xs font-black text-gray-900
                             dark:text-white uppercase tracking-wide mb-1"
              >
                Savings Details
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Savings account specific information
              </p>
              <DetailRow
                icon={Percent}
                label="Interest Rate"
                value={`${account.interestRate}% per annum`}
                highlight
              />
              <DetailRow
                icon={Banknote}
                label="Withdrawal Limit"
                value={formatCurrency(account.withdrawalLimit)}
              />
              <DetailRow
                icon={TrendingUp}
                label="Daily Txn Limit"
                value={formatCurrency(account.dailyTxnLimit)}
              />
              <DetailRow
                icon={Hash}
                label="Max Withdrawals"
                value={`${account.maxWithdrawals} per period`}
              />
              <DetailRow
                icon={Calendar}
                label="Last Interest Date"
                value={
                  account.lastInterestDate
                    ? formatDate(account.lastInterestDate)
                    : "—"
                }
              />
            </>
          ) : (
            <>
              <h3
                className="text-xs font-black text-gray-900
                             dark:text-white uppercase tracking-wide mb-1"
              >
                Current Account Details
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Current account specific information
              </p>
              <DetailRow
                icon={Banknote}
                label="Overdraft Limit"
                value={formatCurrency(account.overdraftLimit)}
                highlight
              />
              <DetailRow
                icon={Percent}
                label="Overdraft Interest"
                value={`${account.overdraftIntRate}% per annum`}
              />
              <DetailRow
                icon={Banknote}
                label="Monthly Service Fee"
                value={formatCurrency(account.monthlyServiceFee)}
              />
              <DetailRow
                icon={Hash}
                label="Free Transactions"
                value={`${account.freeTransLimit} per month`}
              />
              <DetailRow
                icon={AlertTriangle}
                label="Overdraft Active"
                value={account.overdraftUsed ? "Yes" : "No"}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
