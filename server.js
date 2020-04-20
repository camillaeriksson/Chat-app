const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = 3000;

app.use(express.static("public"));

http.listen(port, () => console.log("listening at " + port));
