-- Fix security warning: Set search_path for the create_product_with_details function
DROP FUNCTION IF EXISTS public.create_product_with_details(UUID, TEXT, TEXT, NUMERIC, INTEGER, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.create_product_with_details(
  p_seller_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_price NUMERIC,
  p_quantity INTEGER,
  p_location TEXT,
  p_language TEXT DEFAULT 'twi',
  p_image_url TEXT DEFAULT NULL,
  p_phone_number TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id UUID;
BEGIN
  INSERT INTO public.products (
    seller_id, title, description, price, quantity, location, language, image_url, phone_number, status
  ) VALUES (
    p_seller_id, p_title, p_description, p_price, p_quantity, p_location, p_language, p_image_url, p_phone_number, 'active'
  )
  RETURNING id INTO v_product_id;
  
  RETURN v_product_id;
END;
$$;