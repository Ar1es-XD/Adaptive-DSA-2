export type Concept = "arrays" | "two-pointers" | "sliding-window" | "recursion" | "hash-map" | "stack" | "binary-search" | "strings";
export type Difficulty = "easy" | "medium";
export type Language = "cpp" | "java" | "python" | "javascript";

export interface TestCase { input: string; expected: string; hidden?: boolean; }
export interface Problem {
  id: string; title: string; description: string; difficulty: Difficulty; concept: Concept;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[]; constraints: string[]; starterCode: Record<Language, string>;
}
export type DiagnosticKind = "logical" | "conceptual" | "coding";
export interface DiagnosticQuestion {
  id: string; concept: Concept; kind: DiagnosticKind; prompt: string;
  starter?: string; language?: Language; referenceAnswer: string; referenceReasoning?: string;
}
export type DiagnosticStatus = "correct" | "partial" | "incorrect";
export interface DiagnosticEvaluation {
  status: DiagnosticStatus; understanding: "low" | "medium" | "high";
  feedback: string; didWell?: string; missing?: string;
}
export interface DiagnosticResponse { questionId: string; answer: string; reasoning: string; evaluation?: DiagnosticEvaluation; }
export interface ConceptStats { attempts: number; correct: number; }
export interface Badge { id: string; label: string; description: string; icon: string; unlockedAt?: number; }
export interface SkillProfile { scores: Record<Concept, number>; stats: Record<Concept, ConceptStats>; solvedIds: string[]; }

export const CONCEPTS: Concept[] = ["arrays","two-pointers","sliding-window","recursion","hash-map","stack","binary-search","strings"];
export const CONCEPT_LABELS: Record<Concept, string> = {
  "arrays": "Arrays", "two-pointers": "Two Pointers", "sliding-window": "Sliding Window",
  "recursion": "Recursion", "hash-map": "Hash Map", "stack": "Stack",
  "binary-search": "Binary Search", "strings": "Strings",
};
