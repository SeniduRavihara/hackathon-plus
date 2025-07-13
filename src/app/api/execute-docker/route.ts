import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";

interface ExecutionResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime?: string;
  error?: string;
}

const languageConfig = {
  python: {
    image: "python:3.9-slim",
    command: "python",
    filename: "solution.py",
  },
  javascript: {
    image: "node:18-slim",
    command: "node",
    filename: "solution.js",
  },
  java: {
    image: "openjdk:11-slim",
    command: "java",
    filename: "Solution.java",
  },
  cpp: {
    image: "gcc:11",
    command: "./a.out",
    filename: "solution.cpp",
  },
};

async function executeInDocker(
  code: string,
  language: string,
  input: string,
  timeout: number = 10000
): Promise<{ output: string; error?: string; executionTime: number }> {
  const config = languageConfig[language as keyof typeof languageConfig];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const containerName = `code_exec_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  try {
    // Create container with code
    const createProcess = spawn("docker", [
      "run",
      "--name",
      containerName,
      "--rm",
      "--memory",
      "512m",
      "--cpus",
      "1",
      "--network",
      "none",
      "--security-opt",
      "no-new-privileges",
      "-i",
      config.image,
      "sh",
      "-c",
      `echo '${code.replace(/'/g, "'\"'\"'")}' > /tmp/${config.filename} && ${
        language === "cpp"
          ? `g++ -std=c++17 /tmp/${config.filename} -o /tmp/a.out && /tmp/a.out`
          : language === "java"
          ? `javac /tmp/${config.filename} && java -cp /tmp Solution`
          : `${config.command} /tmp/${config.filename}`
      }`,
    ]);

    const startTime = Date.now();

    const result = await new Promise<{
      output: string;
      error?: string;
      executionTime: number;
    }>((resolve) => {
      let output = "";
      let errorOutput = "";

      createProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      createProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      // Send input to the process
      createProcess.stdin.write(input);
      createProcess.stdin.end();

      const timeoutId = setTimeout(() => {
        createProcess.kill();
        // Clean up container if it's still running
        spawn("docker", ["kill", containerName], { stdio: "ignore" });
        resolve({
          output: "",
          error: "Execution timeout",
          executionTime: timeout,
        });
      }, timeout);

      createProcess.on("close", (code) => {
        clearTimeout(timeoutId);
        const executionTime = Date.now() - startTime;
        resolve({
          output: output.trim(),
          error: code !== 0 ? errorOutput : undefined,
          executionTime,
        });
      });
    });

    return result;
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Unknown error",
      executionTime: 0,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json();

    if (!code || !language || !testCases) {
      return NextResponse.json(
        { error: "Missing required fields: code, language, testCases" },
        { status: 400 }
      );
    }

    const results: ExecutionResult[] = [];

    for (const testCase of testCases) {
      try {
        const { output, error, executionTime } = await executeInDocker(
          code,
          language,
          testCase.input
        );

        const actualOutput = output.trim();
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          passed,
          input: testCase.input,
          expectedOutput: expectedOutput,
          actualOutput: error || actualOutput,
          executionTime: `${executionTime}ms`,
          error: error,
        });
      } catch (error) {
        results.push({
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error executing test case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
