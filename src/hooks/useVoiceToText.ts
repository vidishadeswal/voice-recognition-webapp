import { useState, useRef, useCallback, useEffect } from "react";
import { AudioService } from "../services/audioService";
import {
  TranscriptionService,
  TranscriptionResult,
} from "../services/transcriptionService";

export enum RecordingState {
  IDLE = "idle",
  RECORDING = "recording",
  PROCESSING = "processing",
  ERROR = "error",
}

interface UseVoiceToTextReturn {
  recordingState: RecordingState;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearTranscript: () => void;
  copyToClipboard: () => Promise<void>;
}

/**
 * Custom hook for voice-to-text functionality
 * Manages audio recording and transcription services
 */
export function useVoiceToText(apiKey: string): UseVoiceToTextReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingState.IDLE
  );
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const audioServiceRef = useRef<AudioService | null>(null);
  const transcriptionServiceRef = useRef<TranscriptionService | null>(null);

  // Initialize services
  useEffect(() => {
    audioServiceRef.current = new AudioService();

    if (apiKey) {
      transcriptionServiceRef.current = new TranscriptionService({ apiKey });
    }

    return () => {
      audioServiceRef.current?.cleanup();
      transcriptionServiceRef.current?.cleanup();
    };
  }, [apiKey]);

  /**
   * Handle transcription results from Deepgram
   */
  const handleTranscript = useCallback((result: TranscriptionResult) => {
    if (result.isFinal) {
      // Append final transcript
      setTranscript((prev) => {
        const newText = prev ? `${prev} ${result.text}` : result.text;
        return newText.trim();
      });
      setInterimTranscript("");
    } else {
      // Update interim transcript (real-time partial results)
      setInterimTranscript(result.text);
    }
  }, []);

  /**
   * Handle transcription errors
   */
  const handleTranscriptionError = useCallback((err: Error) => {
    console.error("Transcription error:", err);
    setError(err.message);
    setRecordingState(RecordingState.ERROR);
  }, []);

  /**
   * Start recording and transcription
   */
  const startRecording = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your Deepgram API key");
      return;
    }

    try {
      setError(null);
      setRecordingState(RecordingState.RECORDING);

      // Start transcription service
      await transcriptionServiceRef.current?.startLiveTranscription(
        handleTranscript,
        handleTranscriptionError
      );

      // Start audio recording with real-time streaming
      await audioServiceRef.current?.startRecording(async (audioBlob: Blob) => {
        try {
          await transcriptionServiceRef.current?.sendAudio(audioBlob);
        } catch (err) {
          console.error("Error sending audio:", err);
        }
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start recording";
      setError(errorMessage);
      setRecordingState(RecordingState.ERROR);
    }
  }, [apiKey, handleTranscript, handleTranscriptionError]);

  /**
   * Stop recording and transcription
   */
  const stopRecording = useCallback(async () => {
    // Only stop if currently recording
    if (recordingState !== RecordingState.RECORDING) {
      return;
    }

    try {
      setRecordingState(RecordingState.PROCESSING);

      // Stop audio recording
      if (audioServiceRef.current?.isRecording()) {
        await audioServiceRef.current?.stopRecording();
      }

      // Stop transcription
      transcriptionServiceRef.current?.stopLiveTranscription();

      setRecordingState(RecordingState.IDLE);
      setInterimTranscript("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stop recording";
      setError(errorMessage);
      setRecordingState(RecordingState.ERROR);
    }
  }, [recordingState]);

  /**
   * Clear transcript text
   */
  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  /**
   * Copy transcript to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transcript);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setError("Failed to copy to clipboard");
    }
  }, [transcript]);

  return {
    recordingState,
    transcript,
    interimTranscript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    copyToClipboard,
  };
}
