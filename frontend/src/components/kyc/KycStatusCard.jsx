import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  KYC_STATUS,
  isKycVerified,
  normalizeKycStatus,
} from "../../utils/constants";
import Button from "../common/Button";
import Badge from "../common/Badge";

const STATUS_CONFIG = {
  [KYC_STATUS.APPROVED]: {
    Icon: CheckCircle2,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600",
    title: "KYC Approved",
    desc: "Your identity has been verified. You have full access to all banking features.",
    bg: "from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900",
    border: "border-emerald-200 dark:border-emerald-800",
    showButton: false,
  },
  [KYC_STATUS.PENDING]: {
    Icon: Clock,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600",
    title: "Under Review",
    desc: "Your documents have been submitted and are being reviewed by our team. This usually takes up to 24 hours.",
    bg: "from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900",
    border: "border-blue-200 dark:border-blue-800",
    showButton: false,
  },
  [KYC_STATUS.REJECTED]: {
    Icon: XCircle,
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600",
    title: "KYC Rejected",
    desc: "Your KYC application was rejected. Please check the rejection reason below and resubmit with correct documents.",
    bg: "from-red-50 to-white dark:from-red-900/20 dark:to-gray-900",
    border: "border-red-200 dark:border-red-800",
    showButton: true,
    buttonLabel: "Resubmit KYC",
    buttonVariant: "danger",
  },
  [KYC_STATUS.NOT_SUBMITTED]: {
    Icon: AlertTriangle,
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600",
    title: "KYC Incomplete",
    desc: "You have not completed all KYC steps. Please complete the process to unlock all banking features.",
    bg: "from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-900",
    border: "border-amber-200 dark:border-amber-800",
    showButton: true,
    buttonLabel: "Continue KYC",
    buttonVariant: "secondary",
  },
};

export default function KycStatusCard({ kycData, onCancel, cancelLoading }) {
  const navigate = useNavigate();
  const status = kycData?.kycStatus ?? KYC_STATUS.NOT_SUBMITTED;
  const config =
    STATUS_CONFIG[normalizeKycStatus(status)] ??
    STATUS_CONFIG[KYC_STATUS.NOT_SUBMITTED];
  const { Icon } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border bg-gradient-to-br p-6
                  ${config.bg} ${config.border}`}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-start
                      gap-4"
      >
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center
                         justify-center flex-shrink-0 ${config.iconBg}`}
        >
          <Icon size={28} className={config.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              {config.title}
            </h3>
            <Badge variant={status} dot size="sm" />
          </div>

          <p
            className="text-sm text-gray-600 dark:text-gray-400
                        leading-relaxed mb-4"
          >
            {config.desc}
          </p>

          {/* KYC step progress */}
          {kycData && (
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { label: "Info", done: kycData.infoSubmitted },
                { label: "Document", done: kycData.documentsSubmitted },
                { label: "Video", done: kycData.videoSubmitted },
              ].map(({ label, done }) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 px-3 py-1.5
                                 rounded-xl text-xs font-bold
                                 ${
                                   done
                                     ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                     : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                 }`}
                >
                  {done ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                  )}
                  {label}
                </div>
              ))}
            </div>
          )}

          {/* Rejection reason */}
          {kycData?.rejectionReason && (
            <div
              className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20
                            border border-red-100 dark:border-red-800"
            >
              <p
                className="text-xs font-bold text-red-700 dark:text-red-400
                            mb-1 uppercase tracking-wide"
              >
                Rejection Reason
              </p>
              <p className="text-sm text-red-600 dark:text-red-300">
                {kycData.rejectionReason}
              </p>
            </div>
          )}

          {/* Masked details */}
          {kycData?.aadharNumber && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { label: "Aadhaar", value: kycData.aadharNumber },
                { label: "PAN", value: kycData.panNumber },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 p-3 rounded-xl
                                bg-white/60 dark:bg-gray-900/60
                                border border-white dark:border-gray-700"
                >
                  <p
                    className="text-[10px] font-bold text-gray-400
                                uppercase tracking-wide"
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm font-bold text-gray-900
                                dark:text-white font-mono"
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {config.showButton && (
              <Button
                size="sm"
                variant={config.buttonVariant}
                onClick={() => navigate("/user/kyc")}
              >
                <ShieldCheck size={13} />
                {config.buttonLabel}
                <ArrowRight size={13} />
              </Button>
            )}

            {/* Cancel KYC — only show if not approved */}
            {kycData && status !== KYC_STATUS.APPROVED && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                loading={cancelLoading}
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RefreshCw size={13} />
                Reset KYC
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
