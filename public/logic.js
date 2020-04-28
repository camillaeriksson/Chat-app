const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  //   const joinForm = document.querySelector("form.joinUI");
  //   joinForm.addEventListener("submit", onJoinRoom);

  const joinForm = document.querySelector("form.joinUI");
  joinForm.addEventListener("submit", onJoinChat);

  const createRoomForm = document.querySelector(".createRoomContainer form");
  createRoomForm.addEventListener("submit", createRoom);

  // send message handler
  const messageForm = document.querySelector(".inputContainer form");
  messageForm.addEventListener("submit", onSendMessage);

  // socket io events
  // socket.emit("get all rooms")
  //   socket.on("create successful");
  socket.on("join successful", loadChatUI);
  socket.on("message", onMessageReceived);
  socket.on("welcome message", welcomeMessage);
  socket.on("leave successful", hideChatUI);
  //   socket.on("add room", printRoom);
  socket.on("allRooms", printRooms);
}

// addRoomToList(room);

// function addRoomToList(room) {
//   const ul = document.querySelector(".openRoomsContainer ul");
//   console.log(ul);
//   const li = document.createElement("li");
//   li.innerText = room;
//   ul.append(li);
// }

function createRoom(event) {
  event.preventDefault();
  const [roomNameInput, passwordInput] = document.querySelectorAll(
    ".createRoomContainer input"
  );

  const room = roomNameInput.value;
  const password = passwordInput.value;

  socket.emit("create room", { room, password });

  roomNameInput.value = "";
  passwordInput.value = "";
}

function onJoinRoom(room) {
  socket.emit("join room", { room });
  document.querySelector(".chatContainer").classList.remove("hidden")
}

function onJoinChat(event) {
  event.preventDefault();
  const nameInput = document.querySelector(".joinUI input");

  const name = nameInput.value;

  socket.emit("join chat", { name });
  document.querySelector(".chatContainer").classList.add("hidden")
}

function printRooms(data) {
  const ul = document.querySelector(".openRoomsContainer ul");
  ul.innerText = "";
  data.forEach((room) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const leaveButton = document.createElement("button");
    button.innerText = "Join";
    button.classList.add("join_button");
    leaveButton.innerText = "Leave chat";
    leaveButton.classList.add("join_button");
    button.addEventListener("click", () => onJoinRoom(room));
    leaveButton.addEventListener("click", () => onLeaveRoom(room))
    li.innerText = room;
    li.append(button, leaveButton);
    ul.append(li);
  });
  return;
}

function onLeaveRoom(room) {
  socket.emit("leave room", { room });
  console.log("has left room", room)
}

function hideChatUI() {
  document.querySelector(".messageContainer").innerText = ""
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
  const hours = new Date().getHours()
  const minutes = new Date().getMinutes()
  const ul = document.querySelector(".messageContainer ul");
  const li = document.createElement("li");
  li.innerText = `${hours}:${minutes} ${name}: ${message}`;
  ul.append(li);
}

function welcomeMessage({ name }) {
  const ul = document.querySelector(".messageContainer ul");
  const li = document.createElement("li");
  li.innerText = `Welcome to the chat, ${name}!`;
  ul.append(li);
}
