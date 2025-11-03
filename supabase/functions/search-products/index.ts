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
    const { query, location, maxDistance = 50 } = await req.json();
    
    if (!query) {
      throw new Error('Search query is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Searching for: "${query}" near ${location || 'anywhere'}`);

    // Use simple text search with ILIKE for better performance
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        profiles(
          full_name,
          phone_number,
          location
        )
      `)
      .eq('status', 'active');

    // Search in title and description
    const searchTerm = `%${query}%`;
    queryBuilder = queryBuilder.or(
      `title.ilike.${searchTerm},description.ilike.${searchTerm}`
    );

    // Filter by location if provided
    if (location) {
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: products, error } = await queryBuilder;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Found ${products?.length || 0} products`);

    return new Response(
      JSON.stringify({ 
        products: products || [],
        count: products?.length || 0,
        query,
        location
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in search-products:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        products: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});