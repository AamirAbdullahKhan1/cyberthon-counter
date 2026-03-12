import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import InaugurationPage from './components/InaugurationPage';
import CountdownPage from './components/CountdownPage';
import NotificationOverlay from './components/NotificationOverlay';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import DeanButtonPage from './components/DeanButtonPage';
import socket from './socket';
import {
  getPhase,
  getTargetTime,
  onMessage,
  playAlertSound,
  playFaaahSound,
} from './channel';

export default function App() {
  const [phase, setPhaseState] = useState(getPhase());
  const [targetTime, setTargetTimeState] = useState(getTargetTime());
  const [notifications, setNotifications] = useState([]);
  // Check if admin is already authenticated this session
  const [isAdminAuthed, setIsAdminAuthed] = useState(
    () => sessionStorage.getItem('cyberthon_admin_auth') === '1'
  );

  // Listen for Socket.io events from the backend
  useEffect(() => {
    // Receive full state sync from server
    socket.on('state-sync', (state) => {
      setPhaseState(state.phase);
      if (state.targetTime) {
        setTargetTimeState(state.targetTime);
      }
      // Also update localStorage so BroadcastChannel tabs stay in sync
      localStorage.setItem('cyberthon_phase', state.phase);
      if (state.targetTime) {
        localStorage.setItem('cyberthon_target_time', String(state.targetTime));
      }
    });

    // Receive notifications from server
    socket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
      playAlertSound();
    });

    // Receive FAAAAHHH sound trigger
    socket.on('sound-faaah', () => {
      playFaaahSound();
    });

    return () => {
      socket.off('state-sync');
      socket.off('notification');
      socket.off('sound-faaah');
    };
  }, []);

  // Also listen for BroadcastChannel (fallback for local-only mode without backend)
  useEffect(() => {
    onMessage((data) => {
      switch (data.type) {
        case 'phase-change':
          setPhaseState(data.phase);
          break;
        case 'timer-sync':
          setTargetTimeState(data.targetTime);
          break;
        case 'notification':
          // We only want to add it if it's not already in the state
          setNotifications((prev) => {
            if (prev.find(n => n.id === data.id)) return prev;
            playAlertSound(); // Play only when adding a new notification
            return [...prev, { id: data.id, message: data.message }];
          });
          break;
        case 'sound-faaah':
          playFaaahSound();
          break;
        case 'reset':
          setPhaseState('inauguration');
          setTargetTimeState(null);
          setNotifications([]);
          break;
      }
    });

    // Listen for localStorage changes (cross-tab)
    const handleStorage = (e) => {
      if (e.key === 'cyberthon_phase') {
        setPhaseState(e.newValue || 'inauguration');
      }
      if (e.key === 'cyberthon_target_time') {
        setTargetTimeState(e.newValue ? parseInt(e.newValue, 10) : null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Poll localStorage for same-tab updates
  useEffect(() => {
    const checkState = () => {
      const currentPhase = getPhase();
      const currentTarget = getTargetTime();
      if (currentPhase !== phase) setPhaseState(currentPhase);
      if (currentTarget !== targetTime) setTargetTimeState(currentTarget);
    };
    const interval = setInterval(checkState, 500);
    return () => clearInterval(interval);
  }, [phase, targetTime]);

  return (
    <Routes>
      <Route path="/" element={
        <>
          <AnimatePresence mode="wait">
            {phase === 'inauguration' ? (
              <InaugurationPage key="inauguration" />
            ) : (
              <CountdownPage key="countdown" targetTime={targetTime} />
            )}
          </AnimatePresence>
          <NotificationOverlay notifications={notifications} />
        </>
      } />
      <Route path="/admin" element={
        <AnimatePresence mode="wait">
          {isAdminAuthed ? (
            <AdminPanel key="panel" />
          ) : (
            <AdminLogin key="login" onAuthenticated={() => setIsAdminAuthed(true)} />
          )}
        </AnimatePresence>
      } />
      <Route path="/button" element={<DeanButtonPage />} />
    </Routes>
  );
}
