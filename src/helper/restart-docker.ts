import { exec } from "child_process";

let isCreating = false;

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, { shell: "cmd.exe" }, (error, stdout, stderr) => {
      if (error) {
        console.error(`오류 발생: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`표준 오류: ${stderr}`);
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}

async function stopDocker() {
  try {
    await runCommand('taskkill /IM "Docker Desktop.exe" /F');
    console.log("Docker Desktop 프로세스 종료 완료");

    await runCommand('taskkill /IM "com.docker.backend.exe" /F').catch(() => {
      console.log("com.docker.backend.exe가 실행 중이 아니었습니다.");
    });
    await runCommand('taskkill /IM "dockerd.exe" /F').catch(() => {
      console.log("dockerd.exe가 실행 중이 아니었습니다.");
    });
    await runCommand('taskkill /IM "com.docker.service" /F').catch(() => {
      console.log("com.docker.service가 실행 중이 아니었습니다.");
    });

    console.log("모든 Docker 관련 프로세스 종료 완료");
  } catch (error) {
    console.error("Docker 프로세스 종료 중 오류:", error);
  }
}

async function startDocker() {
  try {
    const dockerPath =
      '"C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"';
    await runCommand(dockerPath);
    console.log("Docker Desktop이 시작되었습니다.");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    isCreating = false;
  } catch (error) {
    console.error("Docker Desktop 시작 실패:", error);
  }
}

export async function restartDocker() {
  if (isCreating) return;

  isCreating = true;
  console.log("Docker를 재시작");
  await stopDocker();
  await startDocker();
  console.log("Docker 재시작 완료!");
}
