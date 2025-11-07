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
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {!isRecording && !isProcessing && (
        <Button
          size="lg"
          onClick={startRecording}
          className="h-32 w-32 rounded-full gradient-primary hover:scale-110 transition-all duration-300 shadow-glow animate-float"
        >
          <Mic className="h-14 w-14" />
        </Button>
      )}
      
      {isRecording && (
        <Button
          size="lg"
          onClick={stopRecording}
          className="h-32 w-32 rounded-full bg-destructive hover:bg-destructive/90 voice-pulse shadow-xl"
        >
          <Square className="h-14 w-14" />
        </Button>
      )}
      
      {isProcessing && (
        <div className="h-32 w-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Loader2 className="h-14 w-14 animate-spin text-white" />
        </div>
      )}
      
      <div className="text-center space-y-1">
        <p className="text-base font-medium">
          {isRecording ? 'Listening...' : isProcessing ? 'Processing your voice...' : 'Tap to start'}
        </p>
        <p className="text-sm text-muted-foreground">
          {isRecording ? 'Speak clearly, tap when done' : isProcessing ? 'Please wait' : 'Speak in Twi, Ga, or Hausa'}
        </p>
      </div>
    </div>
  );
};