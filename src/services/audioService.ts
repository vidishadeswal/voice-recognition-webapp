/**
 * Audio Service
 * Handles microphone access, audio capture, and streaming
 */

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];

  /**
   * Request microphone permission and initialize audio stream
   */
  async requestMicrophoneAccess(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000, // Deepgram works well with 16kHz
        },
      });
      this.audioStream = stream;
      return stream;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          throw new Error(
            "Microphone access denied. Please grant permission in settings."
          );
        } else if (error.name === "NotFoundError") {
          throw new Error("No microphone found. Please connect a microphone.");
        }
      }
      throw new Error(`Failed to access microphone: ${error}`);
    }
  }

  /**
   * Start recording audio
   */
  async startRecording(onDataAvailable: (blob: Blob) => void): Promise<void> {
    if (!this.audioStream) {
      await this.requestMicrophoneAccess();
    }

    if (!this.audioStream) {
      throw new Error("Audio stream not available");
    }

    this.audioChunks = [];

    // Use webm format which is widely supported
    const mimeType = "audio/webm;codecs=opus";

    this.mediaRecorder = new MediaRecorder(this.audioStream, {
      mimeType,
      audioBitsPerSecond: 16000,
    });

    // Send audio chunks as they become available for real-time processing
    this.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        console.log(`Audio chunk captured: ${event.data.size} bytes`);
        this.audioChunks.push(event.data);
        onDataAvailable(event.data);
      }
    });

    // Request data every 250ms for near real-time streaming
    this.mediaRecorder.start(250);
  }

  /**
   * Stop recording audio
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"));
        return;
      }

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        this.audioChunks = [];
        resolve(audioBlob);
      });

      this.mediaRecorder.stop();
    });
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}
