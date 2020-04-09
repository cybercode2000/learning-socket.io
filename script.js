const socket = io("http://localhost:3000");
const messageForm = document.getElementById("send-container");
const messageContainer = document.getElementById("message-container");
const messageInput = document.getElementById("message-input");

const name = prompt("what is your name");
appendMessage("You Joined");
socket.emit("new-user", name);

socket.on("chat-message", data => {
  appendMessage(data.name + ":" + " " + data.message);
});

socket.on("user-connected", name => {
  appendMessage(name + " " + " joined");
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage("You" + ":" + " " + message);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

messageInput.addEventListener("focus", () => {
  socket.emit("user-typing", name);
});

socket.on("typing", name => {
  appendMessage(name + " " + "typing ....");
  messageForm.addEventListener("submit", () => {
    removeMessage(name);
  });
});

socket.on("user-disconnected", name => {
  appendMessage(name + " " + "disconnected");
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function removeMessage(message) {
  messageElement.innerText = "";
}
