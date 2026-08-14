-- 015_functions.sql
CREATE OR REPLACE FUNCTION public.consume_inventory(
    p_organization_id uuid,
    p_ticket_id uuid,
    p_item_id uuid,
    p_quantity numeric,
    p_user_id uuid
) RETURNS void AS $$
DECLARE
    v_unit_cost numeric;
    v_total_cost numeric;
BEGIN
    -- Check stock
    IF (SELECT current_stock FROM public.inventory_items WHERE id = p_item_id AND organization_id = p_organization_id) < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for item %', p_item_id;
    END IF;

    -- Get unit cost
    SELECT unit_cost INTO v_unit_cost FROM public.inventory_items WHERE id = p_item_id;
    v_total_cost := v_unit_cost * p_quantity;

    -- Update inventory item
    UPDATE public.inventory_items
    SET current_stock = current_stock - p_quantity
    WHERE id = p_item_id AND organization_id = p_organization_id;

    -- Create inventory transaction
    INSERT INTO public.inventory_transactions (
        organization_id, inventory_item_id, transaction_type, quantity, unit_cost, reference_type, reference_id, performed_by
    ) VALUES (
        p_organization_id, p_item_id, 'consumed', p_quantity, v_unit_cost, 'service_ticket', p_ticket_id, p_user_id
    );

    -- Create service ticket part record
    INSERT INTO public.service_ticket_parts (
        service_ticket_id, inventory_item_id, quantity, unit_cost, total_cost, issued_by
    ) VALUES (
        p_ticket_id, p_item_id, p_quantity, v_unit_cost, v_total_cost, p_user_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.record_payment(
    p_organization_id uuid,
    p_invoice_id uuid,
    p_amount numeric,
    p_payment_method text,
    p_user_id uuid,
    p_payment_number text
) RETURNS void AS $$
DECLARE
    v_customer_id uuid;
    v_invoice_total numeric;
    v_amount_paid numeric;
BEGIN
    -- Get invoice details
    SELECT customer_id, total_amount, amount_paid 
    INTO v_customer_id, v_invoice_total, v_amount_paid
    FROM public.invoices WHERE id = p_invoice_id AND organization_id = p_organization_id;

    IF v_customer_id IS NULL THEN
        RAISE EXCEPTION 'Invoice not found';
    END IF;

    IF v_amount_paid + p_amount > v_invoice_total THEN
        RAISE EXCEPTION 'Payment amount exceeds invoice balance';
    END IF;

    -- Insert payment
    INSERT INTO public.payments (
        organization_id, customer_id, invoice_id, payment_number, amount, payment_method, payment_date, received_by
    ) VALUES (
        p_organization_id, v_customer_id, p_invoice_id, p_payment_number, p_amount, p_payment_method, now(), p_user_id
    );

    -- Update invoice
    UPDATE public.invoices
    SET amount_paid = amount_paid + p_amount,
        balance_amount = total_amount - (amount_paid + p_amount),
        status = CASE 
            WHEN amount_paid + p_amount >= total_amount THEN 'paid' 
            ELSE 'partially_paid' 
        END
    WHERE id = p_invoice_id AND organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql;
