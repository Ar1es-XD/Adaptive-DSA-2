import type { Problem, Language } from "@/lib/types";

const py = (s: string) => s;
const stub = (lang: Language, fn: string, sig: string): string => {
  switch (lang) {
    case "python": return `def ${fn}(${sig}):\n    # write your solution here\n    pass\n`;
    case "javascript": return `function ${fn}(${sig}) {\n  // write your solution here\n}\n`;
    case "cpp": return `// implement ${fn}\n#include <bits/stdc++.h>\nusing namespace std;\n\n// your function here\n`;
    case "java": return `// implement ${fn}\nclass Solution {\n    // your method here\n}\n`;
  }
};

const starter = (fn: string, sig: string): Record<Language, string> => ({
  python: stub("python", fn, sig),
  javascript: stub("javascript", fn, sig),
  cpp: stub("cpp", fn, sig),
  java: stub("java", fn, sig),
});

export const PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Sum of Array",
    description: "Given an array of integers, return the sum of all elements.",
    difficulty: "easy",
    concept: "arrays",
    examples: [{ input: "[1,2,3,4]", output: "10" }],
    testCases: [
      { input: "[1,2,3,4]", expected: "10" },
      { input: "[]", expected: "0" },
      { input: "[-1,-2,5]", expected: "2", hidden: true },
    ],
    constraints: ["0 <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: starter("arraySum", "nums"),
  },
  {
    id: "p2",
    title: "Find Maximum",
    description: "Return the maximum element in a non-empty integer array.",
    difficulty: "easy",
    concept: "arrays",
    examples: [{ input: "[3,1,4,1,5,9,2]", output: "9" }],
    testCases: [
      { input: "[3,1,4,1,5,9,2]", expected: "9" },
      { input: "[-5,-1,-9]", expected: "-1" },
      { input: "[42]", expected: "42", hidden: true },
    ],
    constraints: ["1 <= n <= 10^5"],
    starterCode: starter("findMax", "nums"),
  },
  {
    id: "p3",
    title: "Two Sum (Sorted)",
    description: "Given a SORTED array of integers and a target, return the 1-indexed pair [i,j] (i<j) such that nums[i]+nums[j]==target. Use two pointers.",
    difficulty: "easy",
    concept: "two-pointers",
    examples: [{ input: "nums=[2,7,11,15], target=9", output: "[1,2]" }],
    testCases: [
      { input: "nums=[2,7,11,15], target=9", expected: "[1,2]" },
      { input: "nums=[1,3,4,5,7,11], target=9", expected: "[3,5]" },
      { input: "nums=[1,2,3,4,4,9,56,90], target=8", expected: "[4,5]", hidden: true },
    ],
    constraints: ["2 <= n <= 10^5", "Array is sorted ascending"],
    starterCode: starter("twoSumSorted", "nums, target"),
  },
  {
    id: "p4",
    title: "Valid Palindrome",
    description: "Given a string, return true if it reads the same forward and backward, considering only alphanumeric characters and ignoring case. Use two pointers.",
    difficulty: "medium",
    concept: "two-pointers",
    examples: [{ input: '"A man, a plan, a canal: Panama"', output: "true" }],
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expected: "true" },
      { input: '"race a car"', expected: "false" },
      { input: '" "', expected: "true", hidden: true },
    ],
    constraints: ["1 <= s.length <= 2*10^5"],
    starterCode: starter("isPalindrome", "s"),
  },
  {
    id: "p5",
    title: "Max Sum Subarray of Size K",
    description: "Given an integer array and integer k, return the maximum sum of any contiguous subarray of length k.",
    difficulty: "easy",
    concept: "sliding-window",
    examples: [{ input: "nums=[2,1,5,1,3,2], k=3", output: "9", explanation: "Subarray [5,1,3] has sum 9." }],
    testCases: [
      { input: "nums=[2,1,5,1,3,2], k=3", expected: "9" },
      { input: "nums=[2,3,4,1,5], k=2", expected: "7" },
      { input: "nums=[1,1,1,1], k=4", expected: "4", hidden: true },
    ],
    constraints: ["1 <= k <= n <= 10^5"],
    starterCode: starter("maxSumK", "nums, k"),
  },
  {
    id: "p6",
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string, find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    concept: "sliding-window",
    examples: [{ input: '"abcabcbb"', output: "3", explanation: '"abc" has length 3.' }],
    testCases: [
      { input: '"abcabcbb"', expected: "3" },
      { input: '"bbbbb"', expected: "1" },
      { input: '"pwwkew"', expected: "3", hidden: true },
    ],
    constraints: ["0 <= s.length <= 5*10^4"],
    starterCode: starter("longestUniqueSubstr", "s"),
  },
  {
    id: "p7",
    title: "Factorial",
    description: "Compute n! recursively. Return the factorial of n.",
    difficulty: "easy",
    concept: "recursion",
    examples: [{ input: "5", output: "120" }],
    testCases: [
      { input: "0", expected: "1" },
      { input: "5", expected: "120" },
      { input: "10", expected: "3628800", hidden: true },
    ],
    constraints: ["0 <= n <= 12"],
    starterCode: starter("factorial", "n"),
  },
  {
    id: "p8",
    title: "Fibonacci",
    description: "Return the nth Fibonacci number where fib(0)=0, fib(1)=1. Recursion (with or without memoization) is allowed.",
    difficulty: "medium",
    concept: "recursion",
    examples: [{ input: "6", output: "8" }],
    testCases: [
      { input: "0", expected: "0" },
      { input: "6", expected: "8" },
      { input: "20", expected: "6765", hidden: true },
    ],
    constraints: ["0 <= n <= 30"],
    starterCode: starter("fib", "n"),
  },
  {
    id: "p9",
    title: "Reverse Array (Recursive)",
    description: "Reverse an integer array using recursion. Return the reversed array.",
    difficulty: "medium",
    concept: "recursion",
    examples: [{ input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" }],
    testCases: [
      { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" },
      { input: "[]", expected: "[]" },
      { input: "[7]", expected: "[7]", hidden: true },
    ],
    constraints: ["0 <= n <= 1000"],
    starterCode: starter("reverseArr", "nums"),
  },
  {
    id: "p10",
    title: "Move Zeroes",
    description: "Given an array, move all zeroes to the end while maintaining the relative order of non-zero elements. Do it in-place.",
    difficulty: "easy",
    concept: "arrays",
    examples: [{ input: "[0,1,0,3,12]", output: "[1,3,12,0,0]" }],
    testCases: [
      { input: "[0,1,0,3,12]", expected: "[1,3,12,0,0]" },
      { input: "[0]", expected: "[0]" },
      { input: "[1,2,3]", expected: "[1,2,3]", hidden: true },
    ],
    constraints: ["1 <= n <= 10^4"],
    starterCode: starter("moveZeroes", "nums"),
  },
];

export const getProblem = (id: string) => PROBLEMS.find(p => p.id === id);
