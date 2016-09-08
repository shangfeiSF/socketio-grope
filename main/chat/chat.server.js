var fs = require('fs')
var http = require('http')
var path = require('path')
var colors = require('colors')
var express = require('express')
var socketio = require('socket.io')

function ChatRoom(config) {
  this.usersOnline = []
  this.countOnline = 0
  this.port = config.port

  this.app = express()
  this.server = http.Server(this.app)
  this.io = socketio(this.server)

  this.routes = [{
    path: '/chat.client.html',
    file: 'chat.client.html'
  }, {
    path: '/chat.client.js',
    file: 'chat.client.js'
  }, {
    path: '/chat.client.css',
    file: 'chat.client.css'
  }]

  this.router()
  this.init()
  this.start()
}

ChatRoom.prototype.router = function () {
  var self = this
  var app = self.app

  self.routes.forEach(function (route) {
    app.get(route.path, function (req, res) {
      res.sendFile(path.join(__dirname, route.file))
    })
  })
}

ChatRoom.prototype.init = function () {
  var io = this.io
  var usersOnline = this.usersOnline
  var countOnline = this.countOnline

  io.on('connection', function (socket) {
    console.log(('A user connected...').green)

    socket.on('login', function (data) {
      var userId = data.userId
      var userName = data.userName
      var sign = [userName, userId].join('#')

      var exist = usersOnline.filter(function (user) {
        return user.sign === sign
      }).pop()

      if (exist) return

      socket.sign = sign

      usersOnline.push({
        userId: userId,
        userName: userName,
        sign: sign
      })
      countOnline++

      io.emit('login', {
        usersOnline: usersOnline,
        countOnline: countOnline,
        user: data
      })

      console.log(('[' + userId + ']' + userName + ' has login\n').cyan)
    })

    socket.on('disconnect', function () {
      var sign = socket.sign

      var target = null
      usersOnline = usersOnline.filter(function (user) {
        var result = true
        if (user.sign === sign) {
          target = user
          countOnline--
          result = false
        }
        return result
      })

      if (!target) return

      io.emit('logout', {
        usersOnline: usersOnline,
        countOnline: countOnline,
        user: {
          id: target.userId,
          name: target.userName
        }
      })

      console.log(('[' + target.userId + ']' + target.userName + ' has logout...\n').cyan)
    })

    socket.on('message', function (data) {
      io.emit('message', data)

      console.log(('[' + data.userId + ']' + data.userName + ' has send message').yellow)
      console.log((data.content + '\n').yellow)
    })
  })
}

ChatRoom.prototype.start = function () {
  var self = this

  self.server.listen(self.port, function () {
    console.log(('Chat Room listening 127.0.0.1:' + self.port + '/chat.client.html').green)
  })
}

new ChatRoom({
  port: 3000
})