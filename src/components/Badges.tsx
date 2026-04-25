import type { Concept, Difficulty } from "@/lib/types";
import { CONCEPT_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const conceptStyles: Record<Concept, string> = {
  arrays: "bg-concept-arrays/15 text-concept-arrays border-concept-arrays/30",
  "two-pointers": "bg-concept-two-pointers/15 text-concept-two-pointers border-concept-two-pointers/30",
  "sliding-window": "bg-concept-sliding-window/15 text-concept-sliding-window border-concept-sliding-window/30",
  recursion: "bg-concept-recursion/15 text-concept-recursion border-concept-recursion/30",
};

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-difficulty-easy/15 text-difficulty-easy border-difficulty-easy/30",
  medium: "bg-difficulty-medium/15 text-difficulty-medium border-difficulty-medium/30",
};

export function ConceptBadge({ concept, className }: { concept: Concept; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", conceptStyles[concept], className)}>
      {CONCEPT_LABELS[concept]}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", difficultyStyles[difficulty], className)}>
      {difficulty}
    </span>
  );
}
