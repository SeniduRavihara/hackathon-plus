import { type NextRequest, NextResponse } from "next/server";
import type { Problem } from "./[id]/route";

const problems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "Easy",
    testCases: [
      { input: "[2,7,11,15]", output: "[0,1]" },
      { input: "[3,2,4]", output: "[1,2]" },
      { input: "[3,3]", output: "[0,1]" },
    ],
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Add Two Numbers",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    difficulty: "Medium",
    testCases: [
      { input: "[2,4,3]", output: "[5,6,4]" },
      { input: "[0]", output: "[0]" },
      { input: "[9,9,9,9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" },
    ],
    createdAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Longest Substring Without Repeating Characters",
    description:
      'Given a string s, find the length of the longest substring without repeating characters. Example 1: Input: s = "abcabcbb" Output: 3 Explanation: The answer is "abc", with the length of 3.',
    difficulty: "Medium",
    testCases: [
      { input: '"abcabcbb"', output: "3" },
      { input: '"bbbbb"', output: "1" },
      { input: '"pwwkew"', output: "3" },
    ],
    createdAt: "2023-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    title: "Median of Two Sorted Arrays",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)). Example 1: Input: nums1 = [1,3], nums2 = [2] Output: 2.00000 Explanation: merged array = [1,2,3] and median is (2 + 3) / 2 = 2.5.",
    difficulty: "Hard",
    testCases: [
      { input: "[1,3]", output: "2.00000" },
      { input: "[1,2]", output: "1.50000" },
      { input: "[0,0]", output: "0.00000" },
      { input: "[1,1]", output: "1.00000" },
    ],
    createdAt: "2023-01-04T00:00:00.000Z",
  },
  {
    id: "5",
    title: "Reverse Integer",
    description:
      "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0. Example 1: Input: x = 123 Output: 321 Example 2: Input: x = -123 Output: -321 Example 3: Input: x = 120 Output: 21",
    difficulty: "Easy",
    testCases: [
      { input: "123", output: "321" },
      { input: "-123", output: "-321" },
      { input: "120", output: "21" },
    ],
    createdAt: "2023-01-05T00:00:00.000Z",
  },
];

let nextId = 6;

export async function GET() {
  return NextResponse.json(problems);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, difficulty, testCases } = body;
    const newProblem: Problem = {
      id: nextId,
      title,
      description,
      difficulty,
      testCases,
    };
    problems.push(newProblem);
    nextId++;
    return NextResponse.json(newProblem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}
