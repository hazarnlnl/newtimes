import { useState } from 'react';
import { TimerStatus } from '../types';
import './Timer.css';

interface TimerProps {
  timeLeft: number;
  duration: number;
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSetDuration: (minutes: number) => void;
}

export const Timer = ({
  timeLeft,
  duration,
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onSetDuration,
}: TimerProps) => {
  const [customMinutes, setCustomMinutes] = useState(25);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <div className="timer-container">
      <div className="timer-display">
        <svg className="progress-ring" width="280" height="280">
          <circle
            className="progress-ring-circle-bg"
            cx="140"
            cy="140"
            r="120"
          />
          <circle
            className="progress-ring-circle"
            cx="140"
            cy="140"
            r="120"
            style={{
              strokeDashoffset: `${754 - (754 * progress) / 100}`,
            }}
          />
        </svg>
        <div className="timer-time">{formatTime(timeLeft)}</div>
      </div>

      {status === 'idle' && (
        <div className="duration-input">
          <label htmlFor="duration">Set Duration (minutes)</label>
          <div className="input-group">
            <input
              id="duration"
              type="number"
              min="1"
              max="240"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
            />
            <button
              className="btn btn-secondary"
              onClick={() => onSetDuration(customMinutes)}
            >
              Set
            </button>
          </div>
        </div>
      )}

      <div className="timer-controls">
        {status === 'idle' && (
          <button className="btn btn-primary btn-large" onClick={onStart}>
            <span className="btn-icon">▶</span>
            Start
          </button>
        )}

        {status === 'running' && (
          <button className="btn btn-warning btn-large" onClick={onPause}>
            <span className="btn-icon">⏸</span>
            Pause
          </button>
        )}

        {status === 'paused' && (
          <>
            <button className="btn btn-success btn-large" onClick={onResume}>
              <span className="btn-icon">▶</span>
              Resume
            </button>
            <button className="btn btn-secondary" onClick={onReset}>
              Reset
            </button>
          </>
        )}

        {status === 'completed' && (
          <button className="btn btn-secondary btn-large" onClick={onReset}>
            <span className="btn-icon">↻</span>
            New Session
          </button>
        )}
      </div>
    </div>
  );
};
