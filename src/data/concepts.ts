export const CONCEPT_CONTENT = {
  arrays: {
    title: "Arrays",
    intuition:
      "Arrays store elements in contiguous memory, giving O(1) random access by index. Most array problems revolve around iteration, in-place modification, or building auxiliary structures (prefix sums, hash maps).",
    whenToUse: [
      "Sequential access or transformation of a list of values",
      "When index-based lookup is needed",
      "Foundation for more advanced patterns: two-pointers, sliding window, prefix sums",
    ],
    walkthrough:
      "Example: sum of an array. Initialize total = 0, iterate over each element, add to total, return total. O(n) time, O(1) extra space.",
    skeleton: `function process(nums) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    // update result using nums[i]
  }
  return result;
}`,
  },
  "two-pointers": {
    title: "Two Pointers",
    intuition:
      "Use two indices that move toward each other (or in the same direction) to inspect pairs/regions of an array in O(n) instead of O(n^2). Works best on sorted arrays or when the relationship between elements is monotonic.",
    whenToUse: [
      "Finding pairs/triplets summing to a target in a sorted array",
      "Palindrome and string comparison problems",
      "Partitioning / in-place removal (e.g. move zeroes, remove duplicates)",
    ],
    walkthrough:
      "Two Sum (sorted): place left=0, right=n-1. If nums[left]+nums[right] < target, move left++. If >, move right--. Else return the pair. O(n).",
    skeleton: `function twoPointer(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
  },
  "sliding-window": {
    title: "Sliding Window",
    intuition:
      "Maintain a contiguous window [l, r] over the array/string and slide it forward. Add the new element on the right, remove the old element on the left when a constraint is violated. Avoids recomputation, achieving O(n).",
    whenToUse: [
      "Max/min sum or product over a fixed-size subarray",
      "Longest substring satisfying a constraint (unique chars, at most k distinct, etc.)",
      "Counting subarrays with a property",
    ],
    walkthrough:
      "Max sum of size k: compute sum of first k elements as window. Then for i=k..n-1: window += nums[i] - nums[i-k]; track max. O(n).",
    skeleton: `function slidingWindow(nums, k) {
  let sum = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (i >= k) sum -= nums[i - k];
    if (i >= k - 1) best = Math.max(best, sum);
  }
  return best;
}`,
  },
  recursion: {
    title: "Recursion",
    intuition:
      "Solve a problem by reducing it to a smaller instance of itself. Every recursion needs (1) a base case that stops the chain, (2) a recursive case that makes progress toward the base.",
    whenToUse: [
      "Naturally recursive structures: trees, graphs, divide-and-conquer",
      "Backtracking and combinatorial enumeration",
      "Problems expressed by recurrences (Fibonacci, factorial, merge sort)",
    ],
    walkthrough:
      "Factorial: base case factorial(0) = 1; recursive case factorial(n) = n * factorial(n-1). Stack depth O(n).",
    skeleton: `function recurse(n) {
  if (n <= 0) return /* base value */;
  return /* combine */ recurse(n - 1);
}`,
  },
} as const;
