import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import Project from "./models/Project.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codeforge")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allowing connections from all origins for now
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  let currentRoom = null;
  let currentUser = null;

  // Handle joining a room
  socket.on("join", async ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom).users.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom).users));
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId); // Join the room

    if (!rooms.has(roomId)) {
      try {
        const project = await Project.findById(roomId);
        const initialCode = project ? project.code : "// start code here";
        rooms.set(roomId, { users: new Set(), code: initialCode });
      } catch (err) {
        rooms.set(roomId, { users: new Set(), code: "// start code here" });
      }
    }

    rooms.get(roomId).users.add(userName); // Add user to the room

    // Emit the current code to the new user
    socket.emit("codeUpdate", rooms.get(roomId).code);

    // Emit the updated user list to the room
    io.to(roomId).emit("userJoined", Array.from(rooms.get(roomId).users));
  });

  // Handle code changes from users
  socket.on("codeChange", ({ roomId, code }) => {
    if (rooms.has(roomId)) {
      rooms.get(roomId).code = code; // Update the room's code with the new code
      io.to(roomId).emit("codeUpdate", code); // Emit updated code to all users in the room
    }
  });

  // Handle user typing indication
  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  // Handle language change
  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  // Handle leaving a room
  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).users.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom).users));

      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom).users.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom).users));
    }
    console.log("User Disconnected");
  });
});

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log("Server is working on port 5000");
});
