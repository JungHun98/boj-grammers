import { Server } from "socket.io";
import fs from "fs";

import { codeRun } from "./code-run";
import { execSync } from "child_process";
import { filePath } from "../consts";

type Langauge = "cpp" | "python" | "java" | "javascript";

export interface IData {
  id: string;
  code: string;
  lang: Langauge;
  room: string;
}

export interface TestData {
  code: string;
  lang: Langauge;
  input: string[];
}

export const problemSocket = (io: Server) => {
  const problem = io.of("/");

  problem.on("connection", (socket: any) => {
    console.log(`connected ${socket.id}`);

    fs.mkdirSync(`${filePath}/${socket.id}`);

    socket.on("codeRun", async (data: TestData) => {
      codeRun(socket, data, io);
    });

    socket.on("disconnect", () => {
      execSync(`docker exec test-app sh -c "rm -rf /usr/src/${socket.id}"`);
      fs.rmdirSync(`compile/${socket.id}`);
      console.log("disconnect");
    });
  });
};
