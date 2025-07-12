import { type NextRequest, NextResponse } from "next/server"
import { sampleProblem } from "./[id]/route"

// In-memory storage (replace with database in production)
const problems: any[] = [sampleProblem]
let nextId = 1

export async function GET() {
  return NextResponse.json(problems)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, difficulty, testCases } = body

    const newProblem = {
      id: nextId.toString(),
      title,
      description,
      difficulty,
      testCases,
      createdAt: new Date().toISOString(),
    }

    problems.push(newProblem)
    nextId++

    return NextResponse.json(newProblem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create problem" }, { status: 500 })
  }
}
