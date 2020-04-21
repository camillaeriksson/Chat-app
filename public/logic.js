let socket = io()
let name = ""

window.onload = () => {
    name = prompt('Whats your name?')
}

socket.on('message', (incoming) => {
    let list = document.getElementById('messages')
    let listItem = document.createElement('li')
    listItem.innerText = incoming.name + ': ' + incoming.message
    list.appendChild(listItem)
})

function sendMessage() {
    let input = document.getElementById("m")
    let message = input.value
    input.value = ""
    socket.emit('message', { name, message })
}