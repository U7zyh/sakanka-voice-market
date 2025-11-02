import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'twi', action = 'sell' } = await req.json();
    
    if (!text) {
      throw new Error('No text provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Extracting product info from: "${text}" (${language}, ${action})`);

    const systemPrompt = `You are a helpful assistant for a marketplace in Ghana. 
Extract product information from voice transcriptions in Twi, Ga, Hausa, or English.

Extract and structure the following information:
- Product name/title
- Description
- Price (convert to GHS if mentioned)
- Quantity
- Location

Return ONLY valid JSON with this exact structure:
{
  "title": "product name",
  "description": "detailed description",
  "price": 0.00,
  "quantity": 1,
  "location": "location name"
}

If information is missing, use reasonable defaults:
- quantity: 1
- price: 0 (if not mentioned)
- location: "Not specified"`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Extract product information from this ${action === 'sell' ? 'seller' : 'buyer'} message: "${text}"` 
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI processing failed: ${errorText}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0].message.content;
    
    console.log('AI response:', extractedText);

    // Parse the JSON from the response
    let productInfo;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = extractedText.match(/```json\n([\s\S]*?)\n```/) || 
                       extractedText.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : extractedText;
      productInfo = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: try to extract basic info
      productInfo = {
        title: text.slice(0, 50),
        description: text,
        price: 0,
        quantity: 1,
        location: 'Not specified'
      };
    }

    // Validate and ensure all fields are present
    const result = {
      title: productInfo.title || 'Product',
      description: productInfo.description || text,
      price: parseFloat(productInfo.price) || 0,
      quantity: parseInt(productInfo.quantity) || 1,
      location: productInfo.location || 'Not specified',
      originalText: text,
      language: language,
    };

    console.log('Extracted product info:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in extract-product-info:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});