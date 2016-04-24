var fs = require('fs')
var http = require('http')
var colors = require('colors')
var socketio = require('socket.io')

var server = http.createServer(function (request, response) {
  fs.readFile(__dirname + '/index.html',
    function (error, data) {
      if (error) {
        response.writeHead(500)
        return response.end('Error loading index.html')
      }

      response.writeHead(200)
      response.end(data)
    })
})

var io = socketio(server)

io.on('connection', function (socket) {
  console.log('[Server] -- Greeting after 3 seconds...'.green)

  setTimeout(function () {
    console.log('[Server] -- Emit Greeting...'.green)
    socket.emit('greeting', {
      message: 'Hello, how are you? --' + (new Date().toTimeString())
    })
  }, 3000)

  socket.on('answer', function (data) {
    console.log(('[Client] -- ' + data.message).yellow)
  })
})

server.listen(8080, function () {
  console.log(('[Server] -- Server listen 127.0.0.1:8080...').green)
})