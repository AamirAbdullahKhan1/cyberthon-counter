import { io } from 'socket.io-client';

// In development:  connects to localhost:4000
// In production:   reads VITE_BACKEND_URL from Vercel env vars (set to your Railway URL)
const SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

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
