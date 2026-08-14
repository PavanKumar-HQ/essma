-- 005_customers.sql
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_code text NOT NULL,
    customer_type text,
    company_name text NOT NULL,
    contact_person text,
    email text,
    phone text,
    alternate_phone text,
    gst_number text,
    pan_number text,
    billing_address text,
    service_address text,
    city text,
    state text,
    pincode text,
    status text DEFAULT 'active',
    notes text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(organization_id, customer_code)
);

CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_modtime
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();
