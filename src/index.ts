import express, { Request, Response } from "express";
import { connection } from "./config/db";
import { authController } from "./controllers/authController";
import { snippetController } from "./controllers/snippetController";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { setupSockets } from "./sockets/socket";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
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

setupSockets(io);

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
