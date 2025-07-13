import { type NextRequest, NextResponse } from "next/server";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.

Input Format:
First line contains space-separated integers representing the array
Second line contains the target integer

Output Format:
Two space-separated integers representing the indices`,
    difficulty: "easy",
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
      { input: "3 3\n6", expectedOutput: "0 1" },
      { input: "1 2 3 4 5\n8", expectedOutput: "2 4" },
      { input: "-1 -2 -3 -4 -5\n-8", expectedOutput: "2 4" },
      { input: "0 4 3 0\n0", expectedOutput: "0 3" },
    ],
  },
  {
    id: 2,
    title: "Palindrome Number",
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same backward as forward.

Example 1:
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

Example 2:
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

Example 3:
Input: x = 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.

Constraints:
- -2^31 <= x <= 2^31 - 1

Input Format:
A single integer x

Output Format:
"true" if x is a palindrome, "false" otherwise`,
    difficulty: "easy",
    testCases: [
      { input: "121", expectedOutput: "true" },
      { input: "-121", expectedOutput: "false" },
      { input: "10", expectedOutput: "false" },
      { input: "12321", expectedOutput: "true" },
      { input: "0", expectedOutput: "true" },
      { input: "12345", expectedOutput: "false" },
    ],
  },
  {
    id: 3,
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Example 4:
Input: s = "([)]"
Output: false

Example 5:
Input: s = "{[]}"
Output: true

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'

Input Format:
A string containing only parentheses

Output Format:
"true" if the string is valid, "false" otherwise`,
    difficulty: "medium",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
      { input: "{[]}", expectedOutput: "true" },
      { input: "(((", expectedOutput: "false" },
      { input: ")))", expectedOutput: "false" },
    ],
  },
  {
    id: 4,
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

Constraints:
- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.

Input Format:
A string s

Output Format:
An integer representing the length of the longest substring without repeating characters`,
    difficulty: "medium",
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
      { input: "", expectedOutput: "0" },
      { input: "a", expectedOutput: "1" },
      { input: "abcdef", expectedOutput: "6" },
      { input: "aab", expectedOutput: "2" },
    ],
  },
  {
    id: 5,
    title: "Merge Two Sorted Lists",
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: list1 = [], list2 = []
Output: []

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]

Note: For this problem, we'll represent linked lists as space-separated integers.

Constraints:
- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.

Input Format:
First line: space-separated integers representing list1
Second line: space-separated integers representing list2

Output Format:
Space-separated integers representing the merged sorted list`,
    difficulty: "easy",
    testCases: [
      { input: "1 2 4\n1 3 4", expectedOutput: "1 1 2 3 4 4" },
      { input: "\n", expectedOutput: "" },
      { input: "\n0", expectedOutput: "0" },
      { input: "1 3 5\n2 4 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "1 2 3\n4 5 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "1\n2", expectedOutput: "1 2" },
    ],
  },
];

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const problemId = parseInt(params.id);
  const problem = problems.find((p) => p.id === problemId);
  console.log(params.id, problem);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json(problem);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const problemId = parseInt(params.id);
  const index = problems.findIndex((p) => p.id === problemId);

  if (index === -1) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  problems.splice(index, 1);
  return NextResponse.json({ message: "Problem deleted successfully" });
}
