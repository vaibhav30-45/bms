import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeftRight,
  CheckCircle2,
  RotateCcw,
  Search,
  CreditCard,
  DollarSign,
  User,
} from "lucide-react";
import { useTransactions } from "../../../hooks/useTransactions";
import { useAccounts } from "../../../hooks/useAccounts";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";
import { PAYMENT_MODES } from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/helpers";
import TransferConfirmationCard from "../../../components/transactions/TransferConfirmationCard";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import Badge from "../../../components/common/Badge";
import Alert from "../../../components/common/Alert";

const schema = yup.object({
  senderAccountNumber: yup.string().required("Select sender account"),
  receiverAccountNumber: yup
    .string()
    .required("Receiver account number is required")
    .min(4, "Enter a valid account number"),
  amount: yup
    .number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  paymentMode: yup.string().required("Select payment mode"),
});

// Transfer receipt component
function TransferReceipt({ result, onNewTransaction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center text-center gap-5"
    >
      <div
        className="w-20 h-20 rounded-full bg-blue-100
                      dark:bg-blue-900/30 flex items-center
                      justify-center"
      >
        <CheckCircle2 size={40} className="text-[#1a3c5e] dark:text-blue-400" />
      </div>

      <div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
          Transfer Successful!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Money sent to {result.receiverName}.
        </p>
      </div>

      <div
        className="w-full max-w-sm bg-gray-50 dark:bg-gray-800/50
                      rounded-2xl border border-gray-100
                      dark:border-gray-800 overflow-hidden"
      >
        <div className="bg-[#1a3c5e] p-5 text-center">
          <p className="text-white/70 text-xs mb-1">Amount Transferred</p>
          <p className="text-white text-3xl font-black">
            {formatCurrency(result.amount)}
          </p>
          <p className="text-white/60 text-xs mt-1">
            To: {result.receiverName}
          </p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {[
            { label: "Transaction ID", value: `#${result.transactionId}` },
            {
              label: "From Account",
              value: `••••  ${result.senderAccountNumber?.slice(-4)}`,
            },
            {
              label: "To Account",
              value: `••••  ${result.receiverAccountNumber?.slice(-4)}`,
            },
            { label: "Receiver Name", value: result.receiverName },
            { label: "Payment Mode", value: result.paymentMode },
            {
              label: "Remaining Balance",
              value: formatCurrency(result.currentBalance),
            },
            {
              label: "Status",
              value: <Badge variant={result.status} size="sm" dot />,
            },
            { label: "Date & Time", value: formatDateTime(result.createdAt) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-xs text-gray-500 flex-shrink-0">
                {label}
              </span>
              <span
                className="text-sm font-bold text-gray-900
                               dark:text-white text-right ml-3"
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button size="md" onClick={onNewTransaction} className="flex-1">
          <RotateCcw size={15} />
          New Transfer
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

export default function TransferPage() {
  const { handleTransfer, handleVerifyAccount, loading, error, setError } =
    useTransactions();
  const { accounts, fetchAccounts, loading: accLoading } = useAccounts();
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [receiverData, setReceiverData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const senderAccNum = watch("senderAccountNumber");
  const receiverAccNum = watch("receiverAccountNumber");
  const amount = watch("amount");
  const paymentMode = watch("paymentMode");

  // Verify receiver account when user stops typing
  const handleVerify = async () => {
    if (!receiverAccNum || receiverAccNum.length < 4) return;
    // Prevent self-transfer
    if (receiverAccNum === senderAccNum) {
      setVerifyError("Cannot transfer to the same account");
      setReceiverData(null);
      return;
    }
    try {
      setVerifying(true);
      setVerifyError("");
      setReceiverData(null);
      const res = await handleVerifyAccount(receiverAccNum);
      if (res.success) {
        if (res.data?.exists) {
          setReceiverData(res.data);
        } else {
          setVerifyError("Account not found. Please check the account number.");
        }
      }
    } catch (err) {
      setVerifyError(getErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  };

  // Step 1: validate form → verify → show confirmation
  const onFormSubmit = async (data) => {
    if (!receiverData?.exists) {
      setVerifyError("Please verify the receiver account first.");
      return;
    }
    setPendingData(data);
    setShowConfirm(true);
  };

  // Step 2: confirmed → execute transfer
  const onConfirmTransfer = async () => {
    if (!pendingData) return;
    const res = await handleTransfer({
      senderAccountNumber: pendingData.senderAccountNumber,
      receiverAccountNumber: pendingData.receiverAccountNumber,
      amount: Number(pendingData.amount),
      paymentMode: pendingData.paymentMode,
    });
    if (res.success) {
      toast.success("Transfer successful!");
      setResult(res.data);
      setShowConfirm(false);
    }
  };

  const handleNewTransfer = () => {
    setResult(null);
    setShowConfirm(false);
    setPendingData(null);
    setReceiverData(null);
    setVerifyError("");
    setError("");
    reset();
  };

  return (
    <>
      <Helmet>
        <title>Fund Transfer — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-xl mx-auto flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        {!result && (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-[#1a3c5e]
                            flex items-center justify-center shadow-md"
            >
              <ArrowLeftRight size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black text-gray-900
                             dark:text-white"
              >
                Fund Transfer
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transfer money to any NexaBank account
              </p>
            </div>
          </div>
        )}

        <Card padding="md">
          {result ? (
            <TransferReceipt
              result={result}
              onNewTransaction={handleNewTransfer}
            />
          ) : accLoading ? (
            <div className="flex justify-center py-8">
              <Loader text="Loading accounts..." />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              <Alert
                type="error"
                message={error}
                show={!!error && !showConfirm}
                onClose={() => setError("")}
              />

              {/* Sender account selector */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300"
                >
                  From Account <span className="text-red-500">*</span>
                </label>
                {accounts.length === 0 ? (
                  <p
                    className="text-sm text-amber-600 p-3 rounded-xl
                                bg-amber-50 dark:bg-amber-900/20"
                  >
                    No accounts found.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {accounts.map((acc) => {
                      const isSel = senderAccNum === acc.accountNumber;
                      const isSavings = !!acc.interestRate;
                      return (
                        <label
                          key={acc.accountId}
                          className={`
                                 flex items-center gap-3 p-3.5
                                 rounded-xl border-2 cursor-pointer
                                 transition-all duration-150
                                 ${
                                   isSel
                                     ? "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:border-blue-400 dark:bg-blue-400/10"
                                     : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
                                 }
                               `}
                        >
                          <input
                            type="radio"
                            value={acc.accountNumber}
                            {...register("senderAccountNumber")}
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
                              <span className="text-gray-400 font-normal text-xs">
                                ({isSavings ? "Savings" : "Current"})
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(acc.accountBalance)}
                            </p>
                          </div>
                          {isSel && (
                            <div
                              className="w-5 h-5 rounded-full bg-[#1a3c5e]
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
                {errors.senderAccountNumber && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.senderAccountNumber.message}
                  </p>
                )}
              </div>

              {/* Receiver account */}
              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label="Receiver Account Number"
                      name="receiverAccountNumber"
                      placeholder="Enter account number"
                      required
                      prefix={<User size={15} />}
                      error={errors.receiverAccountNumber?.message}
                      {...register("receiverAccountNumber")}
                      onChange={(e) => {
                        register("receiverAccountNumber").onChange(e);
                        setReceiverData(null);
                        setVerifyError("");
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="md"
                    variant="outline"
                    onClick={handleVerify}
                    loading={verifying}
                    className="flex-shrink-0 mb-0.5"
                  >
                    <Search size={15} />
                    Verify
                  </Button>
                </div>

                {/* Verify error */}
                {verifyError && (
                  <p
                    className="text-xs text-red-500 font-medium
                                flex items-center gap-1"
                  >
                    {verifyError}
                  </p>
                )}

                {/* Receiver verified */}
                {receiverData?.exists && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl
                               bg-emerald-50 dark:bg-emerald-900/20
                               border border-emerald-200
                               dark:border-emerald-800"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-emerald-500 flex-shrink-0"
                    />
                    <div>
                      <p
                        className="text-xs font-bold text-emerald-800
                                    dark:text-emerald-300"
                      >
                        Account Verified
                      </p>
                      <p
                        className="text-xs text-emerald-700
                                    dark:text-emerald-400"
                      >
                        {receiverData.accountHolderName}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Amount */}
              <Input
                label="Amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                required
                prefix={<DollarSign size={15} />}
                suffix={
                  <span className="text-xs font-bold text-gray-400">INR</span>
                }
                error={errors.amount?.message}
                {...register("amount")}
              />

              {/* Payment mode */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300"
                >
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PAYMENT_MODES.map((mode) => (
                    <label key={mode} className="cursor-pointer">
                      <input
                        type="radio"
                        value={mode}
                        {...register("paymentMode")}
                        className="sr-only peer"
                      />
                      <div
                        className="flex items-center justify-center
                                      px-2 py-2.5 rounded-xl border-2
                                      border-gray-100 dark:border-gray-800
                                      text-xs font-bold text-gray-500
                                      transition-all cursor-pointer
                                      peer-checked:border-[#1a3c5e]
                                      peer-checked:bg-[#1a3c5e]/5
                                      peer-checked:text-[#1a3c5e]
                                      dark:peer-checked:border-blue-400
                                      dark:peer-checked:bg-blue-400/10
                                      dark:peer-checked:text-blue-400
                                      hover:border-gray-300"
                      >
                        {mode}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.paymentMode && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.paymentMode.message}
                  </p>
                )}
              </div>

              {/* Confirmation card */}
              {showConfirm && pendingData && (
                <TransferConfirmationCard
                  senderAccount={pendingData.senderAccountNumber}
                  receiverData={receiverData}
                  amount={Number(pendingData.amount)}
                  paymentMode={pendingData.paymentMode}
                  onConfirm={onConfirmTransfer}
                  onCancel={() => {
                    setShowConfirm(false);
                    setPendingData(null);
                  }}
                  loading={loading}
                />
              )}

              {/* Submit */}
              {!showConfirm && (
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={accounts.length === 0 || !receiverData?.exists}
                >
                  <ArrowLeftRight size={16} />
                  Review Transfer
                </Button>
              )}
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
