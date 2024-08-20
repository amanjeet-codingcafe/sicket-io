const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Adjust as needed
        credentials: true
    }
  });

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3012;

server.listen(port, () => {
    console.log('Server running on port', port);
});

// Handling CORS for socket.io
app.post('/send', (req, res) => {
    if (!req.body.room_id) {
        return res.status(400).json({
            'success': false,
            'message': 'Parameter `room_id` is missing.'
        });
    }
    if (!req.body.message) {
        return res.status(400).json({
            'success': false,
            'message': 'Parameter `message` is missing.'
        });
    }
    io.sockets.emit(req.body.room_id, req.body.message);
    res.status(200).json({
        'success': true,
        'message': 'Event has been triggered to `room_id`:' + req.body.room_id,
        'body': req.body.message,
    });
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (room_id) => {
        socket.join(room_id);
        console.log(`User joined room ${room_id}`);
    });

    socket.onAny((eventName, message) => {
        console.log(`Received event ${eventName} with message:`, message);
        io.to(eventName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});