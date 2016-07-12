var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    socket.broadcast.emit('message', message)
  })
})

var port = process.env.PORT || 3000
http.listen(port, () => console.log(`Listening on port ${port}`))
