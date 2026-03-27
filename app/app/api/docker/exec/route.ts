import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { container = "etheriatimes", command } = body;

    if (!command) {
      return NextResponse.json(
        { output: "", exitCode: 1, success: false, error: "No command provided" },
        { status: 400 }
      );
    }

    return new Promise((resolve) => {
      const output: string[] = [];
      const dockerProcess = spawn("docker", ["exec", container, "sh", "-c", command]);

      dockerProcess.stdout.on("data", (data) => {
        output.push(data.toString());
      });

      dockerProcess.stderr.on("data", (data) => {
        output.push(data.toString());
      });

      dockerProcess.on("close", (code) => {
        resolve(
          NextResponse.json({
            output: output.join(""),
            exitCode: code || 0,
            success: code === 0,
          })
        );
      });

      dockerProcess.on("error", () => {
        resolve(
          NextResponse.json(
            { output: "", exitCode: 1, success: false, error: "Failed to execute docker command" },
            { status: 500 }
          )
        );
      });
    });
  } catch {
    return NextResponse.json(
      { output: "", exitCode: 1, success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
