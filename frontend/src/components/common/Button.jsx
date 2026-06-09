import { forwardRef } from "react";
import { motion } from "framer-motion";
import Loader from "./Loader";

const variants = {
  primary:
    "bg-[#1a3c5e] hover:bg-[#15304d] text-white shadow-md hover:shadow-lg",
  secondary:
    "bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-md hover:shadow-lg",
  outline:
    "border-2 border-[#1a3c5e] text-[#1a3c5e] hover:bg-[#1a3c5e] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white",
  ghost:
    "text-[#1a3c5e] hover:bg-[#1a3c5e]/10 dark:text-blue-400 dark:hover:bg-blue-400/10",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
  xl: "px-9 py-4 text-lg rounded-2xl",
  icon: "p-2.5 rounded-xl",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        disabled={disabled || loading}
        className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
        {...props}
      >
        {loading ? (
          <>
            <Loader size="sm" color="white" />
            <span>Please wait...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
export default Button;
