/**
 * Transcription Service
 * Handles Deepgram API integration for speech-to-text
 */

import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

export interface TranscriptionConfig {
  apiKey: string;
  model?: string;
  language?: string;
  punctuate?: boolean;
  interimResults?: boolean;
}

export interface TranscriptionResult {
  text: string;
  isFinal: boolean;
  confidence?: number;
}

export class TranscriptionService {
  private deepgram: any;
  private liveConnection: any = null;
  private config: TranscriptionConfig;

  constructor(config: TranscriptionConfig) {
    this.config = {
      model: "nova-2",
      language: "en",
      punctuate: true,
      interimResults: true,
      ...config,
    };

    this.deepgram = createClient(this.config.apiKey);
  }

  /**
   * Start live transcription session
   */
  async startLiveTranscription(
    onTranscript: (result: TranscriptionResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      this.liveConnection = this.deepgram.listen.live({
        model: this.config.model,
        language: this.config.language,
        punctuate: this.config.punctuate,
        interim_results: this.config.interimResults,
        smart_format: true,
      });

      // Handle connection open
      this.liveConnection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Deepgram connection opened");
      });

      // Handle transcription results
      this.liveConnection.on(
        LiveTranscriptionEvents.Transcript,
        (data: any) => {
          console.log("Received transcript data:", data);
          const transcript = data.channel?.alternatives?.[0];
          if (transcript && transcript.transcript) {
            const result: TranscriptionResult = {
              text: transcript.transcript,
              isFinal: data.is_final || false,
              confidence: transcript.confidence,
            };
            console.log("Transcript result:", result);
            onTranscript(result);
          }
        }
      );

      // Handle errors
      this.liveConnection.on(LiveTranscriptionEvents.Error, (error: any) => {
        console.error("Deepgram error:", error);
        onError(
          new Error(`Transcription error: ${error.message || "Unknown error"}`)
        );
      });

      // Handle connection close
      this.liveConnection.on(LiveTranscriptionEvents.Close, () => {
        console.log("Deepgram connection closed");
      });
    } catch (error) {
      onError(new Error(`Failed to start transcription: ${error}`));
    }
  }

  /**
   * Send audio data to Deepgram for transcription
   */
  async sendAudio(audioBlob: Blob): Promise<void> {
    if (!this.liveConnection) {
      throw new Error("Live connection not established");
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();

      if (this.liveConnection.getReadyState() === 1) {
        this.liveConnection.send(arrayBuffer);
      }
    } catch (error) {
      console.error("Error sending audio:", error);
      throw new Error(`Failed to send audio: ${error}`);
    }
  }
  /**
   * Stop live transcription
   */
  stopLiveTranscription(): void {
    if (this.liveConnection) {
      this.liveConnection.finish();
      this.liveConnection = null;
    }
  }

  /**
   * Transcribe pre-recorded audio (alternative method)
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const { result, error } =
        await this.deepgram.listen.prerecorded.transcribeFile(uint8Array, {
          model: this.config.model,
          language: this.config.language,
          punctuate: this.config.punctuate,
          smart_format: true,
        });

      if (error) {
        throw new Error(`Transcription failed: ${error.message}`);
      }

      const transcript =
        result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      return transcript || "";
    } catch (error) {
      throw new Error(`Failed to transcribe audio: ${error}`);
    }
  }

  /**
   * Check if connection is active
   */
  isConnected(): boolean {
    return this.liveConnection && this.liveConnection.getReadyState() === 1;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopLiveTranscription();
  }
}
