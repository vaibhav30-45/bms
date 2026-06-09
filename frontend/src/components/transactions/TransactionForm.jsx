import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreditCard, DollarSign, Wallet, ArrowRight } from "lucide-react";
import { PAYMENT_MODES } from "../../utils/constants";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

const schema = yup.object({
  accountNumber: yup.string().required("Account number is required"),
  amount: yup
    .number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  paymentMode: yup.string().required("Payment mode is required"),
});

export default function TransactionForm({
  type = "deposit", // deposit | withdraw
  accounts = [],
  onSubmit,
  loading,
  error,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const selectedAccNum = watch("accountNumber");
  const selectedAcc = accounts.find((a) => a.accountNumber === selectedAccNum);

  const isDeposit = type === "deposit";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <Alert type="error" message={error} show={!!error} className="mb-1" />

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
            No accounts found. Please create an account first.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {accounts.map((acc) => {
              const isSelected = selectedAccNum === acc.accountNumber;
              const isSavings = !!acc.interestRate;
              return (
                <label
                  key={acc.accountId}
                  className={`
                    flex items-center gap-3 p-3.5 rounded-xl border-2
                    cursor-pointer transition-all duration-150
                    ${
                      isSelected
                        ? "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:border-blue-400 dark:bg-blue-400/10"
                        : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
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
                      <span className="text-gray-400 font-normal text-xs">
                        ({isSavings ? "Savings" : "Current"})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Balance:{" "}
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(acc.accountBalance ?? 0)}
                    </p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full bg-[#1a3c5e]
                                    dark:bg-blue-500 flex items-center
                                    justify-center flex-shrink-0"
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
          <p className="text-xs text-red-500 font-medium mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      {/* Selected account balance info */}
      {selectedAcc && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl
                        bg-gray-50 dark:bg-gray-800/50
                        border border-gray-100 dark:border-gray-800"
        >
          <Wallet size={16} className="text-gray-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Available Balance</p>
            <p
              className="text-sm font-black text-gray-900
                          dark:text-white"
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(selectedAcc.accountBalance ?? 0)}
            </p>
          </div>
          {!isDeposit && selectedAcc.withdrawalLimit && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Withdrawal Limit</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(selectedAcc.withdrawalLimit)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Amount */}
      <Input
        label="Amount"
        name="amount"
        type="number"
        placeholder="Enter amount"
        required
        prefix={<DollarSign size={15} />}
        suffix={<span className="text-xs font-bold text-gray-400">INR</span>}
        error={errors.amount?.message}
        hint="Minimum ₹1"
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
            <label key={mode} className="relative cursor-pointer">
              <input
                type="radio"
                value={mode}
                {...register("paymentMode")}
                className="sr-only peer"
              />
              <div
                className="flex items-center justify-center px-2 py-2.5
                              rounded-xl border-2 border-gray-100
                              dark:border-gray-800 text-xs font-bold
                              text-gray-500 dark:text-gray-400
                              transition-all duration-150
                              peer-checked:border-[#1a3c5e]
                              peer-checked:bg-[#1a3c5e]/5
                              peer-checked:text-[#1a3c5e]
                              dark:peer-checked:border-blue-400
                              dark:peer-checked:bg-blue-400/10
                              dark:peer-checked:text-blue-400
                              hover:border-gray-300
                              dark:hover:border-gray-600
                              cursor-pointer"
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

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={loading}
        disabled={accounts.length === 0}
      >
        {isDeposit ? "Deposit Funds" : "Withdraw Funds"}
        <ArrowRight size={16} />
      </Button>
    </form>
  );
}
