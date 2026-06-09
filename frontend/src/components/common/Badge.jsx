const variants = {
  // KYC / User status
  APPROVED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SUCCESS:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PENDING:
    "bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400",
  INCOMPLETE:
    "bg-amber-100   text-amber-700   dark:bg-amber-900/30   dark:text-amber-400",
  REJECTED:
    "bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-400",
  FAILED:
    "bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-400",
  INACTIVE:
    "bg-gray-100    text-gray-600    dark:bg-gray-800       dark:text-gray-400",
  SUSPENDED:
    "bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-400",
  // Transaction types
  CREDIT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DEBIT:
    "bg-red-100     text-red-700     dark:bg-red-900/30     dark:text-red-400",
  TRANSFER:
    "bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-400",
  // Account types
  SAVINGS:
    "bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-400",
  CURRENT:
    "bg-purple-100  text-purple-700  dark:bg-purple-900/30  dark:text-purple-400",
  // Default
  DEFAULT:
    "bg-gray-100    text-gray-600    dark:bg-gray-800       dark:text-gray-400",
  VERIFIED: "bg-emerald-100 text-emerald-700 border-emerald-200",

  SUBMITTED: "bg-blue-100 text-blue-700 border-blue-200",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1   text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export default function Badge({
  label,
  variant,
  size = "md",
  dot = false,
  className = "",
}) {
  const style = variants[variant?.toUpperCase()] || variants.DEFAULT;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full
        ${sizes[size]} ${style} ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {label || variant}
    </span>
  );
}
