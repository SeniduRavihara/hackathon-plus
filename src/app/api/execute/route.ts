import { spawn } from "child_process";
import { unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import { join } from "path";

interface ExecutionResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime?: string;
  error?: string;
}

interface LanguageConfig {
  extension: string;
  command: string;
  args: string[];
  compileCommand?: string;
  compileArgs?: string[];
}

const languageConfig: Record<string, LanguageConfig> = {
  python: {
    extension: "py",
    command: "python",
    args: [],
  },
  javascript: {
    extension: "js",
    command: "node",
    args: [],
  },
  java: {
    extension: "java",
    command: "java",
    args: [],
    compileCommand: "javac",
  },
  cpp: {
    extension: "cpp",
    command: "./a.out",
    args: [],
    compileCommand: "g++",
    compileArgs: ["-std=c++17"],
  },
};

async function executeCode(
  code: string,
  language: string,
  input: string,
  timeout: number = 5000
): Promise<{ output: string; error?: string; executionTime: number }> {
  const config = languageConfig[language as keyof typeof languageConfig];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const tempDir = tmpdir();
  const fileName = `solution_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const filePath = join(tempDir, `${fileName}.${config.extension}`);

  try {
    // Write code to temporary file
    await writeFile(filePath, code);

    // Compile if needed (for Java and C++)
    if (config.compileCommand) {
      const compileProcess = spawn(config.compileCommand, [
        ...(config.compileArgs || []),
        filePath,
      ]);

      const compileResult = await new Promise<{
        success: boolean;
        error?: string;
      }>((resolve) => {
        let errorOutput = "";
        compileProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        compileProcess.on("close", (code) => {
          resolve({
            success: code === 0,
            error: code !== 0 ? errorOutput : undefined,
          });
        });
      });

      if (!compileResult.success) {
        return {
          output: "",
          error: compileResult.error,
          executionTime: 0,
        };
      }
    }

    // Execute the code
    const startTime = Date.now();
    const executeProcess = spawn(config.command, [
      ...config.args,
      config.compileCommand ? join(tempDir, fileName) : filePath,
    ]);

    const result = await new Promise<{
      output: string;
      error?: string;
      executionTime: number;
    }>((resolve) => {
      let output = "";
      let errorOutput = "";

      executeProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      executeProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      // Send input to the process
      executeProcess.stdin.write(input);
      executeProcess.stdin.end();

      const timeoutId = setTimeout(() => {
        executeProcess.kill();
        resolve({
          output: "",
          error: "Execution timeout",
          executionTime: timeout,
        });
      }, timeout);

      executeProcess.on("close", (code) => {
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
  } finally {
    // Clean up temporary files
    try {
      await unlink(filePath);
      if (config.compileCommand) {
        const executablePath =
          config.compileCommand === "javac"
            ? join(tempDir, `${fileName}.class`)
            : join(tempDir, "a.out");
        await unlink(executablePath);
      }
    } catch {
      // Ignore cleanup errors
    }
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
        const { output, error, executionTime } = await executeCode(
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
