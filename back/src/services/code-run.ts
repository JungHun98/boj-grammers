import fs from "fs";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";
import { Server } from "socket.io";
import Docker from "dockerode";

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
  try {
    const clientResult: string[] = Array(inputDataList.length).fill(null);
    socketIO.to(id).emit("start", clientResult);

    container = await docker.createContainer({
      Image: imageName[lang],
      Tty: true,
      HostConfig: {
        Memory: MEMORY_LIMIT,
        CpuShares: 2,
        CpuPeriod: 100000,
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

    await Promise.all(
      inputDataList.map((test, i) => {
        return new Promise((resolve, reject) => {
          const formattedParam = test.split("\n").join("\\n");
          const command = `docker exec ${container.id} sh -c "echo '${formattedParam}' | ${languageCommands[lang].run}"`;

          dockerRun(
            command,
            DOCKER_ULR,
            container.id,
            (err: string, res: any) => {
              if (err) {
                reject(new Error(err));
                return;
              }

              const result = typeof res === "object" ? JSON.parse(res) : res;
              clientResult[i] = result;
              socketIO.to(id).emit("output", clientResult);
              resolve(result);
            }
          );
        });
      })
    );
  } catch (err) {
    const error = err as Error;
    const message = splitErrorMessage(error.message, id);

    socketIO.to(id).emit("error", message);
    console.error("Error:", err);
  } finally {
    if (container !== null) {
      await container.stop();
      await container.remove();
    }
  }
}

export const codeRun = (socket: any, data: TestData, io: Server) => {
  const { code, lang, input } = data;
  console.log(code);

  try {
    fs.writeFileSync(`${filePath}/${socket.id}/${fileName[lang]}`, code);
    dockerHandle(socket.id, code, lang, input, io);
  } catch (error) {
    io.to(socket.id).emit("error", error);
    console.error(error);
  }
};
