import fs from "fs";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { cleanDirectory } from "../helper/clean-directory";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";
import { Server } from "socket.io";
import Docker from "dockerode";

const splitErrorMessage = (msg: string, id: string) => {
  const ONE_LINE = 1;
  let message = msg.split("\n");

  if (message.length === ONE_LINE) {
    return msg;
  }

  message = message.map((elem) => elem.replace(`${id}/`, ""));
  return message.slice(ONE_LINE).join("\n").replace("/", "");
};

const imageName = {
  python: `python:3.9-alpine`,
  java: `openjdk:8-jdk-alpine`,
  javascript: `node:16`,
  cpp: `gcc:latest`,
};

const docker = new Docker();
const MEMORY_LIMIT = 500 * 1024 * 1024;
const CPU_LIMIT = 512;

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
        Memory: 512 * 1024 * 1024, // 500MB 메모리 제한
        CpuShares: 512, // CPU 비율 (1024가 기본값, 512는 50% CPU를 의미)
        CpuPeriod: 100000, // CPU 할당 기간
      },
    });

    const languageCommands = {
      javascript: {
        compile: null,
        run: `node ${id}/code.js`,
      },
      python: {
        compile: null,
        run: `python3 ${id}/code.py`,
      },
      java: {
        compile: `javac ${id}/Main.java`,
        run: `java -cp ${id} Main`,
      },
      cpp: {
        compile: `g++ ${id}/main.cpp -o ${id}/main`,
        run: `${id}/main`,
      },
    };

    await container.start();

    try {
      execSync(`docker cp ${filePath}/${id} ${container.id}:/`);
      const compile = languageCommands[lang].compile;

      if (compile !== null) {
        execSync(`docker exec ${container.id} sh -c "${compile}"`);
      }
    } catch (err) {
      const error = err as Error;
      cleanDirectory(`${filePath}/${id}`);
      console.error(err);

      const message = splitErrorMessage(error.message, id);
      socketIO.to(id).emit("error", message);
      return;
    }

    await Promise.all(
      inputDataList.map((test, i) => {
        return new Promise((_res, rej) => {
          const formattedParam = test.split("\n").join("\\n");
          const command = `docker exec ${container.id} sh -c "echo '${formattedParam}' | ${languageCommands[lang].run}"`;

          dockerRun(command, id, container.id, (err: string, res: any) => {
            if (err) {
              console.error(err);

              const message = splitErrorMessage(err, id);
              socketIO.to(id).emit("error", message);
              rej(err);
              return;
            }

            const result = typeof res === "object" ? JSON.parse(res) : res;
            clientResult[i] = result;
            socketIO.to(id).emit("output", clientResult);
            _res(result);
          });
        });
      })
    );
  } catch (err: any) {
    console.error("Error:", err);
    cleanDirectory(`${filePath}/${id}`);
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

  fs.writeFileSync(`${filePath}/${socket.id}/${fileName[lang]}`, code);
  dockerHandle(socket.id, code, lang, input, io);
};
