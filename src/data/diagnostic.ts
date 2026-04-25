import type { DiagnosticQuestion } from "./types";

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1",
    concept: "arrays",
    question: "Given an array of n integers, what is the time complexity of finding the maximum element by iterating once?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    correctIndex: 2,
    explanation: "A single linear scan visits every element exactly once.",
  },
  {
    id: "q2",
    concept: "two-pointers",
    question: "On a SORTED array, the two-pointer technique can find a pair summing to a target in:",
    options: ["O(n^2) only", "O(n log n) using binary search per element", "O(n) with two pointers from both ends", "O(1) lookup"],
    correctIndex: 2,
    explanation: "Move left/right pointers based on sum vs target — linear scan.",
  },
  {
    id: "q3",
    concept: "sliding-window",
    question: "Sliding window is BEST suited for:",
    options: [
      "Finding the kth largest element",
      "Contiguous subarray/substring problems with a constraint",
      "Reversing a linked list",
      "Sorting an unsorted array",
    ],
    correctIndex: 1,
    explanation: "Sliding window maintains a contiguous range and slides it forward.",
  },
  {
    id: "q4",
    concept: "recursion",
    question: "What is the base case for computing factorial(n) recursively?",
    options: ["n == -1", "n == 0 returning 1", "n == 1 returning 0", "There is no base case"],
    correctIndex: 1,
    explanation: "factorial(0) = 1 by definition; this stops the recursion.",
  },
];
