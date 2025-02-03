import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import { problem } from "./services/problem";
import { problemSocket } from "./services/problem-socket";
import { dockerBuild } from "./helper/docker-build";

const app: Application = express();
const server = http.createServer(app);
const port: number = 80;

app.use(
  cors({
    origin: "https://boj-grammers.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "https://boj-grammers.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

problemSocket(io);

app.get("/api/problem", async function (req, res) {
  try {
    const problemId = Number(req.query.problemId);

    if (!problemId || isNaN(problemId)) {
      return res.status(400).send("유효하지 않은 번호입니다.");
    }

    // problemId를 problem 함수에 전달하여 데이터 가져오기
    const {
      id,
      title,
      limitTableHtml,
      descriptionHtml,
      inputHtml,
      outputHtml,
      limitHtml,
      examples,
    } = await problem(problemId);

    // 데이터를 JSON 형식으로 응답
    res.json({
      id,
      title,
      limitTableHtml,
      descriptionHtml,
      inputHtml,
      outputHtml,
      limitHtml,
      examples,
    });
  } catch (err) {
    const error = err as unknown as Error;
    res.status(Number(error.message)).send("Error fetching data");
  }
});

app.use(express.static(path.join(__dirname, "../../front/build")));

server.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

dockerBuild();
