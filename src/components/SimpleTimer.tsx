import { useState, useEffect } from 'react';

interface SimpleTimerProps {
  onComplete: () => void;
  onDurationChange?: (duration: number) => void;
  onFinishEarly?: (duration: number) => void;
}

export const SimpleTimer = ({ onComplete, onDurationChange, onFinishEarly }: SimpleTimerProps) => {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialDuration, setInitialDuration] = useState(25 * 60);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [pausedTimeLeft, setPausedTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && endTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          setIsRunning(false);
          setHasCompleted(true);
          setEndTime(null);
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          } catch (err) {
            console.log('Audio not available');
          }
          if (onDurationChange) {
            onDurationChange(initialDuration);
          }
          onComplete();
        }
      }, 100); // Check more frequently for accuracy
      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, endTime, onComplete, onDurationChange, initialDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${String(mins).padStart(2, '0')}`;
  };

  const handleStart = () => {
    const now = Date.now();
    const duration = pausedTimeLeft !== null ? pausedTimeLeft : timeLeft;
    setEndTime(now + duration * 1000);
    setIsRunning(true);
    setIsPaused(false);
    setHasCompleted(false);
    setPausedTimeLeft(null);
  };

  const handlePause = () => {
    setPausedTimeLeft(timeLeft);
    setIsPaused(true);
    setEndTime(null);
  };

  const handleResume = () => {
    const now = Date.now();
    setEndTime(now + timeLeft * 1000);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialDuration);
    setHasCompleted(false);
    setEndTime(null);
    setPausedTimeLeft(null);
  };

  const handleFinish = () => {
    const actualDuration = initialDuration - timeLeft;
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialDuration);
    setEndTime(null);
    setPausedTimeLeft(null);
    if (onFinishEarly && actualDuration > 0) {
      onFinishEarly(actualDuration);
    }
  };

  const handleMinutesChange = (newMinutes: number) => {
    setMinutes(newMinutes);
    const newDuration = newMinutes * 60;
    setInitialDuration(newDuration);
    setTimeLeft(newDuration);
    setHasCompleted(false);
    setEndTime(null);
    setPausedTimeLeft(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '60px',
      width: '217px'
    }}>
      {/* Timer Display */}
      <div style={{
        width: '217px',
        height: '58px',
        fontFamily: 'Fira Mono',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '48px',
        lineHeight: '58px',
        textAlign: 'center',
        color: '#CBCBCB'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        width: '217px'
      }}>
        {/* Duration Input Section - Always visible but disabled when running */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          width: '217px',
          opacity: isRunning || isPaused ? 0 : 1,
          pointerEvents: isRunning || isPaused ? 'none' : 'auto'
        }}>
          <>
            {/* Duration Input Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              width: '120px'
            }}>
              {/* Duration Label */}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                width: '78px',
                height: '16px'
              }}>
                <span style={{
                  fontFamily: 'Fira Mono',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '10px',
                  lineHeight: '12px',
                  color: '#BEBEBE'
                }}>
                  DURATION
                </span>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '2px 4px',
                  background: '#161616',
                  borderRadius: '4px'
                }}>
                  <span style={{
                    fontFamily: 'Fira Mono',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '10px',
                    lineHeight: '12px',
                    color: '#BEBEBE'
                  }}>
                    MIN
                  </span>
                </div>
              </div>

              {/* Input Field */}
              <input
                type="number"
                min="1"
                max="240"
                value={minutes}
                onChange={(e) => handleMinutesChange(Number(e.target.value))}
                style={{
                  boxSizing: 'border-box',
                  padding: '6px 12px',
                  width: '86px',
                  height: '32px',
                  background: '#161616',
                  border: '1px solid #242424',
                  borderRadius: '8px',
                  fontFamily: 'Fira Mono',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  outline: 'none',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                  appearance: 'none'
                } as React.CSSProperties}
              />
            </div>

            {/* Preset Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '217px'
            }}>
              <button
                onClick={() => handleMinutesChange(30)}
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4px 8px',
                  flex: '0 0 auto',
                  height: '25px',
                  background: minutes === 30 ? '#242424' : '#191919',
                  border: '1px solid #242424',
                  borderRadius: '4px',
                  fontFamily: 'Fira Mono',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#BEBEBE',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                30 MIN
              </button>
              <button
                onClick={() => handleMinutesChange(60)}
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4px 8px',
                  flex: '0 0 auto',
                  height: '25px',
                  background: minutes === 60 ? '#242424' : '#191919',
                  border: '1px solid #242424',
                  borderRadius: '4px',
                  fontFamily: 'Fira Mono',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#BEBEBE',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                60 MIN
              </button>
              <button
                onClick={() => handleMinutesChange(90)}
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4px 8px',
                  flex: '0 0 auto',
                  height: '25px',
                  background: minutes === 90 ? '#242424' : '#191919',
                  border: '1px solid #242424',
                  borderRadius: '4px',
                  fontFamily: 'Fira Mono',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '17px',
                  color: '#BEBEBE',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                90 MIN
              </button>
            </div>
          </>
        </div>

        {/* Action Button */}
        {!isPaused && !hasCompleted && (
          <button
            onClick={isRunning ? handlePause : handleStart}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 12px',
              height: '32px',
              background: '#191919',
              border: '1px solid #242424',
              borderRadius: '4px',
              fontFamily: 'Fira Mono',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '14px',
              color: '#BEBEBE',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
        )}

        {isPaused && (
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={handleResume}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px 12px',
                height: '32px',
                background: '#191919',
                border: '1px solid #242424',
                borderRadius: '4px',
                fontFamily: 'Fira Mono',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
                color: '#BEBEBE',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              RESUME
            </button>
            <button
              onClick={handleFinish}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px 12px',
                height: '32px',
                background: '#191919',
                border: '1px solid #242424',
                borderRadius: '4px',
                fontFamily: 'Fira Mono',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
                color: '#BEBEBE',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              FINISH
            </button>
            <button
              onClick={handleReset}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px 12px',
                height: '32px',
                background: '#191919',
                border: '1px solid #242424',
                borderRadius: '4px',
                fontFamily: 'Fira Mono',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '14px',
                color: '#BEBEBE',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              RESET
            </button>
          </div>
        )}

        {!isRunning && !isPaused && hasCompleted && (
          <button
            onClick={handleReset}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 12px',
              height: '32px',
              background: '#191919',
              border: '1px solid #242424',
              borderRadius: '4px',
              fontFamily: 'Fira Mono',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '14px',
              color: '#BEBEBE',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            NEW
          </button>
        )}
      </div>
    </div>
  );
};
