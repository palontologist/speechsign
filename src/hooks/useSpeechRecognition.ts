import { useState, useEffect, useCallback } from 'react';

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('browser-not-supported');
      return;
    }

    const rec = new SpeechRecognition();
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    setRecognition(rec);
  }, []);

  const startRecording = useCallback((lang: string = 'en') => {
    if (!recognition) {
      setError('browser-not-supported');
      return;
    }
    try {
      recognition.lang = lang;
      recognition.start();
      setIsRecording(true);
      setTranscript('');
    } catch (e) {
      console.error('Failed to start recording:', e);
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition]);

  return { transcript, isRecording, error, startRecording, stopRecording };
}
