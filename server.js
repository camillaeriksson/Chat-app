const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const rooms = [];
/*  "rum 1" : { password: null},
  "rum 2" : { password: "hje213" } */

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  io.to(socket.id).emit("allRooms", getAllRooms());

  socket.on("leave room", (room) => {
    socket.leaveAll(room, () => {
      socket.to(room).emit("user left", socket.id);
      // socket.to(socket.id).emit("leave successful", "success");
    });
    // koll om det finns nån kvar i rummet
    // io.sockets.adapter.rooms
    var roomsAdapter = io.socket.adapter.rooms
    console.log("adapter.rooms", roomsAdapter)
    io.emit("allRooms", getAllRooms());
  });

  socket.on("join chat", (name) => {
    io.to(socket.id).emit("join successful", name.name);
    io.to(socket.id).emit("welcome message", {
      name: name.name,
    });
    io.emit("allRooms", getAllRooms());

    socket.on("create room", (data) => {
      //   io.to(socket.id).emit("print room", data.room);
      socket.leaveAll();
      socket.join(data.room, () => {
        rooms.push({ name: data.room, password: data.password });

        io.to(data.room).emit("message", {
          name: name.name,
          message: `has joined ${data.room}`,
        });
        io.emit("allRooms", getAllRooms());
      });
      return;
    });

    socket.on("join room", (data) => {
      socket.leaveAll();
      let roomIndex = rooms.findIndex((room) => {
        return room.name == data.room.name;
      });
      console.log(data.room.password, rooms[roomIndex].password);

      if (data.password !== rooms[roomIndex].password) {
        // emit fel lösenord
        // console.log("lösenord");
        // return;
        socket.emit("leave room", data.room.name);
      }

      socket.join(data.room.name, () => {
        // Respond to client that joined successfully
        io.emit("allRooms", getAllRooms());
        console.log("TEST", socket.rooms);

        // Bradcast message to all clients in the room
        io.to(data.room.name).emit("message", {
          name: name.name,
          message: `has joined ${data.room.name}`,
        });
      });
    });

    socket.on("message", (message) => {
      console.log("message", message);
      // Bradcast message to all clients in the rooms
      console.log(socket.rooms);
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

// ["rum 1", "rum 2", ...]

// [{ name: "rum 1", hasPassword: false }, { name: "rum 2", hasPassword: true }]

function getAllRooms() {
  // var availableRooms = [];
  // //var roomNames = io.sockets.adapter.rooms;
  // console.log("rooms", rooms);
  // if (rooms) {
  //   for (var room in rooms) {
  //     if (room.length !== 20) {
  //       const formattedRoom = {
  //         name: room,
  //         hasPassword: rooms[room].password ? true : false
  //       }
  //       availableRooms.push(formattedRoom);
  //     }
  //   }
  // }
  // console.log("availableRooms", availableRooms);
  // return availableRooms;
  return rooms;
}

// function getAllRooms() {
//   var availableRooms = [];
//   var rooms = io.sockets.adapter.rooms;
//   console.log("rooms", rooms);
//   if (rooms) {
//     const socketIds = Object.keys(io.sockets.sockets)

//     for (var roomId in rooms) {
//       if (socketIds.find((socketId) => socketId !== roomId)) {
//         availableRooms.push(roomId);
//       }
//     }
//   }
//   console.log(availableRooms);
//   return availableRooms;
// }

server.listen(3000, () => console.log("listening at 3000"));
