import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import ejs from "ejs";

import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// Server Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //send and recieve data in Json format
app.use(cors());
app.set("views", "./server/views");
app.set("view engine", "ejs");
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Server Listen Along with Database
// connection(in case of data persistence)
const server = app.listen(PORT, (error) => {
  if (!error) console.log("Server is listening on port " + PORT);
  else console.log(`Error: ${error}`.red.bold);
});

//set up socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    // console.log("new message received: " + newMessageRecieved.content);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", room);
  });

  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
});
