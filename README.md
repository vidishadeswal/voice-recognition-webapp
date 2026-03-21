# Voice-to-Text Desktop App

A cross-platform desktop application for real-time voice-to-text transcription, built with Tauri and Deepgram. This project is a functional clone of Wispr Flow, focusing on core voice input functionality and clean code architecture.

## Features

- **Push-to-Talk Voice Input**: Intuitive hold-to-record mechanism
- **Real-Time Transcription**: Near-instant speech-to-text using Deepgram's Nova-2 model
- **Cross-Platform**: Works on Windows, macOS, and Linux via Tauri
- **Clean UI**: Simple, functional interface with visual recording feedback
- **Clipboard Integration**: One-click copy transcribed text
- **Error Handling**: Graceful handling of permissions, network issues, and API errors

## Tech Stack

- **Desktop Framework**: [Tauri](https://tauri.app/) - Lightweight, secure desktop framework
- **Frontend**: React + TypeScript - Modern UI development
- **Speech-to-Text**: [Deepgram API](https://deepgram.com/) - Industry-leading voice recognition
- **Build Tool**: Vite - Fast development and optimized builds
- **Audio API**: Web Audio API - Browser-native audio capture

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)

   ```bash
   node --version
   ```

2. **Rust** (for Tauri)

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

3. **Deepgram API Key**

   - Sign up at [console.deepgram.com](https://console.deepgram.com/)
   - Free tier includes $200 credit (50,000 minutes)

4. **System Dependencies** (platform-specific)

   **macOS**:

   ```bash
   xcode-select --install
   ```

   **Windows**:

   - Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

   **Linux (Debian/Ubuntu)**:

   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.1-dev \
     build-essential \
     curl \
     wget \
     file \
     libssl-dev \
     libgtk-3-dev \
     libayatana-appindicator3-dev \
     librsvg2-dev
   ```

## Quick Start

### 1. Clone and Install

```bash
cd voice-to-text-app
npm install
```

### 2. Configure API Key

The app will prompt you to enter your Deepgram API key on first launch. You can also:

1. Run the app in development mode
2. Click the settings icon in the top right
3. Paste your Deepgram API key
4. Click "Save API Key"

The key is stored locally in your browser's localStorage.

### 3. Run Development Server

```bash
npm run tauri dev
```

This will:

- Start the Vite development server
- Launch the Tauri desktop application
- Enable hot-reload for rapid development

### 4. Build for Production

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/`.

## Usage

1. **Start the App**: Launch the application
2. **Configure**: Enter your Deepgram API key in settings (first time only)
3. **Record**: Hold down the large circular button
4. **Speak**: Talk naturally while holding the button
5. **Release**: Let go to stop recording
6. **View**: See your transcribed text appear in real-time
7. **Copy**: Click "Copy" to copy text to clipboard
8. **Clear**: Click "Clear" to start fresh

## License
MIT 
