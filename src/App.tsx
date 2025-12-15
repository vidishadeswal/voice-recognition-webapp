import { useState, useEffect } from "react";
import "./App.css";
import { RecordButton } from "./components/RecordButton";
import { TranscriptDisplay } from "./components/TranscriptDisplay";
import { useVoiceToText, RecordingState } from "./hooks/useVoiceToText";

function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(true);

  const {
    recordingState,
    transcript,
    interimTranscript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    copyToClipboard,
  } = useVoiceToText(apiKey);

  // Load API key from environment variable or localStorage
  useEffect(() => {
    const envKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      setApiKeyInput(envKey);
      setShowSettings(false);
    } else {
      const savedKey = localStorage.getItem("deepgram_api_key");
      if (savedKey) {
        setApiKey(savedKey);
        setApiKeyInput(savedKey);
        setShowSettings(false);
      }
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("deepgram_api_key", apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setShowSettings(false);
    }
  };

  const handleRecordStart = () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (
      recordingState === RecordingState.IDLE ||
      recordingState === RecordingState.ERROR
    ) {
      startRecording();
    }
  };

  const handleRecordStop = () => {
    if (recordingState === RecordingState.RECORDING) {
      stopRecording();
    }
  };

  const isRecording = recordingState === RecordingState.RECORDING;
  const isProcessing = recordingState === RecordingState.PROCESSING;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎙️ Voice-to-Text App</h1>
        <p className="subtitle">Powered by Tauri + Deepgram</p>
        <button
          className="settings-button"
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
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
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m5.2-15.2l-4.2 4.2m0 6l-4.2 4.2m15.2-5.2h-6m-6 0H1m15.2 5.2l-4.2-4.2m0-6l-4.2-4.2" />
          </svg>
        </button>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <h3>⚙️ Settings</h3>
          <div className="api-key-input-group">
            <label htmlFor="api-key">Deepgram API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your Deepgram API key"
              className="api-key-input"
            />
            <button onClick={handleSaveApiKey} className="save-button">
              Save API Key
            </button>
          </div>
          <p className="api-key-help">
            Don't have an API key? Get one at{" "}
            <a
              href="https://console.deepgram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              console.deepgram.com
            </a>
          </p>
        </div>
      )}

      <main className="app-content">
        {error && (
          <div className="error-banner">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
            <button onClick={clearTranscript}>×</button>
          </div>
        )}

        <TranscriptDisplay
          transcript={transcript}
          interimTranscript={interimTranscript}
          onCopy={copyToClipboard}
          onClear={clearTranscript}
        />

        <div className="recording-controls">
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onMouseDown={handleRecordStart}
            onMouseUp={handleRecordStop}
            onTouchStart={handleRecordStart}
            onTouchEnd={handleRecordStop}
          />
          <p className="recording-hint">
            {!apiKey
              ? "Please configure your API key in settings"
              : "Hold the button and speak"}
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with <span className="heart">❤️</span> using Tauri & Deepgram
        </p>
      </footer>
    </div>
  );
}

export default App;
