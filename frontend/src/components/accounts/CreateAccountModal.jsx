import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  PiggyBank,
  Building2,
  Hash,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Alert from "../common/Alert";

const schema = yup.object({
  branchId: yup
    .number()
    .typeError("Branch ID must be a number")
    .positive("Branch ID must be positive")
    .integer("Branch ID must be a whole number")
    .required("Branch ID is required"),
});

const ACCOUNT_TYPES = [
  {
    type: "savings",
    Icon: PiggyBank,
    title: "Savings Account",
    desc: "Earn interest on your deposits",
    color: "border-blue-200 dark:border-blue-800",
    active:
      "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:border-blue-400 dark:bg-blue-400/10",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    features: [
      "Up to 4.5% annual interest",
      "Withdrawal limits for savings",
      "Daily transaction limits",
      "Last interest credit tracking",
    ],
  },
  {
    type: "current",
    Icon: Building2,
    title: "Current Account",
    desc: "For business transactions",
    color: "border-amber-200 dark:border-amber-800",
    active:
      "border-amber-500 bg-amber-50/50 dark:border-amber-400 dark:bg-amber-400/10",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    features: [
      "Overdraft facility available",
      "Free monthly transactions",
      "Monthly service fee applies",
      "Business-ready features",
    ],
  },
];

export default function CreateAccountModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  existingAccounts = [],
}) {
  const [selectedType, setSelectedType] = useState("savings");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const handleClose = () => {
    reset();
    setSelectedType("savings");
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit({ type: selectedType, branchId: Number(data.branchId) });
  };

  // Count existing accounts by type
  const savingsCount = existingAccounts.filter((a) => !!a.interestRate).length;
  const currentCount = existingAccounts.filter((a) => !a.interestRate).length;
  const savingsDisabled = savingsCount >= 2;
  const currentDisabled = currentCount >= 2;

  const selectedConfig = ACCOUNT_TYPES.find((a) => a.type === selectedType);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Account"
      size="lg"
    >
      <div className="flex flex-col gap-5">
        <Alert type="error" message={error} show={!!error} />

        {/* Account type selection */}
        <div>
          <p
            className="text-xs font-black text-gray-500 dark:text-gray-400
                        uppercase tracking-wide mb-3"
          >
            Select Account Type
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACCOUNT_TYPES.map(
              ({
                type,
                Icon,
                title,
                desc,
                color,
                active,
                iconBg,
                iconColor,
              }) => {
                const isSavingsType = type === "savings";
                const isDisabled = isSavingsType
                  ? savingsDisabled
                  : currentDisabled;
                const count = isSavingsType ? savingsCount : currentCount;
                const isSelected = selectedType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setSelectedType(type)}
                    className={`
                    relative text-left p-4 rounded-2xl border-2
                    transition-all duration-200
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed border-gray-100 dark:border-gray-800"
                        : isSelected
                          ? active
                          : `${color} hover:${active}`
                    }
                  `}
                  >
                    {/* Selected indicator */}
                    {isSelected && !isDisabled && (
                      <div
                        className="absolute top-3 right-3 w-5 h-5
                                    rounded-full bg-[#1a3c5e] dark:bg-blue-500
                                    flex items-center justify-center"
                      >
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    )}

                    {/* Limit badge */}
                    {isDisabled && (
                      <div
                        className="absolute top-3 right-3 px-2 py-0.5
                                    rounded-full bg-red-100 dark:bg-red-900/30
                                    text-red-600 dark:text-red-400
                                    text-[10px] font-bold"
                      >
                        Max reached
                      </div>
                    )}

                    <div
                      className={`w-10 h-10 rounded-xl ${iconBg}
                                   flex items-center justify-center mb-3`}
                    >
                      <Icon size={20} className={iconColor} />
                    </div>

                    <p
                      className="text-sm font-black text-gray-900
                                dark:text-white mb-0.5"
                    >
                      {title}
                    </p>
                    <p
                      className="text-xs text-gray-500 dark:text-gray-400
                                mb-2"
                    >
                      {desc}
                    </p>
                    <p className="text-xs text-gray-400">{count}/2 created</p>
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Features of selected type */}
        {selectedConfig && (
          <div
            className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50
                          border border-gray-100 dark:border-gray-800"
          >
            <p
              className="text-xs font-black text-gray-600 dark:text-gray-400
                          uppercase tracking-wide mb-3 flex items-center gap-1.5"
            >
              <Info size={12} />
              {selectedConfig.title} Features
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedConfig.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2
                    size={13}
                    className="text-emerald-500 flex-shrink-0"
                  />
                  <span
                    className="text-xs text-gray-600
                                   dark:text-gray-400"
                  >
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branch ID input */}
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <Input
            label="Branch ID"
            name="branchId"
            type="number"
            placeholder="e.g. 3"
            required
            prefix={<Hash size={15} />}
            error={errors.branchId?.message}
            hint="Enter your nearest branch ID. Ask your bank branch for their ID."
            {...register("branchId")}
          />

          {/* Info note */}
          <div className="flex items-start gap-2 mt-3 mb-5">
            <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A {selectedType === "savings" ? "savings" : "current"} account
              will be created linked to the specified branch. Account number
              will be auto-generated by the system.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              size="md"
              loading={loading}
              disabled={
                selectedType === "savings" ? savingsDisabled : currentDisabled
              }
              className="sm:flex-1"
            >
              Create {selectedType === "savings" ? "Savings" : "Current"}{" "}
              Account
              <ArrowRight size={15} />
            </Button>
            <Button
              type="button"
              size="md"
              variant="outline"
              onClick={handleClose}
              className="sm:flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
