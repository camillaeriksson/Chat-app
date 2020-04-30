const socket = io();

window.addEventListener("load", () => {
  setupEventListeners();
});

function setupEventListeners() {
  const joinForm = document.querySelector("form.joinUI");
  joinForm.addEventListener("submit", onJoinChat);

  const createRoomForm = document.querySelector(".createRoomContainer form");
  createRoomForm.addEventListener("submit", createRoom);

  // send message handler
  const messageForm = document.querySelector(".inputContainer form");
  messageForm.addEventListener("submit", onSendMessage);

  // socket io events
  socket.on("join successful", loadChatUI);
  socket.on("message", onMessageReceived);
  socket.on("welcome message", welcomeMessage);
  socket.on("allRooms", printRooms);
  socket.on("leave room", onLeaveRoom);
}

function createRoom(event) {
  document.querySelector(".messageContainer ul").innerText = "";
  event.preventDefault();
  const [roomNameInput, passwordInput] = document.querySelectorAll(
    ".createRoomContainer input"
  );

  const room = roomNameInput.value;
  const password = passwordInput.value;

  socket.emit("create room", { room, password });

  document.querySelector(".welcomeMessageContainer").classList.add("hidden");

  document.querySelector(".chatContainer").classList.remove("hidden");

  const roomNameContainer = document.querySelector(".roomNameContainer");
  const roomName = document.createElement("h2");
  roomNameContainer.innerHTML = "";
  roomName.innerText = room;
  roomNameContainer.append(roomName);

  roomNameInput.value = "";
  passwordInput.value = "";
}

function onJoinRoom(room) {
  document.querySelector(".messageContainer ul").innerText = "";
  let password = "";
  if (room.password.length) {
    password = prompt("Ange lösenord");
  }
  socket.emit("join room", { room, password });
  if (password === room.password) {
    document.querySelector(".chatContainer").classList.remove("hidden");
    document.querySelector(".welcomeMessageContainer").classList.add("hidden");
    const roomNameContainer = document.querySelector(".roomNameContainer");
    const roomName = document.createElement("h2");
    roomNameContainer.innerHTML = "";
    roomName.innerText = room.name;
    roomNameContainer.append(roomName);
  }
}

function onJoinChat(event) {
  event.preventDefault();
  const nameInput = document.querySelector(".joinUI input");

  const name = nameInput.value;

  socket.emit("join chat", { name });
  document.querySelector(".chatContainer").classList.add("hidden");
}

function printRooms(rooms) {
  const openUl = document.querySelector(".openRoomsContainer ul");
  openUl.innerText = "";
  const lockedUl = document.querySelector(".lockedRoomsContainer ul");
  lockedUl.innerText = "";

  rooms.forEach((room) => {
    if (room.password) {
      // create password room
      const li = document.createElement("li");
      const button = document.createElement("button");
      const leaveButton = document.createElement("button");
      button.innerText = "Join";
      button.classList.add("join_button");
      leaveButton.innerText = "Leave chat";
      leaveButton.classList.add("join_button");
      button.addEventListener("click", () => onJoinRoom(room));
      leaveButton.addEventListener("click", () => onLeaveRoom(room));
      li.innerText = room.name;
      li.append(button, leaveButton);
      lockedUl.append(li);
    } else {
      // create normal room
      const li = document.createElement("li");
      const button = document.createElement("button");
      const leaveButton = document.createElement("button");
      button.innerText = "Join";
      button.classList.add("join_button");
      leaveButton.innerText = "Leave chat";
      leaveButton.classList.add("join_button");
      button.addEventListener("click", () => onJoinRoom(room));
      leaveButton.addEventListener("click", () => onLeaveRoom(room));
      li.innerText = room.name;
      li.append(button, leaveButton);
      openUl.append(li);
    }
  });
  return;
}

function onLeaveRoom(room) {
  socket.emit("leave room", { room });
  document.querySelector(".messageContainer ul").innerText = "";
  document.querySelector(".chatContainer").classList.add("hidden");
}

function onSendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("m");
  socket.emit("message", input.value);
  input.value = "";
}

function loadChatUI(name) {
  const nameContainer = document.createElement("h1");
  nameContainer.innerText = `${name}`;
  document.querySelector(".userNameContainer").append(nameContainer);
  document.querySelector(".joinUI").classList.add("hidden");
  document.querySelector(".flexContainer").classList.remove("hidden");
}

function onMessageReceived({ name, message }) {
  const time = new Date().toTimeString().substr(0, 5);
  const ul = document.querySelector(".messageContainer ul");
  const li = document.createElement("li");
  li.innerText = `${time} ${name}\n ${message}`;
  ul.append(li);

  const chatMessages = document.querySelector(".messageContainer");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function welcomeMessage({ name }) {
  const flexContainer = document.querySelector(".flexContainer");
  const welcomeMessageContainer = document.createElement("div");
  welcomeMessageContainer.classList.add("welcomeMessageContainer");
  const welcomeMessage = document.createElement("h1");
  welcomeMessage.innerText = `Welcome to the chat, ${name}!`;
  welcomeMessageContainer.append(welcomeMessage);
  flexContainer.append(welcomeMessageContainer);
}
