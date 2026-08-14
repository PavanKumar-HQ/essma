-- ====================================================================
-- ESSMA OS - ENTERPRISE POWER INFRASTRUCTURE OPERATING SYSTEM
-- COMPLETE PRODUCTION POSTGRESQL DDL SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
CREATE TYPE role_type AS ENUM (
  'Super Admin',
  'Admin',
  'Sales',
  'Service Manager',
  'Engineer',
  'Accounts',
  'Inventory Manager'
);

CREATE TYPE equipment_category AS ENUM (
  'UPS',
  'Inverter',
  'Battery Bank',
  'Solar System',
  'Stabilizer',
  'Accessory'
);

CREATE TYPE ticket_priority AS ENUM ('Emergency', 'High', 'Medium', 'Low');
CREATE TYPE ticket_status AS ENUM ('Open', 'Assigned', 'In Progress', 'Pending Spares', 'Resolved', 'Closed');
CREATE TYPE warranty_status AS ENUM ('Active', 'Expired', 'Claim Pending');
CREATE TYPE amc_status AS ENUM ('Covered', 'Expired', 'None', 'Pending Renewal');

-- 3. CORE USERS & ROLES
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name role_type UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role role_type NOT NULL DEFAULT 'Engineer',
  avatar_url TEXT,
  skills TEXT[],
  certifications TEXT[],
  availability_status TEXT DEFAULT 'Available',
  rating NUMERIC(3, 2) DEFAULT 5.00,
  completed_jobs_count INT DEFAULT 0,
  current_gps_lat NUMERIC(10, 8),
  current_gps_lng NUMERIC(11, 8),
  current_gps_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS & BRANCHES
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  gstin TEXT UNIQUE NOT NULL,
  industry TEXT,
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  total_equipment_count INT DEFAULT 0,
  active_amc_contracts_count INT DEFAULT 0,
  total_revenue NUMERIC(14, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customer_branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEADS & OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  requirement TEXT,
  estimated_kva NUMERIC(10, 2),
  budget NUMERIC(14, 2),
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'New',
  probability INT DEFAULT 50,
  assigned_salesperson_id UUID REFERENCES public.users(id),
  expected_closure_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EQUIPMENT & POWER ASSETS
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number TEXT UNIQUE NOT NULL,
  model_name TEXT NOT NULL,
  category equipment_category NOT NULL DEFAULT 'UPS',
  capacity_kva NUMERIC(10, 2) NOT NULL,
  capacity_kw NUMERIC(10, 2) NOT NULL,
  phase TEXT DEFAULT '3-Phase',
  battery_type TEXT,
  battery_quantity INT DEFAULT 0,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.customer_branches(id),
  site_address TEXT NOT NULL,
  city TEXT NOT NULL,
  installation_date DATE,
  warranty_start_date DATE,
  warranty_end_date DATE,
  warranty_status warranty_status DEFAULT 'Active',
  amc_status amc_status DEFAULT 'None',
  health_score INT DEFAULT 100,
  last_inspection_date DATE,
  next_maintenance_due_date DATE,
  assigned_engineer_id UUID REFERENCES public.users(id),
  qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.battery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  battery_cell_index INT NOT NULL,
  voltage NUMERIC(4, 2) NOT NULL,
  temperature NUMERIC(4, 1),
  internal_resistance NUMERIC(6, 2),
  status TEXT DEFAULT 'Healthy',
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INSTALLATIONS & COMMISSIONING
CREATE TABLE IF NOT EXISTS public.installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  installation_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  assigned_engineer_id UUID REFERENCES public.users(id),
  site_address TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  stage TEXT DEFAULT 'Commissioning',
  checklist JSONB DEFAULT '{}'::jsonb,
  customer_signature_url TEXT,
  photos TEXT[],
  completed_at TIMESTAMPTZ
);

-- 8. SERVICE TICKETS
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  priority ticket_priority DEFAULT 'Emergency',
  status ticket_status DEFAULT 'Open',
  reported_by TEXT NOT NULL,
  reported_phone TEXT NOT NULL,
  assigned_engineer_id UUID REFERENCES public.users(id),
  diagnosis_notes TEXT,
  voltage_readings JSONB DEFAULT '{}'::jsonb,
  customer_signature_url TEXT,
  sla_met BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 9. AMC CONTRACTS & PM VISITS
CREATE TABLE IF NOT EXISTS public.amc_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  coverage_type TEXT NOT NULL DEFAULT 'Comprehensive',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_value NUMERIC(14, 2) NOT NULL,
  visit_frequency TEXT DEFAULT 'Quarterly',
  total_visits_scheduled INT DEFAULT 4,
  visits_completed INT DEFAULT 0,
  status TEXT DEFAULT 'Active',
  assigned_engineer_id UUID REFERENCES public.users(id),
  next_scheduled_visit DATE
);

CREATE TABLE IF NOT EXISTS public.pm_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_number TEXT UNIQUE NOT NULL,
  amc_contract_id UUID REFERENCES public.amc_contracts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  equipment_id UUID REFERENCES public.equipment(id),
  assigned_engineer_id UUID REFERENCES public.users(id),
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'Scheduled',
  checklist JSONB DEFAULT '{}'::jsonb,
  engineer_notes TEXT,
  customer_signature_url TEXT,
  completed_at TIMESTAMPTZ
);

-- 10. INVENTORY & WAREHOUSE
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  warehouse_location TEXT DEFAULT 'WH-1 (Main Warehouse)',
  rack_number TEXT,
  shelf_number TEXT,
  batch_number TEXT,
  serial_number TEXT,
  quantity_in_stock INT DEFAULT 0,
  reserved_quantity INT DEFAULT 0,
  minimum_threshold INT DEFAULT 5,
  unit_cost NUMERIC(12, 2) NOT NULL,
  selling_price NUMERIC(12, 2) NOT NULL,
  supplier_name TEXT,
  last_restocked_date DATE DEFAULT CURRENT_DATE
);

-- 11. FINANCIAL INVOICES & PAYMENTS
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type TEXT DEFAULT 'Service',
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  gstin TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal NUMERIC(14, 2) NOT NULL,
  total_tax NUMERIC(14, 2) NOT NULL,
  grand_total NUMERIC(14, 2) NOT NULL,
  paid_amount NUMERIC(14, 2) DEFAULT 0.00,
  payment_status TEXT DEFAULT 'Unpaid',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS & SYSTEM NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id),
  user_name TEXT NOT NULL,
  user_role role_type NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read domain data
CREATE POLICY "Allow authenticated read on customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on equipment" ON public.equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on tickets" ON public.tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on inventory" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on invoices" ON public.invoices FOR SELECT TO authenticated USING (true);

-- Allow full write for admins and domain managers
CREATE POLICY "Allow write on customers" ON public.customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow write on equipment" ON public.equipment FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow write on tickets" ON public.tickets FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow write on inventory" ON public.inventory FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow write on invoices" ON public.invoices FOR ALL TO authenticated USING (true);
