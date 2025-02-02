import { exec } from "child_process";

export const dockerRun = (command: string, socketId: string, cb: any) => {
  const TIME_OUT = 10000;
  let isTimeout = false;

  exec(command, (error, stdout, stderr) => {
    if (isTimeout) {
      cb(
        `\nExecution timed out after ${Math.floor(TIME_OUT / 1000)} seconds`,
        null
      );
      return;
    }

    console.log("clear");
    clearTimeout(timeoutId); // 작업이 완료되면 타이머 해제

    if (error) {
      cb(error.message, null);
      return;
    }
    if (stderr) {
      cb(stderr, null);
      return;
    }

    cb(null, stdout);
  });

  const timeoutId = setTimeout(() => {
    isTimeout = true;
    exec(`docker exec test-app pkill -f ${socketId}`);
    console.log("exit");
  }, TIME_OUT);
};
