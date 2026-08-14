-- 016_triggers.sql
-- Example trigger for audit logs (could be expanded to all tables)
CREATE OR REPLACE FUNCTION public.audit_record_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id uuid;
    v_org_id uuid;
BEGIN
    -- Try to get current user from auth.uid() if available
    BEGIN
        v_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
    END;
    
    -- Extract organization_id if it exists in the row
    BEGIN
        v_org_id := NEW.organization_id;
    EXCEPTION WHEN OTHERS THEN
        BEGIN
            v_org_id := OLD.organization_id;
        EXCEPTION WHEN OTHERS THEN
            v_org_id := NULL;
        END;
    END;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (organization_id, user_id, entity_type, entity_id, action, new_data)
        VALUES (v_org_id, v_user_id, TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (organization_id, user_id, entity_type, entity_id, action, old_data, new_data)
        VALUES (v_org_id, v_user_id, TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (organization_id, user_id, entity_type, entity_id, action, old_data)
        VALUES (v_org_id, v_user_id, TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD)::jsonb);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to core tables
CREATE TRIGGER audit_customers_changes AFTER INSERT OR UPDATE OR DELETE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.audit_record_changes();
CREATE TRIGGER audit_equipment_changes AFTER INSERT OR UPDATE OR DELETE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.audit_record_changes();
CREATE TRIGGER audit_service_tickets_changes AFTER INSERT OR UPDATE OR DELETE ON public.service_tickets FOR EACH ROW EXECUTE FUNCTION public.audit_record_changes();
CREATE TRIGGER audit_invoices_changes AFTER INSERT OR UPDATE OR DELETE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.audit_record_changes();
