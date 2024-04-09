"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSockets = void 0;
const socketUtils_1 = require("../utils/socketUtils");
const setupSockets = (io) => {
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("joinRoom", ({ snippetId }) => {
            socket.join(snippetId);
            console.log(`User joined room: ${snippetId}`);
        });
        socket.on("leaveRoom", ({ snippetId }) => {
            socket.leave(snippetId);
            console.log(`User left room: ${snippetId}`);
        });
        socket.on("editContent", async ({ token, snippetId, content }) => {
            socket.to(snippetId).emit("contentChanged", { snippetId, content });
            await (0, socketUtils_1.updateSnippet)(token, snippetId, "content", content);
        });
        socket.on("editTitle", async ({ token, snippetId, title }) => {
            socket.to(snippetId).emit("titleChanged", { snippetId, title });
            await (0, socketUtils_1.updateSnippet)(token, snippetId, "title", title);
        });
        socket.on("editSettings", async ({ token, snippetId, settings }) => {
            socket.to(snippetId).emit("settingsChanged", { snippetId, settings });
            await (0, socketUtils_1.updateSnippet)(token, snippetId, "settings", settings);
        });
        socket.on("disconnect", () => {
            console.log("a user disconnected");
        });
    });
};
exports.setupSockets = setupSockets;
