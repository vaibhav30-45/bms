import { forwardRef } from "react";
import { Building2, MapPin } from "lucide-react";
import { BRANCHES } from "../../utils/branchData";

const BranchDropdown = forwardRef(
  (
    {
      label = "Select Branch",
      name = "branchId",
      error,
      required = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={name}
          className="text-sm font-semibold text-gray-700
                        dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <Building2
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2
                     text-gray-400 pointer-events-none z-10"
          />
          <select
            ref={ref}
            id={name}
            name={name}
            className={`
            w-full pl-10 pr-4 py-3 rounded-xl border text-sm
            font-medium bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-3
            appearance-none transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-200 dark:border-gray-700 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
            }
            ${className}
          `}
            {...props}
          >
            <option value="">Select your nearest branch...</option>
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.city}, {b.state}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div
            className="absolute right-3.5 top-1/2 -translate-y-1/2
                        pointer-events-none"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  },
);

BranchDropdown.displayName = "BranchDropdown";
export default BranchDropdown;
