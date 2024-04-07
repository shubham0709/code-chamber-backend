import express, { Request, Response } from "express";
import { connection } from "./config/db";
import { authController } from "./controllers/authController";
import { snippetController } from "./controllers/snippetController";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send(`Server is running at http://localhost:${PORT}`);
});

app.use("/auth", authController);
app.use("/snippet", snippetController);

declare global {
  namespace Express {
    interface Request {
      user?: any; // adding a key user on the request object
    }
  }
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", ({ snippetId }) => {
    socket.join(snippetId);
    console.log(`A user joined room for snippet: ${snippetId}`);
  });

  // Leave the room when the user closes the snippet or disconnects
  socket.on("leaveRoom", ({ snippetId }) => {
    socket.leave(snippetId);
    console.log(`A user left room for snippet: ${snippetId}`);
  });

  // Broadcast changes to all users in the same snippet room, except the one who made the change
  socket.on("editContent", ({ token, snippetId, content }) => {
    console.log("changing content");
    socket.to(snippetId).emit("contentChanged", { snippetId, content });
  });

  socket.on("editTitle", ({ token, snippetId, title }) => {
    console.log("changing title");
    socket.to(snippetId).emit("titleChanged", { snippetId, title });
  });

  socket.on("editSettings", ({ token, snippetId, settings }) => {
    console.log("changing settings");
    socket.to(snippetId).emit("settingsChanged", { snippetId, settings });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Unable to connect to DB");
  }

  console.log(`Server is running at http://localhost:${PORT}`);
});