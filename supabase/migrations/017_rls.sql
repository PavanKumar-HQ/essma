-- 017_rls.sql
-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amc_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_ticket_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organization_id
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS uuid AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Base RLS Policy: Users can only see data for their organization
CREATE POLICY "Users can access their organization data" ON public.customers FOR ALL USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can access their organization data" ON public.equipment FOR ALL USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can access their organization data" ON public.service_tickets FOR ALL USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can access their organization data" ON public.amc_contracts FOR ALL USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can access their organization data" ON public.inventory_items FOR ALL USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can access their organization data" ON public.invoices FOR ALL USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can access their organization data" ON public.payments FOR ALL USING (organization_id = public.get_user_organization_id());

-- Profiles policy: user can read profiles in their org, update their own
CREATE POLICY "Users can read profiles in their organization" ON public.profiles FOR SELECT USING (organization_id = public.get_user_organization_id());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Roles and Permissions are globally readable by authenticated users
CREATE POLICY "Authenticated users can read roles" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read permissions" ON public.permissions FOR SELECT USING (auth.role() = 'authenticated');
