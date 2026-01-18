interface TimeEntry {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  tags: string[];
}

interface SimpleHistoryProps {
  entries: TimeEntry[];
  onDelete: (id: string) => void;
}

export const SimpleHistory = ({ entries, onDelete }: SimpleHistoryProps) => {
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
      return `${hours}H ${minutes}M`;
    } else if (minutes > 0) {
      return `${minutes}M ${secs}S`;
    } else {
      return `${secs}S`;
    }
  };

  const totalTime = entries.reduce((acc, entry) => acc + entry.duration, 0);
  const sortedEntries = [...entries].sort((a, b) => b.startTime - a.startTime);

  if (entries.length === 0) {
    return (
      <div style={{
        padding: '40px',
        background: '#161616',
        borderRadius: '8px',
        border: '1px solid #242424',
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{
          fontFamily: 'Fira Mono',
          fontSize: '14px',
          textAlign: 'center',
          color: '#BEBEBE'
        }}>
          NO SESSIONS YET
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px',
      background: '#161616',
      borderRadius: '8px',
      border: '1px solid #242424',
      maxWidth: '800px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid #242424'
      }}>
        <span style={{
          fontFamily: 'Fira Mono',
          fontSize: '14px',
          fontWeight: 500,
          color: '#E2E2E2',
          textTransform: 'uppercase'
        }}>
          SESSION HISTORY
        </span>
        <div style={{
          padding: '4px 8px',
          background: '#050505',
          borderRadius: '4px',
          fontFamily: 'Fira Mono',
          fontSize: '10px',
          color: '#BEBEBE'
        }}>
          TOTAL: {formatDuration(totalTime)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            style={{
              position: 'relative',
              padding: '16px',
              background: '#050505',
              borderRadius: '4px',
              border: '1px solid #181818'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{
                  fontFamily: 'Fira Mono',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#E2E2E2'
                }}>
                  {formatDate(entry.startTime)}
                </div>
                <div style={{
                  fontFamily: 'Fira Mono',
                  fontSize: '10px',
                  color: '#BEBEBE'
                }}>
                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                background: '#161616',
                borderRadius: '4px',
                fontFamily: 'Fira Mono',
                fontSize: '12px',
                fontWeight: 500,
                color: '#E2E2E2'
              }}>
                {formatDuration(entry.duration)}
              </div>
            </div>

            {entry.tags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}>
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '2px 6px',
                      background: '#242424',
                      borderRadius: '4px',
                      fontFamily: 'Fira Mono',
                      fontSize: '10px',
                      color: '#BEBEBE'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => onDelete(entry.id)}
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: '#161616',
                border: '1px solid #242424',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontFamily: 'Fira Mono',
                fontSize: '10px',
                color: '#BEBEBE'
              }}
            >
              DEL
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
