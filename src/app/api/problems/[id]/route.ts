import { type NextRequest, NextResponse } from "next/server";

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
}

const problems: Problem[] = [
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
      {
        input: "2 7 11 15\n9",
        expectedOutput: "0 1",
      },
      {
        input: "3 2 4\n6",
        expectedOutput: "1 2",
      },
      {
        input: "3 3\n6",
        expectedOutput: "0 1",
      },
      {
        input: "1 2 3 4 5\n8",
        expectedOutput: "2 4",
      },
      {
        input: "-1 -2 -3 -4 -5\n-8",
        expectedOutput: "2 4",
      },
      {
        input: "0 4 3 0\n0",
        expectedOutput: "0 3",
      },
    ],
  },
];

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = context.params;
  const problemId = parseInt(params.id);
  const problem = problems.find((p) => p.id === problemId);
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  return NextResponse.json(problem);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = context.params;
  const problemId = parseInt(params.id);
  const index = problems.findIndex((p) => p.id === problemId);
  if (index === -1) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  problems.splice(index, 1);
  return NextResponse.json({ message: "Problem deleted successfully" });
}
