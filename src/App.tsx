import { useState, useEffect } from 'react';
import { SimpleTimer } from './components/SimpleTimer';
import { SimpleTagInput } from './components/SimpleTagInput';
import { SimpleHistory } from './components/SimpleHistory';
import { ActivityGraph } from './components/ActivityGraph';
import './App.css';

interface TimeEntry {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  tags: string[];
}

function App() {
  // Load entries from localStorage on initialization
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    try {
      const stored = window.localStorage.getItem('time-entries');
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  });
  
  const [showTagInput, setShowTagInput] = useState(false);
  const [activeView, setActiveView] = useState<'timer' | 'history'>('timer');
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem('time-entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  }, [entries]);

  const handleTimerComplete = () => {
    setSessionStartTime(Date.now() - sessionDuration * 1000);
    setShowTagInput(true);
  };

  const handleFinishEarly = (actualDuration: number) => {
    setSessionDuration(actualDuration);
    setSessionStartTime(Date.now() - actualDuration * 1000);
    setShowTagInput(true);
  };

  const handleSaveTags = (tags: string[]) => {
    if (sessionStartTime) {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        startTime: sessionStartTime,
        endTime: Date.now(),
        duration: sessionDuration,
        tags,
      };
      setEntries([...entries, newEntry]);
    }
    setShowTagInput(false);
    setSessionStartTime(null);
    setSessionDuration(0);
  };

  const handleSkipTags = () => {
    if (sessionStartTime) {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        startTime: sessionStartTime,
        endTime: Date.now(),
        duration: sessionDuration,
        tags: [],
      };
      setEntries([...entries, newEntry]);
    }
    setShowTagInput(false);
    setSessionStartTime(null);
    setSessionDuration(0);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">NEW TIMES</h1>
        <nav className="app-nav">
          <button
            className="nav-btn"
            onClick={() => setActiveView(activeView === 'timer' ? 'history' : 'timer')}
          >
            {activeView === 'timer' ? 'HISTORY' : 'TIMER'}
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className="view-container">
          <div style={{ display: activeView === 'timer' && !showTagInput ? 'flex' : 'none', justifyContent: 'center', width: '100%' }}>
            <SimpleTimer 
              onComplete={handleTimerComplete}
              onDurationChange={setSessionDuration}
              onFinishEarly={handleFinishEarly}
            />
          </div>

          {activeView === 'timer' && showTagInput && (
            <SimpleTagInput onSave={handleSaveTags} onSkip={handleSkipTags} />
          )}

          {activeView === 'history' && (
            <SimpleHistory entries={entries} onDelete={handleDeleteEntry} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        MADE BY HAZAR
      </footer>

      {/* Activity Graph - only show on timer view */}
      {activeView === 'timer' && <ActivityGraph entries={entries} />}
    </div>
  );
}

export default App;
