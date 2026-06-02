import { scoreBadgeClass } from "@/lib/format";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const sizeClass =
    size === "lg"
      ? "h-16 w-16 text-xl"
      : size === "sm"
        ? "h-8 w-8 text-xs"
        : "h-12 w-12 text-base";

  return (
    <div className={`${scoreBadgeClass(score)} ${sizeClass}`}>
      {score}
    </div>
  );
}
