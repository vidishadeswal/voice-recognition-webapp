import React from "react";
import "./RecordButton.css";

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

/**
 * Push-to-talk recording button with visual feedback
 */
export const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  isProcessing,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
}) => {
  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (isRecording) return "Recording...";
    return "Hold to Record";
  };

  const getButtonClass = () => {
    let className = "record-button";
    if (isRecording) className += " recording";
    if (isProcessing) className += " processing";
    return className;
  };

  return (
    <button
      className={getButtonClass()}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={isProcessing}
    >
      <div className="record-button-inner">
        <div className="microphone-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        <span className="button-text">{getButtonText()}</span>
      </div>
      {isRecording && <div className="pulse-ring" />}
    </button>
  );
};
