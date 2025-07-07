let socket;
let username = '';
let avatar = '';

function connect() {
  username = document.getElementById('username').value.trim();
  avatar = document.getElementById('avatar').value.trim() || 'https://dummyimage.com/128x128/000/fff&text=' + username;

  if (!username) return alert("enter a name");

  socket = new WebSocket("wss://s.qwertywaffle.xyz:11311");

  socket.onopen = () => {
    document.getElementById('input').style.display = 'flex';
    document.getElementById('username').disabled = true;
    document.getElementById('avatar').disabled = true;
    console.log("Connected to server!");
  };

  socket.onmessage = (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch (e) {
      console.warn("Received non-JSON message:", event.data);
      return;
    }

    // Create and insert message element
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<img src="${msg.avatar}"><b>${msg.username}</b>: ${msg.text}`;
    const messages = document.getElementById('messages');
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  socket.onerror = (e) => {
    console.error("WebSocket error:", e);
    alert("Could not connect to server.");
  };

  socket.onclose = () => {
    alert("Connection closed.");
    document.getElementById('input').style.display = 'none';
    document.getElementById('username').disabled = false;
    document.getElementById('avatar').disabled = false;
  };
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (text && socket && socket.readyState === WebSocket.OPEN) {
    const msg = { username, avatar, text };
    socket.send(JSON.stringify(msg));
    input.value = '';
  }
}

// Press Enter to send message
document.getElementById('messageInput').addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});
