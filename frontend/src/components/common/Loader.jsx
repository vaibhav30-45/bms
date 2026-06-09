export default function Loader({
  size = "md",
  color = "primary",
  fullScreen = false,
  text,
}) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colorMap = {
    primary:
      "border-[#1a3c5e] border-t-transparent dark:border-blue-400 dark:border-t-transparent",
    white: "border-white border-t-transparent",
    amber: "border-amber-500 border-t-transparent",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          rounded-full animate-spin
          ${sizeMap[size]}
          ${colorMap[color]}
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center
                      bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}
