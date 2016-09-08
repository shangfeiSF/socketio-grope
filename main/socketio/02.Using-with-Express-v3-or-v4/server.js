var http = require('http')
var path = require('path')
var colors = require('colors')
var express = require('express')
var socketio = require('socket.io')

var app = express()
var server = http.Server(app)

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/index.html'))
})
app.get('/client.js', function (request, response) {
  response.sendFile(path.join(__dirname, '/client.js'))
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