import React from "react";
import "./TranscriptDisplay.css";

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  onCopy: () => void;
  onClear: () => void;
}

/**
 * Display area for transcribed text with copy and clear actions
 */
export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  interimTranscript,
  onCopy,
  onClear,
}) => {
  const hasContent = transcript.length > 0 || interimTranscript.length > 0;

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h2>Transcript</h2>
        <div className="transcript-actions">
          {hasContent && (
            <>
              <button
                className="action-button copy-button"
                onClick={onCopy}
                title="Copy to clipboard"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </button>
              <button
                className="action-button clear-button"
                onClick={onClear}
                title="Clear transcript"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      <div className="transcript-content">
        {!hasContent ? (
          <div className="transcript-placeholder">
            <p>Your transcribed text will appear here</p>
            <p className="hint">Hold the button below and start speaking</p>
          </div>
        ) : (
          <div className="transcript-text">
            <span className="final-transcript">{transcript}</span>
            {interimTranscript && (
              <span className="interim-transcript"> {interimTranscript}</span>
            )}
          </div>
        )}
      </div>

      {hasContent && (
        <div className="transcript-stats">
          <span className="word-count">
            {transcript.split(/\s+/).filter((word) => word.length > 0).length}{" "}
            words
          </span>
          <span className="char-count">{transcript.length} characters</span>
        </div>
      )}
    </div>
  );
};
