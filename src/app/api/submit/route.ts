import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for submissions (replace with database in production)
const submissions: any[] = []
let nextSubmissionId = 1

export async function POST(request: NextRequest) {
  try {
    const { problemId, code, language, testResults } = await request.json()

    const passedTests = testResults.filter((r: any) => r.passed).length
    const totalTests = testResults.length
    const score = (passedTests / totalTests) * 100

    const submission = {
      id: nextSubmissionId.toString(),
      problemId,
      code,
      language,
      testResults,
      score,
      passedTests,
      totalTests,
      submittedAt: new Date().toISOString(),
    }

    submissions.push(submission)
    nextSubmissionId++

    return NextResponse.json({
      message: "Solution submitted successfully",
      submission: {
        id: submission.id,
        score: submission.score,
        passedTests: submission.passedTests,
        totalTests: submission.totalTests,
      },
    })
  } catch (error) {
    console.error("Error submitting solution:", error)
    return NextResponse.json({ error: "Failed to submit solution" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(submissions)
}
