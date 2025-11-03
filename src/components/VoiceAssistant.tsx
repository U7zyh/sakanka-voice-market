import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceAssistantProps {
  language: string;
  onProductExtracted?: (data: any) => void;
}

export const VoiceAssistant = ({ language, onProductExtracted }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initial greeting
    speakMessage("Hello! I'm here to help you sell or buy products. What would you like to do today?");
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now. I'm listening to you.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audioBase64: base64Audio, language }
        });

        if (error) throw error;

        const userMessage = data.text;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        // Get AI response
        const { data: aiResponse, error: aiError } = await supabase.functions.invoke('voice-assistant', {
          body: { 
            messages: [...messages, { role: 'user', content: userMessage }],
            language 
          }
        });

        if (aiError) throw aiError;

        const assistantMessage = aiResponse.message;
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

        // Speak the response
        await speakMessage(assistantMessage);

        // Try to extract product info if in selling context
        if (userMessage.toLowerCase().includes('sell') || messages.some(m => m.content.toLowerCase().includes('sell'))) {
          const { data: productInfo } = await supabase.functions.invoke('extract-product-info', {
            body: { text: userMessage, language, action: 'sell' }
          });

          if (productInfo && onProductExtracted) {
            onProductExtracted(productInfo);
          }
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Could not process your voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const speakMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, language }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audioRef.current = audio;
      
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error('Error speaking:', error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border-2 border-primary/20">
      <div className="flex items-center gap-4">
        <Button
          size="lg"
          onClick={isListening ? stopListening : startListening}
          className={`rounded-full w-20 h-20 ${isListening ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
        >
          {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </Button>
        
        {isSpeaking && (
          <div className="flex items-center gap-2 text-primary">
            <Volume2 className="h-6 w-6 animate-pulse" />
            <span className="text-sm font-medium">Speaking...</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isListening ? 'Listening to you...' : 'Tap microphone to speak'}
        </p>
      </div>

      {messages.length > 0 && (
        <div className="w-full max-h-40 overflow-y-auto space-y-2 mt-4">
          {messages.slice(-3).map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary/10 text-foreground ml-8' 
                  : 'bg-secondary text-foreground mr-8'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
