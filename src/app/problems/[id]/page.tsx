"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Play, Send, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Problem {
  id: string
  title: string
  description: string
  difficulty: string
  testCases: Array<{ input: string; expectedOutput: string }>
}

interface TestResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string
  executionTime?: string
}

export default function ProblemSolvePage() {
  const params = useParams()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProblem(params.id as string)
    }

    console.log(params.id);
    
  }, [params.id])

  const fetchProblem = async (id: string) => {
    try {
      const response = await fetch(`/api/problems/${id}`)
      const data = await response.json()
      setProblem(data)
    } catch (error) {
      console.error("Error fetching problem:", error)
    }
  }

  const runCode = async () => {
    if (!problem || !code.trim()) return

    setIsRunning(true)
    setShowResults(false)

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          testCases: problem.testCases,
        }),
      })

      const results = await response.json()
      setTestResults(results)
      setShowResults(true)
    } catch (error) {
      console.error("Error running code:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const submitSolution = async () => {
    if (!problem || !code.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          testResults,
        }),
      })

      if (response.ok) {
        alert("Solution submitted successfully!")
      }
    } catch (error) {
      console.error("Error submitting solution:", error)
    } finally {
      setIsSubmitting(false)
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

  const getDefaultCode = (lang: string) => {
    switch (lang) {
      case "python":
        return "# Write your solution here\ndef solution():\n    pass\n\n# Example usage\nprint(solution())"
      case "javascript":
        return "// Write your solution here\nfunction solution() {\n    // Your code here\n}\n\n// Example usage\nconsole.log(solution());"
      case "java":
        return 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello World");\n    }\n}'
      case "cpp":
        return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello World" << endl;\n    return 0;\n}'
      default:
        return ""
    }
  }

  useEffect(() => {
    if (!code) {
      setCode(getDefaultCode(language))
    }
  }, [language])

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading problem...</p>
        </div>
      </div>
    )
  }

  const passedTests = testResults.filter((r) => r.passed).length
  const totalTests = testResults.length

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/problems">
            <Button className="border border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problems
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getDifficultyClass(problem.difficulty)}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    {problem.description}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Test Cases</CardTitle>
                <CardDescription className="text-slate-400">
                  Your solution will be tested against these cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problem.testCases.slice(0, 2).map((testCase, index) => (
                    <div key={index} className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                      <h4 className="font-medium mb-2 text-white">Example {index + 1}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-slate-300 mb-1">Input:</p>
                          <pre className="bg-slate-700 p-2 rounded text-xs text-slate-200">{testCase.input}</pre>
                        </div>
                        <div>
                          <p className="font-medium text-slate-300 mb-1">Output:</p>
                          <pre className="bg-slate-700 p-2 rounded text-xs text-slate-200">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                  {problem.testCases.length > 2 && (
                    <p className="text-sm text-slate-400">+ {problem.testCases.length - 2} more hidden test cases</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {showResults && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    Test Results
                    <Badge className={passedTests === totalTests ? "badge-success" : "badge-error"}>
                      {passedTests}/{totalTests} Passed
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className="border border-slate-700 rounded-lg p-3 bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-medium text-white">Test Case {index + 1}</span>
                          {result.executionTime && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {result.executionTime}
                            </span>
                          )}
                        </div>
                        {!result.passed && (
                          <div className="text-sm space-y-2">
                            <div>
                              <p className="font-medium text-slate-300">Expected:</p>
                              <pre className="bg-slate-700 p-2 rounded text-xs text-slate-200">
                                {result.expectedOutput}
                              </pre>
                            </div>
                            <div>
                              <p className="font-medium text-slate-300">Got:</p>
                              <pre className="bg-red-900/30 border border-red-500/30 p-2 rounded text-xs text-red-300">
                                {result.actualOutput}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Code Editor</CardTitle>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="python" className="text-white hover:bg-slate-700">
                        Python
                      </SelectItem>
                      <SelectItem value="javascript" className="text-white hover:bg-slate-700">
                        JavaScript
                      </SelectItem>
                      <SelectItem value="java" className="text-white hover:bg-slate-700">
                        Java
                      </SelectItem>
                      <SelectItem value="cpp" className="text-white hover:bg-slate-700">
                        C++
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Write your solution here..."
                  className="font-mono text-sm min-h-[400px] resize-none bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={runCode}
                disabled={isRunning || !code.trim()}
                className="flex-1 gradient-green-emerald hover:opacity-90 text-white"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>

              <Button
                onClick={submitSolution}
                disabled={isSubmitting || !code.trim() || testResults.length === 0}
                className="flex-1 gradient-blue-purple hover:opacity-90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
