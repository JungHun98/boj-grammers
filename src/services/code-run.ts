import fs from "fs/promises";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";
import { Server } from "socket.io";
import { Worker } from "worker_threads";
import Docker from "dockerode";
import { restartDocker } from "../helper/restart-docker";

const DOCKER_ULR = "/home";

const splitErrorMessage = (msg: string, id: string) => {
  const ONE_LINE = 1;
  let message = msg.split("\n");

  if (message.length === ONE_LINE) {
    return msg;
  }

  message = message.map((elem) => elem.replace(`${DOCKER_ULR}/${id}/`, ""));
  return message.slice(ONE_LINE).join("\n").replace("/", "");
};

const imageName = {
  python: `python:alpine`,
  java: `openjdk:8-jdk-alpine`,
  javascript: `node:16`,
  cpp: `gcc:latest`,
};

const docker = new Docker();
const MEMORY_LIMIT = 512 * 1024 * 1024;
const CPU_LIMIT = 512;

const languageCommands = {
  javascript: {
    compile: null,
    run: `node ${DOCKER_ULR}/code.js`,
  },
  python: {
    compile: null,
    run: `python3 ${DOCKER_ULR}/code.py`,
  },
  java: {
    compile: `javac ${DOCKER_ULR}/Main.java`,
    run: `java -cp ${DOCKER_ULR} Main`,
  },
  cpp: {
    compile: `g++ ${DOCKER_ULR}/main.cpp -o ${DOCKER_ULR}/main`,
    run: `${DOCKER_ULR}/main`,
  },
};

async function dockerHandle(
  id: string,
  code: string,
  lang: "python" | "java" | "javascript" | "cpp",
  inputDataList: string[],
  socketIO: Server
) {
  let container: any = null;
  const workerArr: Worker[] = [];

  try {
    const clientResult: string[] = Array(inputDataList.length).fill(null);
    socketIO.to(id).emit("start", clientResult);

    container = await docker.createContainer({
      Image: imageName[lang],
      Tty: true,
      NetworkDisabled: true,

      HostConfig: {
        Memory: MEMORY_LIMIT,
        CpuShares: 512,
        CpuPeriod: 100000,
        NetworkMode: "none",
        SecurityOpt: ["no-new-privileges"],
      },
    });
    await container.start();

    execSync(
      `docker cp ${filePath}/${id}/${fileName[lang]} ${container.id}:${DOCKER_ULR}`
    );
    const compile = languageCommands[lang].compile;

    if (compile !== null) {
      execSync(`docker exec ${container.id} sh -c "${compile}"`);
    }

    const codeRunPromiseArr = inputDataList.map((test, i) => {
      return new Promise((resolve, reject) => {
        const formattedParam = test.replace(/\n/g, "\\n");
        const command = `docker exec ${container.id} sh -c "printf '${formattedParam}' | ${languageCommands[lang].run}"`;

        const codeWorker = dockerRun(command, (err: string, res: any) => {
          if (err) {
            reject(new Error(err));
            return;
          }

          const result = typeof res === "object" ? JSON.parse(res) : res;
          clientResult[i] = result;
          socketIO.to(id).emit("output", clientResult);
          resolve(result);
        });

        workerArr.push(codeWorker);
      });
    });

    const TIME_OUT = 15000;
    const timoutTimer = new Promise((_, rej) => {
      setTimeout(() => {
        rej(
          new Error(
            `Execution timed out after ${Math.floor(TIME_OUT / 1000)} seconds`
          )
        );
      }, TIME_OUT);
    });

    await Promise.race([Promise.all(codeRunPromiseArr), timoutTimer]);
  } catch (err) {
    workerArr.forEach((worker) => {
      worker.terminate();
    });

    const error = err as Error;
    const message = splitErrorMessage(error.message, id);

    socketIO.to(id).emit("error", message);
    console.error("Error:", err);
  } finally {
    if (container !== null) {
      await container.stop();
      await container.remove();
    } else {
      restartDocker();
    }
  }
}

export const codeRun = async (socket: any, data: TestData, io: Server) => {
  const { code, lang, input } = data;
  const path = `${filePath}/${socket.id}/${fileName[lang]}`;
  console.log(code);

  try {
    await fs.writeFile(path, code, "utf8");
    dockerHandle(socket.id, code, lang, input, io);
  } catch (error) {
    io.to(socket.id).emit("error", error);
    console.error(error);
  }
};
