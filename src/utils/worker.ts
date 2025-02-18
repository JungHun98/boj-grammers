const { parentPort } = require("worker_threads");
const { exec } = require("child_process");

interface TaskParam {
  command: string;
  rundir: string;
  containerId: string;
  timeout: number;
}

parentPort?.on("message", ({ command }: TaskParam) => {
  exec(command, (error: { message: any }, stdout: any, stderr: any) => {
    if (error) {
      parentPort?.postMessage({ error: error.message });
      return;
    }

    if (stderr) {
      parentPort?.postMessage({ error: stderr });
      return;
    }

    parentPort?.postMessage({ stdout });
  });
});
