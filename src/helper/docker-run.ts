import { Worker } from "worker_threads";

interface DockerRunCallback {
  (err: string, res: any): void;
}

export const dockerRun = (command: string, cb: DockerRunCallback) => {
  const worker = new Worker("./src/utils/worker.ts", {
    execArgv: ["-r", "ts-node/register"],
  });

  worker.postMessage({ command });

  worker.on("message", (result: { error: string; stdout: string }) => {
    if (result.error) {
      cb(result.error, null);
    } else {
      cb("", result.stdout);
    }
  });

  worker.on("error", (error) => {
    cb(error.message, null);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      cb(`Worker stopped with exit code ${code}`, null);
    }
  });

  return worker;
};
