-- 006_equipment.sql
CREATE TABLE IF NOT EXISTS public.equipment (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    equipment_code text NOT NULL,
    serial_number text,
    asset_number text,
    equipment_type text,
    brand text,
    model text,
    capacity text,
    installation_date date,
    purchase_date date,
    warranty_start date,
    warranty_end date,
    location text,
    status text DEFAULT 'active',
    condition text,
    last_service_date date,
    next_service_date date,
    notes text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(organization_id, equipment_code)
);

CREATE OR REPLACE FUNCTION update_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_equipment_modtime
    BEFORE UPDATE ON public.equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_equipment_updated_at();
