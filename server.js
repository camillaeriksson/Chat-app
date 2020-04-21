const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = 3000;

app.use(express.static("public"));

io.on('connection', (socket) => {

    console.log('New Connection')

    socket.on('message', (incoming) => {
        io.emit('message', incoming)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
      });
})

http.listen(port, () => console.log("listening at " + port));
