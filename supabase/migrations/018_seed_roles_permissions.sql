-- 018_seed_roles_permissions.sql
-- Insert default roles
INSERT INTO public.roles (name, description) VALUES
('Super Admin', 'Full access'),
('Admin', 'Organization-wide operational access'),
('Manager', 'Customers, equipment, service, AMC, inventory, finance and reports according to assigned permissions'),
('Service Manager', 'Service tickets, dispatch, assignments, technicians and service reports'),
('Technician', 'Only assigned service operations, equipment information required for work, service visits and parts consumption'),
('Inventory Manager', 'Inventory, suppliers, warehouses and stock transactions'),
('Finance', 'Invoices, payments, financial reports'),
('Viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO public.permissions (key, name, description, module, action) VALUES
('customers.read', 'Read Customers', 'View customer records', 'customers', 'read'),
('customers.create', 'Create Customers', 'Create customer records', 'customers', 'create'),
('customers.update', 'Update Customers', 'Update customer records', 'customers', 'update'),
('customers.delete', 'Delete Customers', 'Delete customer records', 'customers', 'delete'),

('equipment.read', 'Read Equipment', 'View equipment records', 'equipment', 'read'),
('equipment.create', 'Create Equipment', 'Create equipment records', 'equipment', 'create'),
('equipment.update', 'Update Equipment', 'Update equipment records', 'equipment', 'update'),
('equipment.delete', 'Delete Equipment', 'Delete equipment records', 'equipment', 'delete'),

('service.read', 'Read Service Tickets', 'View service tickets', 'service', 'read'),
('service.create', 'Create Service Tickets', 'Create service tickets', 'service', 'create'),
('service.update', 'Update Service Tickets', 'Update service tickets', 'service', 'update'),
('service.dispatch', 'Dispatch Service Tickets', 'Dispatch service tickets', 'service', 'dispatch'),
('service.assign', 'Assign Service Tickets', 'Assign service tickets', 'service', 'assign'),
('service.close', 'Close Service Tickets', 'Close service tickets', 'service', 'close'),

('inventory.read', 'Read Inventory', 'View inventory records', 'inventory', 'read'),
('inventory.create', 'Create Inventory', 'Create inventory records', 'inventory', 'create'),
('inventory.update', 'Update Inventory', 'Update inventory records', 'inventory', 'update'),
('inventory.adjust', 'Adjust Inventory', 'Adjust inventory stock levels', 'inventory', 'adjust'),

('finance.read', 'Read Finance', 'View financial records', 'finance', 'read'),
('finance.create', 'Create Finance', 'Create financial records', 'finance', 'create'),
('finance.update', 'Update Finance', 'Update financial records', 'finance', 'update'),
('finance.approve', 'Approve Finance', 'Approve financial records', 'finance', 'approve'),

('amc.read', 'Read AMC', 'View AMC contracts', 'amc', 'read'),
('amc.create', 'Create AMC', 'Create AMC contracts', 'amc', 'create'),
('amc.update', 'Update AMC', 'Update AMC contracts', 'amc', 'update'),
('amc.renew', 'Renew AMC', 'Renew AMC contracts', 'amc', 'renew')
ON CONFLICT (key) DO NOTHING;

-- Seed role_permissions (Basic seeding for Super Admin)
DO $$
DECLARE
    v_super_admin_id uuid;
    v_permission record;
BEGIN
    SELECT id INTO v_super_admin_id FROM public.roles WHERE name = 'Super Admin';
    
    FOR v_permission IN SELECT id FROM public.permissions LOOP
        INSERT INTO public.role_permissions (role_id, permission_id) 
        VALUES (v_super_admin_id, v_permission.id)
        ON CONFLICT DO NOTHING;
    END LOOP;
END
$$;
