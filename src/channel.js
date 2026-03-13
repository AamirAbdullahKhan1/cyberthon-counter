// BroadcastChannel for cross-tab communication
const channel = new BroadcastChannel('cyberthon-timer');

// localStorage keys
const STORAGE_KEYS = {
  PHASE: 'cyberthon_phase',
  TARGET_TIME: 'cyberthon_target_time',
  TIMER_DURATION: 'cyberthon_timer_duration',
  TIME_OFFSET: 'cyberthon_time_offset',
};

// --- Time Sync ---
export let globalTimeOffset = parseInt(localStorage.getItem(STORAGE_KEYS.TIME_OFFSET) || '0', 10);

export function setGlobalTimeOffset(offset) {
  if (offset !== globalTimeOffset) {
    globalTimeOffset = offset;
    localStorage.setItem(STORAGE_KEYS.TIME_OFFSET, String(offset));
  }
}

// Absolute time synced to Google
export function getSyncedTime() {
  return Date.now() + globalTimeOffset;
}

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
  channel.postMessage({ type: 'notification', message, id: getSyncedTime() });
}

// Send FAAAHHHH sound trigger to all tabs
export function sendFaaahSound() {
  channel.postMessage({ type: 'sound-faaah', id: getSyncedTime() });
}

// Listen for messages
export function onMessage(callback) {
  channel.addEventListener('message', (event) => {
    callback(event.data);
  });
}

import alertSoundFile from './assets/cyber-notification.wav';
import faaahSoundFile from './assets/faaah.mp3';

// Play alert beep sound using Web Audio API / Custom Sound
export function playAlertSound() {
  try {
    const audio = new Audio(alertSoundFile);
    audio.play().catch(e => console.warn('Audio play failed:', e));
  } catch (e) {
    console.warn('Could not play alert sound:', e);
  }
}

// Play FAAAHHHH sound
export function playFaaahSound() {
  try {
    const audio = new Audio(faaahSoundFile);
    audio.play().catch(e => console.warn('Audio play failed:', e));
  } catch (e) {
    console.warn('Could not play FAAAHHHH sound:', e);
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
