export type Concept = "arrays" | "two-pointers" | "sliding-window" | "recursion";
export type Difficulty = "easy" | "medium";
export type Language = "cpp" | "java" | "python" | "javascript";

export interface TestCase {
  input: string;
  expected: string;
  hidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  concept: Concept;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  constraints: string[];
  starterCode: Record<Language, string>;
}

export type DiagnosticKind = "logical" | "conceptual" | "coding";

export interface DiagnosticQuestion {
  id: string;
  concept: Concept;
  kind: DiagnosticKind;
  prompt: string;
  /** For coding questions: starter code + language */
  starter?: string;
  language?: Language;
  /** Reference answer + reasoning used by the AI evaluator (never shown to user) */
  referenceAnswer: string;
  referenceReasoning?: string;
}

export interface DiagnosticEvaluation {
  correct: boolean;
  understanding: "low" | "medium" | "high";
  feedback: string;
}

export interface DiagnosticResponse {
  questionId: string;
  answer: string;
  reasoning: string;
  evaluation?: DiagnosticEvaluation;
}

export interface ConceptStats {
  attempts: number;
  correct: number;
}

export interface SkillProfile {
  scores: Record<Concept, number>; // 0-100
  stats: Record<Concept, ConceptStats>;
}

export const CONCEPTS: Concept[] = ["arrays", "two-pointers", "sliding-window", "recursion"];

export const CONCEPT_LABELS: Record<Concept, string> = {
  arrays: "Arrays",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  recursion: "Recursion",
};
