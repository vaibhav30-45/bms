import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TrendingDown,
  CheckCircle2,
  RotateCcw,
  Banknote,
  CreditCard,
  Info,
  ArrowRight,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAccounts } from "../../../hooks/useAccounts";
import { BRANCHES } from "../../../utils/branchData";
import { formatCurrency } from "../../../utils/formatCurrency";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import Alert from "../../../components/common/Alert";
import BranchDropdown from "../../../components/common/BranchDropdown";
import SlotPicker from "../../../components/common/SlotPicker";

const schema = yup.object({
  accountNumber: yup.string().required("Select an account"),
  branchId: yup
    .number()
    .typeError("Select a branch")
    .positive("Select a branch")
    .required("Select a branch"),
  amount: yup
    .number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});

// ── Withdraw Slot Token ────────────────────────
function WithdrawSlotToken({ slot, onNewBooking }) {
  const formatTime = (time) => {
    if (!time) return "—";
    const [h, m] = time.toString().split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center gap-6"
    >
      <div
        className="w-20 h-20 rounded-full bg-red-100
                      dark:bg-red-900/30 flex items-center
                      justify-center"
      >
        <CheckCircle2 size={40} className="text-red-500" />
      </div>

      <div>
        <h2
          className="text-xl font-black text-gray-900
                       dark:text-white mb-1"
        >
          Withdrawal Slot Booked!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visit the branch at your chosen time. Money is deducted after the
          teller processes your request.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div
          className="bg-red-600 rounded-t-2xl p-5 text-center
                        relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-gradient-to-tr
                          from-white/5 to-transparent
                          pointer-events-none"
          />
          <p
            className="text-white/60 text-xs font-semibold
                        uppercase tracking-widest mb-1"
          >
            Withdrawal Token
          </p>
          <p
            className="text-white text-3xl sm:text-4xl font-black
                        tracking-widest font-mono"
          >
            {slot.tokenNumber}
          </p>
        </div>

        <div
          className="bg-white dark:bg-gray-900 rounded-b-2xl
                        border border-t-0 border-gray-100
                        dark:border-gray-800 overflow-hidden"
        >
          <div
            className="grid grid-cols-2 divide-x divide-gray-100
                          dark:divide-gray-800 border-b
                          border-gray-100 dark:border-gray-800"
          >
            <div className="p-4 text-center">
              <p
                className="text-[10px] font-bold text-gray-400
                            uppercase tracking-wide mb-1"
              >
                Branch
              </p>
              <p
                className="text-sm font-black text-gray-900
                            dark:text-white leading-snug"
              >
                {slot.branchName ?? "—"}
              </p>
            </div>
            <div className="p-4 text-center">
              <p
                className="text-[10px] font-bold text-gray-400
                            uppercase tracking-wide mb-1"
              >
                Date
              </p>
              <p
                className="text-sm font-black text-gray-900
                            dark:text-white leading-snug"
              >
                {formatDate(slot.dateStr ?? slot.slotDate)}
              </p>
            </div>
          </div>

          <div
            className="p-4 border-b border-gray-100
                          dark:border-gray-800"
          >
            <p
              className="text-xs font-bold text-gray-500
                          dark:text-gray-400 uppercase tracking-wide
                          text-center mb-2"
            >
              Your Time Slot
            </p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="px-4 py-2 rounded-xl bg-red-50
                              dark:bg-red-900/20"
              >
                <p
                  className="text-base font-black text-red-600
                              dark:text-red-400"
                >
                  {formatTime(slot.startTime)}
                </p>
              </div>
              <span className="text-gray-400 font-black">→</span>
              <div
                className="px-4 py-2 rounded-xl bg-red-50
                              dark:bg-red-900/20"
              >
                <p
                  className="text-base font-black text-red-600
                              dark:text-red-400"
                >
                  {formatTime(slot.endTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold text-red-800
                               dark:text-red-300"
              >
                Cash to Withdraw
              </span>
              <span className="text-lg font-black text-red-600">
                {formatCurrency(slot.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 my-1 px-2">
          <div
            className="flex-1 border-t-2 border-dashed
                          border-gray-200 dark:border-gray-700"
          />
          <div
            className="w-2 h-2 rounded-full bg-gray-200
                          dark:bg-gray-700"
          />
          <div
            className="flex-1 border-t-2 border-dashed
                          border-gray-200 dark:border-gray-700"
          />
        </div>

        <div
          className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl
                        border border-amber-200 dark:border-amber-800
                        p-4"
        >
          <p
            className="text-xs font-black text-amber-800
                        dark:text-amber-300 uppercase tracking-wide
                        mb-2 flex items-center gap-1.5"
          >
            <Info size={12} /> Instructions
          </p>
          <ul className="space-y-1.5">
            {[
              "Show this token to the teller at the branch",
              "Carry a valid government ID proof",
              "Money deducted only after teller processes it",
              "Arrive 5 minutes before your slot",
              "Slot expires if missed — rebook required",
            ].map((i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs
                                     text-amber-700 dark:text-amber-400"
              >
                <span className="flex-shrink-0">•</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button size="md" onClick={onNewBooking} className="flex-1">
          <RotateCcw size={15} /> Book Another Slot
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => window.print()}
          className="flex-1 no-print"
        >
          Print Token
        </Button>
      </div>
    </motion.div>
  );
}

// ── Withdraw Form ──────────────────────────────
function WithdrawForm({ accounts, onSubmit, loading, error, setError }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const selectedAccNum = watch("accountNumber");
  const selectedBranch = watch("branchId");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotError, setSlotError] = useState("");

  const selectedAcc = accounts.find((a) => a.accountNumber === selectedAccNum);

  const handleFormSubmit = (data) => {
    if (!selectedSlot) {
      setSlotError("Please select a time slot.");
      return;
    }
    setSlotError("");
    onSubmit(data, selectedSlot);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <Alert
        type="error"
        message={error}
        show={!!error}
        onClose={() => setError("")}
      />

      {/* Warning notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-2xl
                      bg-red-50 dark:bg-red-900/20
                      border border-red-200 dark:border-red-800"
      >
        <AlertTriangle
          size={16}
          className="text-red-500 flex-shrink-0 mt-0.5"
        />
        <div>
          <p
            className="text-sm font-bold text-red-800
                        dark:text-red-300 mb-1"
          >
            Branch Withdrawal — Slot Required
          </p>
          <p className="text-xs text-red-700 dark:text-red-400">
            Money is <strong>not deducted immediately.</strong> Visit the branch
            at your chosen slot — teller processes and gives cash at the
            counter.
          </p>
        </div>
      </div>

      {/* Account selector */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-gray-700
                           dark:text-gray-300"
        >
          Select Account <span className="text-red-500">*</span>
        </label>
        {accounts.length === 0 ? (
          <div
            className="p-4 rounded-xl border border-amber-200
                          dark:border-amber-800 bg-amber-50
                          dark:bg-amber-900/20 text-sm
                          text-amber-700 dark:text-amber-400"
          >
            No accounts found.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {accounts.map((acc) => {
              const isSel = selectedAccNum === acc.accountNumber;
              const isSavings = !!acc.interestRate;
              return (
                <label
                  key={acc.accountId}
                  className={`
                         flex items-center gap-3 p-3.5 rounded-xl
                         border-2 cursor-pointer transition-all
                         ${
                           isSel
                             ? "border-red-500 bg-red-50/50 dark:border-red-400 dark:bg-red-400/10"
                             : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
                         }
                       `}
                >
                  <input
                    type="radio"
                    value={acc.accountNumber}
                    {...register("accountNumber")}
                    className="sr-only"
                  />
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
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold text-gray-900
                                  dark:text-white truncate"
                    >
                      ••••&nbsp;{acc.accountNumber?.slice(-4)}{" "}
                      <span
                        className="text-gray-400 font-normal
                                       text-xs"
                      >
                        ({isSavings ? "Savings" : "Current"})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Balance: {formatCurrency(acc.accountBalance ?? 0)}
                    </p>
                  </div>
                  {isSel && (
                    <div
                      className="w-5 h-5 rounded-full bg-red-500
                                    flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        )}
        {errors.accountNumber && (
          <p className="text-xs text-red-500 font-medium">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      {/* Balance info */}
      {selectedAcc && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl
                        bg-gray-50 dark:bg-gray-800/50
                        border border-gray-100 dark:border-gray-800"
        >
          <Banknote size={16} className="text-gray-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Available Balance</p>
            <p
              className="text-sm font-black text-gray-900
                          dark:text-white"
            >
              {formatCurrency(selectedAcc.accountBalance ?? 0)}
            </p>
          </div>
          {selectedAcc.withdrawalLimit && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Per-Withdrawal Limit</p>
              <p
                className="text-sm font-bold text-gray-900
                            dark:text-white"
              >
                {formatCurrency(selectedAcc.withdrawalLimit)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Amount */}
      <Input
        label="Cash Amount to Withdraw"
        name="amount"
        type="number"
        placeholder="Enter amount"
        required
        prefix={<Banknote size={15} />}
        suffix={<span className="text-xs font-bold text-gray-400">INR</span>}
        error={errors.amount?.message}
        hint="Ensure sufficient balance before visiting"
        {...register("amount")}
      />

      {/* Branch dropdown */}
      <BranchDropdown
        label="Select Branch"
        name="branchId"
        required
        error={errors.branchId?.message}
        {...register("branchId")}
      />

      {/* Payment mode — static */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-gray-700
                           dark:text-gray-300"
        >
          Payment Mode
        </label>
        <div
          className="flex items-center gap-3 px-4 py-3
                        rounded-xl border border-gray-200
                        dark:border-gray-700 bg-gray-50
                        dark:bg-gray-800/50"
        >
          <Banknote size={16} className="text-gray-400 flex-shrink-0" />
          <span
            className="text-sm font-bold text-gray-900
                           dark:text-white"
          >
            CASH
          </span>
          <span className="ml-auto text-xs text-gray-400">
            Only mode available
          </span>
        </div>
      </div>

      {/* Slot picker */}
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-gray-700
                           dark:text-gray-300"
        >
          Choose Appointment Slot <span className="text-red-500">*</span>
        </label>
        <div
          className="border border-gray-200 dark:border-gray-700
                        rounded-2xl p-4"
        >
          <SlotPicker
            branchId={selectedBranch}
            selectedSlot={selectedSlot}
            onSlotSelect={(slot) => {
              setSelectedSlot(slot);
              setSlotError("");
            }}
          />
        </div>
        {slotError && (
          <p className="text-xs text-red-500 font-medium">{slotError}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={loading}
        disabled={accounts.length === 0}
        className="!bg-red-600 hover:!bg-red-700"
      >
        <Calendar size={16} />
        Confirm Withdrawal Slot
        <ArrowRight size={16} />
      </Button>
    </form>
  );
}

// ── Main Withdraw Page ─────────────────────────
export default function WithdrawPage() {
  const { handleAssignWithdrawSlot, loading, error, setError } =
    useTransactions();
  const { accounts, fetchAccounts, loading: accLoading } = useAccounts();
  const [slotResult, setSlotResult] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const onSubmit = async (data, selectedSlot) => {
    const res = await handleAssignWithdrawSlot({
      accountNumber: data.accountNumber,
      branchId: Number(data.branchId),
      amount: Number(data.amount),
    });

    if (res.success) {
      const branch = BRANCHES.find((b) => b.id === Number(data.branchId));
      toast.success("Withdrawal slot booked!");
      setSlotResult({
        ...res.data,

        // Change token prefix
        tokenNumber:
          res.data?.tokenNumber?.replace(/^DEP-/, "WDL-") ||
          `WDL-${Date.now()}`,

        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        dateStr: selectedSlot.dateStr,

        branchName:
          res.data?.branchName ??
          (branch ? `${branch.name}, ${branch.city}` : "—"),
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Withdrawal Slot — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-xl mx-auto flex flex-col gap-5 sm:gap-6">
        {!slotResult && (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-red-500
                            flex items-center justify-center shadow-md"
            >
              <TrendingDown size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black
                             text-gray-900 dark:text-white"
              >
                Withdraw Cash
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Book a branch appointment to withdraw cash
              </p>
            </div>
          </div>
        )}

        <Card padding="md">
          {slotResult ? (
            <WithdrawSlotToken
              slot={slotResult}
              onNewBooking={() => {
                setSlotResult(null);
                setError("");
              }}
            />
          ) : accLoading ? (
            <div className="flex justify-center py-8">
              <Loader text="Loading accounts..." />
            </div>
          ) : (
            <WithdrawForm
              accounts={accounts}
              onSubmit={onSubmit}
              loading={loading}
              error={error}
              setError={setError}
            />
          )}
        </Card>
      </div>
    </>
  );
}
