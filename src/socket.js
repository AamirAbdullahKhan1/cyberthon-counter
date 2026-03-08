import { io } from 'socket.io-client';

// Auto-detect server URL:
// - In development: connect to localhost:4000
// - In production: connect to the same host (Railway serves everything from one URL)
const SERVER_URL = import.meta.env.PROD
    ? window.location.origin
    : 'http://localhost:4000';

const socket = io(SERVER_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
});

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
});

export default socket;
