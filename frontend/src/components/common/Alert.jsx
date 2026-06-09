import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const config = {
  success: {
    container:
      "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    icon: "text-emerald-500",
    title: "text-emerald-800 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
  error: {
    container:
      "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    icon: "text-red-500",
    title: "text-red-800 dark:text-red-300",
    text: "text-red-700 dark:text-red-400",
    Icon: AlertCircle,
  },
  warning: {
    container:
      "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    icon: "text-amber-500",
    title: "text-amber-800 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-400",
    Icon: AlertTriangle,
  },
  info: {
    container:
      "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    icon: "text-blue-500",
    title: "text-blue-800 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-400",
    Icon: Info,
  },
};

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  show = true,
  className = "",
}) {
  const c = config[type] || config.info;
  const { Icon } = c;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          role="alert"
          className={`
            flex items-start gap-3 p-4 rounded-xl border
            ${c.container} ${className}
          `}
        >
          <Icon size={18} className={`flex-shrink-0 mt-0.5 ${c.icon}`} />

          <div className="flex-1 min-w-0">
            {title && (
              <p className={`text-sm font-semibold ${c.title}`}>{title}</p>
            )}
            {message && <p className={`text-sm mt-0.5 ${c.text}`}>{message}</p>}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className={`flex-shrink-0 ${c.icon} opacity-70 hover:opacity-100
                          transition-opacity`}
            >
              <X size={15} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
