const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  const joinForm = document.querySelector("form.joinUI");
  joinForm.addEventListener("submit", onJoinRoom);

  // send message handler
  const messageForm = document.querySelector(".inputContainer form");
  messageForm.addEventListener("submit", onSendMessage);

  // socket io events
  // socket.emit("get all rooms")
  socket.on("join successful", loadChatUI);
  socket.on("message", onMessageReceived);
  socket.on("add room", printRoom);
  socket.on("allRooms", (data) => {
    console.log(data)
  })
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
  const div = document.createElement("div");
  li.append(div);
  div.innerText = `${name}: ${message}`;
  ul.append(li);
}
