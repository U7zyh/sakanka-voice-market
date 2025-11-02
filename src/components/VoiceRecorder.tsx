import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  language?: string;
  className?: string;
}

export const VoiceRecorder = ({ onTranscription, language = 'twi', className }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Call edge function to transcribe
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-to-text`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              audioBase64: base64Audio,
              language: language,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        onTranscription(data.text);
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process audio. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {!isRecording && !isProcessing && (
        <Button
          size="lg"
          onClick={startRecording}
          className="h-24 w-24 rounded-full gradient-primary hover:scale-105 transition-transform shadow-lg"
        >
          <Mic className="h-10 w-10" />
        </Button>
      )}
      
      {isRecording && (
        <Button
          size="lg"
          onClick={stopRecording}
          className="h-24 w-24 rounded-full bg-destructive hover:bg-destructive/90 voice-pulse animate-pulse"
        >
          <Square className="h-10 w-10" />
        </Button>
      )}
      
      {isProcessing && (
        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
        </div>
      )}
      
      <p className="text-sm text-muted-foreground text-center">
        {isRecording ? 'Recording... Tap to stop' : isProcessing ? 'Processing...' : 'Tap to speak'}
      </p>
    </div>
  );
};