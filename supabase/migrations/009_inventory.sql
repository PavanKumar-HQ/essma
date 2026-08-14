-- 009_inventory.sql
CREATE TABLE IF NOT EXISTS public.inventory_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    contact_person text,
    email text,
    phone text,
    address text,
    gst_number text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    sku text NOT NULL,
    name text NOT NULL,
    description text,
    category_id uuid REFERENCES public.inventory_categories(id) ON DELETE SET NULL,
    unit text,
    minimum_stock numeric DEFAULT 0,
    maximum_stock numeric,
    current_stock numeric DEFAULT 0,
    reserved_stock numeric DEFAULT 0,
    unit_cost numeric(12, 2) DEFAULT 0,
    selling_price numeric(12, 2) DEFAULT 0,
    supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
    status text DEFAULT 'active',
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz,
    deleted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    UNIQUE(organization_id, sku)
);

CREATE TABLE IF NOT EXISTS public.warehouses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    code text,
    location text,
    manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.warehouse_inventory (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    quantity numeric DEFAULT 0,
    reserved_quantity numeric DEFAULT 0,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(warehouse_id, inventory_item_id)
);

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    transaction_type text NOT NULL,
    quantity numeric NOT NULL,
    unit_cost numeric(12, 2),
    reference_type text,
    reference_id uuid,
    warehouse_id uuid REFERENCES public.warehouses(id) ON DELETE SET NULL,
    performed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_ticket_parts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_ticket_id uuid NOT NULL REFERENCES public.service_tickets(id) ON DELETE CASCADE,
    inventory_item_id uuid NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    quantity numeric NOT NULL,
    unit_cost numeric(12, 2),
    total_cost numeric(12, 2),
    issued_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_items_modtime BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();
CREATE TRIGGER update_inventory_categories_modtime BEFORE UPDATE ON public.inventory_categories FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();
CREATE TRIGGER update_suppliers_modtime BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();
CREATE TRIGGER update_warehouses_modtime BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();
CREATE TRIGGER update_warehouse_inventory_modtime BEFORE UPDATE ON public.warehouse_inventory FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();
