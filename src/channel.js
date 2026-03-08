// BroadcastChannel for cross-tab communication
const channel = new BroadcastChannel('cyberthon-timer');

// localStorage keys
const STORAGE_KEYS = {
  PHASE: 'cyberthon_phase',
  TARGET_TIME: 'cyberthon_target_time',
  TIMER_DURATION: 'cyberthon_timer_duration',
};

// Get current phase from localStorage
export function getPhase() {
  return localStorage.getItem(STORAGE_KEYS.PHASE) || 'inauguration';
}

// Set phase and broadcast to all tabs
export function setPhase(phase) {
  localStorage.setItem(STORAGE_KEYS.PHASE, phase);
  channel.postMessage({ type: 'phase-change', phase });
}

// Get target time
export function getTargetTime() {
  const t = localStorage.getItem(STORAGE_KEYS.TARGET_TIME);
  return t ? parseInt(t, 10) : null;
}

// Set target time and broadcast
export function setTargetTime(targetTime) {
  localStorage.setItem(STORAGE_KEYS.TARGET_TIME, String(targetTime));
  channel.postMessage({ type: 'timer-sync', targetTime });
}

// Get timer duration in minutes
export function getTimerDuration() {
  const d = localStorage.getItem(STORAGE_KEYS.TIMER_DURATION);
  return d ? parseInt(d, 10) : 1440; // default 24 hours
}

// Set timer duration
export function setTimerDuration(minutes) {
  localStorage.setItem(STORAGE_KEYS.TIMER_DURATION, String(minutes));
}

// Send notification to all tabs
export function sendNotification(message) {
  channel.postMessage({ type: 'notification', message, id: Date.now() });
}

// Listen for messages
export function onMessage(callback) {
  channel.addEventListener('message', (event) => {
    callback(event.data);
  });
}

import alertSoundFile from './assets/cyber-notification.wav';

// Play alert beep sound using Web Audio API / Custom Sound
export function playAlertSound() {
  try {
    const audio = new Audio(alertSoundFile);
    audio.play().catch(e => console.warn('Audio play failed:', e));
  } catch (e) {
    console.warn('Could not play alert sound:', e);
  }
}

// Reset everything (for testing)
export function resetState() {
  localStorage.removeItem(STORAGE_KEYS.PHASE);
  localStorage.removeItem(STORAGE_KEYS.TARGET_TIME);
  localStorage.removeItem(STORAGE_KEYS.TIMER_DURATION);
  channel.postMessage({ type: 'reset' });
}

export default channel;
