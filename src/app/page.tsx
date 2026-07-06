'use client';

import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { defineCustomElements } from 'pose-viewer/loader';

export default function TranslationPage() {
  const { transcript, isRecording, error, startRecording, stopRecording } = useSpeechRecognition();
  const [poseUrl, setPoseUrl] = useState<string | null>(null);
  const [currentGloss, setCurrentGloss] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    defineCustomElements();

    // Poll for latest Omi translation every 500ms
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/omi/latest');
        if (res.ok) {
          const data = await res.json();
          
          // If we have a new transcript that is different from the current one, translate it
          if (data.transcript && data.transcript !== transcript) {
             // We don't update 'transcript' state here because it might be coming 
             // from the local mic. We only trigger translation if it's from Omi.
             triggerOmiTranslation(data.transcript);
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, [transcript]);

  const triggerOmiTranslation = async (text: string) => {
    setLoading(true);
    try {
      const encodedText = encodeURIComponent(text);
      const url = `/api/proxy-sign?text=${encodedText}&spoken=en&signed=ase`;
      setPoseUrl(url);
      // Note: we can't easily get the 'gloss' back from the blob proxy, 
      // so we use the transcript as the gloss for the demo.
      setCurrentGloss(text);
    } catch (e) {
      console.error('Omi translation error:', e);
    } finally {
      setLoading(false);
    }
  };

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

         <div className="flex flex-col items-center gap-2 w-full max-w-md p-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-gray-700">
           <span className="font-bold text-blue-700">Connect via Omi:</span>
           <p className="text-center text-xs">
             1. Install the SpeechSign app from <a href="https://app.omi.me/my-apps/01KWRHPZCB704KG9W0RF2ZMDS2" target="_blank" className="underline text-blue-800 font-medium">Omi App Store</a>.<br/>
             2. Set the Webhook URL to: <code className="bg-gray-200 text-gray-800 px-1 rounded font-mono">https://speechsign.vercel.app/api/omi/interpret</code><br/>
             3. Set Trigger to: <span className="font-mono text-gray-900 font-bold">Transcript Segment Processed</span>.
           </p>
         </div>

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

       <div className="w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center relative">
         {poseUrl ? (
           <>
             <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               Live Translation
             </div>
             <pose-viewer 
               src={poseUrl} 
               style={{ width: '100%', height: '100%' }}
             ></pose-viewer>
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-2xl font-black uppercase italic shadow-xl">
               {currentGloss}
             </div>
           </>
         ) : (
           <p className="text-gray-500">No translation loaded</p>
         )}
       </div>

    </div>
  );
}
