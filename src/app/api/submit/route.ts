import { type NextRequest, NextResponse } from "next/server";

// Example submission storage (replace with DB in production)
interface Submission {
  id: number;
  problemId: number;
  code: string;
  language: string;
  testResults: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  }[];
  createdAt: string;
}

const submissions: Submission[] = [];
let nextId = 1;

export async function POST(request: NextRequest) {
  try {
    const { problemId, code, language, testResults } = await request.json();
    const newSubmission: Submission = {
      id: nextId++,
      problemId,
      code,
      language,
      testResults,
      createdAt: new Date().toISOString(),
    };
    submissions.push(newSubmission);
    return NextResponse.json(newSubmission, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit solution" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(submissions);
}
