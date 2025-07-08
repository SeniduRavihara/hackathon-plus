"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Clock, Users } from "lucide-react"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: string
  testCases: Array<{ input: string; expectedOutput: string }>
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/problems")
      const data = await response.json()
      setProblems(data)
    } catch (error) {
      console.error("Error fetching problems:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "badge-easy"
      case "medium":
        return "badge-medium"
      case "hard":
        return "badge-hard"
      default:
        return "bg-slate-500/20 text-slate-400 border border-slate-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading problems...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Hackathon Problems</h1>
              <p className="text-slate-400">Choose a problem to start coding</p>
            </div>
            <Link href="/admin">
              <Button className="border border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
                Admin Panel
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>{problems.length} Problems</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>No time limit</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Individual participation</span>
            </div>
          </div>
        </div>

        {problems.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-12">
              <Code className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Problems Available</h3>
              <p className="text-slate-400 mb-4">There are no problems available for this hackathon yet.</p>
              <Link href="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700">Go to Admin Panel</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {problems.map((problem, index) => (
              <Card
                key={problem.id}
                className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-all duration-200 card-hover"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-slate-500">Problem {index + 1}</span>
                        <Badge className={getDifficultyClass(problem.difficulty)}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 text-white">{problem.title}</CardTitle>
                      <CardDescription className="text-base text-slate-400">
                        {problem.description.length > 200
                          ? `${problem.description.substring(0, 200)}...`
                          : problem.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-400">
                      <span>{problem.testCases.length} test cases</span>
                    </div>
                    <Link href={`/problems/${problem.id}`}>
                      <Button className="gradient-blue-purple hover:opacity-90 text-white">
                        <Code className="w-4 h-4 mr-2" />
                        Solve Problem
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
