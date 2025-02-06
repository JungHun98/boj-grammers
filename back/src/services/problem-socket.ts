import { Server } from "socket.io";
import fs from "fs";
import os from "os";
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

const LIMIT_CPU_USAGE = 75;

const getCpuUsage = () => {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  for (let cpu of cpus) {
    for (let time of Object.values(cpu.times)) {
      totalTick += time;
    }
    totalIdle += cpu.times.idle;
  }

  const usedCpu = totalTick - totalIdle;
  const cpuUsagePercentage = (usedCpu / totalTick) * 100;

  return cpuUsagePercentage;
};

export const problemSocket = (io: Server) => {
  const problem = io.of("/");

  problem.on("connection", (socket: any) => {
    console.log(`connected ${socket.id}`);

    fs.mkdirSync(`${filePath}/${socket.id}`);

    socket.on("codeRun", async (data: TestData) => {
      const cpuUsage = getCpuUsage();

      if (cpuUsage > LIMIT_CPU_USAGE) {
        io.to(socket.id).emit(
          "warning",
          "서버가 혼잡해요. 잠시만 기다려주세요."
        );
        return;
      }

      codeRun(socket, data, io);
    });

    socket.on("disconnect", () => {
      try {
        execSync(`docker exec test-app sh -c "rm -rf /usr/src/${socket.id}"`);
        fs.rmdirSync(`compile/${socket.id}`);
      } catch {
        console.log(`fail remove /usr/src/${socket.id}`);
      } finally {
        console.log("disconnect");
      }
    });
  });
};
