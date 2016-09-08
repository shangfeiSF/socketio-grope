var socket = io('http://localhost:8080')
var greetings = document.getElementById('greetings')

// socket link then send sign to server
socket.on('connect', function () {
  var sign = +new Date()
  socket.emit('connected', {
    sign: sign
  })
})

socket.on('message', function (message) {
  var dom = document.createElement('div')
  dom.innerHTML = message
  greetings.appendChild(dom)

  setTimeout(function(){
    socket.send('Client Time is ' + new Date().getTime())
  }, 1000)

})
