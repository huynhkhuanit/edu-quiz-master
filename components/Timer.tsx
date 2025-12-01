import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  timeLimit: number; // in minutes, 0 = no limit
  startTime: number | null;
  onTimeUp: () => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, startTime, onTimeUp, isRunning }) => {
  const [elapsed, setElapsed] = useState(0);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      setElapsed(elapsedSeconds);

      // Check if time is up (only if there's a time limit)
      if (timeLimit > 0) {
        const timeLimitSeconds = timeLimit * 60;
        if (elapsedSeconds >= timeLimitSeconds) {
          onTimeUp();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, timeLimit, onTimeUp]);

  // Calculate remaining time for countdown mode
  const remaining = timeLimit > 0 ? Math.max(0, timeLimit * 60 - elapsed) : elapsed;
  const isCountdown = timeLimit > 0;
  const isLowTime = isCountdown && remaining < 60; // Less than 1 minute
  const isWarning = isCountdown && remaining < 300 && remaining >= 60; // Less than 5 minutes

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-mono font-semibold transition-colors ${
      isLowTime 
        ? 'bg-red-100 text-red-600 animate-pulse' 
        : isWarning 
          ? 'bg-amber-100 text-amber-600'
          : 'bg-slate-100 text-slate-600'
    }`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{isCountdown ? formatTime(remaining) : formatTime(elapsed)}</span>
      {isCountdown && (
        <span className="text-xs opacity-60">còn lại</span>
      )}
    </div>
  );
};

export default Timer;
