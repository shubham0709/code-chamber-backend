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
const snippet_1 = require("./models/snippet");
// "scripts": {
//   "start": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts",
//   "build": "tsc",
//   "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts"
// },
// let scripts = {
//   start: "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/app.ts",
//   build: "rimraf dist && tsc",
//   "ts.check": "tsc --project tsconfig.json",
//   "add-build": "git add dist",
//   test: 'echo "Error: no test specified" && exit 1',
// };
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
    //edit content of the snippet
    socket.on("editContent", async ({ token, snippetId, content }) => {
        console.log("changing content");
        socket.to(snippetId).emit("contentChanged", { snippetId, content });
        await snippet_1.snippetModel.findOneAndUpdate({ _id: snippetId }, { content: content }, { new: true });
    });
    //Making different callers for title, content, and discription
    //edit title of the snippet
    socket.on("editTitle", async ({ token, snippetId, title }) => {
        console.log("changing title");
        socket.to(snippetId).emit("titleChanged", { snippetId, title });
        await snippet_1.snippetModel.findOneAndUpdate({ _id: snippetId }, { title });
    });
    //edit settings of the snippet ({language})
    socket.on("editSettings", async ({ token, snippetId, settings }) => {
        console.log("changing settings : ", { token, snippetId, settings });
        socket.to(snippetId).emit("settingsChanged", { snippetId, settings });
        await snippet_1.snippetModel.findOneAndUpdate({ _id: snippetId }, { settings });
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("a user disconnected");
    });
});
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
