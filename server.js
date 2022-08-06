const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { joinRoom, getCurrentUser, userLeavesChat, getUsersInRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chatBot = "CodeChat Bot";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinRoom(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(chatBot, "Welcome to Chatcat!"));

    socket.broadcast.to(user.room).emit("message", formatMessage(chatBot, `${user.username} has joined the chat!`));

    // Send user and room info
    io.to(user.room).emit("roominfo", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    let user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // User leaves the chatroom
  socket.on("disconnect", () => {
    const user = userLeavesChat(socket.id);

    if (user) {
      io.to(user.room).emit("message", formatMessage(chatBot, `${user.username} has left the chat`));

      // Send user and room info
      io.to(user.room).emit("roominfo", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
