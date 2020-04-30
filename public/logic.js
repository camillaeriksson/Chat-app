const socket = io();
/* const name = "";
const room = ""; */

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

}

function createRoom(event) {
  event.preventDefault();
  const [roomNameInput, passwordInput] = document.querySelectorAll(
    ".createRoomContainer input"
  );

  const room = roomNameInput.value;
  const password = passwordInput.value;

  socket.emit("create room", { room, password });

  document.querySelector(".flexContainer h3").innerText = "";

  document.querySelector(".chatContainer").classList.remove("hidden");

  roomNameInput.value = "";
  passwordInput.value = "";

  console.log("Test", password)

}

function onJoinRoom(room) {
  document.querySelector(".flexContainer h3").innerText = "";
  document.querySelector(".messageContainer ul").innerText = "";
  const enterPasswordInput = document.querySelector(
    ".enterPasswordForm input" // hämta lösenords element
  ); // eventuellt fel element
  const password = !enterPasswordInput.value.length ? null : enterPasswordInput.value;
  socket.emit("join room", { room, password });
  document.querySelector(".chatContainer").classList.remove("hidden");
  /* console.log("joinRoom", data.password) */
}

function onJoinChat(event) {
  event.preventDefault();
  const nameInput = document.querySelector(".joinUI input");

  const name = nameInput.value;

  socket.emit("join chat", { name });
  document.querySelector(".chatContainer").classList.add("hidden");
}


function printRooms(roomNames) {
  const openUl = document.querySelector(".openRoomsContainer ul");
  openUl.innerText = "";
  const lockedUl = document.querySelector(".lockedRoomsContainer ul");
  lockedUl.innerText = "";
  
  roomNames.forEach((room) => {

    if (room.hasPassword) {
      // create password room
      const li = document.createElement("li");
      const button = document.createElement("button");
      const leaveButton = document.createElement("button");
      button.innerText = "Join";
      button.classList.add("join_button");
      leaveButton.innerText = "Leave chat";
      leaveButton.classList.add("join_button");
      button.addEventListener("click", () => onJoinRoom(room))
      leaveButton.addEventListener("click", () => onLeaveRoom(room))
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
      leaveButton.addEventListener("click", () => onLeaveRoom(room))
      li.innerText = room.name;
      li.append(button, leaveButton);
      openUl.append(li);
    }
  });
  return;
}

function onLeaveRoom(room) {
  socket.emit("leave room", { room });
  console.log("has left room", room);
  document.querySelector(".messageContainer ul").innerText = "";
  document.querySelector(".chatContainer").classList.add("hidden");
}

/* function hideChatUI() {
  console.log("hideChatUI")
  document.querySelector(".messageContainer ul").empty()
} */

function onSendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("m");
  socket.emit("message", input.value);
  input.value = "";
}

function loadChatUI(name) {
  const nameContainer = document.createElement("h1");
  nameContainer.innerText = `${name}`;
  document.querySelector(".roomListContainer").prepend(nameContainer);
  document.querySelector(".joinUI").classList.add("hidden");
  document.querySelector(".flexContainer").classList.remove("hidden");
}

function onMessageReceived({ name, message }) {
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const ul = document.querySelector(".messageContainer ul");
  const li = document.createElement("li");
  li.innerText = `${hours}:${minutes} ${name}: ${message}`;
  ul.append(li);
  console.log(name, message);
}

function welcomeMessage({ name }) {
  const chatContainer = document.querySelector(".flexContainer");
  const welcomeMessage = document.createElement("h3");
  welcomeMessage.innerText = `Welcome to the chat, ${name}!`;
  chatContainer.append(welcomeMessage);
}
