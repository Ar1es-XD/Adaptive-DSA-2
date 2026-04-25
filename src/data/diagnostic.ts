import type { DiagnosticQuestion } from "@/lib/types";

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // 1. Logical reasoning — pattern / scanning intuition (arrays)
  {
    id: "q1",
    concept: "arrays",
    kind: "logical",
    prompt:
      "You have a long row of numbered lockers. You walk past them once, left to right, and you may only remember a constant number of values at a time. Describe a strategy to find the largest number written on any locker, and explain why your approach is reliable.",
    referenceAnswer:
      "Keep a running variable 'best' initialized to the first locker's number. For each subsequent locker, if its number is greater than 'best', update 'best'. After the single pass, 'best' holds the maximum.",
    referenceReasoning:
      "A single linear scan with O(1) memory is sufficient because the maximum is invariant under order, and updating only on a strictly greater value preserves the running maximum.",
  },

  // 2. Logical reasoning — two pointers intuition (no jargon)
  {
    id: "q2",
    concept: "two-pointers",
    kind: "logical",
    prompt:
      "You are given a SORTED list of numbers and a target value T. You want to find two numbers in the list that add up to T. Without using extra memory, describe a method that avoids checking every pair, and explain why it works.",
    referenceAnswer:
      "Place one pointer at the start (left) and one at the end (right). Compute the sum of the two pointed numbers. If sum == T, done. If sum < T, move left pointer right (increase sum). If sum > T, move right pointer left (decrease sum). Repeat until they meet.",
    referenceReasoning:
      "Sortedness makes the sum monotonic with respect to pointer moves, so each move safely eliminates one number from consideration, giving O(n) time and O(1) space.",
  },

  // 3. Conceptual — sliding window
  {
    id: "q3",
    concept: "sliding-window",
    kind: "conceptual",
    prompt:
      "In your own words, when does the sliding-window technique apply, and what does it let you avoid recomputing? Give one short example of a problem where it helps.",
    referenceAnswer:
      "Sliding window applies to problems over a contiguous subarray or substring with a constraint (sum, length, distinct chars, etc.). It avoids recomputing the answer for each subarray from scratch by reusing the previous window's state and updating it incrementally as one end advances and the other shrinks. Example: longest substring without repeating characters, or maximum sum of any k-length subarray.",
    referenceReasoning:
      "It exploits the overlap between consecutive subarrays so each element is added and removed at most once, yielding O(n) time.",
  },

  // 4. Conceptual — recursion base case
  {
    id: "q4",
    concept: "recursion",
    kind: "conceptual",
    prompt:
      "What is a 'base case' in recursion, and what happens if a recursive function does not have one (or has the wrong one)? Answer briefly in your own words.",
    referenceAnswer:
      "A base case is the smallest version of the problem whose answer is known directly, without recursing further. It is the stopping condition. Without a correct base case, the function calls itself indefinitely, eventually causing a stack overflow.",
    referenceReasoning:
      "Recursion reduces a problem toward the base case; the base case anchors the recursion so that the call stack can unwind with concrete answers.",
  },

  // 5. Coding — small implementation (arrays / loop)
  {
    id: "q5",
    concept: "arrays",
    kind: "coding",
    language: "python",
    prompt:
      "Write a function `count_positive(nums)` that returns the number of strictly positive integers in the list `nums`. You may assume `nums` is a list of integers (possibly empty).",
    starter: "def count_positive(nums):\n    # your code here\n    pass\n",
    referenceAnswer:
      "def count_positive(nums):\n    count = 0\n    for x in nums:\n        if x > 0:\n            count += 1\n    return count",
  },

  // 6. Coding — recursion
  {
    id: "q6",
    concept: "recursion",
    kind: "coding",
    language: "python",
    prompt:
      "Write a recursive function `sum_to(n)` that returns 1 + 2 + ... + n for a non-negative integer n. It must be recursive (no loops). Define the base case yourself.",
    starter: "def sum_to(n):\n    # your code here\n    pass\n",
    referenceAnswer:
      "def sum_to(n):\n    if n <= 0:\n        return 0\n    return n + sum_to(n - 1)",
  },
];
