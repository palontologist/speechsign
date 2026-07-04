'use client';

import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { defineCustomElements } from 'pose-viewer/loader';

export default function TranslationPage() {
  const { transcript, isRecording, error, startRecording, stopRecording } = useSpeechRecognition();
  const [poseUrl, setPoseUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    defineCustomElements();
  }, []);

  const handleTranslate = async () => {
    if (!transcript) return;
    setLoading(true);
    try {
      const text = encodeURIComponent(transcript);
      const spoken = 'en';
      const signed = 'ase'; // Defaulting to American Sign Language (ASE)
      const url = `/api/proxy-sign?text=${text}&spoken=${spoken}&signed=${signed}`;
      setPoseUrl(url);
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-extrabold mb-2 text-blue-900">🤟 SpeechSign</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Real-time speech-to-sign interpretation. Connect your Omi device or use the microphone below.
      </p>
      <div className="flex flex-col items-center gap-4 mb-8">
        <button
          onClick={isRecording ? stopRecording : () => startRecording()}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            isRecording ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        {error && <p className="text-red-500 text-sm">Error: {error}</p>}
        
        <div className="text-lg font-medium min-h-[1.5em]">
          Transcript: <span className="text-blue-600">{transcript || '...'}</span>
        </div>

        <button
          onClick={handleTranslate}
          disabled={!transcript || loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:bg-gray-400 transition-all"
        >
          {loading ? 'Translating...' : 'Translate to Sign'}
        </button>
      </div>

      <div className="w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
        {poseUrl ? (
          <pose-viewer 
            src={poseUrl} 
            style={{ width: '100%', height: '100%' }}
          ></pose-viewer>
        ) : (
          <p className="text-gray-500">No translation loaded</p>
        )}
      </div>
    </div>
  );
}
