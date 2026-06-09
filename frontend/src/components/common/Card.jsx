import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  shadow = "md",
  onClick,
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const base = `
    bg-white dark:bg-gray-900
    border border-gray-100 dark:border-gray-800
    rounded-2xl
    ${paddings[padding]}
    ${shadows[shadow]}
    ${onClick ? "cursor-pointer" : ""}
  `;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, shadow: "lg" }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={`${base} transition-shadow duration-200 hover:shadow-lg ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
