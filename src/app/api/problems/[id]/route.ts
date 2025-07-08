import { type NextRequest, NextResponse } from "next/server"

// In-memory storage (replace with database in production)
const problems: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const problem = problems.find((p) => p.id === params.id)

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 })
  }

  return NextResponse.json(problem)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const index = problems.findIndex((p) => p.id === params.id)

  if (index === -1) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 })
  }

  problems.splice(index, 1)
  return NextResponse.json({ message: "Problem deleted successfully" })
}
