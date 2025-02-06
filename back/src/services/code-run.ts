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
    console.error("에러");
    cleanDirectory(`${filePath}/${socket.id}`);
    io.to(socket.id).emit("error", error.message);
    return;
  }

  if (directoryCommandsRegex.test(code)) {
    io.to(socket.id).emit(
      "warning",
      "리눅스 명령어는 코드에 작성할 수 없어요."
    );
    return;
  }

  if (networkConnectionRegex.test(code)) {
    io.to(socket.id).emit("warning", "네트워크 연결 코드는 작성할 수 없어요.");
    return;
  }

  input.forEach((test, i) => {
    if (!run) return;

    try {
      executeCommand(test, run, socket.id, (err: string, res: any) => {
        if (err) {
          console.log(err);
          io.to(socket.id).emit("error", err);
          return;
        }

        const result = typeof res === "object" ? JSON.parse(res) : res;
        clientResult[i] = result;

        io.to(socket.id).emit("output", clientResult);
      });
    } catch (err: any) {
      io.to(socket.id).emit("error", err.message);
    }
  });

  cleanDirectory(`${filePath}/${socket.id}`);
};
