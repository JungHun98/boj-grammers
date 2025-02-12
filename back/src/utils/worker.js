const { parentPort } = require("worker_threads");
const { exec } = require("child_process");

parentPort?.on("message", ({ command, socketId, containerId, timeout }) => {
  let isTimeout = false;

  const timeoutId = setTimeout(() => {
    isTimeout = true;
    exec(`docker exec ${containerId} pkill -f ${socketId}`, (error) => {
      if (error) {
        parentPort?.postMessage({ error: error.message });
      } else {
        parentPort?.postMessage({
          error: `Execution timed out after ${Math.floor(
            timeout / 1000
          )} seconds`,
        });
      }
    });
  }, timeout);

  exec(command, (error, stdout, stderr) => {
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
});
