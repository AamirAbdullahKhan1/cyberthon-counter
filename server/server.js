import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import https from 'https';


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

// --- Time Sync ---
let googleTimeOffset = 0; // The difference in ms between System Clock and Google's Clock

function syncWithGoogleTime() {
    const req = https.request({ method: 'HEAD', host: 'google.com', port: 443, path: '/' }, (res) => {
        if (res.headers.date) {
            const googleTime = new Date(res.headers.date).getTime();
            googleTimeOffset = googleTime - Date.now();
            console.log(`[TimeSync] Synced with Google. True time offset: ${googleTimeOffset}ms`);
            
            // Push updated sync to clients that might be already connected
            io.emit('time-sync', { googleTimeOffset });
        }
    });
    req.on('error', (e) => console.warn('[TimeSync] Failed to sync with Google:', e.message));
    req.end();
}

// Initial sync and periodic resync every hour
syncWithGoogleTime();
setInterval(syncWithGoogleTime, 1000 * 60 * 60);

// Helper for true absolute time
function getTrueTime() {
    return Date.now() + googleTimeOffset;
}

// --- Socket.io ---
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send current state to newly connected client
    socket.emit('state-sync', { ...appState, googleTimeOffset });

    // Coordinator initiates the event (inauguration → countdown)
    socket.on('initiate', () => {
        const durationMs = appState.timerDuration * 60 * 1000;
        appState.phase = 'countdown';
        appState.targetTime = getTrueTime() + durationMs;
        io.emit('state-sync', { ...appState, googleTimeOffset });
        console.log('Event initiated! Countdown started.');
    });

    // Coordinator sets new timer duration and starts
    socket.on('set-timer', ({ duration }) => {
        appState.timerDuration = duration;
        appState.targetTime = getTrueTime() + duration * 60 * 1000;
        appState.phase = 'countdown';
        io.emit('state-sync', { ...appState, googleTimeOffset });
        console.log(`Timer set: ${duration} minutes`);
    });

    // Coordinator sends a notification to all screens
    socket.on('send-notification', ({ message }) => {
        const notification = {
            id: getTrueTime(),
            message,
            timestamp: new Date(getTrueTime()).toISOString(),
        };
        io.emit('notification', notification);
        console.log(`Notification sent: ${message}`);
    });

    // Coordinator triggers the FAAAAHHH sound
    socket.on('play-faaah', () => {
        io.emit('sound-faaah', { id: Date.now() });
        console.log(`Sound trigger: FAAAHHHH`);
    });

    // Reset back to inauguration
    socket.on('reset', () => {
        appState = {
            phase: 'inauguration',
            targetTime: null,
            timerDuration: 1440,
        };
        io.emit('state-sync', { ...appState, googleTimeOffset });
        console.log('State reset to inauguration.');
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Cyberthon Server running on port ${PORT}`);
});
