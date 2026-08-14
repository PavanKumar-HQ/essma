-- 019_crm_rpc_functions.sql

-- 1. Atomic function to update inventory stock
CREATE OR REPLACE FUNCTION public.update_inventory_stock(
    p_item_id UUID,
    p_delta NUMERIC
) RETURNS public.inventory_items AS $$
DECLARE
    v_item public.inventory_items;
BEGIN
    UPDATE public.inventory_items
    SET current_stock = GREATEST(0, current_stock + p_delta)
    WHERE id = p_item_id
    RETURNING * INTO v_item;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory item not found';
    END IF;

    RETURN v_item;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to create inventory item with flattened structure
CREATE OR REPLACE FUNCTION public.create_inventory_item_flat(
    p_organization_id UUID,
    p_sku TEXT,
    p_name TEXT,
    p_category_name TEXT,
    p_supplier_name TEXT,
    p_warehouse_location TEXT,
    p_rack_number TEXT,
    p_shelf_number TEXT,
    p_quantity_in_stock NUMERIC,
    p_minimum_threshold NUMERIC,
    p_unit_cost NUMERIC,
    p_selling_price NUMERIC,
    p_user_id UUID
) RETURNS public.inventory_items AS $$
DECLARE
    v_category_id UUID;
    v_supplier_id UUID;
    v_warehouse_id UUID;
    v_item public.inventory_items;
BEGIN
    -- Resolve or Create Category
    SELECT id INTO v_category_id FROM public.inventory_categories 
    WHERE organization_id = p_organization_id AND name = p_category_name LIMIT 1;
    
    IF v_category_id IS NULL THEN
        INSERT INTO public.inventory_categories (organization_id, name)
        VALUES (p_organization_id, p_category_name)
        RETURNING id INTO v_category_id;
    END IF;

    -- Resolve or Create Supplier
    SELECT id INTO v_supplier_id FROM public.suppliers 
    WHERE organization_id = p_organization_id AND name = p_supplier_name LIMIT 1;
    
    IF v_supplier_id IS NULL THEN
        INSERT INTO public.suppliers (organization_id, name)
        VALUES (p_organization_id, p_supplier_name)
        RETURNING id INTO v_supplier_id;
    END IF;

    -- Resolve or Create Warehouse
    SELECT id INTO v_warehouse_id FROM public.warehouses 
    WHERE organization_id = p_organization_id AND name = p_warehouse_location LIMIT 1;
    
    IF v_warehouse_id IS NULL THEN
        INSERT INTO public.warehouses (organization_id, name)
        VALUES (p_organization_id, p_warehouse_location)
        RETURNING id INTO v_warehouse_id;
    END IF;

    -- Insert Inventory Item
    INSERT INTO public.inventory_items (
        organization_id,
        sku,
        name,
        category_id,
        supplier_id,
        current_stock,
        minimum_stock,
        unit_cost,
        selling_price,
        created_by
    ) VALUES (
        p_organization_id,
        p_sku,
        p_name,
        v_category_id,
        v_supplier_id,
        p_quantity_in_stock,
        p_minimum_threshold,
        p_unit_cost,
        p_selling_price,
        p_user_id
    ) RETURNING * INTO v_item;

    -- Map item to warehouse
    INSERT INTO public.warehouse_inventory (
        warehouse_id,
        inventory_item_id,
        quantity
    ) VALUES (
        v_warehouse_id,
        v_item.id,
        p_quantity_in_stock
    );

    RETURN v_item;
END;
$$ LANGUAGE plpgsql;

-- 3. View to flatten inventory for easy querying
CREATE OR REPLACE VIEW public.inventory_items_view AS
SELECT 
    i.id,
    i.organization_id,
    i.sku,
    i.name,
    c.name as category,
    i.current_stock as quantity_in_stock,
    i.reserved_stock as reserved_quantity,
    i.minimum_stock as minimum_threshold,
    i.unit_cost,
    i.selling_price,
    i.supplier_id,
    s.name as supplier_name,
    i.updated_at as last_restocked_date,
    w.name as warehouse_location,
    wi.quantity as warehouse_quantity
FROM public.inventory_items i
LEFT JOIN public.inventory_categories c ON i.category_id = c.id
LEFT JOIN public.suppliers s ON i.supplier_id = s.id
LEFT JOIN public.warehouse_inventory wi ON wi.inventory_item_id = i.id
LEFT JOIN public.warehouses w ON wi.warehouse_id = w.id;
