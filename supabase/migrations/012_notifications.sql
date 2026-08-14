-- 012_notifications.sql
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    message text,
    entity_type text,
    entity_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    read_at timestamptz
);
