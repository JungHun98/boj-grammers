import fs from "fs";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { cleanDirectory } from "../helper/clean-directory";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";
import { Server } from "socket.io";

const executeCommand = (
  param: string,
  runCommand: string,
  socketId: string,
  callback: (err: string, res: any) => void
) => {
  const formattedParam = param.split("\n").join("\\n");
  const command = `docker exec test-app sh -c "echo -e '${formattedParam}' | ${runCommand}"`;

  dockerRun(command, socketId, callback);
};

const directoryCommandsRegex =
  /(?<!\w)\b(cd|ls|mkdir|rmdir|rm|cp|mv|sudo)\b(?!\w)/;

const networkConnectionRegex =
  /#include <.*curl.*>|HttpURLConnection|import requests|fetch\(/;

const splitErrorMessage = (msg: string) => {
  const ONE_LINE = 1;
  const message = msg.replace(/\/usr\/src\/[^/]+\//, "").split("\n");

  if (message.length === ONE_LINE) {
    return msg;
  }

  return message.slice(ONE_LINE).join("\n");
};

export const codeRun = (socket: any, data: TestData, io: Server) => {
  const { code, lang, input } = data;
  console.log(code);

  const clientResult: string[] = Array(input.length).fill(null);
  const dockerPath = `/usr/src/${socket.id}`;

  fs.writeFileSync(`${filePath}/${socket.id}/${fileName[lang]}`, code);

  const languageCommands = {
    javascript: {
      compile: null,
      run: `node ${dockerPath}/code.js`,
    },
    python: {
      compile: null,
      run: `python3 ${dockerPath}/code.py`,
    },
    java: {
      compile: `javac ${dockerPath}/Main.java`,
      run: `java ${dockerPath}/Main.java`,
    },
    cpp: {
      compile: `g++ ${dockerPath}/main.cpp -o ${dockerPath}/main`,
      run: `${dockerPath}/main`,
    },
  };

  io.to(socket.id).emit("start", clientResult);

  const { compile, run } = languageCommands[lang] || {};

  try {
    execSync(`docker cp ${filePath}/${socket.id} test-app:/usr/src`);
    if (compile !== null) {
      execSync(`docker exec test-app sh -c "${compile}"`);
    }
  } catch (err) {
    const error = err as Error;
    cleanDirectory(`${filePath}/${socket.id}`);
    console.error(err);

    const message = splitErrorMessage(error.message);
    io.to(socket.id).emit("error", message);
    return;
  }

  if (directoryCommandsRegex.test(code)) {
    io.to(socket.id).emit(
      "warning",
      "리눅스 명령어는 코드에 작성할 수 없어요."
    );
    cleanDirectory(`${filePath}/${socket.id}`);
    return;
  }

  if (networkConnectionRegex.test(code)) {
    io.to(socket.id).emit("warning", "네트워크 연결 코드는 작성할 수 없어요.");
    cleanDirectory(`${filePath}/${socket.id}`);
    return;
  }

  input.forEach((test, i) => {
    if (!run) return;

    try {
      executeCommand(test, run, socket.id, (err: string, res: any) => {
        if (err) {
          console.error(err);

          const message = splitErrorMessage(err);
          io.to(socket.id).emit("error", message);
          return;
        }

        const result = typeof res === "object" ? JSON.parse(res) : res;
        clientResult[i] = result;

        io.to(socket.id).emit("output", clientResult);
      });
    } catch (err: any) {
      const message = splitErrorMessage(err.message);
      io.to(socket.id).emit("error", message);
    }
  });

  cleanDirectory(`${filePath}/${socket.id}`);
};
