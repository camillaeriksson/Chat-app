const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);
});

socket.on("create room", (data) => {
  socket.join(data.room, () => {
    io.to(socket.id).emit("create successful", "success");

    io.to(data.room).emit("message", {
      name: data.name,
      message: `Has joined the room`,
    });
  });

  io.to(socket.id).emit("allRooms", [1, 2]);

  socket.on("join room", (data) => {
    socket.join(data.room, () => {
      // Respond to client that joined successfully
      io.to(socket.id).emit("join successful", "success");
      io.emit("allRooms", [1, 2]);

      // Bradcast message to all clients in the room
      io.to(data.room).emit("message", {
        name: data.name,
        message: `Has joined the room`,
      });
    });

    io.emit("add room", data.room);

    socket.on("message", (message) => {
      // Bradcast message to all clients in the room
      io.to(data.room).emit("message", { name: data.name, message });
    });
  });
});

server.listen(3000, () => console.log("listening at 3000"));
