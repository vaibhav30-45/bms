import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder = "",
      error,
      hint,
      success,
      required = false,
      disabled = false,
      prefix,
      suffix,
      className = "",
      containerClass = "",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const borderColor = error
      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
      : success
        ? "border-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-500"
        : "border-gray-200 dark:border-gray-700 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]";

    return (
      <div className={`flex flex-col gap-1.5 ${containerClass}`}>
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3.5 text-gray-400 dark:text-gray-500 pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className={`
            w-full rounded-xl border bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            py-3 text-sm font-medium
            focus:outline-none focus:ring-3
            transition-all duration-200
            disabled:bg-gray-50 dark:disabled:bg-gray-800
            disabled:cursor-not-allowed disabled:opacity-60
            ${prefix ? "pl-10" : "pl-4"}
            ${suffix || isPassword ? "pr-10" : "pr-4"}
            ${borderColor}
            ${className}
          `}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600
                       dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          )}

          {!isPassword && suffix && (
            <div className="absolute right-3.5 text-gray-400 dark:text-gray-500 pointer-events-none">
              {suffix}
            </div>
          )}

          {error && !isPassword && (
            <AlertCircle
              size={17}
              className="absolute right-3.5 text-red-500 pointer-events-none"
            />
          )}
          {success && !isPassword && (
            <CheckCircle2
              size={17}
              className="absolute right-3.5 text-emerald-500 pointer-events-none"
            />
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
