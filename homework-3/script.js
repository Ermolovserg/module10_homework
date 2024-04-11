document.addEventListener("DOMContentLoaded", function() {
  const messageArea = document.getElementById("messageArea");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const locButton = document.getElementById("locationButton");

//  Установка соедениния с сервером
  const socket = new WebSocket("wss://echo-ws-service.herokuapp.com");
  let isUserMessage = true;

// Прием сообщения от сервера
  socket.onmessage = function(event) {
      showMessage(event.data, false); 
  };

  // Отправка сообщения
  sendButton.addEventListener("click", function() {
      const message = messageInput.value.trim();
      if (message !== "") {
          sendMessage(message, true); 
          messageInput.value = "";
      }
  });

  // Отправка геолокации
  locButton.addEventListener("click", function() {
    "geolocation" in navigator ?
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const locationURL = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            sendMessage(locationURL, true); 
        }) :
        alert("Геолокация не поддерживается");
});

  function sendMessage(message, fromUser) {
      socket.send(message);
      showMessage(message, fromUser); 
  }

// Отоброжения сообщения в чате
  function showMessage(message, fromUser) {
      const messageElement = document.createElement("div");
      messageElement.textContent = message;
      messageElement.style.textAlign = fromUser ? "right" : "left";
      messageArea.appendChild(messageElement);
      messageArea.scrollTop = messageArea.scrollHeight;
      isUserMessage = !fromUser;
  }
});