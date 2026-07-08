# 🤟 SpeechSign: The Full-Loop Communication Bridge

SpeechSign is a real-time, AI-powered accessibility ecosystem designed to bridge the communication gap between the hearing and the Deaf/Hard-of-Hearing communities. 

Unlike traditional captioning, SpeechSign provides a **Full-Loop experience**, transforming spoken language into visual signs and signed gestures back into spoken voice.

## 🌟 The Vision: Full-Loop Accessibility

Most accessibility tools are one-way. SpeechSign creates a bidirectional bridge:

### 1. Hearing $\rightarrow$ Deaf (Speech-to-Sign)
**Flow**: `Speaker` $\rightarrow$ `Omi (Global Capture)` $\rightarrow$ `TursoDB (State Bridge)` $\rightarrow$ `3D Translate Avatar`
*   **Real-time Capture**: Integrated with **Omi's** plugin architecture to capture speech from any environment.
*   **Low-Latency Bridge**: Uses **TursoDB** and **Drizzle ORM** to synchronize transcripts across the globe in <500ms.
*   **Visual Expression**: Renders a high-fidelity 3D skeletal avatar that performs sign language in real-time.

### 2. Deaf $\rightarrow$ Hearing (Sign-to-Speech)
**Flow**: `Signer` $\rightarrow$ `Webcam` $\rightarrow$ `NVIDIA LocateAnything` $\rightarrow$ `Browser TTS`
*   **Visual Grounding**: Leverages **NVIDIA LocateAnything-3B** to recognize sign language gestures in a video stream.
*   **Instant Translation**: Maps detected visual poses to textual meanings.
*   **Voice Output**: Uses the Web Speech API to convert translated text into a natural spoken voice.

---

## 🛠️ Technical Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | `Next.js`, `Tailwind CSS` | High-performance UI and 3D avatar rendering |
| **Database** | `TursoDB`, `Drizzle ORM` | Edge-optimized state management for real-time sync |
| **AI (Vision)** | `NVIDIA LocateAnything` | Vision-Language grounding for gesture recognition |
| **Capture** | `Omi Plugin` | Global, wearable-ready speech transcription |
| **Avatar** | `Translate Avatar` | 3D skeletal sign language representation |
| **Deployment** | `Vercel` | Serverless hosting for the interpretation bridge |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- TursoDB Account
- NVIDIA GPU (for Sign-to-Speech local server)

### Installation
1. **Clone the repo**
   ```bash
   git clone https://github.com/palontologist/speechsign.git
   cd speechsign
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root:
   ```env
   TURSO_DATABASE_URL="your_url"
   TURSO_AUTH_TOKEN="your_token"
   ```

3. **Run the App**
   ```bash
   npm run dev
   ```

### Connecting Omi
1. Install the SpeechSign app from the [Omi App Store](https://app.omi.me/my-apps/01KWRHPZCB704KG9W0RF2ZMDS2).
2. Set the Webhook URL to: `https://speechsign.vercel.app/api/omi/interpret`.
3. Set the Trigger to: `Transcript Segment Processed`.

---

## 📈 Roadmap
- [ ] **Custom Sign Tuning**: Implementing LoRA fine-tuning on LocateAnything for specific regional sign dialects.
- [ ] **Low-Latency Edge Rendering**: Moving the avatar rendering to the edge to reduce visual lag.
- [ ] **Multi-User Rooms**: Enabling group conversations where multiple avatars sign simultaneously.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
