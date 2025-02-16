const { parentPort } = require("worker_threads");
const { exec } = require("child_process");

interface TaskParam {
  command: string;
  rundir: string;
  containerId: string;
  timeout: number;
}

parentPort?.on(
  "message",
  ({ command, rundir, containerId, timeout }: TaskParam) => {
    let isTimeout = false;

    const timeoutId = setTimeout(() => {
      isTimeout = true;
      exec(
        `docker exec ${containerId} pkill -f ${rundir}`,
        (error: { message: any }) => {
          if (error) {
            parentPort?.postMessage({ error: error.message });
          } else {
            parentPort?.postMessage({
              error: `Execution timed out after ${Math.floor(
                timeout / 1000
              )} seconds`,
            });
          }
        }
      );
    }, timeout);

    exec(command, (error: { message: any }, stdout: any, stderr: any) => {
      clearTimeout(timeoutId);

      if (isTimeout) {
        parentPort?.postMessage({
          error: `Execution timed out after ${Math.floor(
            timeout / 1000
          )} seconds`,
        });
        return;
      }

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
  }
);
