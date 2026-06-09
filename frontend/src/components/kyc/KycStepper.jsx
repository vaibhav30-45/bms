import { CheckCircle2, Circle, Lock } from "lucide-react";

const STEPS = [
  {
    id: 1,
    label: "Identity Info",
    desc: "Aadhaar & PAN details",
  },
  {
    id: 2,
    label: "Upload Document",
    desc: "PDF of your ID proof",
  },
  {
    id: 3,
    label: "Upload Video",
    desc: "Short verification clip",
  },
];

export default function KycStepper({ currentStep, completedSteps = [] }) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5
                        bg-gray-100 dark:bg-gray-800 z-0"
        >
          <div
            className="h-full bg-gradient-to-r from-[#1a3c5e] to-blue-400
                       transition-all duration-500"
            style={{
              width: `${(Math.max(...completedSteps, 0) / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {STEPS.map(({ id, label, desc }) => {
          const isDone = completedSteps.includes(id);
          const isCurrent = currentStep === id;
          const isLocked =
            !isDone && !isCurrent && id > Math.max(...completedSteps, 0) + 1;

          return (
            <div
              key={id}
              className="flex flex-col items-center gap-2 z-10 flex-1"
            >
              {/* Circle */}
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center
                border-2 transition-all duration-300
                ${
                  isDone
                    ? "bg-[#1a3c5e] border-[#1a3c5e] shadow-md shadow-[#1a3c5e]/20"
                    : isCurrent
                      ? "bg-white dark:bg-gray-900 border-[#1a3c5e] shadow-md"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                }
              `}
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="text-white" />
                ) : isLocked ? (
                  <Lock
                    size={14}
                    className="text-gray-300 dark:text-gray-600"
                  />
                ) : (
                  <span
                    className={`text-sm font-black
                    ${
                      isCurrent
                        ? "text-[#1a3c5e] dark:text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {id}
                  </span>
                )}
              </div>

              {/* Labels */}
              <div className="text-center">
                <p
                  className={`text-xs font-bold transition-colors
                  ${
                    isCurrent
                      ? "text-[#1a3c5e] dark:text-blue-400"
                      : isDone
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {label}
                </p>
                <p
                  className="text-[10px] text-gray-400 dark:text-gray-600
                              hidden md:block mt-0.5"
                >
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile stepper — compact */}
      <div
        className="sm:hidden flex items-center gap-3 p-3 rounded-2xl
                      bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="flex items-center gap-1.5">
          {STEPS.map(({ id }) => {
            const isDone = completedSteps.includes(id);
            const isCurrent = currentStep === id;
            return (
              <div
                key={id}
                className={`
                w-7 h-7 rounded-full flex items-center justify-center
                text-xs font-black transition-all duration-300
                ${
                  isDone
                    ? "bg-[#1a3c5e] text-white"
                    : isCurrent
                      ? "bg-[#1a3c5e]/10 text-[#1a3c5e] dark:bg-blue-400/10 dark:text-blue-400 border-2 border-[#1a3c5e] dark:border-blue-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }
              `}
              >
                {isDone ? <CheckCircle2 size={13} /> : id}
              </div>
            );
          })}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Step {currentStep}: {STEPS[currentStep - 1]?.label}
          </p>
          <p className="text-xs text-gray-400">
            {STEPS[currentStep - 1]?.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
