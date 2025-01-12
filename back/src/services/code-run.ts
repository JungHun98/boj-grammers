import fs from "fs";

import { dockerRun } from "../helper/docker-run";
import { TestData } from "./problem-socket";
import { cleanDirectory } from "../helper/clean-directory";
import { execSync } from "child_process";
import { fileName, filePath } from "../consts";

interface IClientResult {
  result: any | null;
}

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

  const clientResult: IClientResult[] = Array.from(
    { length: input.length },
    (_, i) => ({
      input: null,
      output: null,
      result: null,
    })
  );

  fs.writeFileSync(`${filePath}/${fileName[lang]}`, code);
  try {
    execSync(`docker cp compile/. test-app:/usr/src`);
  } catch (err) {
    console.error(err);
    socket.emit("error", "not compile");
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

  input.forEach((test, i) => {
    const { compile, run } = languageCommands[lang] || {};
    
    if (!run) return;
  
    executeCommand(test, compile, run, (err: string, res: any) => {
      if (err) {
        socket.emit("error", err);
        return;
      }
  
      const result = typeof res === "object" ? JSON.parse(res) : res;
      clientResult[i] = { result };
      socket.emit("output", clientResult);
    });
  });

  cleanDirectory(filePath);
};
