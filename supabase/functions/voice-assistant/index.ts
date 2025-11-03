import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'english' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompts: Record<string, string> = {
      twi: `You are Akua, a friendly Ghanaian marketplace assistant speaking Twi. Help traders buy and sell products. Be warm, patient, and helpful. Keep responses concise. When users describe products, extract: name, price, quantity, location.`,
      ga: `You are Tetteh, a friendly Ghanaian marketplace assistant speaking Ga. Help traders buy and sell products. Be warm, patient, and helpful. Keep responses concise. When users describe products, extract: name, price, quantity, location.`,
      hausa: `You are Amina, a friendly Ghanaian marketplace assistant speaking Hausa. Help traders buy and sell products. Be warm, patient, and helpful. Keep responses concise. When users describe products, extract: name, price, quantity, location.`,
      english: `You are a friendly Ghanaian marketplace assistant. Help traders buy and sell products using simple English. Be warm, patient, and helpful. Keep responses concise and clear. When users describe products, extract: name, price, quantity, location.`
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompts[language] || systemPrompts.english },
          ...messages
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI service temporarily unavailable.');
      }
      throw new Error('AI service error');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in voice-assistant:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
