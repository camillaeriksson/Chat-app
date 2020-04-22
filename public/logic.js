const socket = io()

window.addEventListener("load", () => {
    setupEventListeners()
})

function setupEventListeners() {
    const joinForm = document.querySelector("form.joinUI")
    joinForm.addEventListener("submit", onJoinRoom)
    
    // send message handler
    const messageForm = document.querySelector(".inputContainer form")
    messageForm.addEventListener("submit", onSendMessage)
    
    // socket io events
    socket.on("join successful", loadChatUI)
    socket.on("message", onMessageReceived)
}


function onJoinRoom(event) {
    event.preventDefault()
    const [nameInput, roomInput] = document.querySelectorAll(".joinUI input")

    const name = nameInput.value
    const room = roomInput.value

    console.log(name, room)

socket.emit("join room", { name, room })   
}

function onSendMessage(event) {
    event.preventDefault()
    const input = document.getElementById("m")
    socket.emit('message', input.value)
    input.value = ""
}

function loadChatUI(data) {
    document.querySelector(".joinUI").classList.add("hidden")
    document.querySelector(".flexContainer").classList.remove("hidden")
}


function onMessageReceived({name, message}) {
    const ul = document.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = `${name}: ${message}`
    ul.append(li)
}
