-- 007_service.sql
CREATE TABLE IF NOT EXISTS public.service_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    ticket_number text NOT NULL,
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    equipment_id uuid REFERENCES public.equipment(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    priority text,
    ticket_type text,
    status text DEFAULT 'new',
    source text,
    reported_at timestamptz,
    scheduled_at timestamptz,
    started_at timestamptz,
    completed_at timestamptz,
    closed_at timestamptz,
    assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(organization_id, ticket_number)
);

CREATE TABLE IF NOT EXISTS public.service_assignments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_ticket_id uuid NOT NULL REFERENCES public.service_tickets(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_at timestamptz DEFAULT now(),
    accepted_at timestamptz,
    started_at timestamptz,
    completed_at timestamptz,
    status text DEFAULT 'assigned',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_visits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_ticket_id uuid NOT NULL REFERENCES public.service_tickets(id) ON DELETE CASCADE,
    technician_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    visit_date date,
    arrival_time time,
    departure_time time,
    work_summary text,
    customer_notes text,
    technician_notes text,
    customer_signature_url text,
    status text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_service_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_tickets_modtime
    BEFORE UPDATE ON public.service_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_service_tables_updated_at();

CREATE TRIGGER update_service_assignments_modtime
    BEFORE UPDATE ON public.service_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_service_tables_updated_at();

CREATE TRIGGER update_service_visits_modtime
    BEFORE UPDATE ON public.service_visits
    FOR EACH ROW
    EXECUTE FUNCTION update_service_tables_updated_at();
