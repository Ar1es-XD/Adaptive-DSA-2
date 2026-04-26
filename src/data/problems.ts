import type { Problem } from "@/lib/types";

const s = (py: string, js: string, cpp: string, java: string) => ({ python: py, javascript: js, cpp, java });

export const PROBLEMS: Problem[] = [
  // ── ARRAYS ──
  { id:"arr-1", title:"Sum of Array", description:"Return the sum of all integers in the array.", difficulty:"easy", concept:"arrays",
    examples:[{input:"[1,2,3,4]",output:"10"}], testCases:[{input:"[1,2,3,4]",expected:"10"},{input:"[-1,1]",expected:"0",hidden:true}],
    constraints:["1 ≤ n ≤ 10^5","-10^4 ≤ nums[i] ≤ 10^4"],
    starterCode: s("def array_sum(nums):\n    pass","function arraySum(nums) {\n  // your code\n}","int arraySum(vector<int>& nums) {\n  // your code\n}","int arraySum(int[] nums) {\n  // your code\n}") },

  { id:"arr-2", title:"Find Maximum", description:"Return the largest element in the array.", difficulty:"easy", concept:"arrays",
    examples:[{input:"[3,1,7,2]",output:"7"}], testCases:[{input:"[3,1,7,2]",expected:"7"},{input:"[-5,-1,-3]",expected:"-1",hidden:true}],
    constraints:["1 ≤ n ≤ 10^5"],
    starterCode: s("def find_max(nums):\n    pass","function findMax(nums) {\n}","int findMax(vector<int>& nums) {\n}","int findMax(int[] nums) {\n}") },

  { id:"arr-3", title:"Move Zeroes", description:"Move all zeroes to the end of the array in-place, maintaining relative order of non-zero elements.", difficulty:"medium", concept:"arrays",
    examples:[{input:"[0,1,0,3,12]",output:"[1,3,12,0,0]"}], testCases:[{input:"[0,1,0,3,12]",expected:"[1,3,12,0,0]"},{input:"[0,0,1]",expected:"[1,0,0]",hidden:true}],
    constraints:["1 ≤ n ≤ 10^4"],
    starterCode: s("def move_zeroes(nums):\n    pass","function moveZeroes(nums) {\n}","void moveZeroes(vector<int>& nums) {\n}","void moveZeroes(int[] nums) {\n}") },

  // ── TWO POINTERS ──
  { id:"tp-1", title:"Two Sum (Sorted)", description:"Given a sorted array, find two numbers that add up to target. Return their 1-indexed positions.", difficulty:"easy", concept:"two-pointers",
    examples:[{input:"nums=[2,7,11,15], target=9",output:"[1,2]"}], testCases:[{input:"[2,7,11,15], 9",expected:"[1,2]"},{input:"[1,3,4,6], 7",expected:"[2,3]",hidden:true}],
    constraints:["2 ≤ n ≤ 10^4","Exactly one solution exists"],
    starterCode: s("def two_sum(nums, target):\n    pass","function twoSum(nums, target) {\n}","vector<int> twoSum(vector<int>& nums, int target) {\n}","int[] twoSum(int[] nums, int target) {\n}") },

  { id:"tp-2", title:"Valid Palindrome", description:"Return true if the string is a palindrome (only alphanumeric characters, case-insensitive).", difficulty:"easy", concept:"two-pointers",
    examples:[{input:'"A man a plan a canal Panama"',output:"true"}], testCases:[{input:'"racecar"',expected:"true"},{input:'"hello"',expected:"false",hidden:true}],
    constraints:["1 ≤ s.length ≤ 2×10^5"],
    starterCode: s("def is_palindrome(s):\n    pass","function isPalindrome(s) {\n}","bool isPalindrome(string s) {\n}","boolean isPalindrome(String s) {\n}") },

  { id:"tp-3", title:"Container With Most Water", description:"Given heights of vertical lines, find two lines that together with the x-axis form a container with the most water.", difficulty:"medium", concept:"two-pointers",
    examples:[{input:"[1,8,6,2,5,4,8,3,7]",output:"49"}], testCases:[{input:"[1,8,6,2,5,4,8,3,7]",expected:"49"},{input:"[1,1]",expected:"1",hidden:true}],
    constraints:["2 ≤ n ≤ 10^5","0 ≤ height[i] ≤ 10^4"],
    starterCode: s("def max_area(height):\n    pass","function maxArea(height) {\n}","int maxArea(vector<int>& height) {\n}","int maxArea(int[] height) {\n}") },

  // ── SLIDING WINDOW ──
  { id:"sw-1", title:"Max Sum Subarray of Size K", description:"Find the maximum sum of any contiguous subarray of size k.", difficulty:"easy", concept:"sliding-window",
    examples:[{input:"nums=[2,1,5,1,3,2], k=3",output:"9"}], testCases:[{input:"[2,1,5,1,3,2], 3",expected:"9"},{input:"[1,4,2,10,2,3,1,0,20], 4",expected:"24",hidden:true}],
    constraints:["1 ≤ k ≤ n ≤ 10^5"],
    starterCode: s("def max_sum(nums, k):\n    pass","function maxSum(nums, k) {\n}","int maxSum(vector<int>& nums, int k) {\n}","int maxSum(int[] nums, int k) {\n}") },

  { id:"sw-2", title:"Longest Substring Without Repeating Characters", description:"Find the length of the longest substring without repeating characters.", difficulty:"medium", concept:"sliding-window",
    examples:[{input:'"abcabcbb"',output:"3",explanation:"abc"}], testCases:[{input:'"abcabcbb"',expected:"3"},{input:'"bbbbb"',expected:"1",hidden:true}],
    constraints:["0 ≤ s.length ≤ 5×10^4"],
    starterCode: s("def length_of_longest_substring(s):\n    pass","function lengthOfLongestSubstring(s) {\n}","int lengthOfLongestSubstring(string s) {\n}","int lengthOfLongestSubstring(String s) {\n}") },

  { id:"sw-3", title:"Minimum Size Subarray Sum", description:"Find the minimal length of a contiguous subarray whose sum ≥ target. Return 0 if no such subarray.", difficulty:"medium", concept:"sliding-window",
    examples:[{input:"target=7, nums=[2,3,1,2,4,3]",output:"2",explanation:"[4,3]"}], testCases:[{input:"7, [2,3,1,2,4,3]",expected:"2"},{input:"4, [1,4,4]",expected:"1",hidden:true}],
    constraints:["1 ≤ target ≤ 10^9","1 ≤ n ≤ 10^5"],
    starterCode: s("def min_subarray_len(target, nums):\n    pass","function minSubArrayLen(target, nums) {\n}","int minSubArrayLen(int target, vector<int>& nums) {\n}","int minSubArrayLen(int target, int[] nums) {\n}") },

  // ── RECURSION ──
  { id:"rec-1", title:"Factorial", description:"Return n! (n factorial). Assume n ≥ 0.", difficulty:"easy", concept:"recursion",
    examples:[{input:"5",output:"120"}], testCases:[{input:"5",expected:"120"},{input:"0",expected:"1",hidden:true}],
    constraints:["0 ≤ n ≤ 12"],
    starterCode: s("def factorial(n):\n    pass","function factorial(n) {\n}","int factorial(int n) {\n}","int factorial(int n) {\n}") },

  { id:"rec-2", title:"Fibonacci", description:"Return the nth Fibonacci number. fib(0)=0, fib(1)=1.", difficulty:"easy", concept:"recursion",
    examples:[{input:"6",output:"8"}], testCases:[{input:"6",expected:"8"},{input:"10",expected:"55",hidden:true}],
    constraints:["0 ≤ n ≤ 30"],
    starterCode: s("def fib(n):\n    pass","function fib(n) {\n}","int fib(int n) {\n}","int fib(int n) {\n}") },

  { id:"rec-3", title:"Reverse Array (Recursive)", description:"Reverse an array in-place using recursion.", difficulty:"medium", concept:"recursion",
    examples:[{input:"[1,2,3,4,5]",output:"[5,4,3,2,1]"}], testCases:[{input:"[1,2,3,4,5]",expected:"[5,4,3,2,1]"},{input:"[1,2]",expected:"[2,1]",hidden:true}],
    constraints:["1 ≤ n ≤ 10^3"],
    starterCode: s("def reverse_array(nums, left=0, right=None):\n    pass","function reverseArray(nums, left=0, right=nums.length-1) {\n}","void reverseArray(vector<int>& nums, int l, int r) {\n}","void reverseArray(int[] nums, int l, int r) {\n}") },

  // ── HASH MAP ──
  { id:"hm-1", title:"Two Sum", description:"Given an array and target, return indices of two numbers that add up to target.", difficulty:"easy", concept:"hash-map",
    examples:[{input:"nums=[2,7,11,15], target=9",output:"[0,1]"}], testCases:[{input:"[2,7,11,15], 9",expected:"[0,1]"},{input:"[3,2,4], 6",expected:"[1,2]",hidden:true}],
    constraints:["2 ≤ n ≤ 10^4","Exactly one solution"],
    starterCode: s("def two_sum(nums, target):\n    pass","function twoSum(nums, target) {\n}","vector<int> twoSum(vector<int>& nums, int target) {\n}","int[] twoSum(int[] nums, int target) {\n}") },

  { id:"hm-2", title:"First Non-Repeating Character", description:"Return the index of the first non-repeating character in a string. Return -1 if none.", difficulty:"easy", concept:"hash-map",
    examples:[{input:'"leetcode"',output:"0"}], testCases:[{input:'"leetcode"',expected:"0"},{input:'"aabb"',expected:"-1",hidden:true}],
    constraints:["1 ≤ s.length ≤ 10^5","lowercase letters only"],
    starterCode: s("def first_uniq_char(s):\n    pass","function firstUniqChar(s) {\n}","int firstUniqChar(string s) {\n}","int firstUniqChar(String s) {\n}") },

  { id:"hm-3", title:"Group Anagrams", description:"Group strings that are anagrams of each other.", difficulty:"medium", concept:"hash-map",
    examples:[{input:'["eat","tea","tan","ate","nat","bat"]',output:'[["bat"],["nat","tan"],["ate","eat","tea"]]'}],
    testCases:[{input:'["eat","tea","tan","ate","nat","bat"]',expected:'[["bat"],["nat","tan"],["ate","eat","tea"]]'},{input:'[""]',expected:'[[""]]',hidden:true}],
    constraints:["1 ≤ strs.length ≤ 10^4","0 ≤ strs[i].length ≤ 100"],
    starterCode: s("def group_anagrams(strs):\n    pass","function groupAnagrams(strs) {\n}","vector<vector<string>> groupAnagrams(vector<string>& strs) {\n}","List<List<String>> groupAnagrams(String[] strs) {\n}") },

  // ── STACK ──
  { id:"stk-1", title:"Valid Parentheses", description:"Return true if the string of brackets is valid (every open bracket has a matching closing bracket in correct order).", difficulty:"easy", concept:"stack",
    examples:[{input:'"()[]{}"',output:"true"},{input:'"(]"',output:"false"}],
    testCases:[{input:'"()[]{}"',expected:"true"},{input:'"([)]"',expected:"false",hidden:true}],
    constraints:["1 ≤ s.length ≤ 10^4","s consists of ()[]{}"],
    starterCode: s("def is_valid(s):\n    pass","function isValid(s) {\n}","bool isValid(string s) {\n}","boolean isValid(String s) {\n}") },

  { id:"stk-2", title:"Min Stack", description:"Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).", difficulty:"medium", concept:"stack",
    examples:[{input:"push(-2),push(0),push(-3),getMin(),pop(),top(),getMin()",output:"-3,0,-2"}],
    testCases:[{input:"push(1),push(2),getMin(),pop(),getMin()",expected:"1,1"},{input:"push(-2),push(0),getMin()",expected:"-2",hidden:true}],
    constraints:["At most 3×10^4 operations"],
    starterCode: s("class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val): pass\n    def pop(self): pass\n    def top(self): pass\n    def get_min(self): pass","class MinStack {\n  push(val) {}\n  pop() {}\n  top() {}\n  getMin() {}\n}","class MinStack {\npublic:\n  void push(int val) {}\n  void pop() {}\n  int top() {}\n  int getMin() {}\n};","class MinStack {\n  public void push(int val) {}\n  public void pop() {}\n  public int top() {return 0;}\n  public int getMin() {return 0;}\n}") },

  { id:"stk-3", title:"Daily Temperatures", description:"For each day, find how many days until a warmer temperature. Return 0 if no future warmer day exists.", difficulty:"medium", concept:"stack",
    examples:[{input:"[73,74,75,71,69,72,76,73]",output:"[1,1,4,2,1,1,0,0]"}],
    testCases:[{input:"[73,74,75,71,69,72,76,73]",expected:"[1,1,4,2,1,1,0,0]"},{input:"[30,40,50,60]",expected:"[1,1,1,0]",hidden:true}],
    constraints:["1 ≤ n ≤ 10^5","30 ≤ T[i] ≤ 100"],
    starterCode: s("def daily_temperatures(temps):\n    pass","function dailyTemperatures(temps) {\n}","vector<int> dailyTemperatures(vector<int>& T) {\n}","int[] dailyTemperatures(int[] T) {\n}") },

  // ── BINARY SEARCH ──
  { id:"bs-1", title:"Binary Search", description:"Given a sorted array and target, return the index of target or -1 if not found.", difficulty:"easy", concept:"binary-search",
    examples:[{input:"nums=[-1,0,3,5,9,12], target=9",output:"4"}],
    testCases:[{input:"[-1,0,3,5,9,12], 9",expected:"4"},{input:"[-1,0,3,5,9,12], 2",expected:"-1",hidden:true}],
    constraints:["1 ≤ n ≤ 10^4","All elements are unique"],
    starterCode: s("def search(nums, target):\n    pass","function search(nums, target) {\n}","int search(vector<int>& nums, int target) {\n}","int search(int[] nums, int target) {\n}") },

  { id:"bs-2", title:"Find Minimum in Rotated Sorted Array", description:"Find the minimum element in a rotated sorted array (no duplicates).", difficulty:"medium", concept:"binary-search",
    examples:[{input:"[3,4,5,1,2]",output:"1"}],
    testCases:[{input:"[3,4,5,1,2]",expected:"1"},{input:"[4,5,6,7,0,1,2]",expected:"0",hidden:true}],
    constraints:["1 ≤ n ≤ 5000","All elements are unique"],
    starterCode: s("def find_min(nums):\n    pass","function findMin(nums) {\n}","int findMin(vector<int>& nums) {\n}","int findMin(int[] nums) {\n}") },

  { id:"bs-3", title:"Search in Rotated Sorted Array", description:"Search for target in a rotated sorted array. Return index or -1.", difficulty:"medium", concept:"binary-search",
    examples:[{input:"nums=[4,5,6,7,0,1,2], target=0",output:"4"}],
    testCases:[{input:"[4,5,6,7,0,1,2], 0",expected:"4"},{input:"[4,5,6,7,0,1,2], 3",expected:"-1",hidden:true}],
    constraints:["1 ≤ n ≤ 5000","All elements are unique"],
    starterCode: s("def search(nums, target):\n    pass","function search(nums, target) {\n}","int search(vector<int>& nums, int target) {\n}","int search(int[] nums, int target) {\n}") },

  // ── STRINGS ──
  { id:"str-1", title:"Reverse String", description:"Reverse a string in-place.", difficulty:"easy", concept:"strings",
    examples:[{input:'["h","e","l","l","o"]',output:'["o","l","l","e","h"]'}],
    testCases:[{input:'["h","e","l","l","o"]',expected:'["o","l","l","e","h"]'},{input:'["a","b"]',expected:'["b","a"]',hidden:true}],
    constraints:["1 ≤ s.length ≤ 10^5"],
    starterCode: s("def reverse_string(s):\n    pass","function reverseString(s) {\n}","void reverseString(vector<char>& s) {\n}","void reverseString(char[] s) {\n}") },

  { id:"str-2", title:"Valid Anagram", description:"Return true if t is an anagram of s.", difficulty:"easy", concept:"strings",
    examples:[{input:'s="anagram", t="nagaram"',output:"true"}],
    testCases:[{input:'"anagram","nagaram"',expected:"true"},{input:'"rat","car"',expected:"false",hidden:true}],
    constraints:["1 ≤ s,t length ≤ 5×10^4","lowercase letters"],
    starterCode: s("def is_anagram(s, t):\n    pass","function isAnagram(s, t) {\n}","bool isAnagram(string s, string t) {\n}","boolean isAnagram(String s, String t) {\n}") },

  { id:"str-3", title:"Longest Common Prefix", description:"Find the longest common prefix string among an array of strings. Return empty string if none.", difficulty:"easy", concept:"strings",
    examples:[{input:'["flower","flow","flight"]',output:'"fl"'}],
    testCases:[{input:'["flower","flow","flight"]',expected:'"fl"'},{input:'["dog","racecar","car"]',expected:'""',hidden:true}],
    constraints:["1 ≤ strs.length ≤ 200","0 ≤ strs[i].length ≤ 200"],
    starterCode: s("def longest_common_prefix(strs):\n    pass","function longestCommonPrefix(strs) {\n}","string longestCommonPrefix(vector<string>& strs) {\n}","String longestCommonPrefix(String[] strs) {\n}") },
];

export const getProblem = (id: string) => PROBLEMS.find((p) => p.id === id);
