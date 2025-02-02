import fs from "fs";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { cleanDirectory } from "../helper/clean-directory";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";
import { Server } from "socket.io";

const executeCommand = (
  param: string,
  compileCommand: string | null,
  runCommand: string,
  socketId: string,
  callback: (err: string, res: any) => void
) => {
  const formattedParam = param.split("\n").join("\\n");

  if (compileCommand !== null) {
    execSync(`docker exec test-app sh -c "${compileCommand}"`);
  }

  const command = `docker exec test-app sh -c "echo -e '${formattedParam}' | ${runCommand}"`;

  dockerRun(command, socketId, callback);
};

export const codeRun = (socket: any, data: TestData, io: Server) => {
  const { code, lang, input } = data;

  const clientResult: string[] = Array(input.length).fill(null);
  const dockerPath = `/usr/src/${socket.id}`;

  fs.writeFileSync(`${filePath}/${socket.id}/${fileName[lang]}`, code);

  try {
    execSync(`docker cp ${filePath}/${socket.id} test-app:/usr/src`);
  } catch (err) {
    console.error("에러");
    io.to(socket.id).emit("error", "compile");
    return;
  }

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

  input.forEach((test, i) => {
    const { compile, run } = languageCommands[lang] || {};

    if (!run) return;

    try {
      executeCommand(test, compile, run, socket.id, (err: string, res: any) => {
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
