import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const sessionId = formData.get('sessionId') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const text = formData.get('text') as string;

    console.log('USSD Request:', { sessionId, phoneNumber, text });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let response = '';

    // Main menu
    if (text === '') {
      response = `CON Welcome to Sakanka - Voice Marketplace
1. Sell Product (Voice)
2. Buy Product (Voice)
3. My Listings
4. Check Balance`;
    }
    // Sell flow
    else if (text === '1') {
      response = `CON Sell Your Product
1. Record voice description
2. Enter manually
0. Back to main menu`;
    }
    // Buy flow
    else if (text === '2') {
      response = `CON What do you want to buy?
1. Food & Groceries
2. Clothing
3. Electronics
4. Other
0. Back to main menu`;
    }
    // My listings
    else if (text === '3') {
      const { data: products } = await supabase
        .from('products')
        .select('title, price, status')
        .eq('phone_number', phoneNumber)
        .limit(3);

      if (products && products.length > 0) {
        response = `CON Your Listings:\n`;
        products.forEach((p, i) => {
          response += `${i + 1}. ${p.title} - GHS ${p.price}\n`;
        });
        response += `0. Back`;
      } else {
        response = `END You have no active listings.`;
      }
    }
    // Voice sell option
    else if (text === '1*1') {
      response = `END Please call +233XXXXXXXXX to record your product description. Our AI will guide you through the process in Twi, Ga, or Hausa.`;
    }
    // Manual sell
    else if (text === '1*2') {
      response = `CON Enter product name:`;
    }
    // Back options
    else if (text.endsWith('*0')) {
      response = `CON Welcome to Sakanka - Voice Marketplace
1. Sell Product (Voice)
2. Buy Product (Voice)
3. My Listings
4. Check Balance`;
    }
    // Default end
    else {
      response = `END Thank you for using Sakanka. Call our voice line for full features: +233XXXXXXXXX`;
    }

    return new Response(response, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Error in USSD handler:', error);
    return new Response(`END Service error. Please try again later.`, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});
