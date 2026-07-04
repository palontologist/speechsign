# 🤟 SpeechSign

**SpeechSign** is a real-time speech-to-sign language interpretation platform designed to bridge the communication gap between hearing and non-hearing individuals. By leveraging real-time audio processing and 3D animation, SpeechSign transforms spoken conversations into accurate sign language in real-time.

## 🚀 Features

- **Real-time Interpretation**: Low-latency conversion of speech to sign language animations.
- **Omi Integration**: Seamlessly integrates as an external plugin for Omi devices, triggering interpretations automatically when conversations start.
- **3D Avatar Rendering**: High-fidelity sign language animations for clear communication.
- **Webhook-based Architecture**: Extensible API design allowing for various input sources.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Edge runtime)
- **Omi Plugin**: FastAPI, Python
- **Animation**: Pose-Viewer / Custom 3D Engine

## 🔌 Omi Integration Flow

SpeechSign can operate as an external integration for Omi:
1. **Omi Device** $\rightarrow$ Captures speech.
2. **Omi Plugin** $\rightarrow$ Forwards transcript to `/api/omi/interpret`.
3. **SpeechSign Backend** $\rightarrow$ Translates text to sign sequences.
4. **SpeechSign Frontend** $\rightarrow$ Renders animations in real-time.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/speechsign.git
cd speechsign

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 API Reference

### Interpret Endpoint
`POST /api/omi/interpret`

**Payload:**
```json
{
  "text": "Hello, how are you?",
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Hello, how are you?",
    "animations": ["wave", "hello", "query_state"]
  }
}
```

---
Built to empower accessibility and inclusivity. 🌍
