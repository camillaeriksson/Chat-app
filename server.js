const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  io.to(socket.id).emit("allRooms", getAllRooms());

  
  socket.on("create room", (data) => {
    socket.join(data.room, () => {
      io.emit("allRooms", getAllRooms());
    });
  });
  
  socket.on("join chat", (name) => {
    io.to(socket.id).emit("join successful", "success");
    io.to(socket.id).emit("welcome message", {
      name: name.name,
    });

      socket.on("leave room", (room) => {
      socket.leave(room)
      socket.to(room).emit('user left', socket.id);
      io.emit(getAllRooms());
    })

    socket.on("join room", (data) => {
      socket.join(data.room, () => {
        // Respond to client that joined successfully
        io.emit("allRooms", getAllRooms());

        // Bradcast message to all clients in the room
        io.to(data.room).emit("message", {
          name: name.name,
          message: `Has joined the room`,
        });
      });

      socket.on("message", (message) => {
        // Bradcast message to all clients in the room
        io.to(data.room).emit("message", { name: name.name, message });
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  });
});

function getAllRooms() {
  var availableRooms = [];
  var rooms = io.sockets.adapter.rooms;
  console.log("rooms", rooms);
  if (rooms) {
    for (var room in rooms) {
      if (room.length !== 20) {
        availableRooms.push(room);
      }
    }
  }
  console.log(availableRooms);
  return availableRooms;
}

server.listen(3000, () => console.log("listening at 3000"));
