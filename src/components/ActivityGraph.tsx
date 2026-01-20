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
  // Generate last 53 weeks (371 days) like GitHub
  const generateDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start from a Sunday
    const startDay = new Date(today);
    const dayOfWeek = startDay.getDay();
    startDay.setDate(startDay.getDate() - dayOfWeek - (52 * 7));
    
    for (let i = 0; i < 371; i++) {
      const date = new Date(startDay);
      date.setDate(date.getDate() + i);
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
    if (hours < 2) return '#2a2a2a';   // < 2 hours - lightest
    if (hours < 4) return '#404040';   // 2-4 hours - medium
    if (hours < 6) return '#5a5a5a';   // 4-6 hours - medium-dark
    return '#808080';                   // 6+ hours - darkest
  };

  const days = generateDays();
  
  // Group by weeks (columns)
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get month labels for the top
  const getMonthLabels = () => {
    const labels: { month: string; offset: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, index) => {
      const firstDay = week[0];
      const month = firstDay.getMonth();
      
      if (month !== lastMonth && index > 0) {
        labels.push({
          month: firstDay.toLocaleDateString('en-US', { month: 'short' }),
          offset: index
        });
        lastMonth = month;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div style={{
      position: 'fixed',
      bottom: '23px',
      right: '26px',
      padding: '16px',
      background: '#0a0a0a',
      border: '1px solid #242424',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* Months */}
      <div style={{
        display: 'flex',
        position: 'relative',
        height: '12px',
        marginLeft: '26px',
        marginBottom: '4px'
      }}>
        {monthLabels.map((label, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${label.offset * 11}px`,
              fontFamily: 'Fira Mono',
              fontSize: '9px',
              color: '#808080',
              textTransform: 'uppercase'
            }}
          >
            {label.month}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Day labels */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          paddingTop: '15px'
        }}>
          <div style={{
            height: '10px',
            fontFamily: 'Fira Mono',
            fontSize: '9px',
            color: '#808080',
            display: 'flex',
            alignItems: 'center'
          }}>
            Mon
          </div>
          <div style={{ height: '10px' }} />
          <div style={{
            height: '10px',
            fontFamily: 'Fira Mono',
            fontSize: '9px',
            color: '#808080',
            display: 'flex',
            alignItems: 'center'
          }}>
            Wed
          </div>
          <div style={{ height: '10px' }} />
          <div style={{
            height: '10px',
            fontFamily: 'Fira Mono',
            fontSize: '9px',
            color: '#808080',
            display: 'flex',
            alignItems: 'center'
          }}>
            Fri
          </div>
          <div style={{ height: '10px' }} />
          <div style={{ height: '10px' }} />
        </div>

        {/* Weeks grid */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}
            >
              {week.map((day, dayIndex) => {
                const duration = getDayDuration(day);
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const isToday = day.toDateString() === new Date().toDateString();
                const isFuture = day > new Date();
                
                return (
                  <div
                    key={dayIndex}
                    title={`${day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}: ${hours}h ${minutes}m`}
                    style={{
                      width: '10px',
                      height: '10px',
                      background: isFuture ? '#0a0a0a' : getColor(duration),
                      border: isToday ? '1px solid #BEBEBE' : '1px solid #1a1a1a',
                      borderRadius: '2px',
                      cursor: isFuture ? 'default' : 'pointer',
                      opacity: isFuture ? 0.3 : 1
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
        marginTop: '8px',
        justifyContent: 'flex-end'
      }}>
        <span style={{
          fontFamily: 'Fira Mono',
          fontSize: '9px',
          color: '#808080'
        }}>
          Less
        </span>
        <div style={{ 
          width: '10px', 
          height: '10px', 
          background: '#161616', 
          border: '1px solid #1a1a1a',
          borderRadius: '2px' 
        }} />
        <div style={{ 
          width: '10px', 
          height: '10px', 
          background: '#2a2a2a', 
          border: '1px solid #1a1a1a',
          borderRadius: '2px' 
        }} />
        <div style={{ 
          width: '10px', 
          height: '10px', 
          background: '#404040', 
          border: '1px solid #1a1a1a',
          borderRadius: '2px' 
        }} />
        <div style={{ 
          width: '10px', 
          height: '10px', 
          background: '#5a5a5a', 
          border: '1px solid #1a1a1a',
          borderRadius: '2px' 
        }} />
        <div style={{ 
          width: '10px', 
          height: '10px', 
          background: '#808080', 
          border: '1px solid #1a1a1a',
          borderRadius: '2px' 
        }} />
        <span style={{
          fontFamily: 'Fira Mono',
          fontSize: '9px',
          color: '#808080'
        }}>
          More
        </span>
      </div>
    </div>
  );
};
