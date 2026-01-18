import { useState, KeyboardEvent } from 'react';

interface SimpleTagInputProps {
  onSave: (tags: string[]) => void;
  onSkip: () => void;
}

export const SimpleTagInput = ({ onSave, onSkip }: SimpleTagInputProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px',
      width: '400px',
      padding: '40px',
      background: '#161616',
      border: '1px solid #242424',
      borderRadius: '8px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}>
        <h3 style={{
          fontFamily: 'Fira Mono',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '17px',
          color: '#E2E2E2',
          margin: 0,
          textTransform: 'uppercase'
        }}>
          ADD TAGS
        </h3>
        <p style={{
          fontFamily: 'Fira Mono',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: '12px',
          color: '#BEBEBE',
          margin: 0
        }}>
          Press Enter to add tags
        </p>
      </div>

      <div style={{
        background: '#050505',
        border: '1px solid #181818',
        borderRadius: '4px',
        padding: '12px',
        width: '100%',
        minHeight: '80px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                background: '#242424',
                borderRadius: '4px',
                fontFamily: 'Fira Mono',
                fontSize: '12px',
                color: '#BEBEBE'
              }}
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#BEBEBE',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: 0,
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={tags.length === 0 ? "TYPE TAG..." : ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: '#E2E2E2',
              fontSize: '12px',
              fontFamily: 'Fira Mono',
              outline: 'none',
              minWidth: '120px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%' }}>
        <button
          onClick={onSkip}
          style={{
            boxSizing: 'border-box',
            padding: '12px 24px',
            background: '#050505',
            border: '1px solid #181818',
            borderRadius: '8px',
            fontFamily: 'Fira Mono',
            fontWeight: 400,
            fontSize: '14px',
            color: '#BEBEBE',
            cursor: 'pointer'
          }}
        >
          SKIP
        </button>
        <button
          onClick={() => onSave(tags)}
          style={{
            boxSizing: 'border-box',
            padding: '12px 24px',
            background: '#DDDDDD',
            border: '1px solid #181818',
            borderRadius: '8px',
            fontFamily: 'Fira Mono',
            fontWeight: 500,
            fontSize: '14px',
            color: '#212121',
            cursor: 'pointer'
          }}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};
