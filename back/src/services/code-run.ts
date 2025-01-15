import fs from "fs";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { cleanDirectory } from "../helper/clean-directory";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";

const executeCommand = (param: string, compileCommand: string | null, runCommand: string, callback: (err: string, res: any) => void) => {
  const formattedParam = param.split('\n').join('\\n');

  if (compileCommand) {
    execSync(`docker exec test-app sh -c "${compileCommand}"`);
  }

  const command = `docker exec test-app sh -c "echo -e '${formattedParam}' | ${runCommand}"`;

  dockerRun(command, callback);
}

export const codeRun = (socket: any, data: TestData) => {
  const { code, lang, input } = data;

  const clientResult: string[] = Array(input.length).fill(null);

  fs.writeFileSync(`${filePath}/${fileName[lang]}`, code);

  try {
    execSync(`docker cp compile/. test-app:/usr/src`);
  } catch (err) {
    console.error("에러");
    socket.emit("error", "compile");
    return;
  }

  const languageCommands = {
    "javascript": {
      compile: null,
      run: "node code.js"
    },
    "python": {
      compile: null,
      run: "python3 code.py"
    },
    "java": {
      compile: "javac Main.java",
      run: "java Main"
    },
    "cpp": {
      compile: "g++ -o main main.cpp",
      run: "./main"
    }
  };

  socket.emit("start", clientResult);

  input.forEach((test, i) => {
    const { compile, run } = languageCommands[lang] || {};
    
    if (!run) return;
  
    try {
      executeCommand(test, compile, run, (err: string, res: any) => {
        if (err) {
          socket.emit("error", err);
          return;
        }
        
        const result = typeof res === "object" ? JSON.parse(res) : res;
        clientResult[i] = result;
        socket.emit("output", clientResult);
      });
    } catch(err: any) {
      socket.emit("error", err.message);
    }
  });

  cleanDirectory(filePath);
};
