var mongoose = require('mongoose')
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

var messageSchema = new mongoose.Schema({
  name: {type: String, required: true},
  text: {type: String, required: true},
  id: {type: String, required: true},
  userId: {type: String, required: true},
  correctionText: {type: String, required: false},
})

var MessageModel = mongoose.model('message', messageSchema)
var saveMessage = (message) => {
  var messageModel = new MessageModel(message)
  messageModel.save((error, data) => {
    if (error) {
      console.log('Error: ' + error)
    } else {
      console.log('Saved message: ' + data)
    }
  })
}

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/recall'
mongoose.connect(mongoUri)
db = mongoose.connection
db.once('open', () => console.log('MongoDB connection open'))
db.on('error', (error) => console.log('Error: ' + error))

app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    socket.broadcast.emit('message', message)
    saveMessage(message)
  })
})
  
var port = process.env.PORT || 3000
http.listen(port, () => console.log(`Listening on port ${port}`))
