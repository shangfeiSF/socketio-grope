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

var chat = io.of('/chat')
  .on('connection', function (socket) {
    socket.on('connected', function (data) {
      socket.sign = data.sign

      console.log('[Server] -- Client#' + socket.sign + ' emit greeting to erveryone'.green)

      chat.emit('join', {
        message: socket.sign + ' has join in'
      })

      console.log('[Server] -- Client#' + socket.sign + ' greeting to self after 3 seconds...'.yellow)

      setTimeout(function () {
        console.log('[Server] -- Client#' + socket.sign + ' emit greeting to self'.green)
        socket.emit('self', {
          message: 'wellcome ' + socket.sign + ' at ' + (new Date().toTimeString())
        })
      }, 3000)
    })

    socket.on('answer', function (data) {
      console.log('[Client] -- Client#' + socket.sign + ' ' + data.message.magenta)
    })

    socket.on('disconnect', function () {
      console.log(('[Server] -- Client#' + socket.sign + ' has disconnected').red)
    })
  })

var news = io.of('/news')
  .on('connection', function (socket) {
    socket.on('connected', function (data) {
      socket.sign = data.sign

      console.log('[Server] -- Client#' + socket.sign + ' will be push news after 4 seconds...'.yellow)

      setTimeout(function () {
        console.log('[Server] -- Client#' + socket.sign + ' is being push news'.green)
        socket.emit('push', {
          news: 'some news'
        })
      }, 4000)
    })

    socket.on('received', function (data) {
      console.log('[Client] -- Client#' + socket.sign + ' ' + data.message.magenta)
    })
  })

server.listen(8080, function () {
  console.log(('[Server] -- Server listen 127.0.0.1:8080...').green)
})