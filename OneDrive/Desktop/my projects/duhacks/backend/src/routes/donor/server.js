const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the 'public' folder so the browser can see html/css/js
app.use(express.static(path.join(__dirname, 'public')));

// Sign out route
app.get('/logout', (req, res) => {
    // Clear session/cookies if using session management
    res.clearCookie('sessionId');
    res.redirect('/login');
});

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // When a phone/browser sends coordinates
    socket.on("send-location", (data) => {
        // Send those coordinates to everyone else
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log('A user disconnected: ' + socket.id);
        io.emit("user-disconnected", socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});