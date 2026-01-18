import type { TimeEntry } from '../types';
import './History.css';

interface HistoryProps {
  entries: TimeEntry[];
  onDelete: (id: string) => void;
}

export const History = ({ entries, onDelete }: HistoryProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const totalTime = entries.reduce((acc, entry) => acc + entry.duration, 0);

  const sortedEntries = [...entries].sort((a, b) => b.startTime - a.startTime);

  if (entries.length === 0) {
    return (
      <div className="history-container">
        <div className="history-header">
          <h2>History</h2>
        </div>
        <div className="history-empty">
          <p>No sessions yet. Start your first timer!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>History</h2>
        <div className="total-time">
          Total: {formatDuration(totalTime)}
        </div>
      </div>

      <div className="history-list">
        {sortedEntries.map((entry) => (
          <div key={entry.id} className="history-item">
            <div className="history-item-main">
              <div className="history-item-time">
                <div className="history-date">{formatDate(entry.startTime)}</div>
                <div className="history-time-range">
                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </div>
              </div>
              <div className="history-duration">
                {formatDuration(entry.duration)}
              </div>
            </div>

            {entry.tags.length > 0 && (
              <div className="history-tags">
                {entry.tags.map((tag) => (
                  <span key={tag} className="history-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              className="history-delete"
              onClick={() => onDelete(entry.id)}
              aria-label="Delete entry"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
