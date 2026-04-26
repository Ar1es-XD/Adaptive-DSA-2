import type { DiagnosticQuestion } from "@/lib/types";

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // --- LOGICAL PUZZLES (5) ---
  {
    id: "l1",
    concept: "arrays",
    kind: "logical",
    prompt:
      "You have 8 identical-looking coins, but one is slightly heavier than the others. You have a balance scale. What is the minimum number of weighings needed to find the heavy coin? Explain your strategy.",
    referenceAnswer:
      "2 weighings. Divide into 3 groups (3, 3, 2). Weigh the two groups of 3. If they balance, weigh the 2 from the last group. If they don't, weigh 2 from the heavier group of 3.",
    referenceReasoning: "Tests the ability to think in terms of logarithmic search/division of space (base 3 in this case).",
  },
  {
    id: "l2",
    concept: "two-pointers",
    kind: "logical",
    prompt:
      "Four people need to cross a fragile bridge at night. It's dark and they only have one torch. The bridge can only hold two people at a time. Each person walks at a different speed: A (1 min), B (2 min), C (5 min), and D (10 min). When two people cross, they must walk at the slower person's pace. What is the fastest way to get everyone across? (Total time).",
    referenceAnswer:
      "17 minutes. A&B cross (2), A returns (1), C&D cross (10), B returns (2), A&B cross (2). 2+1+10+2+2 = 17.",
    referenceReasoning: "Tests optimization logic and the ability to challenge the obvious 'send the fastest back every time' greedy strategy.",
  },
  {
    id: "l3",
    concept: "recursion",
    kind: "logical",
    prompt:
      "A set of Russian Dolls is nested inside each other. If you want to find a tiny piece of paper hidden inside the smallest doll, and you have 100 dolls, what is the 'algorithm' you would use to get to it? Describe the repetitive step.",
    referenceAnswer:
      "Open current doll. If there is a smaller doll inside, repeat the process for the smaller doll. Otherwise, take the paper. This is recursion.",
    referenceReasoning: "Tests intuitive understanding of recursive base cases and self-similarity.",
  },
  {
    id: "l4",
    concept: "sliding-window",
    kind: "logical",
    prompt:
      "You are monitoring a temperature sensor. You want to find the highest average temperature over any 3-hour period during a 24-hour day. Instead of recalculating the sum of 3 hours from scratch every time you move forward 1 hour, how could you update the sum more efficiently?",
    referenceAnswer:
      "Subtract the temperature from the hour that just left the 3-hour window and add the temperature from the new hour that just entered. This avoids redundant addition.",
    referenceReasoning: "Tests the 'Sliding Window' optimization intuition—reusing previous work.",
  },
  {
    id: "l5",
    concept: "arrays",
    kind: "logical",
    prompt:
      "In a line of 10 people, everyone is wearing either a red or blue hat. Each person can only see the hats of the people in front of them. The last person in line (who sees 9 hats) says 'Blue' if they see an even number of blue hats, and 'Red' otherwise. How can the other 9 people use this information to determine their own hat color with 100% certainty?",
    referenceAnswer:
      "The first person's shout establishes a 'parity' (even/odd) of blue hats. Each subsequent person, seeing the hats ahead and hearing the shouts behind, can deduce if their own hat must be blue or red to maintain the parity.",
    referenceReasoning: "Tests complex logical deduction and information propagation logic.",
  },

  // --- CODING QUESTIONS (5) ---
  {
    id: "c1",
    concept: "arrays",
    kind: "coding",
    language: "python",
    prompt:
      "Write a function `reverse_list(items)` that returns a new list with the elements in reverse order.\n\nInput: [1, 2, 3]\nOutput: [3, 2, 1]",
    starter: "def reverse_list(items):\n    # your code here\n    pass\n",
    referenceAnswer: "def reverse_list(items):\n    return items[::-1]",
  },
  {
    id: "c2",
    concept: "two-pointers",
    kind: "coding",
    language: "python",
    prompt:
      "Write a function `is_palindrome(s)` that returns True if a string reads the same forwards and backwards, and False otherwise.\n\nInput: 'radar'\nOutput: True",
    starter: "def is_palindrome(s):\n    # your code here\n    pass\n",
    referenceAnswer: "def is_palindrome(s):\n    return s == s[::-1]",
  },
  {
    id: "c3",
    concept: "recursion",
    kind: "coding",
    language: "python",
    prompt:
      "Write a function `factorial(n)` that calculates the product of all positive integers up to n. (e.g., 5! = 5*4*3*2*1 = 120).\n\nYou may assume n >= 0.",
    starter: "def factorial(n):\n    # your code here\n    pass\n",
    referenceAnswer: "def factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n-1)",
  },
  {
    id: "c4",
    concept: "sliding-window",
    kind: "coding",
    language: "python",
    prompt:
      "Given a list of numbers `nums`, find the maximum sum of any two adjacent elements.\n\nInput: [1, 5, 2, 8, 3]\nOutput: 11 (because 8 + 3 = 11)",
    starter: "def max_adjacent_sum(nums):\n    # your code here\n    pass\n",
    referenceAnswer: "def max_adjacent_sum(nums):\n    if len(nums) < 2: return 0\n    max_sum = nums[0] + nums[1]\n    for i in range(len(nums) - 1):\n        max_sum = max(max_sum, nums[i] + nums[i+1])\n    return max_sum",
  },
  {
    id: "c5",
    concept: "arrays",
    kind: "coding",
    language: "python",
    prompt:
      "Write a function `fizz_buzz(n)` that returns a list of strings from 1 to n. But for multiples of 3, use 'Fizz', for multiples of 5, use 'Buzz', and for multiples of both 3 and 5, use 'FizzBuzz'.\n\nInput: 5\nOutput: ['1', '2', 'Fizz', '4', 'Buzz']",
    starter: "def fizz_buzz(n):\n    # your code here\n    pass\n",
    referenceAnswer: "def fizz_buzz(n):\n    res = []\n    for i in range(1, n+1):\n        if i % 15 == 0: res.append('FizzBuzz')\n        elif i % 3 == 0: res.append('Fizz')\n        elif i % 5 == 0: res.append('Buzz')\n        else: res.append(str(i))\n    return res",
  },
];
