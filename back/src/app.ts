import express, { Application } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import { problem } from "./services/problem";
import { problemSocket } from "./services/problem-socket";

const app: Application = express();
const server = http.createServer(app);
const port: number = 8080;

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

problemSocket(io);

app.get("/api/problem", async function (req, res) {
  try{
    const { id, title, descriptionHtml,
      inputHtml,
      outputHtml,
      limitHtml,
      examples
    } = await problem(16946);
    
  res.json({  
    id,
    title,
    descriptionHtml,
    inputHtml,
    outputHtml,
    limitHtml,
    examples
  });
  } catch(err) {
    res.status(500).send('Error fetching data');
  }
});

app.use(express.static(path.join(__dirname, "../../front/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../../front/build/index.html"));
// });

server.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});