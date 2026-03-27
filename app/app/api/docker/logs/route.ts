import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const container = searchParams.get("container") || "etheriatimes";
  const lines = parseInt(searchParams.get("lines") || "100", 10);

  return new Promise((resolve) => {
    const logs: string[] = [];
    const dockerProcess = spawn("docker", ["logs", "--tail", lines.toString(), container]);

    dockerProcess.stdout.on("data", (data) => {
      logs.push(data.toString());
    });

    dockerProcess.stderr.on("data", (data) => {
      logs.push(data.toString());
    });

    dockerProcess.on("close", () => {
      const combinedLogs = logs.join("").split("\n").filter(Boolean);

      resolve(
        NextResponse.json({
          logs: combinedLogs.slice(-lines),
          success: true,
          container,
          lines,
        })
      );
    });

    dockerProcess.on("error", () => {
      resolve(
        NextResponse.json(
          { logs: [], success: false, error: "Failed to execute docker command" },
          { status: 500 }
        )
      );
    });
  });
}
