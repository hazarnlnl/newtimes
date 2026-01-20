interface TimeEntry {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  tags: string[];
}

interface ActivityGraphProps {
  entries: TimeEntry[];
}

export const ActivityGraph = ({ entries }: ActivityGraphProps) => {
  // Generate last 12 weeks (84 days)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Calculate total duration for a specific day
  const getDayDuration = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return entries
      .filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= dayStart && entryDate <= dayEnd;
      })
      .reduce((total, entry) => total + entry.duration, 0);
  };

  // Get color based on duration (in seconds)
  const getColor = (durationInSeconds: number) => {
    const hours = durationInSeconds / 3600;
    
    if (hours === 0) return '#161616'; // No activity
    if (hours < 2) return '#242424';   // < 2 hours - lightest
    if (hours < 4) return '#404040';   // 2-4 hours - medium
    if (hours < 6) return '#606060';   // 4-6 hours - medium-dark
    return '#808080';                   // 6+ hours - darkest
  };

  const days = generateDays();
  
  // Group by weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get day of week label
  const getDayLabel = (dayIndex: number) => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return labels[dayIndex];
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px',
      background: '#161616',
      border: '1px solid #242424',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        fontFamily: 'Fira Mono',
        fontSize: '10px',
        color: '#BEBEBE',
        textTransform: 'uppercase'
      }}>
        Activity
      </div>
      
      <div style={{ display: 'flex', gap: '2px' }}>
        {/* Day labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          marginRight: '4px'
        }}>
          {[0, 1, 2, 3, 4, 5, 6].map(day => (
            <div
              key={day}
              style={{
                width: '10px',
                height: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Fira Mono',
                fontSize: '8px',
                color: '#BEBEBE'
              }}
            >
              {day % 2 === 1 ? getDayLabel(day) : ''}
            </div>
          ))}
        </div>

        {/* Weeks grid */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              {week.map((day, dayIndex) => {
                const duration = getDayDuration(day);
                const hours = Math.floor(duration / 3600);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={dayIndex}
                    title={`${day.toLocaleDateString()}: ${hours}h ${Math.floor((duration % 3600) / 60)}m`}
                    style={{
                      width: '10px',
                      height: '10px',
                      background: getColor(duration),
                      border: isToday ? '1px solid #BEBEBE' : 'none',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '4px'
      }}>
        <span style={{
          fontFamily: 'Fira Mono',
          fontSize: '8px',
          color: '#BEBEBE'
        }}>
          LESS
        </span>
        <div style={{ width: '10px', height: '10px', background: '#161616', borderRadius: '2px' }} />
        <div style={{ width: '10px', height: '10px', background: '#242424', borderRadius: '2px' }} />
        <div style={{ width: '10px', height: '10px', background: '#404040', borderRadius: '2px' }} />
        <div style={{ width: '10px', height: '10px', background: '#606060', borderRadius: '2px' }} />
        <div style={{ width: '10px', height: '10px', background: '#808080', borderRadius: '2px' }} />
        <span style={{
          fontFamily: 'Fira Mono',
          fontSize: '8px',
          color: '#BEBEBE'
        }}>
          MORE
        </span>
      </div>
    </div>
  );
};
