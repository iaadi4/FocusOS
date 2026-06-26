
export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  fillClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className = "",
  fillClassName = "bg-[#C9A96E]",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`w-full bg-[#1A1A1A] h-[2px] rounded-none overflow-hidden ${className}`}
    >
      <div
        className={`h-full ${fillClassName} transition-all duration-150 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
