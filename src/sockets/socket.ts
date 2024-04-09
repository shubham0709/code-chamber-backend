import { Server as SocketIOServer } from "socket.io";
import { updateSnippet } from "../utils/socketUtils";

export const setupSockets = (io: SocketIOServer) => {
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
      await updateSnippet(token, snippetId, "content", content);
    });

    socket.on("editTitle", async ({ token, snippetId, title }) => {
      socket.to(snippetId).emit("titleChanged", { snippetId, title });
      await updateSnippet(token, snippetId, "title", title);
    });

    socket.on("editSettings", async ({ token, snippetId, settings }) => {
      socket.to(snippetId).emit("settingsChanged", { snippetId, settings });
      await updateSnippet(token, snippetId, "settings", settings);
    });

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
};
