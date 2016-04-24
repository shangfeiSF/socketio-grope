var socket = io('http://localhost:8080')
var greetings = document.getElementById('greetings')

// socket link then send sign to server
socket.on('connect', function () {
  var sign = +new Date()
  socket.emit('connected', {
    sign: sign
  })
})

socket.on('join', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  message.style.color = '#00ff00'
  greetings.appendChild(message)
})

socket.on('self', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  greetings.appendChild(message)

  setTimeout(function () {
    socket.emit('answer',
      {message: 'I am fine. Thank you'},
      function (data, servertime) {
        var message = document.createElement('div')
        message.innerHTML = '[Server] received message [' + data.message + '] at ' + new Date(servertime).toTimeString()
        greetings.appendChild(message)
      })
  }, 3000)

})
