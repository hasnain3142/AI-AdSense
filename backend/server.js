const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(bodyParser.json());
app.use(cors());

let currentMessage = null;
let messageProcessed = false;

app.post('/api/postMessage', (req, res) => {
  currentMessage = req.body.message;
  messageProcessed = false; // Reset the flag when a new message is received
  io.emit('newMessage', currentMessage); // Emit the new message to all connected clients
  res.sendStatus(200); // Send response immediately
});

app.get('/api/getMessage', (req, res) => {
  res.json({ message: currentMessage });
});

app.post('/api/status', (req, res) => {
  messageProcessed = true;
  currentMessage = null; // Reset currentMessage
  res.json({ success: true });
});

app.get('/api/status', (req, res) => {
  res.json({ messageProcessed });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
