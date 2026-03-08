import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: false,
    },
});

// --- Global State ---
let appState = {
    phase: 'inauguration', // 'inauguration' | 'countdown'
    targetTime: null,       // Unix timestamp (ms) when countdown ends
    timerDuration: 1440,    // default 24 hours in minutes
};

// --- Socket.io ---
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send current state to newly connected client
    socket.emit('state-sync', appState);

    // Coordinator initiates the event (inauguration → countdown)
    socket.on('initiate', () => {
        const durationMs = appState.timerDuration * 60 * 1000;
        appState.phase = 'countdown';
        appState.targetTime = Date.now() + durationMs;
        io.emit('state-sync', appState);
        console.log('Event initiated! Countdown started.');
    });

    // Coordinator sets new timer duration and starts
    socket.on('set-timer', ({ duration }) => {
        appState.timerDuration = duration;
        appState.targetTime = Date.now() + duration * 60 * 1000;
        appState.phase = 'countdown';
        io.emit('state-sync', appState);
        console.log(`Timer set: ${duration} minutes`);
    });

    // Coordinator sends a notification to all screens
    socket.on('send-notification', ({ message }) => {
        const notification = {
            id: Date.now(),
            message,
            timestamp: new Date().toISOString(),
        };
        io.emit('notification', notification);
        console.log(`Notification sent: ${message}`);
    });

    // Reset back to inauguration
    socket.on('reset', () => {
        appState = {
            phase: 'inauguration',
            targetTime: null,
            timerDuration: 1440,
        };
        io.emit('state-sync', appState);
        console.log('State reset to inauguration.');
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Cyberthon Server running on port ${PORT}`);
});
