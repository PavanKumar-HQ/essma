-- 010_finance.sql
CREATE TABLE IF NOT EXISTS public.invoices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    invoice_number text NOT NULL,
    service_ticket_id uuid REFERENCES public.service_tickets(id) ON DELETE SET NULL,
    amc_id uuid REFERENCES public.amc_contracts(id) ON DELETE SET NULL,
    invoice_date date,
    due_date date,
    subtotal numeric(12, 2) DEFAULT 0,
    discount numeric(12, 2) DEFAULT 0,
    tax_amount numeric(12, 2) DEFAULT 0,
    total_amount numeric(12, 2) DEFAULT 0,
    amount_paid numeric(12, 2) DEFAULT 0,
    balance_amount numeric(12, 2) DEFAULT 0,
    status text DEFAULT 'draft',
    notes text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(organization_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description text NOT NULL,
    quantity numeric NOT NULL DEFAULT 1,
    unit_price numeric(12, 2) NOT NULL DEFAULT 0,
    discount numeric(12, 2) DEFAULT 0,
    tax_rate numeric(5, 2) DEFAULT 0,
    tax_amount numeric(12, 2) DEFAULT 0,
    total numeric(12, 2) NOT NULL DEFAULT 0,
    service_ticket_id uuid REFERENCES public.service_tickets(id) ON DELETE SET NULL,
    inventory_item_id uuid REFERENCES public.inventory_items(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
    payment_number text NOT NULL,
    amount numeric(12, 2) NOT NULL,
    payment_method text,
    payment_date timestamptz,
    reference_number text,
    status text DEFAULT 'completed',
    notes text,
    received_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(organization_id, payment_number)
);

CREATE OR REPLACE FUNCTION update_finance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoices_modtime BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_finance_updated_at();
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_finance_updated_at();
