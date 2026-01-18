export interface TimeEntry {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  tags: string[];
  timerDuration: number; // the set timer duration in seconds
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';
