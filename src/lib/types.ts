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

export interface DiagnosticQuestion {
  id: string;
  concept: Concept;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
