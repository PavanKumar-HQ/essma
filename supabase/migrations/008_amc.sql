-- 008_amc.sql
CREATE TABLE IF NOT EXISTS public.amc_contracts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    contract_number text NOT NULL,
    start_date date,
    end_date date,
    contract_type text,
    status text DEFAULT 'draft',
    billing_frequency text,
    contract_value numeric(12, 2) DEFAULT 0,
    tax_amount numeric(12, 2) DEFAULT 0,
    total_value numeric(12, 2) DEFAULT 0,
    terms text,
    notes text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(organization_id, contract_number)
);

CREATE TABLE IF NOT EXISTS public.amc_equipment (
    amc_id uuid REFERENCES public.amc_contracts(id) ON DELETE CASCADE,
    equipment_id uuid REFERENCES public.equipment(id) ON DELETE CASCADE,
    PRIMARY KEY (amc_id, equipment_id)
);

CREATE OR REPLACE FUNCTION update_amc_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_amc_contracts_modtime
    BEFORE UPDATE ON public.amc_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_amc_contracts_updated_at();
