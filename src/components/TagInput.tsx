import { useState, KeyboardEvent } from 'react';
import './TagInput.css';

interface TagInputProps {
  onSave: (tags: string[]) => void;
  onSkip: () => void;
}

export const TagInput = ({ onSave, onSkip }: TagInputProps) => {
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

  const handleSave = () => {
    onSave(tags);
  };

  return (
    <div className="tag-input-container">
      <h3>What did you work on?</h3>
      <p className="tag-subtitle">Add tags to categorize this session</p>

      <div className="tag-input-wrapper">
        <div className="tags-list">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button
                className="tag-remove"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="tag-input"
            placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>

      <div className="tag-actions">
        <button className="btn btn-secondary" onClick={onSkip}>
          Skip
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Session
        </button>
      </div>
    </div>
  );
};
