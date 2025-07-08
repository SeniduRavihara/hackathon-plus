import { type NextRequest, NextResponse } from "next/server"

const JUDGE0_ENDPOINT = "https://35c5a202e5f5.ngrok-free.app"

const languageMap: { [key: string]: number } = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json()

    const languageId = languageMap[language]
    if (!languageId) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 })
    }

    const results = []

    for (const testCase of testCases) {
      try {
        // Submit code to Judge0
        const submitResponse = await fetch(`${JUDGE0_ENDPOINT}/submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.expectedOutput,
          }),
        })

        if (!submitResponse.ok) {
          throw new Error("Failed to submit to Judge0")
        }

        const submitResult = await submitResponse.json()
        const token = submitResult.token

        // Poll for result
        let attempts = 0
        let result

        while (attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const resultResponse = await fetch(`${JUDGE0_ENDPOINT}/submissions/${token}`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          })

          if (!resultResponse.ok) {
            throw new Error("Failed to get result from Judge0")
          }

          result = await resultResponse.json()

          if (result.status.id > 2) {
            // Status > 2 means processing is complete
            break
          }

          attempts++
        }

        const actualOutput = result.stdout ? result.stdout.trim() : result.stderr || "No output"
        const expectedOutput = testCase.expectedOutput.trim()
        const passed = actualOutput === expectedOutput

        results.push({
          passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput,
          executionTime: result.time ? `${result.time}s` : undefined,
          memory: result.memory ? `${result.memory} KB` : undefined,
          status: result.status.description,
        })
      } catch (error) {
        console.error("Error executing test case:", error)
        results.push({
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "Execution Error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error in execute API:", error)
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 })
  }
}
