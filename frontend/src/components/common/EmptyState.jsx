import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There's nothing here yet.",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col items-center justify-center
                  py-16 px-6 text-center ${className}`}
    >
      <div
        className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800
                      flex items-center justify-center mb-4"
      >
        <Icon size={28} className="text-gray-400 dark:text-gray-500" />
      </div>

      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
