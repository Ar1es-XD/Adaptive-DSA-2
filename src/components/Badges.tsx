import type { Concept, Difficulty } from "@/lib/types";
import { CONCEPT_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const conceptStyles: Record<Concept, string> = {
  "arrays":                "bg-blue-100 text-blue-700 border-blue-300",
  "two-pointers":          "bg-violet-100 text-violet-700 border-violet-300",
  "sliding-window":        "bg-teal-100 text-teal-700 border-teal-300",
  "recursion":             "bg-orange-100 text-orange-700 border-orange-300",
  "hash-map":              "bg-pink-100 text-pink-700 border-pink-300",
  "stack":                 "bg-amber-100 text-amber-700 border-amber-300",
  "binary-search":         "bg-green-100 text-green-700 border-green-300",
  "strings":               "bg-indigo-100 text-indigo-700 border-indigo-300",
};

const difficultyStyles: Record<Difficulty, string> = {
  easy:   "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export function ConceptBadge({ concept, className }: { concept: Concept; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
      conceptStyles[concept] ?? "bg-gray-100 text-gray-700 border-gray-300",
      className
    )}>
      {CONCEPT_LABELS[concept]}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize",
      difficultyStyles[difficulty],
      className
    )}>
      {difficulty}
    </span>
  );
}
