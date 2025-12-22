import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLimit: number;
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

      if (timeLimit > 0) {
        const timeLimitSeconds = timeLimit * 60;
        if (elapsedSeconds >= timeLimitSeconds) {
          onTimeUp();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, timeLimit, onTimeUp]);

  const remaining = timeLimit > 0 ? Math.max(0, timeLimit * 60 - elapsed) : elapsed;
  const isCountdown = timeLimit > 0;
  const isLowTime = isCountdown && remaining < 60;
  const isWarning = isCountdown && remaining < 300 && remaining >= 60;

  return (
    <div className={`
      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono font-semibold transition-all
      ${isLowTime 
        ? 'bg-destructive/10 text-destructive animate-pulse border border-destructive/20' 
        : isWarning 
          ? 'bg-warning/10 text-warning-foreground border border-warning/20'
          : 'bg-muted text-muted-foreground border border-border'
      }
    `}>
      <Clock className="w-4 h-4" />
      <span>{isCountdown ? formatTime(remaining) : formatTime(elapsed)}</span>
      {isCountdown && (
        <span className="text-xs opacity-60">còn lại</span>
      )}
    </div>
  );
};

export default Timer;
