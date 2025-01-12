import { Server } from "socket.io";

import { testcaseRun } from "./testcase-run";
import { codeRun } from "./code-run";
import { exec } from "child_process";

type Langauge = 'cpp' | 'python' | 'java' | 'javascript';

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
    console.log("connected");

    socket.on("codeRun", async (data: TestData) => {
      codeRun(socket, data);
    });

    socket.on("disconnect", () => {
      // exec("docker stop test-app");
      // exec("docker rm test-app");
      console.log("disconnect");
    });
  });
};
