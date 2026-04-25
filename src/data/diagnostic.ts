import type { DiagnosticQuestion } from "@/lib/types";

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // Q1 — Logical reasoning: linear growth (arrays / linear scan)
  {
    id: "q1",
    concept: "arrays",
    kind: "logical",
    prompt:
      "You are scanning a list of numbers to find the largest value. You compare each element with the current maximum one by one.\n\nIf the list size doubles, how does the number of comparisons change? Explain your reasoning.",
    referenceAnswer:
      "The number of comparisons also roughly doubles. If the list has n elements, you do about n comparisons. Doubling n to 2n means about 2n comparisons — it grows linearly with the size of the list.",
    referenceReasoning:
      "Each element is visited exactly once, so the work scales linearly with input size (linear growth).",
  },

  // Q2 — Logical reasoning: hidden quadratic (nested comparisons → motivates two pointers / smarter scans)
  {
    id: "q2",
    concept: "two-pointers",
    kind: "logical",
    prompt:
      "You have a list of n numbers. For each number, you compare it with every other number in the list.\n\nHow does the number of comparisons grow as n increases? Explain in simple terms.",
    referenceAnswer:
      "For each of the n numbers you do about n comparisons, so the total is about n × n = n² comparisons. If n doubles, the work grows roughly four times. The growth is quadratic — much faster than linear.",
    referenceReasoning:
      "Two nested passes over the list produce n² work; the student should recognize the multiplicative effect, not just say 'a lot more'.",
  },

  // Q3 — Conceptual: what does O(n) mean
  {
    id: "q3",
    concept: "sliding-window",
    kind: "conceptual",
    prompt:
      "What does it mean when we say an algorithm is O(n)? Explain in your own words (no formal definition needed).",
    referenceAnswer:
      "It means the work the algorithm does grows in direct proportion to the input size n. If the input doubles, the work roughly doubles. The algorithm touches each item a constant number of times — it does not revisit or re-compare excessively.",
    referenceReasoning:
      "The student should convey proportional growth and the intuition of 'one pass / constant work per item', not just repeat the symbol.",
  },

  // Q4 — Coding: max element in array (basic implementation)
  {
    id: "q4",
    concept: "arrays",
    kind: "coding",
    language: "python",
    prompt:
      "Write a function `find_max(nums)` that returns the maximum element in the list `nums`.\n\nExample:\nInput: [3, 1, 7, 2]\nOutput: 7\n\nYou may assume `nums` has at least one element.",
    starter: "def find_max(nums):\n    # your code here\n    pass\n",
    referenceAnswer:
      "def find_max(nums):\n    best = nums[0]\n    for x in nums[1:]:\n        if x > best:\n            best = x\n    return best",
  },

  // Q5 — Coding: consecutive pair sum > 100 (adjacency / pattern lite)
  {
    id: "q5",
    concept: "two-pointers",
    kind: "coding",
    language: "python",
    prompt:
      "Given a list of integers `nums`, return True if there exist two CONSECUTIVE numbers whose sum is greater than 100, otherwise return False.\n\nExample:\nInput: [10, 60, 50, 20]\nOutput: True   (because 60 + 50 > 100)\n\nIf the list has fewer than 2 elements, return False.",
    starter: "def has_consecutive_big_sum(nums):\n    # your code here\n    pass\n",
    referenceAnswer:
      "def has_consecutive_big_sum(nums):\n    for i in range(len(nums) - 1):\n        if nums[i] + nums[i + 1] > 100:\n            return True\n    return False",
  },
];
