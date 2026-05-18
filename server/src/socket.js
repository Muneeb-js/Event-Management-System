import { Server } from "socket.io";
import { LobbyMessage } from "./models/lobbyMessage.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their private room`);
    });

    socket.on("joinEventLobby", ({ eventId, user }) => {
      socket.join(`lobby-${eventId}`);
      console.log(`User ${user?.fullName || socket.id} joined event lobby room lobby-${eventId}`);
    });

    socket.on("leaveEventLobby", ({ eventId }) => {
      socket.leave(`lobby-${eventId}`);
      console.log(`User left lobby room lobby-${eventId}`);
    });

    socket.on("sendLobbyMessage", async ({ eventId, userId, senderName, content }) => {
      try {
        if (!content || !content.trim()) return;
        const savedMessage = await LobbyMessage.create({
          event: eventId,
          user: userId,
          senderName,
          content: content.trim()
        });
        io.to(`lobby-${eventId}`).emit("newLobbyMessage", savedMessage);
      } catch (err) {
        console.error("Error saving lobby message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const emitNotification = (userId, notification) => {
  if (io) {
    io.to(userId.toString()).emit("newNotification", notification);
  }
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
