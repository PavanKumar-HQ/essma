-- 014_indexes.sql
CREATE INDEX IF NOT EXISTS idx_customers_org_id ON public.customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_equipment_org_id ON public.equipment(organization_id);
CREATE INDEX IF NOT EXISTS idx_equipment_customer_id ON public.equipment(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_org_id ON public.service_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_customer_id ON public.service_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_equipment_id ON public.service_tickets(equipment_id);
CREATE INDEX IF NOT EXISTS idx_service_tickets_assigned_to ON public.service_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_service_tickets_status ON public.service_tickets(status);
CREATE INDEX IF NOT EXISTS idx_service_tickets_priority ON public.service_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_amc_contracts_org_id ON public.amc_contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_amc_contracts_customer_id ON public.amc_contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_org_id ON public.inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_org_id ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- GIN indexes for search if needed in future
CREATE INDEX IF NOT EXISTS idx_customers_company_name_trgm ON public.customers USING GIN (company_name gin_trgm_ops);
