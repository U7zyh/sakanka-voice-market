-- Add phone_number field to products table for USSD integration
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add index for faster phone number lookups
CREATE INDEX IF NOT EXISTS idx_products_phone_number ON public.products(phone_number);

-- Update RLS policies to allow phone number queries
-- Note: Existing policies remain in place, this just adds phone number support