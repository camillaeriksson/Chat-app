const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  const joinForm = document.querySelector("form.joinUI");
  joinForm.addEventListener("submit", onJoinRoom);

  const createRoomForm = document.querySelector(".createRoomContainer form")
  createRoomForm.addEventListener("submit", createRoom)


  // send message handler
  const messageForm = document.querySelector(".inputContainer form");
  messageForm.addEventListener("submit", onSendMessage);

  // socket io events
  // socket.emit("get all rooms")
  socket.on("create successful")
  socket.on("join successful", loadChatUI);
  socket.on("message", onMessageReceived);
  socket.on("add room", printRoom);
  socket.on("allRooms", (data) => {
    console.log(data)
  })
}


function createRoom(event) {
  event.preventDefault()
  const [roomNameInput, passwordInput] = document.querySelectorAll(".createRoomContainer input")

  const room = roomNameInput.value
  const password = passwordInput.value

  socket.emit("create room", { room, password })

  roomNameInput.value = ""
  passwordInput.value = ""

  addRoomToList(room)
  
  console.log("password: ", password)
}

function addRoomToList(room) {
  const ul = document.querySelector(".openRoomsContainer ul");
  console.log(ul);
  const li = document.createElement("li");
  li.innerText = room;
  ul.append(li);
}

function onJoinRoom(event) {
  event.preventDefault();
  const [nameInput, roomInput] = document.querySelectorAll(".joinUI input");

  const name = nameInput.value;
  const room = roomInput.value;

  socket.emit("join room", { name, room });
}

function printRoom(room) {
  const ul = document.querySelector(".openRoomsContainer ul");
  console.log(ul);
  const li = document.createElement("li");
  li.innerText = room;
  ul.append(li);
}

function onSendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("m");
  socket.emit("message", input.value);
  input.value = "";
}

function loadChatUI(data) {
  document.querySelector(".joinUI").classList.add("hidden");
  document.querySelector(".flexContainer").classList.remove("hidden");
}

function onMessageReceived({ name, message }) {
  const ul = document.querySelector(".messageContainer ul");
  const li = document.createElement("li");
  li.innerText = `${name}: ${message}`;
  ul.append(li);
}
