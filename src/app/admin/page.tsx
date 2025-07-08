"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface TestCase {
  input: string
  expectedOutput: string
}

interface Problem {
  id: string
  title: string
  description: string
  difficulty: string
  testCases: TestCase[]
}

export default function AdminPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
  })
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: "", expectedOutput: "" }])

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const problemData = {
      ...formData,
      testCases: testCases.filter((tc) => tc.input.trim() && tc.expectedOutput.trim()),
    }

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(problemData),
      })

      if (response.ok) {
        setFormData({ title: "", description: "", difficulty: "easy" })
        setTestCases([{ input: "", expectedOutput: "" }])
        setShowForm(false)
        fetchProblems()
      }
    } catch (error) {
      console.error("Error creating problem:", error)
    }
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }])
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const updateTestCase = (index: number, field: "input" | "expectedOutput", value: string) => {
    const updated = testCases.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    setTestCases(updated)
  }

  const deleteProblem = async (id: string) => {
    try {
      await fetch(`/api/problems/${id}`, { method: "DELETE" })
      fetchProblems()
    } catch (error) {
      console.error("Error deleting problem:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Manage hackathon problems and test cases</p>
          </div>
          <div className="flex gap-4">
            <Link href="/problems">
              <Button className="border border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                View Problems
              </Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Problem
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Problem</CardTitle>
              <CardDescription className="text-slate-400">Add a new coding problem for the hackathon</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-slate-300">
                      Problem Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Two Sum"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty" className="text-slate-300">
                      Difficulty
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="easy" className="text-white hover:bg-slate-700">
                          Easy
                        </SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-slate-700">
                          Medium
                        </SelectItem>
                        <SelectItem value="hard" className="text-white hover:bg-slate-700">
                          Hard
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">
                    Problem Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the problem, input/output format, constraints, etc."
                    rows={6}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-slate-300">Test Cases</Label>
                    <Button type="button" onClick={addTestCase} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Test Case
                    </Button>
                  </div>

                  {testCases.map((testCase, index) => (
                    <div key={index} className="border border-slate-700 rounded-lg p-4 mb-4 bg-slate-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-white">Test Case {index + 1}</h4>
                        {testCases.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="border border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-300">Input</Label>
                          <Textarea
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, "input", e.target.value)}
                            placeholder="Input for this test case"
                            rows={3}
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-300">Expected Output</Label>
                          <Textarea
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                            placeholder="Expected output for this test case"
                            rows={3}
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Problem
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold text-white">Existing Problems ({problems.length})</h2>
          {problems.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="text-center py-8">
                <p className="text-slate-400">No problems created yet. Add your first problem above!</p>
              </CardContent>
            </Card>
          ) : (
            problems.map((problem) => (
              <Card
                key={problem.id}
                className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors card-hover"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-white">
                        {problem.title}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            problem.difficulty === "easy"
                              ? "badge-easy"
                              : problem.difficulty === "medium"
                                ? "badge-medium"
                                : "badge-hard"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-2 text-slate-400">
                        {problem.description.substring(0, 150)}...
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => deleteProblem(problem.id)}
                      className="border border-slate-600 text-slate-300 hover:bg-red-900/20 hover:border-red-500 hover:text-red-400 bg-transparent p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">Test Cases: {problem.testCases.length}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
