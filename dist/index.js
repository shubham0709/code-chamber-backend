"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const authController_1 = require("./controllers/authController");
const snippetController_1 = require("./controllers/snippetController");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./sockets/socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send(`Server is running at http://localhost:${PORT}`);
});
app.use("/auth", authController_1.authController);
app.use("/snippet", snippetController_1.snippetController);
(0, socket_1.setupSockets)(io);
const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
    try {
        await db_1.connection;
        console.log("Connected to DB");
    }
    catch (err) {
        console.log("Unable to connect to DB");
    }
    console.log(`Server is running at http://localhost:${PORT}`);
});
