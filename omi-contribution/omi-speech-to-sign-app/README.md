# Omi Speech-to-Sign Plugin

This plugin enables real-time speech-to-sign interpretation by forwarding Omi's conversation transcripts to an external Speech-to-Sign service.

## How it Works
1. Omi captures real-time speech transcripts.
2. The plugin forwards these transcripts via a POST request to a configured `SIGN_APP_URL`.
3. The external service processes the text and triggers sign language animations on the user's display device.

## Configuration
Set the following environment variable in your Omi environment:
- `SIGN_APP_URL`: The endpoint of your Speech-to-Sign interpretation API.

## API Endpoint
`POST /interpret`
Payload:
```json
{
  "text": "Hello, how are you?",
  "user_id": "user_123",
  "session_id": "sess_456"
}
```
