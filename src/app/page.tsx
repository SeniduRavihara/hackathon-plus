import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Users, Trophy, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Powered by Judge0</span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            HackCode Platform
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            The ultimate coding platform for conducting hackathons with real-time code execution and automated testing
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/admin">
              <Button
                size="lg"
                className="gradient-blue-purple hover:opacity-90 text-white border-0 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Admin Dashboard
              </Button>
            </Link>
            <Link href="/problems">
              <Button
                size="lg"
                className="border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Join Hackathon
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm card-hover">
            <CardHeader className="text-center">
              <Code className="w-12 h-12 mx-auto text-blue-400 mb-4" />
              <CardTitle className="text-white">Code & Test</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400">
                Write code in multiple languages and test against custom test cases with instant feedback
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm card-hover">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-purple-400 mb-4" />
              <CardTitle className="text-white">Team Competition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400">
                Compete with other participants in real-time hackathon events and challenges
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm card-hover">
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
              <CardTitle className="text-white">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-400">
                Get instant feedback on your submissions with detailed test results and performance metrics
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
