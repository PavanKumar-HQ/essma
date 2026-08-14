CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    lead_number VARCHAR(50) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    city VARCHAR(100),
    requirement TEXT,
    estimated_kva NUMERIC(10,2),
    budget NUMERIC(15,2),
    source VARCHAR(100) DEFAULT 'Website',
    status VARCHAR(50) DEFAULT 'New',
    probability INTEGER DEFAULT 50,
    assigned_salesperson_id UUID REFERENCES public.profiles(id),
    expected_closure_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    version INTEGER DEFAULT 1,
    lead_id UUID REFERENCES public.leads(id),
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    gstin VARCHAR(50),
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(15,2) DEFAULT 0,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(15,2) DEFAULT 0,
    cgst_amount NUMERIC(15,2) DEFAULT 0,
    sgst_amount NUMERIC(15,2) DEFAULT 0,
    igst_amount NUMERIC(15,2) DEFAULT 0,
    total_tax NUMERIC(15,2) DEFAULT 0,
    grand_total NUMERIC(15,2) DEFAULT 0,
    terms TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    installation_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    equipment_id UUID NOT NULL REFERENCES public.equipment(id),
    site_address TEXT,
    scheduled_date DATE,
    assigned_engineer_id UUID REFERENCES public.profiles(id),
    stage VARCHAR(50) DEFAULT 'Site Survey',
    checklist JSONB DEFAULT '{}'::jsonb,
    commissioning_report_url TEXT,
    customer_signature TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    gps_check_in JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.pm_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    visit_number VARCHAR(50) NOT NULL UNIQUE,
    amc_contract_id UUID NOT NULL REFERENCES public.amc_contracts(id),
    customer_id UUID NOT NULL REFERENCES public.customers(id),
    equipment_id UUID NOT NULL REFERENCES public.equipment(id),
    assigned_engineer_id UUID REFERENCES public.profiles(id),
    scheduled_date DATE,
    status VARCHAR(50) DEFAULT 'Scheduled',
    checklist JSONB DEFAULT '{}'::jsonb,
    battery_voltage_readings JSONB DEFAULT '[]'::jsonb,
    engineer_notes TEXT,
    customer_signature TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_visits ENABLE ROW LEVEL SECURITY;
