import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, price, quantity, location, language, image_url, phone_number } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Authentication failed');
    }

    console.log(`Creating product for user: ${user.id}`);

    // Check if user has seller role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'seller')
      .single();

    if (!roles) {
      throw new Error('User does not have seller role');
    }

    // Get user phone from profile if not provided
    let contactPhone = phone_number;
    if (!contactPhone) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single();
      
      contactPhone = profile?.phone_number;
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        location,
        language: language || 'twi',
        image_url,
        phone_number: contactPhone,
        status: 'active'
      })
      .select()
      .single();

    if (productError) {
      console.error('Product creation error:', productError);
      throw productError;
    }

    console.log('Product created successfully:', product.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        product
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-product:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});