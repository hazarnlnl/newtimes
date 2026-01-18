import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerStatus } from '../types';

export const useTimer = (initialDuration: number = 25 * 60) => {
  const [duration, setDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element for notification
  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const playNotification = useCallback(() => {
    // Create a simple beep sound
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('completed');
            clearInterval(intervalRef.current!);
            playNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, playNotification]);

  const start = useCallback(() => {
    if (status === 'idle') {
      setStartTime(Date.now());
    }
    setStatus('running');
  }, [status]);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTimeLeft(duration);
    setStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [duration]);

  const setCustomDuration = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
    setStatus('idle');
    setStartTime(null);
  }, []);

  return {
    timeLeft,
    duration,
    status,
    startTime,
    start,
    pause,
    resume,
    reset,
    setCustomDuration,
  };
};
