var socket = io('http://localhost:8080')
var greetings = document.getElementById('greetings')

socket.on('connect', function () {
  var nickname = window.location.search.slice(1)
  var id = +new Date()

  socket.emit('connected', {
    nickname: nickname || 'anonymUser',
    id: id
  })
})

socket.on('join', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  message.style.color = '#999'
  greetings.appendChild(message)
})

socket.on('greeting', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  message.style.color = '#00ff00'
  greetings.appendChild(message)

  socket.emit('answer', {
    message: 'Wellcome ' + data.sign
  })
})

socket.on('broadcast', function (data) {
  var message = document.createElement('div')
  message.innerHTML = data.message
  message.style.color = '#ff3300'
  greetings.appendChild(message)
})