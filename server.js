const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const rooms = [];

app.use(express.static("public"));

// When client connects
io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  io.to(socket.id).emit("allRooms", getAllRooms());

  // When client clicks leave button
  socket.on("leave room", (room) => {
    // koll om det finns nån kvar i rummet
    // io.sockets.adapter.rooms
    //console.log("Room: ", room)
    // var rooms1 = io.sockets.adapter.rooms
    console.log("Lååångt", io.sockets.adapter.rooms[room.room.name]);
    console.log("Roooom name", room.room.name);

    let roomIndex = rooms.findIndex((roomToFind) => {
      return room.room.name == roomToFind.name;
    });

    if (io.sockets.adapter.rooms[room.room.name].length === 1) {
      rooms.splice(roomIndex, 1);
      //console.log("Ta bort rum från arrayen");
    }
    
    console.log("uppdate", rooms);
    // console.log("rooms1", io.sockets.adapter.rooms[room.room.name].length);

    io.emit("allRooms", getAllRooms());
    socket.leaveAll(room, () => {
      socket.to(room).emit("user left", socket.id);
    });
    console.log(getAllRooms())
  });

  // When client joins chat
  socket.on("join chat", (name) => {
    // Respond to client that joined successfully
    io.to(socket.id).emit("join successful", name.name);

    // Print welcome message to client
    io.to(socket.id).emit("welcome message", {
      name: name.name,
    });

    io.emit("allRooms", getAllRooms());

    // When client creates a room
    socket.on("create room", (data) => {
      // Leave all other rooms
      socket.leaveAll();

      // Join new created room
      socket.join(data.room, () => {
        // Add the new created room to array
        rooms.push({ name: data.room, password: data.password });

        // Print to room that user has joined
        io.to(data.room).emit("message", {
          name: name.name,
          message: `has joined ${data.room}`,
        });

        io.emit("allRooms", getAllRooms());
      });
      return;
    });

    // When client clicks join button
    socket.on("join room", (data) => {
      socket.leaveAll();

      // Find room index in array
      let roomIndex = rooms.findIndex((room) => {
        return room.name == data.room.name;
      });

      // If password is wrong
      if (data.password !== rooms[roomIndex].password) {
        socket.emit("leave room", data.room.name);
      }

      // Join room
      socket.join(data.room.name, () => {
        io.emit("allRooms", getAllRooms());

        // Print to room that user has joined
        io.to(data.room.name).emit("message", {
          name: name.name,
          message: `has joined ${data.room.name}`,
        });
      });
    });

    // Print message to all clients in the rooms
    socket.on("message", (message) => {
      const room = Object.keys(socket.rooms)[0];

      if (message) {
        io.to(room).emit("message", { name: name.name, message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
});

// Get all the rooms in the array
function getAllRooms() {
  return rooms;
}

server.listen(3000, () => console.log("listening at 3000"));
